"use client";
import { Button } from "@/components/ui/button";
import {
  FilterTime,
  FilterYear,
  PageWithFilters,
  RangeFilter,
  SearchFilterObject,
  TimeFilter
} from "@/components/ui/filter";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { setPurchaseOrders } from "@/reducers/purchaseOrdersReducer";
import { setStaffs } from "@/reducers/staffReducer";
import { setSuppliers } from "@/reducers/suppliersReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import PurchaseOrderService from "@/services/purchaseOrderService";
import StaffService from "@/services/staff_service";
import SupplierService from "@/services/supplierService";
import {
  TimeFilterType,
  handleDateCondition,
  handleRangeNumFilter,
} from "@/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PurchaseOrderDatatable } from "./datatable";
import ProductService from "@/services/productService";
import { setProducts } from "@/reducers/productsReducer";

export default function PurchaseOrderPage() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();
  const purchaseOrders = useAppSelector((state) => state.purchaseOrders.value);
  const staffs = useAppSelector((state) => state.staffs.value);
  const suppliers = useAppSelector((state) => state.suppliers.value);

  useEffect(() => {
    dispatch(showPreloader());
    const fetchData = async () => {
      const purchaseOrders = await PurchaseOrderService.getAllPurchaseOrders();
      const staffs = await StaffService.getAllStaffs();
      const suppliers = await SupplierService.getAllSuppliers();
      const products = await ProductService.getAllProducts();
      dispatch(setPurchaseOrders(purchaseOrders.data));
      dispatch(setStaffs(staffs.data));
      dispatch(setSuppliers(suppliers.data));
      dispatch(setProducts(products.data));
    };

    fetchData()
      .then()
      .catch((e) => axiosUIErrorHandler(e, toast, router))
      .finally(() => dispatch(disablePreloader()));
  }, []);

  const [filteredPurchaseOrders, setFilteredPurchaseOrders] =
    useState(purchaseOrders);

  const [timeConditionControls, setTimeConditionControls] = useState({
    createdDate: TimeFilterType.StaticRange as TimeFilterType,
  });
  const [timeConditions, setTimeConditions] = useState({
    createdDate: FilterYear.AllTime as FilterTime,
  });
  const [timeRangeConditions, setTimeRangeConditions] = useState({
    createdDate: { startDate: new Date(), endDate: new Date() },
  });
  const [rangeConditions, setRangeConditions] = useState({
    discount: {
      startValue: NaN,
      endValue: NaN,
    },
    subtotal: {
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

  const updateCreatedDateConditionControl = (value: TimeFilterType) => {
    setTimeConditionControls({ ...timeConditionControls, createdDate: value });
  };

  const updateCreatedDateCondition = (value: FilterTime) => {
    setTimeConditions({ ...timeConditions, createdDate: value });
  };

  const updateCreatedDateConditionRange = (value: {
    startDate: Date;
    endDate: Date;
  }) => {
    setTimeRangeConditions({ ...timeRangeConditions, createdDate: value });
  };

  useEffect(() => {
    let filteredPurchaseReturns = handleRangeNumFilter(
      rangeConditions,
      purchaseOrders,
    );
    filteredPurchaseReturns = filteredPurchaseReturns.filter(
      (purchaseOrder) => {
        if (
          !handleDateCondition(
            timeConditions.createdDate,
            timeRangeConditions.createdDate,
            timeConditionControls.createdDate,
            new Date(purchaseOrder.createdDate),
          )
        )
          return false;

        if (
          staffCondition.length > 0 &&
          !staffCondition.some((staff) => staff.id === purchaseOrder.staffId)
        )
          return false;
        if (
          supplierCondition.length > 0 &&
          !supplierCondition.some(
            (supplier) => supplier.id === purchaseOrder.supplierId,
          )
        )
          return false;
        return true;
      },
    );
    setFilteredPurchaseOrders(filteredPurchaseReturns);
  }, [rangeConditions, staffCondition, supplierCondition, purchaseOrders, timeConditions, timeRangeConditions, timeConditionControls]);

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
      range={rangeConditions.subtotal}
      onValuesChanged={(range) =>
        setRangeConditions({
          ...rangeConditions,
          subtotal: range,
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
      timeFilterControl={timeConditionControls.createdDate}
      singleTimeValue={timeConditions.createdDate}
      rangeTimeValue={timeRangeConditions.createdDate}
      onTimeFilterControlChanged={updateCreatedDateConditionControl}
      onSingleTimeFilterChanged={updateCreatedDateCondition}
      onRangeTimeFilterChanged={updateCreatedDateConditionRange}
    />,
  ];

  return (
    <PageWithFilters
      title="Purchase Order"
      filters={filters}
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
      <PurchaseOrderDatatable data={filteredPurchaseOrders} />
    </PageWithFilters>
  );
}