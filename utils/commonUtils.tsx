import * as XLSX from "xlsx";

export const exportExcel = (
  data: any[],
  nameSheet: string,
  nameFile: string
) => {
  return new Promise((resolve, reject) => {
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, nameSheet);
    XLSX.writeFile(wb, `${nameFile}.xlsx`);
    resolve("oke");
  });
};

type Filter = Record<string, any>;

export function filterTable<T>(
  filter: Filter,
  listToFilter: Array<T>
): Array<T> {
  const filterList = listToFilter.filter((row) => {
    console.log("here");
    const filterKeys = Object.keys(filter);
    for (let key of filterKeys) {
      console.log("key: ", key);
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
