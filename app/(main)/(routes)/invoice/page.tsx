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
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import InvoiceService from "@/services/invoiceService";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InvoiceDatatable } from "./datatable";
import {
  TimeFilterType,
  handleDateCondition,
  handleRangeNumFilter,
} from "@/utils";
import StaffService from "@/services/staff_service";
import { setStaffs } from "@/reducers/staffReducer";
import CustomerService from "@/services/customerService";
import { setCustomers } from "@/reducers/customersReducer";
import { PAYMENT_METHODS } from "@/entities/Invoice";

export default function InvoicePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const NewInvoiceButton = () => {
    return (
      <Button variant={"green"} onClick={() => router.push("/sale")}>
        <Plus size={16} className="mr-2" />
        New Invoice
      </Button>
    );
  };

  const invoices = useAppSelector((state) => state.invoices.value);
  const staffs = useAppSelector((state) => state.staffs.value);
  const customers = useAppSelector((state) => state.customers.value);

  const [filteredInvoices, setFilteredInvoices] = useState(invoices);

  useEffect(() => {
    dispatch(showPreloader());
    const fetchData = async () => {
      const invoices = await InvoiceService.getAllInvoices();
      dispatch(setInvoices(invoices.data));

      const staffs = await StaffService.getAllStaffs();
      dispatch(setStaffs(staffs.data));

      const customers = await CustomerService.getAllCustomers();
      dispatch(setCustomers(customers.data));
    };

    fetchData()
      .then()
      .catch((e) => axiosUIErrorHandler(e, toast, router))
      .finally(() => dispatch(disablePreloader()));
  }, []);

  const [rangeConditions, setRangeConditions] = useState({
    discountValue: {
      startValue: NaN,
      endValue: NaN,
    },
    cash: {
      startValue: NaN,
      endValue: NaN,
    },
    changed: {
      startValue: NaN,
      endValue: NaN,
    },
    total: {
      startValue: NaN,
      endValue: NaN,
    },
  });

  const [timeConditionControls, setTimeConditionControls] = useState({
    createdAt: TimeFilterType.StaticRange as TimeFilterType,
  });
  const [timeConditions, setTimeConditions] = useState({
    createdAt: FilterYear.AllTime as FilterTime,
  });
  const [timeRangeConditions, setTimeRangeConditions] = useState({
    createdAt: { startDate: new Date(), endDate: new Date() },
  });
  const [customerCondition, setCustomerCondition] = useState<
    { id: number; name: string }[]
  >([]);
  const [staffCondition, setStaffCondition] = useState<
    { id: number; name: string }[]
  >([]);

  const [paymentMethodConditions, setPaymentMethodConditions] = useState("All");

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
    let filteredInvoices = handleRangeNumFilter(rangeConditions, invoices);
    filteredInvoices = filteredInvoices.filter((invoice) => {
      if (
        !handleDateCondition(
          timeConditions.createdAt,
          timeRangeConditions.createdAt,
          timeConditionControls.createdAt,
          new Date(invoice.createdAt),
        )
      )
        return false;

      if (
        customerCondition.length > 0 &&
        !customerCondition.some(
          (customer) => customer.id === invoice.customerId,
        )
      ) {
        return false;
      }

      if (
        staffCondition.length > 0 &&
        !staffCondition.some((staff) => staff.id === invoice.staffId)
      ) {
        return false;
      }

      if (
        paymentMethodConditions !== "All" &&
        invoice.paymentMethod !== paymentMethodConditions
      ) {
        return false;
      }
      return true;
    });
    setFilteredInvoices(filteredInvoices);
  }, [
    rangeConditions,
    paymentMethodConditions,
    invoices,
    customerCondition,
    staffCondition,
  ]);

  const filters = [
    <SingleChoiceFilter
      key={1}
      title="Payment method"
      choices={[...Object.values(PAYMENT_METHODS), "All"]}
      value={paymentMethodConditions}
      onValueChanged={setPaymentMethodConditions}
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
    <SearchFilterObject
      key={3}
      placeholder="Find customer..."
      title="Customer"
      values={customerCondition.map((customer) => ({
        id: customer.id,
        name: customer.name,
        displayString: customer.name,
      }))}
      choices={customers.map((customer) => ({
        id: customer.id,
        name: customer.name,
        displayString: customer.name,
      }))}
      filter={(value: any, queryString: string) =>
        value.id.toString().includes(queryString) ||
        value.name.includes(queryString)
      }
      onValuesChanged={(values) =>
        setCustomerCondition([
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
      key={5}
      title="Cash"
      range={rangeConditions.cash}
      onValuesChanged={(range) =>
        setRangeConditions({
          ...rangeConditions,
          cash: range,
        })
      }
      className="mb-2"
    />,
    <RangeFilter
      key={6}
      title="Change"
      range={rangeConditions.changed}
      onValuesChanged={(range) =>
        setRangeConditions({
          ...rangeConditions,
          changed: range,
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
      title="Invoices"
      filters={filters}
      headerButtons={[<NewInvoiceButton key={1} />]}
    >
      <InvoiceDatatable data={filteredInvoices} router={router} />
    </PageWithFilters>
  );
}
