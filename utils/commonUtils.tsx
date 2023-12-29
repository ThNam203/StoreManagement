import {
  FilterDay,
  FilterMonth,
  FilterQuarter,
  FilterTime,
  FilterWeek,
  FilterYear,
} from "@/components/ui/filter";
import { format, isBefore } from "date-fns";
import * as XLSX from "xlsx";

const exportExcel = (data: any[], nameSheet: string, nameFile: string) => {
  return new Promise((resolve, reject) => {
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, nameSheet);
    XLSX.writeFile(wb, `${nameFile}.xlsx`);
    resolve("oke");
  });
};

const importExcel = async (file: any) => {
  const validMIMEType = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];
  let importData = [];
  if (!validMIMEType.includes(file.type)) {
    const error = new Error("Invalid file type");
    return Promise.reject(error);
  }
  try {
    const data = await file.arrayBuffer();

    const workbook = XLSX.readFile(data, { cellDates: true });
    let worksheet: any = {};
    for (let sheetName of workbook.SheetNames) {
      worksheet[sheetName] = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheetName],
      );
      importData.push(worksheet[sheetName]);
    }
  } catch (e) {
    return Promise.reject(e);
  }
  return Promise.resolve(importData);
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
  listToFilter: Array<T>,
): Array<T> {
  const filterList = listToFilter.filter((row) => {
    const filterKeys = Object.keys(filter);
    for (let key of filterKeys) {
      if (
        filter[key as keyof typeof filter].length > 0 &&
        !filter[key as keyof typeof filter].includes(
          row[key as keyof typeof row],
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
  listToFilter: Array<T>,
): Array<T> {
  const filterList = listToFilter.filter((row) => {
    const filterKeys = Object.keys(filter);
    for (let key of filterKeys) {
      if (
        filter[key as keyof typeof filter] === null ||
        filter[key as keyof typeof filter] === undefined
      )
        return true;
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

type FilterCondition = {
  [key: string]: any[] | any;
};

function handleChoiceFilters<T>(
  filter: FilterCondition,
  listToFilter: Array<T>,
): Array<T> {
  const filterList = listToFilter.filter((row) => {
    const filterKeys = Object.keys(filter);

    for (let key of filterKeys) {
      const filterValue = filter[key];

      if (Array.isArray(filterValue)) {
        // Use handleMultipleFilter for array values
        if (
          filterValue.length > 0 &&
          !filterValue.includes(row[key as keyof typeof row])
        ) {
          return false;
        }
      } else {
        // Use handleSingleFilter for non-array values
        if (
          filterValue !== null &&
          filterValue !== undefined &&
          filterValue !== row[key as keyof typeof row]
        ) {
          return false;
        }
      }
    }

    return true;
  });

  return filterList;
}

function handleRangeTimeFilter<T>(
  filter: RangeTimeFilter,
  listToFilter: Array<T>,
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
  date: Date,
  range: { startDate: Date; endDate: Date },
) => {
  range.startDate.setHours(0, 0, 0, 0)
  range.endDate.setHours(23, 59, 59, 999)

  if (isBefore(date, range.startDate) || isBefore(range.endDate, date)) return false;
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
  listToFilter: Array<T>,
): Array<T> {
  const filterList = listToFilter.filter((row) => {
    const filterKeys = Object.keys(filterControl);
    for (let key of filterKeys) {
      let value = row[key as keyof typeof row];
      
      if (
        filterControl[key as keyof typeof filterControl] ===
        TimeFilterType.RangeTime
      ) {
        let range = rangeTimeFilter[key as keyof typeof rangeTimeFilter];

        if (value instanceof Date && range !== undefined && range !== null) {
          if (!isInRangeTime(value, range)) return false;
        } else return false;
      } else {
        let staticRange = staticRangeFilter[
          key as keyof typeof staticRangeFilter
        ] as FilterTime;
        let range = getStaticRangeFilterTime(staticRange);
        if (staticRange === FilterYear.AllTime) continue;
        if (value instanceof Date && range !== undefined && range !== null) {
          if (!isInRangeTime(value, range)) return false;
        } else {
          console.log(value, ' is date? ', value instanceof Date)
          return false;
        }
      }
    }
    return true;
  });
  return filterList;
}

function handleDateCondition(
  staticRangeCondition: FilterTime,
  rangeTimeCondition: {
        startDate: Date;
        endDate: Date;
    },
  filterControl: TimeFilterType,
  date: Date,
): boolean {
  if (
    filterControl ===
    TimeFilterType.RangeTime
  ) {
    if (date && rangeTimeCondition !== undefined && rangeTimeCondition !== null) {
      if (!isInRangeTime(date, rangeTimeCondition)) return false;
    } else return false;
  } else {
    if (staticRangeCondition === FilterYear.AllTime) return true;
    let range = getStaticRangeFilterTime(staticRangeCondition);
    if (range !== undefined && range !== null) {
      if (!isInRangeTime(date, range)) return false;
    } else {
      return false;
    }
  }
  return true;
}

function handleStaticRangeFilter<T>(
  filter: StaticRangeFilter,
  listToFilter: Array<T>,
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
  listToFilter: Array<T>,
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
  value: FilterTime,
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

    let firstDate = new Date(today.getFullYear(), firstMonth - 1, 1); // 0-indexed
    let lastDate = new Date(today.getFullYear(), lastMonth, 0); // 0-indexed

    range = { startDate: firstDate, endDate: lastDate };
  }
  return range;
};
const getMinMaxOfListTime = (
  list: Date[],
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

const isValidInput = (input: string): boolean => {
  // Kiểm tra xem input có phải là số hợp lệ hay không
  const regex = /^\d+(\.\d+)?$/;
  return regex.test(input);
};
const removeCharNotANum = (e: any) => {
  let input = e.target.value;
  if (!isValidInput(input)) {
    input = input.slice(0, input.length - 1);
  }

  e.target.value = input;
};

const formatID = (id: number, prefix: string) => {
  return `${prefix}${id.toString()}`;
};
const revertID = (id: string, prefix: string) => {
  return id.replace(prefix, "");
};

const formatPrice = (price: number) => {
  const formattedPrice = new Intl.NumberFormat("vi-VN").format(price);
  return formattedPrice;
};

const formatNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  // remove characters that is not number
  let rawValue = e.currentTarget.value.replace(/[^\d]/g, "");
  // remove leading 0s
  rawValue = rawValue.replace(/^0+(\d)/, "$1");
  let num = Number(rawValue);
  // Add commas for every 3 digits from the right
  const formattedValue = new Intl.NumberFormat("vi-VN", {
    style: "decimal",
  }).format(num);

  e.currentTarget.value = formattedValue;
  return num;
};

type DateType = "date" | "datetime" | "time";
const formatDate = (date: Date, type: DateType = "date") => {
  const convertDate = new Date(date);
  if (!convertDate) return "";
  if (type === "date") return format(convertDate, "MM/dd/yyyy");
  if (type === "datetime") return format(convertDate, "MM/dd/yyyy hh:mm a");
  return format(convertDate, "hh:mm a");
};

const createRangeDate = (range: { startDate: Date; endDate: Date }): Date[] => {
  const rangeDate: Date[] = [];
  range.startDate.setHours(0, 0, 0, 0);
  range.endDate.setHours(0, 0, 0, 0);

  //create an array of date from startDate to endDate
  for (
    let i = range.startDate.getTime();
    i <= range.endDate.getTime();
    i += 86400000
  ) {
    rangeDate.push(new Date(i));
  }
  return rangeDate;
};

function camelToPascalWithSpaces(camelCaseStr: string) {
  // Check if the string is not empty
  if (!camelCaseStr) {
      return camelCaseStr;
  }

  // Add a space before each capital letter
  const pascalCaseWithSpaces = camelCaseStr.replace(/([A-Z])/g, ' $1');

  // Capitalize the first letter and remove leading space
  const pascalCaseStr = pascalCaseWithSpaces.charAt(0).toUpperCase() + pascalCaseWithSpaces.slice(1).trim();

  return pascalCaseStr;
}


export {
  createRangeDate,
  exportExcel,
  formatDate,
  formatID,
  formatNumberInput,
  formatPrice,
  getMinMaxOfListTime,
  getStaticRangeFilterTime,
  handleMultipleFilter,
  handleRangeNumFilter,
  handleRangeTimeFilter,
  handleSingleFilter,
  handleStaticRangeFilter,
  handleTimeFilter,
  importExcel,
  isInRangeNum,
  isInRangeTime,
  removeCharNotANum,
  revertID,
  handleChoiceFilters,
  handleDateCondition,
  camelToPascalWithSpaces
};
