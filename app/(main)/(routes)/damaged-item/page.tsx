"use client";
import { Button } from "@/components/ui/button";
import {
  FilterTime,
  FilterYear,
  PageWithFilters,
  SearchFilterObject,
  TimeFilter,
} from "@/components/ui/filter";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DamagedItemsDatatable } from "./datatable";
import DamagedItemService from "@/services/damagedItemService";
import { setDamagedItemDocuments } from "@/reducers/damagedItemsReducer";
import StaffService from "@/services/staff_service";
import { setStaffs } from "@/reducers/staffReducer";
import { TimeFilterType, handleDateCondition } from "@/utils";
import ProductService from "@/services/productService";
import { setProducts } from "@/reducers/productsReducer";

export default function DamagedItemsPage() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();
  const damagedItemDocuments = useAppSelector(
    (state) => state.damagedItemDocuments.value,
  );
  const staffs = useAppSelector((state) => state.staffs.activeStaffs);
  const roles = useAppSelector((state) => state.role.value);
  const profile = useAppSelector((state) => state.profile.value)!;
  const userPermissions = roles?.find(
    (role) => role.positionName === profile?.position,
  )!.roleSetting;
  
  useEffect(() => {
    dispatch(showPreloader());
    const fetchData = async () => {
      const damagedItemDocuments =
        await DamagedItemService.getAllDamagedItemDocuments();
      const staffs = await StaffService.getAllStaffs();
      const products = await ProductService.getAllProducts();

      dispatch(setDamagedItemDocuments(damagedItemDocuments.data));
      dispatch(setStaffs(staffs.data));
      dispatch(setProducts(products.data));
    };

    fetchData()
      .then()
      .catch((e) => axiosUIErrorHandler(e, toast, router))
      .finally(() => dispatch(disablePreloader()));
  }, []);

  const [filteredDamagedItemDocuments, setFilteredDamagedItemDocuments] =
    useState(damagedItemDocuments);

  const [timeConditionControls, setTimeConditionControls] = useState({
    createdDate: TimeFilterType.StaticRange as TimeFilterType,
    birthday: TimeFilterType.StaticRange as TimeFilterType,
  });
  const [timeConditions, setTimeConditions] = useState({
    createdDate: FilterYear.AllTime as FilterTime,
    birthday: FilterYear.AllTime as FilterTime,
  });
  const [timeRangeConditions, setTimeRangeConditions] = useState({
    createdDate: { startDate: new Date(), endDate: new Date() },
    birthday: { startDate: new Date(), endDate: new Date() },
  });
  const [creatorCondition, setCreatorCondition] = useState<
    { id: number; name: string }[]
  >([]);

  const updateCreatedDateCondition = (value: FilterTime) => {
    setTimeConditions({ ...timeConditions, createdDate: value });
  };

  const updateCreatedDateConditionRange = (value: {
    startDate: Date;
    endDate: Date;
  }) => {
    setTimeRangeConditions({ ...timeRangeConditions, createdDate: value });
  };

  const updateCreatedDateConditionControl = (value: TimeFilterType) => {
    setTimeConditionControls({ ...timeConditionControls, createdDate: value });
  };

  useEffect(() => {
    // let filteredCustomers = handleChoiceFilters(filterConditions, customers);
    let filteredDamagedItemDocuments = damagedItemDocuments;
    filteredDamagedItemDocuments = filteredDamagedItemDocuments.filter(
      (document) => {
        if (
          !handleDateCondition(
            timeConditions.createdDate,
            timeRangeConditions.createdDate,
            timeConditionControls.createdDate,
            new Date(document.createdDate),
          )
        )
          return false;

        if (creatorCondition.length > 0) {
          if (
            !creatorCondition.some(
              (creator) => creator.id === document.creatorId,
            )
          ) {
            return false;
          }
        }

        return true;
      },
    );
    setFilteredDamagedItemDocuments(filteredDamagedItemDocuments);
  }, [
    timeConditions,
    timeRangeConditions,
    creatorCondition,
    damagedItemDocuments,
    staffs,
    timeConditionControls,
  ]);

  const filters = [
    <TimeFilter
      key={2}
      title="Created date"
      className="mb-2"
      timeFilterControl={timeConditionControls.createdDate}
      singleTimeValue={timeConditions.createdDate}
      rangeTimeValue={timeRangeConditions.createdDate}
      onTimeFilterControlChanged={updateCreatedDateConditionControl}
      onSingleTimeFilterChanged={updateCreatedDateCondition}
      onRangeTimeFilterChanged={updateCreatedDateConditionRange}
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
  ];

  const headerButtons = [];
  if (userPermissions.damageItems.create) {
    headerButtons.push(<Button
      key={1}
      variant={"green"}
      onClick={() => router.push("/damaged-item/new")}
    >
      New document
    </Button>)
  }

  return (
    <PageWithFilters title="Damaged Items" filters={filters} headerButtons={headerButtons}>
      <DamagedItemsDatatable data={filteredDamagedItemDocuments} />
    </PageWithFilters>
  );
}
