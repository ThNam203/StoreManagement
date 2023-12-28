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
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { setPurchaseReturns } from "@/reducers/purchaseReturnsReducer";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import PurchaseReturnService from "@/services/purchaseReturnService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PurchaseReturnDatatable } from "./datatable";
import StaffService from "@/services/staff_service";
import { setStaffs } from "@/reducers/staffReducer";
import SupplierService from "@/services/supplier_service";
import { setSuppliers } from "@/reducers/suppliersReducer";
import { TimeFilterType, handleRangeNumFilter } from "@/utils";

export default function PurchaseReturnPage() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();
  const purchaseReturns = useAppSelector(
    (state) => state.purchaseReturns.value,
  );
  const staffs = useAppSelector((state) => state.staffs.value);
  const suppliers = useAppSelector((state) => state.suppliers.value);

  useEffect(() => {
    dispatch(showPreloader());
    const fetchData = async () => {
      const purchaseReturns =
        await PurchaseReturnService.getAllPurchaseReturns();
      dispatch(setPurchaseReturns(purchaseReturns.data));

      const staffs = await StaffService.getAllStaffs();
      dispatch(setStaffs(staffs.data));

      const suppliers = await SupplierService.getAllSuppliers();
      dispatch(setSuppliers(suppliers.data));
    };

    fetchData()
      .then()
      .catch((e) => axiosUIErrorHandler(e, toast))
      .finally(() => dispatch(disablePreloader()));
  }, []);

  const [filteredPurchaseReturns, setFilteredPurchaseReturns] =
    useState(purchaseReturns);

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
    discount: {
      startValue: NaN,
      endValue: NaN,
    },
    subTotal: {
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
  const [supplierCondition, setSupplierCondition] = useState<
    { id: number; name: string }[]
  >([]);

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
    let filteredPurchaseReturns = handleRangeNumFilter(
      rangeConditions,
      purchaseReturns,
    );
    filteredPurchaseReturns = filteredPurchaseReturns.filter(
      (purchaseReturn) => {
        if (
          staffCondition.length > 0 &&
          !staffCondition.some((staff) => staff.id === purchaseReturn.staffId)
        )
          return false;
        if (
          supplierCondition.length > 0 &&
          !supplierCondition.some(
            (supplier) => supplier.id === purchaseReturn.supplierId,
          )
        )
          return false;
        return true;
      },
    );
    setFilteredPurchaseReturns(filteredPurchaseReturns);
  }, [rangeConditions, staffCondition, supplierCondition, purchaseReturns]);

  const filters = [
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
      key={1}
      placeholder="Find supplier..."
      title="Supplier"
      values={supplierCondition.map((supplier) => ({
        id: supplier.id,
        name: supplier.name,
        displayString: supplier.name,
      }))}
      choices={suppliers.map((supplier) => ({
        id: supplier.id,
        name: supplier.name,
        displayString: supplier.name,
      }))}
      filter={(value: any, queryString: string) =>
        value.id.toString().includes(queryString) ||
        value.name.includes(queryString)
      }
      onValuesChanged={(values) =>
        setSupplierCondition([
          ...values.map((v: any) => {
            return { id: v.id, name: v.name };
          }),
        ])
      }
      className="mb-2"
    />,
    <RangeFilter
      key={4}
      title="Discount"
      range={rangeConditions.discount}
      onValuesChanged={(range) =>
        setRangeConditions({
          ...rangeConditions,
          discount: range,
        })
      }
      className="mb-2"
    />,
    <RangeFilter
      key={6}
      title="Sub total"
      range={rangeConditions.subTotal}
      onValuesChanged={(range) =>
        setRangeConditions({
          ...rangeConditions,
          subTotal: range,
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
      title="Purchase Return"
      filters={filters}
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
      <PurchaseReturnDatatable data={filteredPurchaseReturns} />
    </PageWithFilters>
  );
}
