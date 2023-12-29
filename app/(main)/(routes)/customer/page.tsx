"use client";

import NewCustomerDialog from "@/components/component/new_customer_dialog";
import { Button } from "@/components/ui/button";
import {
  FilterTime,
  FilterYear,
  PageWithFilters,
  SearchFilter,
  SearchFilterObject,
  SingleChoiceFilter,
  TimeFilter,
} from "@/components/ui/filter";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setCustomerGroups } from "@/reducers/customerGroupsReducer";
import { setCustomers } from "@/reducers/customersReducer";
import { setInvoices } from "@/reducers/invoicesReducer";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import CustomerService from "@/services/customerService";
import InvoiceService from "@/services/invoiceService";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CustomerDatatable } from "./datatable";
import {
  TimeFilterType,
  handleChoiceFilters,
  handleDateCondition,
  handleTimeFilter,
} from "@/utils";
import StaffService from "@/services/staff_service";
import { setStaffs } from "@/reducers/staffReducer";

const SEX_CONDITIONS = ["Male", "Female", "Not to say", "All"];

export default function InvoicePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const NewInvoiceButton = () => {
    return (
      <NewCustomerDialog
        DialogTrigger={
          <Button variant={"green"}>
            <Plus size={16} className="mr-2" />
            New Customer
          </Button>
        }
      />
    );
  };

  const invoices = useAppSelector((state) => state.invoices.value);
  const customers = useAppSelector((state) => state.customers.value);
  const customerGroups = useAppSelector((state) => state.customerGroups.value);
  const staffs = useAppSelector((state) => state.staffs.value);

  useEffect(() => {
    dispatch(showPreloader());
    const fetchData = async () => {
      const invoices = await InvoiceService.getAllInvoices();
      dispatch(setInvoices(invoices.data));
      const customers = await CustomerService.getAllCustomers();
      dispatch(setCustomers(customers.data));
      const customerGroups = await CustomerService.getAllCustomerGroups();
      dispatch(setCustomerGroups(customerGroups.data));
      const staffs = await StaffService.getAllStaffs();
      dispatch(setStaffs(staffs.data));
    };

    fetchData()
      .then()
      .catch((e) => axiosUIErrorHandler(e, toast))
      .finally(() => dispatch(disablePreloader()));
  }, []);

  const [filteredCustomers, setFilteredCustomers] = useState(customers);

  const [filterConditions, setFilterConditions] = useState({
    customerGroup: [] as string[],
  });

  const [sexCondition, setSexCondition] = useState<string>("All");

  const [timeConditionControls, setTimeConditionControls] = useState({
    createdAt: TimeFilterType.StaticRange as TimeFilterType,
    birthday: TimeFilterType.StaticRange as TimeFilterType,
  });
  const [timeConditions, setTimeConditions] = useState({
    createdAt: FilterYear.AllTime as FilterTime,
    birthday: FilterYear.AllTime as FilterTime,
  });
  const [timeRangeConditions, setTimeRangeConditions] = useState({
    createdAt: { startDate: new Date(), endDate: new Date() },
    birthday: { startDate: new Date(), endDate: new Date() },
  });
  const [customerCreatorCondition, setCustomerCreatorCondition] = useState<
    { id: number; name: string }[]
  >([]);

  const updateProductGroupCondition = (values: string[]) => {
    setFilterConditions({ ...filterConditions, customerGroup: values });
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

  const updateCreatedAtConditionControl = (value: TimeFilterType) => {
    setTimeConditionControls({ ...timeConditionControls, createdAt: value });
  };

  const updateBirthdayCondition = (value: FilterTime) => {
    setTimeConditions({ ...timeConditions, birthday: value });
  };

  const updateBirthdayConditionRange = (value: {
    startDate: Date;
    endDate: Date;
  }) => {
    setTimeRangeConditions({ ...timeRangeConditions, birthday: value });
  };

  const updateBirthdayConditionControl = (value: TimeFilterType) => {
    setTimeConditionControls({ ...timeConditionControls, birthday: value });
  };

  useEffect(() => {
    let filteredCustomers = handleChoiceFilters(filterConditions, customers);
    filteredCustomers = filteredCustomers.filter((customer) => {
      if (
        !handleDateCondition(
          timeConditions.createdAt,
          timeRangeConditions.createdAt,
          timeConditionControls.createdAt,
          new Date(customer.createdAt),
        )
      )
        return false;

      if (
        !handleDateCondition(
          timeConditions.birthday,
          timeRangeConditions.birthday,
          timeConditionControls.birthday,
          new Date(customer.birthday),
        )
      )
        return false;

      if (customerCreatorCondition.length > 0) {
        if (
          !customerCreatorCondition.some(
            (creator) => creator.id === customer.creatorId,
          )
        ) {
          return false;
        }
      }

      if (customer.sex !== sexCondition && sexCondition !== "All") return false;

      return true;
    });

    setFilteredCustomers(filteredCustomers);
  }, [
    customers,
    filterConditions,
    customerCreatorCondition,
    timeConditions,
    timeRangeConditions,
    timeConditionControls,
    sexCondition,
  ]);

  const filters = [
    <SearchFilter
      key={1}
      placeholder="Find group..."
      title="Customer group"
      chosenValues={filterConditions.customerGroup}
      choices={customerGroups.map((group) => group.name)}
      onValuesChanged={updateProductGroupCondition}
      className="mb-2"
    />,
    <TimeFilter
      key={2}
      title="Created date"
      className="mb-2"
      timeFilterControl={timeConditionControls.createdAt}
      singleTimeValue={timeConditions.createdAt}
      rangeTimeValue={timeRangeConditions.createdAt}
      onTimeFilterControlChanged={updateCreatedAtConditionControl}
      onSingleTimeFilterChanged={updateCreatedAtCondition}
      onRangeTimeFilterChanged={updateCreatedAtConditionRange}
    />,
    <SearchFilterObject
      key={3}
      placeholder="Find creator..."
      title="Creator"
      values={customerCreatorCondition.map((group) => ({
        id: group.id,
        name: group.name,
        displayString: group.name,
      }))}
      choices={staffs.map((group) => ({
        id: group.id,
        name: group.name,
        displayString: group.name,
      }))}
      filter={(value: any, queryString: string) =>
        value.id.toString().includes(queryString) ||
        value.name.includes(queryString)
      }
      onValuesChanged={(values) =>
        setCustomerCreatorCondition([
          ...values.map((v: any) => {
            return { id: v.id, name: v.name };
          }),
        ])
      }
      className="mb-2"
    />,
    <SingleChoiceFilter
      key={4}
      title="Sex"
      choices={SEX_CONDITIONS}
      value={sexCondition}
      onValueChanged={setSexCondition}
      className="mb-2"
    />,
    <TimeFilter
      key={5}
      title="Birthday"
      className="mb-2"
      timeFilterControl={timeConditionControls.birthday}
      singleTimeValue={timeConditions.birthday}
      rangeTimeValue={timeRangeConditions.birthday}
      onTimeFilterControlChanged={updateBirthdayConditionControl}
      onSingleTimeFilterChanged={updateBirthdayCondition}
      onRangeTimeFilterChanged={updateBirthdayConditionRange}
    />,
  ];

  return (
    <PageWithFilters
      title="Customers"
      filters={filters}
      headerButtons={[<NewInvoiceButton key={1} />]}
    >
      <CustomerDatatable data={filteredCustomers} />
    </PageWithFilters>
  );
}
