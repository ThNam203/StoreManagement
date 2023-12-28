"use client";
import { Button } from "@/components/ui/button";
import {
  PageWithFilters
} from "@/components/ui/filter";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { setPurchaseReturns } from "@/reducers/purchaseReturnsReducer";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import PurchaseReturnService from "@/services/purchaseReturnService";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PurchaseReturnDatatable } from "./datatable";

export default function PurchaseReturnPage() {
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
