import {
  FilterDay,
  FilterMonth,
  FilterQuarter,
  FilterTime,
  FilterWeek,
  FilterYear,
} from "@/components/ui/filter";
import * as XLSX from "xlsx";
import { EnumValues } from "zod";

const exportExcel = (data: any[], nameSheet: string, nameFile: string) => {
  return new Promise((resolve, reject) => {
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, nameSheet);
    XLSX.writeFile(wb, `${nameFile}.xlsx`);
    resolve("oke");
  });
};

type MultiFilter = Record<string, any>;
type SingleFilter = Record<string, any>;
type RangeTimeFilter = Record<string, { startDate: Date; endDate: Date }>;
type StaticRangeFilter = Record<string, FilterTime>;
type RangeNumFilter = Record<string, { startValue: number; endValue: number }>;
type FilterControl = Record<string, TimeFilterType>;
export enum TimeFilterType {
  "StaticRange",
  "RangeTime",
}

function handleMultipleFilter<T>(
  filter: MultiFilter,
  listToFilter: Array<T>
): Array<T> {
  const filterList = listToFilter.filter((row) => {
    const filterKeys = Object.keys(filter);
    for (let key of filterKeys) {
      if (
        filter[key as keyof typeof filter].length > 0 &&
        !filter[key as keyof typeof filter].includes(
          row[key as keyof typeof row]
        )
      )
        return false;
    }
    return true;
  });
  return filterList;
}

function handleSingleFilter<T>(
  filter: SingleFilter,
  listToFilter: Array<T>
): Array<T> {
  const filterList = listToFilter.filter((row) => {
    const filterKeys = Object.keys(filter);
    for (let key of filterKeys) {
      if (
        filter[key as keyof typeof filter].length > 0 &&
        filter[key as keyof typeof filter] !== row[key as keyof typeof row]
      )
        return false;
    }
    return true;
  });
  return filterList;
}

function handleRangeTimeFilter<T>(
  filter: RangeTimeFilter,
  listToFilter: Array<T>
): Array<T> {
  const filterList = listToFilter.filter((row) => {
    const filterKeys = Object.keys(filter);
    for (let key of filterKeys) {
      let value = row[key as keyof typeof row];
      let range = filter[key as keyof typeof filter];
      if (value instanceof Date && range !== undefined && range !== null) {
        if (!isInRangeTime(value, range)) return false;
      } else return false;
    }
    return true;
  });
  return filterList;
}

const isInRangeTime = (
  value: Date,
  range: { startDate: Date; endDate: Date }
) => {
  let date = value as Date;
  let startDate = range.startDate as Date;
  let endDate = range.endDate as Date;

  startDate = new Date(startDate.setHours(0, 0, 0, 0));
  endDate = new Date(endDate.setHours(0, 0, 0, 0));

  const formatedDate = date.toLocaleDateString();
  const formatedStartDate = startDate.toLocaleDateString();
  const formatedEndDate = endDate.toLocaleDateString();

  if (startDate > endDate) {
    return false;
  } else if (formatedStartDate === formatedEndDate) {
    if (formatedDate !== formatedStartDate) return false;
  } else {
    if (formatedDate === formatedStartDate) return true;
    if (formatedDate == formatedEndDate) return true;
    if (date < startDate || date > endDate) return false;
  }
  return true;
};

const isInRangeNum = (value: number, startValue: number, endValue: number) => {
  if (startValue > endValue) {
    return false;
  } else if (startValue === endValue) {
    if (value !== startValue) return false;
  } else {
    if (value < startValue || value > endValue) return false;
  }
  return true;
};

function handleTimeFilter<T>(
  staticRangeFilter: StaticRangeFilter,
  rangeTimeFilter: RangeTimeFilter,
  filterControl: FilterControl,
  listToFilter: Array<T>
): Array<T> {
  const filterList = listToFilter.filter((row) => {
    const filterKeys = Object.keys(filterControl);
    for (let key of filterKeys) {
      if (
        filterControl[key as keyof typeof filterControl] ===
        TimeFilterType.RangeTime
      ) {
        let value = row[key as keyof typeof row];
        let range = rangeTimeFilter[key as keyof typeof rangeTimeFilter];
        if (value instanceof Date && range !== undefined && range !== null) {
          if (!isInRangeTime(value, range)) return false;
        } else return false;
      } else {
        let value = row[key as keyof typeof row];
        let staticRange = staticRangeFilter[
          key as keyof typeof staticRangeFilter
        ] as FilterTime;
        let range = getStaticRangeFilterTime(staticRange);
        if (staticRange === FilterYear.AllTime) continue;
        if (value instanceof Date && range !== undefined && range !== null) {
          if (!isInRangeTime(value, range)) return false;
        } else return false;
      }
    }
    return true;
  });
  return filterList;
}

function handleStaticRangeFilter<T>(
  filter: StaticRangeFilter,
  listToFilter: Array<T>
): Array<T> {
  const filterList = listToFilter.filter((row) => {
    const filterKeys = Object.keys(filter);
    for (let key of filterKeys) {
      let value = row[key as keyof typeof row] as Date;
      let staticRange = filter[key as keyof typeof filter] as FilterTime;
      if (staticRange === FilterYear.AllTime) continue;
      let range = getStaticRangeFilterTime(staticRange);
      if (value instanceof Date && range !== undefined && range !== null) {
        if (!isInRangeTime(value, range)) return false;
      } else return false;
    }
    return true;
  });
  return filterList;
}

function handleRangeNumFilter<T>(
  filter: RangeNumFilter,
  listToFilter: Array<T>
): Array<T> {
  const filterList = listToFilter.filter((row) => {
    const filterKeys = Object.keys(filter);
    for (let key of filterKeys) {
      let value = row[key as keyof typeof row];
      if (typeof value === "number") {
        const ivalue = value as number;
        const startValue = filter[key as keyof typeof filter]
          .startValue as number;
        const endValue = filter[key as keyof typeof filter].endValue as number;

        if (!isInRangeNum(ivalue, startValue, endValue)) return false;
      } else return false;
    }
    return true;
  });
  return filterList;
}

const getStaticRangeFilterTime = (
  value: FilterTime
): { startDate: Date; endDate: Date } => {
  let range = {
    startDate: new Date(),
    endDate: new Date(),
  };
  if (value === FilterDay.Today) {
    return range;
  } else if (value === FilterDay.LastDay) {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    range = { startDate: yesterday, endDate: yesterday };
  } else if (value === FilterWeek.ThisWeek) {
    let today = new Date();
    let firstDay = today.getDate() - today.getDay();
    if (today.getDay() === 0) firstDay -= 7;
    firstDay += 1;
    let firstDate = new Date(today.setDate(firstDay));
    let lastDate = new Date(today.setDate(firstDate.getDate() + 6));

    range = { startDate: firstDate, endDate: lastDate };
  } else if (value === FilterWeek.LastWeek) {
    let today = new Date();
    let firstDay = today.getDate() - today.getDay() - 7;
    if (today.getDay() === 0) firstDay -= 7;
    firstDay += 1;
    let firstDate = new Date(today.setDate(firstDay));
    let lastDate = new Date(today.setDate(firstDate.getDate() + 6));

    range = { startDate: firstDate, endDate: lastDate };
  } else if (value === FilterWeek.Last7Days) {
    let today = new Date();
    let firstDay = today.getDate() - 6;
    let firstDate = new Date(today.setDate(firstDay));
    let lastDate = new Date();

    range = { startDate: firstDate, endDate: lastDate };
  } else if (value === FilterMonth.ThisMonth) {
    let today = new Date();
    let firstDate = new Date(today.setDate(1));
    let lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    range = { startDate: firstDate, endDate: lastDate };
  } else if (value === FilterMonth.LastMonth) {
    let today = new Date();
    let firstDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    let lastDate = new Date(today.getFullYear(), today.getMonth(), 0);

    range = { startDate: firstDate, endDate: lastDate };
  } else if (value === FilterMonth.Last30Days) {
    let today = new Date();
    let firstDay = today.getDate() - 29;
    let firstDate = new Date(today.setDate(firstDay));
    let lastDate = new Date();

    range = { startDate: firstDate, endDate: lastDate };
  } else if (value === FilterYear.ThisYear) {
    let today = new Date();
    let firstDate = new Date(today.getFullYear(), 0, 1);
    let lastDate = new Date(today.getFullYear() + 1, 0, 0);

    range = { startDate: firstDate, endDate: lastDate };
  } else if (value === FilterYear.LastYear) {
    let today = new Date();
    let firstDate = new Date(today.getFullYear() - 1, 0, 1);
    let lastDate = new Date(today.getFullYear(), 0, 0);

    range = { startDate: firstDate, endDate: lastDate };
  } else if (value === FilterYear.AllTime) {
    // range = { startDate: minDate, endDate: maxDate };
  } else if (value === FilterQuarter.ThisQuarter) {
    let today = new Date();
    let month = today.getMonth() + 1;
    let quarterIndex = Math.floor((month - 1) / 3); // start with 0
    let firstMonth = quarterIndex * 3 + 1; // 1-indexed
    let lastMonth = firstMonth + 2;

    let firstDate = new Date(today.getFullYear(), firstMonth - 1, 1); // 0-indexed
    let lastDate = new Date(today.getFullYear(), lastMonth, 0); // 0-indexed

    range = { startDate: firstDate, endDate: lastDate };
  } else if (value === FilterQuarter.LastQuarter) {
    let today = new Date();
    let month = today.getMonth() + 1;
    let quarterIndex = Math.floor((month - 1) / 3); // start with 0
    let firstMonth = quarterIndex * 3 - 2; // 1-indexed
    let lastMonth = firstMonth + 2;
    console.log("firstmonth", firstMonth);
    console.log("lastmonth", lastMonth);

    let firstDate = new Date(today.getFullYear(), firstMonth - 1, 1); // 0-indexed
    let lastDate = new Date(today.getFullYear(), lastMonth, 0); // 0-indexed

    range = { startDate: firstDate, endDate: lastDate };
  }
  return range;
};
const getMinMaxOfListTime = (
  list: Date[]
): { minDate: Date; maxDate: Date } => {
  let range = {
    minDate: new Date(),
    maxDate: new Date(),
  };

  list.forEach((date) => {
    if (date < range.minDate) range.minDate = new Date(date);
    if (date > range.maxDate) range.maxDate = new Date(date);
  });

  return range;
};

const removeCharNotANum = (e: any) => {
  // e.target.value = e.target.value.replace(/\D/g, "");
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
};

const formatID = (id: number, prefix: string) => {
  return `${prefix}${id.toString().padStart(4, "0")}`;
};

const formatPrice = (price: number) => {
  const formattedPrice = new Intl.NumberFormat("vi-VN").format(price);
  return formattedPrice;
};

export {
  exportExcel,
  handleSingleFilter,
  handleMultipleFilter,
  handleRangeTimeFilter,
  handleStaticRangeFilter,
  handleTimeFilter,
  handleRangeNumFilter,
  getStaticRangeFilterTime,
  getMinMaxOfListTime,
  removeCharNotANum,
  formatID,
  formatPrice,
};
