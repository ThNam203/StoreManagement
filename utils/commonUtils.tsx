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

type MultiFilter = Record<string, any>;
type SingleFilter = Record<string, string>;
type RangeFilter = Record<string, { startDate: Date; endDate: Date }>;

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

function handleRangeFilter<T>(
  filter: RangeFilter,
  listToFilter: Array<T>
): Array<T> {
  const filterList = listToFilter.filter((row) => {
    const filterKeys = Object.keys(filter);
    for (let key of filterKeys) {
      if (
        filter[key as keyof typeof filter].startDate <
          filter[key as keyof typeof filter].endDate &&
        (row[key as keyof typeof row] <
          filter[key as keyof typeof filter].startDate ||
          row[key as keyof typeof row] >
            filter[key as keyof typeof filter].endDate)
      )
        return false;
    }
    return true;
  });
  return filterList;
}

export {
  exportExcel,
  handleSingleFilter,
  handleMultipleFilter,
  handleRangeFilter,
};
