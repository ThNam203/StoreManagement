"use client";
import {
  ChoicesFilter,
  FilterTime,
  FilterYear,
  PageWithFilters,
  SearchFilter,
  TimeFilter,
} from "@/components/ui/filter";
import { useEffect, useState } from "react";
import { TimeFilterType } from "@/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import StockCheckService from "@/services/stock_check_service";
import { setStockChecks } from "@/reducers/stockChecksReducer";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import { useToast } from "@/components/ui/use-toast";
import PurchaseOrderService from "@/services/purchaseOrderService";
import { setPurchaseOrders } from "@/reducers/purchaseOrdersReducer";
import { PurchaseReturnDatatable } from "./datatable";
import PurchaseReturnService from "@/services/purchaseReturnService";
import { setPurchaseReturns } from "@/reducers/purchaseReturnsReducer";

export default function StockCheck() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();
  const purchaseReturns = useAppSelector((state) => state.purchaseReturns.value);

  useEffect(() => {
    dispatch(showPreloader());
    const fetchData = async () => {
      const purchaseReturns = await PurchaseReturnService.getAllPurchaseReturns();
      dispatch(setPurchaseReturns(purchaseReturns.data));
    };

    fetchData()
      .then()
      .catch((e) => axiosUIErrorHandler(e, toast))
      .finally(() => dispatch(disablePreloader()));
  }, []);

  return (
    <PageWithFilters
      title="Purchase Return"
      filters={[]}
      headerButtons={[
        <Button
          key={1}
          variant={"green"}
          onClick={() => router.push("/purchase-return/new")}
        >
          New purchase return
        </Button>,
      ]}
    >
      <PurchaseReturnDatatable data={purchaseReturns} />
    </PageWithFilters>
  );
}
