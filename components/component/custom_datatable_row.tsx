import { Row, flexRender } from "@tanstack/react-table";
import React, { RefObject } from "react";
import { TableCell, TableRow } from "../ui/table";
import { cn } from "@/lib/utils";

export interface TabProps<TData> {
  render: (
    row: Row<TData>,
    setShowTabs: (value: boolean) => any,
  ) => React.JSX.Element;
  tabName: string;
}

export interface CustomeDatatableRowProps<TData, TValue> {
  row: Row<TData>;
  containerRef: RefObject<HTMLDivElement>;
  tabs?: TabProps<TData>[];
}

export default function CustomDatatableRow<TData, TValue>({
  row,
  containerRef,
  tabs,
}: CustomeDatatableRowProps<TData, TValue>) {
  const [showInfoRow, setShowInfoRow] = React.useState(false);
  const [showTabIndex, setShowTabIndex] = React.useState(0);

  const borderWidth =
    containerRef && containerRef.current
      ? Math.floor(containerRef.current?.getBoundingClientRect().width) -
        1 +
        "px"
      : "100%";

  return (
    <React.Fragment>
      <TableRow
        data-state={row.getIsSelected() && "selected"}
        onClick={(e) => {
          setShowInfoRow((prev) => !prev);
        }}
        className={cn(
          "relative hover:cursor-pointer",
          showInfoRow ? "!border-b-0" : "",
        )}
      >
        {row.getVisibleCells().map((cell: any) => (
          <TableCell
            key={cell.id}
            className={cn(
              "whitespace-nowrap",
              showInfoRow && tabs ? "bg-green-200 font-semibold" : "",
            )}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
        <td
          className={cn(
            "absolute bottom-0 left-0 right-0 top-0",
            showInfoRow && tabs ? "border-t-2 border-green-400" : "hidden",
          )}
        ></td>
      </TableRow>
      {tabs && showInfoRow ? (
        <>
          <tr className="hidden" />
          {/* maintain odd - even row */}
          <tr>
            <td colSpan={row.getVisibleCells().length} className="p-0">
              <div className={cn("border-b-2 border-t-0 border-green-400")}>
                <div
                  style={{
                    width: borderWidth,
                  }}
                >
                  <div className="flex w-full flex-row gap-2 bg-green-200 px-2">
                    {tabs.map((tab, tabIdx) => (
                      <div
                        key={tabIdx}
                        className={cn(
                          "flex h-full flex-row items-center justify-center rounded-t-sm p-2 px-4 duration-200 ease-linear hover:cursor-pointer",
                          showTabIndex === tabIdx
                            ? "bg-white font-semibold text-black"
                            : "",
                        )}
                        onClick={(e) => setShowTabIndex(tabIdx)}
                      >
                        <p className="flex-1 text-sm">{tab.tabName}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-4 p-2 pt-0">
                    {tabs.length > showTabIndex
                      ? tabs[showTabIndex].render(row, setShowInfoRow)
                      : null}
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </>
      ) : null}
    </React.Fragment>
  );
}
