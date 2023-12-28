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
import { PurchaseOrderDatatable } from "./datatable";
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

export default function PurchaseOrderPage() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();
  const purchaseOrders = useAppSelector((state) => state.purchaseOrders.value);

  useEffect(() => {
    dispatch(showPreloader());
    const fetchData = async () => {
      const purchaseOrders = await PurchaseOrderService.getAllPurchaseOrders();
      dispatch(setPurchaseOrders(purchaseOrders.data));
    };

    fetchData()
      .then()
      .catch((e) => axiosUIErrorHandler(e, toast))
      .finally(() => dispatch(disablePreloader()));
  }, []);

  return (
    <PageWithFilters
      title="Purchase Order"
      filters={[]}
      headerButtons={[
        <Button
          key={1}
          variant={"green"}
          onClick={() => router.push("/purchase-order/new")}
        >
          New purchase order
        </Button>,
      ]}
    >
      <PurchaseOrderDatatable data={purchaseOrders} />
    </PageWithFilters>
  );
}
