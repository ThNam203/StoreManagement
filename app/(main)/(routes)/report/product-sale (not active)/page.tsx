// "use client";

// import { FilterDay, FilterTime, PageWithFilters, TimeFilter } from "@/components/ui/filter";
// import {
//   DefaultPDFContent,
//   ReportPDFDownloadButton,
//   ReportPDFView,
// } from "@/components/ui/pdf";
// import { useToast } from "@/components/ui/use-toast";
// import { ProductSellReport } from "@/entities/Report";
// import { useAppDispatch } from "@/hooks";
// import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
// import { axiosUIErrorHandler } from "@/services/axiosUtils";
// import ReportService from "@/services/reportService";
// import { TimeFilterType, getDateRangeFromTimeFilterCondition, handleRangeNumFilter } from "@/utils";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function ProductSaleReportPage() {
//   const { toast } = useToast();
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const [report, setReport] = useState<ProductSellReport | null>(null);
//   const [reportDateRangeCondition, setReportDateRange] = useState({
//     startDate: new Date(),
//     endDate: new Date(),
//   });
//   const [reportDateSingleCondition, setReportDateSingleCondition] = useState(
//     FilterDay.Today as FilterTime,
//   );
//   const [reportDateControl, setReportDateControl] = useState<TimeFilterType>(
//     TimeFilterType.StaticRange,
//   );
//   const range = getDateRangeFromTimeFilterCondition(
//     reportDateControl,
//     reportDateSingleCondition,
//     reportDateRangeCondition,
//   );

//   const [valueRangeConditions, setValueRangeConditions] = useState({
//     revenue: {
//       startValue: NaN,
//       endValue: NaN,
//     },
//     costPrice: {
//       startValue: NaN,
//       endValue: NaN,
//     },
//     profit: {
//       startValue: NaN,
//       endValue: NaN,
//     },
//   });

//   useEffect(() => {
//     dispatch(showPreloader());
//     const fetchReport = async () => {
//       const report = await ReportService.getProductSellRecordReport(
//         range.startDate,
//         range.endDate,
//       );      
      
//       const reportData = report.data;
//       const filteredData = handleRangeNumFilter(
//         valueRangeConditions,
//         reportData,
//       );
//       setReport(filteredData);
//     };

//     fetchReport()
//       .catch((err) => axiosUIErrorHandler(err, toast, router))
//       .finally(() => dispatch(disablePreloader()));
//   }, [reportDateRangeCondition, reportDateSingleCondition, reportDateControl]);

//   const filters = [
//     <TimeFilter
//       key={1}
//       title="Report range"
//       timeFilterControl={reportDateControl}
//       singleTimeValue={reportDateSingleCondition}
//       rangeTimeValue={reportDateRangeCondition}
//       onTimeFilterControlChanged={(value) => setReportDateControl(value)}
//       onSingleTimeFilterChanged={(value) => setReportDateSingleCondition(value)}
//       onRangeTimeFilterChanged={(value) => setReportDateRange(value)}
//     />,
//   ];

//   const PDF = report ? (
//     <DefaultPDFContent
//       data={report}
//       startDate={range.startDate}
//       endDate={range.endDate}
//       title="PRODUCT SALE REPORT"
//       dataProperties={[
//         "productId",
//         "name",
//         "quantitySell",
//         "quantityReturn",
//         "totalSell",
//         "totalReturn",
//         "total",
//       ]}
//     />
//   ) : null;

//   return (
//     <PageWithFilters filters={filters} title="Product Sale Report">
//       <div className="flex flex-col space-y-4">
//         {report ? (
//           <>
//             <ReportPDFDownloadButton PdfContent={PDF!} classname="self-end" />
//             <ReportPDFView
//               PdfContent={PDF!}
//               classname="w-full h-[1000px] bg-black"
//             />
//           </>
//         ) : null}
//       </div>
//     </PageWithFilters>
//   );
// }
