"use client";

import { Button } from "@/components/ui/button";
import {
  FilterTime,
  FilterYear,
  PageWithFilters,
  RangeFilter,
  SearchFilterObject,
  SingleChoiceFilter,
  TimeFilter,
} from "@/components/ui/filter";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setInvoices } from "@/reducers/invoicesReducer";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import InvoiceService from "@/services/invoiceService";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ChooseInvoiceToReturnDialog from "@/components/component/choose_invoice_to_return_dialog";
import ReturnInvoiceService from "@/services/returnInvoiceService";
import { setReturnInvoices } from "@/reducers/returnInvoicesReducer";
import { ReturnDatatable } from "./datatable";
import StaffService from "@/services/staff_service";
import { setStaffs } from "@/reducers/staffReducer";
import { TimeFilterType, handleRangeNumFilter } from "@/utils";
import { PAYMENT_METHODS } from "@/entities/Invoice";

export default function ReturnPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const NewInvoiceButton = () => {
    const [openDialog, setOpenDialog] = useState(false);
    return (
      <>
        <Button variant={"green"} onClick={() => setOpenDialog(true)}>
          <Plus size={16} className="mr-2" />
          New Return
        </Button>
        <ChooseInvoiceToReturnDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          invoices={invoices}
        />
      </>
    );
  };

  const invoices = useAppSelector((state) => state.invoices.value);
  const returnInvoices = useAppSelector((state) => state.returnInvoices.value);
  const staffs = useAppSelector((state) => state.staffs.value);

  useEffect(() => {
    dispatch(showPreloader());
    const fetchData = async () => {
      const invoices = await InvoiceService.getAllInvoices();
      dispatch(setInvoices(invoices.data));
      const returnInvoices = await ReturnInvoiceService.getAllReturnInvoices();
      dispatch(setReturnInvoices(returnInvoices.data));
      const staffs = await StaffService.getAllStaffs();
      dispatch(setStaffs(staffs.data));
    };

    fetchData()
      .then()
      .catch((e) => axiosUIErrorHandler(e, toast))
      .finally(() => dispatch(disablePreloader()));
  }, []);

  const [filteredReturnInvoices, setFilteredReturnInvoices] =
    useState(returnInvoices);

  const [timeConditionControls, setTimeConditionControls] = useState({
    createdAt: TimeFilterType.StaticRange as TimeFilterType,
  });
  const [timeConditions, setTimeConditions] = useState({
    createdAt: FilterYear.AllTime as FilterTime,
  });
  const [timeRangeConditions, setTimeRangeConditions] = useState({
    createdAt: { startDate: new Date(), endDate: new Date() },
  });
  const [rangeConditions, setRangeConditions] = useState({
    discountValue: {
      startValue: NaN,
      endValue: NaN,
    },
    returnFee: {
      startValue: NaN,
      endValue: NaN,
    },
    total: {
      startValue: NaN,
      endValue: NaN,
    },
  });
  const [staffCondition, setStaffCondition] = useState<
    { id: number; name: string }[]
  >([]);
  const [paymentMethodCondition, setPaymentMethodCondition] = useState("All");

  const updateCreatedAtConditionControl = (value: TimeFilterType) => {
    setTimeConditionControls({ ...timeConditionControls, createdAt: value });
  };

  const updateCreatedAtCondition = (value: FilterTime) => {
    setTimeConditions({ ...timeConditions, createdAt: value });
  };

  const updateCreatedAtConditionRange = (value: {
    startDate: Date;
    endDate: Date;
  }) => {
    setTimeRangeConditions({ ...timeRangeConditions, createdAt: value });
  };

  useEffect(() => {
    let filteredReturnInvoices = handleRangeNumFilter(rangeConditions, returnInvoices);
    filteredReturnInvoices = filteredReturnInvoices.filter((invoice) => {
      if (
        staffCondition.length > 0 &&
        !staffCondition.find((staff) => staff.id === invoice.staffId)
      ) return false;

      if (
        paymentMethodCondition !== "All" &&
        invoice.paymentMethod !== paymentMethodCondition
      ) {
        return false;
      }
      return true;
    });
    setFilteredReturnInvoices(filteredReturnInvoices);
  }, [rangeConditions, paymentMethodCondition, returnInvoices, staffCondition]);

  const filters = [
    <SingleChoiceFilter
      key={1}
      title="Payment method"
      choices={Object.values(PAYMENT_METHODS)}
      value={paymentMethodCondition}
      onValueChanged={setPaymentMethodCondition}
      className="mb-2"
    />,
    <SearchFilterObject
      key={2}
      placeholder="Find staff..."
      title="Staff (Creator)"
      values={staffCondition.map((staff) => ({
        id: staff.id,
        name: staff.name,
        displayString: staff.name,
      }))}
      choices={staffs.map((staff) => ({
        id: staff.id,
        name: staff.name,
        displayString: staff.name,
      }))}
      filter={(value: any, queryString: string) =>
        value.id.toString().includes(queryString) ||
        value.name.includes(queryString)
      }
      onValuesChanged={(values) =>
        setStaffCondition([
          ...values.map((v: any) => {
            return { id: v.id, name: v.name };
          }),
        ])
      }
      className="mb-2"
    />,
    <RangeFilter
      key={4}
      title="Discount value"
      range={rangeConditions.discountValue}
      onValuesChanged={(range) =>
        setRangeConditions({
          ...rangeConditions,
          discountValue: range,
        })
      }
      className="mb-2"
    />,
    <RangeFilter
      key={6}
      title="Return fee"
      range={rangeConditions.returnFee}
      onValuesChanged={(range) =>
        setRangeConditions({
          ...rangeConditions,
          returnFee: range,
        })
      }
      className="mb-2"
    />,
    <RangeFilter
      key={7}
      title="Total"
      range={rangeConditions.total}
      onValuesChanged={(range) =>
        setRangeConditions({
          ...rangeConditions,
          total: range,
        })
      }
      className="mb-2"
    />,
    <TimeFilter
      key={5}
      title="Created date"
      className="mb-2"
      timeFilterControl={timeConditionControls.createdAt}
      singleTimeValue={timeConditions.createdAt}
      rangeTimeValue={timeRangeConditions.createdAt}
      onTimeFilterControlChanged={updateCreatedAtConditionControl}
      onSingleTimeFilterChanged={updateCreatedAtCondition}
      onRangeTimeFilterChanged={updateCreatedAtConditionRange}
    />,
  ];

  return (
    <PageWithFilters
      title="Returns"
      filters={filters}
      headerButtons={[<NewInvoiceButton key={1} />]}
    >
      <ReturnDatatable data={filteredReturnInvoices} router={router} />
    </PageWithFilters>
  );
}
