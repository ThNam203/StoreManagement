"use client";
import { Button } from "@/components/ui/button";
import {
  PageWithFilters
} from "@/components/ui/filter";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DamagedItemsDatatable } from "./datatable";
import DamagedItemService from "@/services/damagedItemService";
import { setDamagedItemDocuments } from "@/reducers/damagedItemsReducer";
import StaffService from "@/services/staff_service";
import { setStaffs } from "@/reducers/staffReducer";

export default function DamagedItemsPage() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();
  const damagedItemDocuments = useAppSelector((state) => state.damagedItemDocuments.value);

  useEffect(() => {
    dispatch(showPreloader());
    const fetchData = async () => {
      const damagedItemDocuments = await DamagedItemService.getAllDamagedItemDocuments();
      dispatch(setDamagedItemDocuments(damagedItemDocuments.data));

      const staffs = await StaffService.getAllStaffs();
      dispatch(setStaffs(staffs.data));
    };

    fetchData()
      .then()
      .catch((e) => axiosUIErrorHandler(e, toast))
      .finally(() => dispatch(disablePreloader()));
  }, []);

  return (
    <PageWithFilters
      title="Damaged Items"
      filters={[]}
      headerButtons={[
        <Button
          key={1}
          variant={"green"}
          onClick={() => router.push("/damaged-item/new")}
        >
          New document
        </Button>,
      ]}
    >
      <DamagedItemsDatatable data={damagedItemDocuments} />
    </PageWithFilters>
  );
}
