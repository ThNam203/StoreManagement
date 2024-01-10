"use client";
import { Button } from "@/components/ui/button";
import NewDiscountForm from "@/components/ui/discount/new_discount_form";
import UpdateDiscountForm from "@/components/ui/discount/update_discount_form";
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
import { setDiscounts } from "@/reducers/discountsReducer";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { setGroups } from "@/reducers/productGroupsReducer";
import { setProducts } from "@/reducers/productsReducer";
import { setStaffs } from "@/reducers/staffReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import DiscountService from "@/services/discountService";
import ProductService from "@/services/productService";
import StaffService from "@/services/staff_service";
import {
  TimeFilterType,
  handleDateCondition,
  handleRangeNumFilter,
} from "@/utils";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DiscountDatatable } from "./datatable";

const DISCOUNT_TYPES = ["Voucher", "Coupon", "All"];
const DISCOUNT_STATUSES = ["Activating", "Disabled", "All"];

export default function DiscountPage() {
  const discounts = useAppSelector((state) => state.discounts.value);
  const staffs = useAppSelector((state) => state.staffs.activeStaffs);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updatePosition, setUpdatePosition] = useState(0);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();
  const roles = useAppSelector((state) => state.role.value);
  const profile = useAppSelector((state) => state.profile.value)!;
  const userPermissions = roles?.find(
    (role) => role.positionName === profile?.position,
  )!.roleSetting;

  useEffect(() => {
    dispatch(showPreloader());
    const getData = async () => {
      try {
        const discounts = await DiscountService.getAllDiscounts();
        dispatch(setDiscounts(discounts.data));

        const products = await ProductService.getAllProducts();
        dispatch(setProducts(products.data));

        const productGroups = await ProductService.getAllGroups();
        dispatch(setGroups(productGroups.data));

        const staffs = await StaffService.getAllStaffs();
        dispatch(setStaffs(staffs.data));
      } catch (e) {
        axiosUIErrorHandler(e, toast, router);
      } finally {
        dispatch(disablePreloader());
      }
    };

    getData();
  }, []);

  const onUpdateButtonClick = (position: number) => {
    setUpdatePosition(position);
    setUpdateOpen(true);
  };

  const [filteredDiscounts, setFilteredDiscounts] = useState(discounts);

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
  const [creatorCondition, setCreatorCondition] = useState<
    { id: number; name: string }[]
  >([]);
  const [typeCondition, setTypeCondition] = useState("All");
  const [statusCondition, setStatusCondition] = useState("All");
  const [valueRangeConditions, setValueRangeConditions] = useState({
    value: {
      startValue: NaN,
      endValue: NaN,
    },
  });

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

  useEffect(() => {
    // let filteredCustomers = handleChoiceFilters(filterConditions, customers);
    let filteredDiscounts = discounts;
    filteredDiscounts = filteredDiscounts.filter((discount) => {
      if (
        !handleDateCondition(
          timeConditions.createdAt,
          timeRangeConditions.createdAt,
          timeConditionControls.createdAt,
          new Date(discount.createdAt),
        )
      )
        return false;

      if (creatorCondition.length > 0) {
        if (
          !creatorCondition.some((creator) => creator.id === discount.creatorId)
        ) {
          return false;
        }
      }

      if (typeCondition !== "All") {
        if (typeCondition.toUpperCase() !== discount.type) {
          return false;
        }
      }

      if (statusCondition !== "All") {
        if (
          (discount.status && statusCondition === "Disabled") ||
          (!discount.status && statusCondition === "Activating")
        ) {
          return false;
        }
      }

      return true;
    });
    filteredDiscounts = handleRangeNumFilter(
      valueRangeConditions,
      filteredDiscounts,
    );
    setFilteredDiscounts(filteredDiscounts);
  }, [
    timeConditions,
    timeRangeConditions,
    creatorCondition,
    discounts,
    typeCondition,
    valueRangeConditions,
    statusCondition,
    timeConditionControls,
  ]);

  const filters = [
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
      values={creatorCondition.map((creator) => ({
        id: creator.id,
        name: creator.name,
        displayString: creator.name,
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
        setCreatorCondition([
          ...values.map((v: any) => {
            return { id: v.id, name: v.name };
          }),
        ])
      }
      className="mb-2"
    />,
    <SingleChoiceFilter
      key={4}
      title="Type"
      choices={DISCOUNT_TYPES}
      value={typeCondition}
      onValueChanged={(value) => setTypeCondition(value)}
      className="mb-2"
    />,
    <RangeFilter
      key={5}
      title="Value"
      range={valueRangeConditions.value}
      onValuesChanged={(value) =>
        setValueRangeConditions((prev) => ({ ...prev, value: value }))
      }
      className="mb-2"
    />,
    <SingleChoiceFilter
      key={6}
      title="Status"
      choices={DISCOUNT_STATUSES}
      value={statusCondition}
      onValueChanged={(value) => setStatusCondition(value)}
      className="mb-2"
    />,
  ];

  const NewDiscountButton = () => {
    const [open, setOpen] = useState(false);
    if (!userPermissions.discount.create) return null;

    return (
      <>
        <Button variant={"green"} onClick={() => setOpen(true)}>
          <Plus size={16} className="mr-2" />
          Create a new discount
        </Button>
        {open ? <NewDiscountForm setOpen={setOpen} /> : null}
      </>
    );
  };

  return (
    <PageWithFilters
      title="Discounts"
      filters={filters}
      headerButtons={[<NewDiscountButton key={1} />]}
    >
      <DiscountDatatable
        data={filteredDiscounts}
        onUpdateButtonClick={onUpdateButtonClick}
      />
      {updateOpen ? (
        <UpdateDiscountForm
          discount={discounts[updatePosition]}
          setOpen={setUpdateOpen}
        />
      ) : null}
    </PageWithFilters>
  );
}
