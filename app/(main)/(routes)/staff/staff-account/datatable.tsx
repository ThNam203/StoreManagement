"use client";

import {
  Paycheck,
  SimpleTransaction,
  Staff,
  WorkSchedule,
} from "@/entities/Staff";
import { Row } from "@tanstack/react-table";
import { AddStaffDialog } from "../../../../../components/ui/staff/add_staff_dialog";

import { CustomDatatable } from "@/components/component/custom_datatable";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { FilterMonth } from "@/components/ui/filter";
import LoadingCircle from "@/components/ui/loading_circle";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { SalaryAdvanceDialog } from "@/components/ui/staff/salary_advance_dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  DetailPunishAndBonus,
  DetailPunishAndBonusList,
  Shift,
} from "@/entities/Attendance";
import { SalaryUnitTable } from "@/entities/SalarySetting";
import {
  FormType,
  TargetType,
  Transaction,
  TransactionDesc,
} from "@/entities/Transaction";
import { useAppSelector } from "@/hooks";
import { cn } from "@/lib/utils";
import { addTransaction } from "@/reducers/transactionReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import TransactionService from "@/services/transaction_service";
import {
  formatDate,
  formatPrice,
  getStaticRangeFilterTime,
  isInRangeTime,
} from "@/utils";
import {
  convertExpenseFormReceived,
  convertExpenseFormToSent,
} from "@/utils/transactionApiUtils";
import { format } from "date-fns";
import {
  Calculator,
  ChevronDown,
  ChevronUp,
  CreditCard,
  PenLine,
  Trash,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  ConfirmDialogType,
  MyConfirmDialog,
} from "../../../../../components/ui/my_confirm_dialog";
import {
  detailPunishAndBonusColumnTitles,
  detailPunishAndBonusDefaultVisibilityState,
  detailPunishAndBonusTableColumns,
  paycheckColumnTitles,
  paycheckDefaultVisibilityState,
  paycheckTableColumns,
  salaryDebtColumnTitles,
  salaryDebtDefaultVisibilityState,
  salaryDebtTableColumns,
  staffColumnTitles,
  staffDefaultVisibilityState,
  staffTableColumns,
  workScheduleColumnTitles,
  workScheduleDefaultVisibilityState,
  workScheduleTableColumns,
} from "./table_columns";
import { useRouter } from "next/navigation";

export function DataTable({
  data,
  onSubmit,
  onStaffDeleteButtonClicked,
  onStaffCalculateSalaryButtonClicked,
}: {
  data: Staff[];
  onSubmit: (values: Staff, avatar: File | null) => any;
  onStaffDeleteButtonClicked: (rowIndex: number) => void;
  onStaffCalculateSalaryButtonClicked?: (rowIndex: number) => any;
}) {
  const profile = useAppSelector((state) => state.profile.value);
  const staffRoleSetting = useAppSelector((state) => state.role.value).find(
    (role) => role.positionName === profile?.position,
  )?.roleSetting.staff;
  const fundLedgerRoleSetting = useAppSelector(
    (state) => state.role.value,
  ).find((role) => role.positionName === profile?.position)?.roleSetting
    .fundLedger;

  let canCreateStaff = false;
  let canUpdateStaff = false;
  let canDeleteStaff = false;
  let canMakePayment = false;
  if (staffRoleSetting) {
    canCreateStaff = staffRoleSetting.create;
    canUpdateStaff = staffRoleSetting.update;
    canDeleteStaff = staffRoleSetting.delete;
  }
  if (fundLedgerRoleSetting) canMakePayment = fundLedgerRoleSetting.create;

  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [openStaffDialog, setOpenStaffDialog] = useState(false);
  const handleOpenStaffDialog = (staff: Staff | null) => {
    setSelectedStaff(staff ? staff : null);
    setOpenStaffDialog(true);
  };
  const handleSubmit = (values: Staff, avatar: File | null) => {
    if (onSubmit) {
      return onSubmit(values, avatar);
    }
  };

  const onStaffUpdateButtonClicked = (rowIndex: number) => {
    handleOpenStaffDialog(data[rowIndex]);
  };

  const shiftList = useAppSelector((state) => state.shift.value);
  const expenseForms = useAppSelector((state) => state.transactions.value);
  const detailPunishAndBonusList = useAppSelector(
    (state) => state.detailPunishAndBonusList.value,
  );
  const [paycheckList, setPaycheckList] = React.useState<Paycheck[][]>([]);
  const [workScheduleList, setWorkScheduleList] = useState<WorkSchedule[][]>(
    [],
  );
  const [salaryDebtList, setSalaryDebtList] = useState<SimpleTransaction[][]>(
    [],
  );
  const [expenseFormsByStaff, setExpenseFormsByStaff] = useState<
    Transaction[][]
  >([]);
  const [detailPunishListByStaff, setDetailPunishListByStaff] = useState<
    DetailPunishAndBonus[][]
  >([]);
  const [detailBonusListByStaff, setDetailBonusListByStaff] = useState<
    DetailPunishAndBonus[][]
  >([]);

  const getPaycheckList = (staff: Staff, paid: number) => {
    let tempPaycheckList: Paycheck[] = [];
    const range = getStaticRangeFilterTime(FilterMonth.ThisMonth);
    const workingPeriod =
      formatDate(range.startDate) + " - " + formatDate(range.endDate);
    tempPaycheckList.push({
      workingPeriod: workingPeriod,
      totalSalary: staff.salaryDebt,
      paid: paid,
      needToPay: staff.salaryDebt - paid,
    });
    return tempPaycheckList;
  };

  const getWorkScheduleList = (staff: Staff, shiftList: Shift[]) => {
    let tempWorkScheduleList: WorkSchedule[] = [];
    shiftList.forEach((shift) => {
      shift.dailyShiftList.forEach((dailyShift) => {
        dailyShift.attendList.forEach((attend) => {
          if (attend.staffId === staff.id) {
            const workSchedule: WorkSchedule = {
              date: dailyShift.date,
              shiftName: shift.name,
              startTime: shift.workingTime.start,
              endTime: shift.workingTime.end,
              note: attend.note,
            };
            tempWorkScheduleList.push(workSchedule);
          }
        });
      });
    });
    return tempWorkScheduleList;
  };

  const getSalaryDebtList = (staff: Staff, expenseForms: Transaction[]) => {
    let tempSalaryDebtList: SimpleTransaction[] = [];
    let totalSalaryDebt = 0;
    let paid = 0;
    expenseForms.forEach((expense) => {
      if (
        expense.targetId === staff.id &&
        expense.targetType === TargetType.STAFF &&
        expense.formType === FormType.EXPENSE &&
        expense.description === TransactionDesc.EXPENSE_STAFF
      ) {
        paid += expense.value;
        const salaryDebt: SimpleTransaction = {
          id: expense.id,
          time: expense.time,
          description: expense.description,
          value: expense.value,
          salaryDebt: staff.salaryDebt - paid,
        };
        totalSalaryDebt += expense.value;
        tempSalaryDebtList.push(salaryDebt);
      }
    });
    return { tempSalaryDebtList, totalSalaryDebt };
  };

  const getExpenseFormsByStaff = (
    staff: Staff,
    expenseForms: Transaction[],
    range: { startDate: Date; endDate: Date },
  ) => {
    let tempExpenseFormsByStaff: Transaction[] = [];
    expenseForms.forEach((expense) => {
      if (
        expense.targetId === staff.id &&
        expense.targetType === TargetType.STAFF &&
        isInRangeTime(expense.time, range) &&
        expense.formType === FormType.EXPENSE &&
        expense.description === TransactionDesc.EXPENSE_STAFF
      ) {
        tempExpenseFormsByStaff.push(expense);
      }
    });
    return tempExpenseFormsByStaff;
  };
  const getDetailPunishByStaff = (
    staff: Staff,
    detailPunishAndBonusList: DetailPunishAndBonusList[],
  ) => {
    let tempDetailPunishByStaff: DetailPunishAndBonus[] = [];
    detailPunishAndBonusList.forEach((detail) => {
      if (detail.staffId === staff.id)
        tempDetailPunishByStaff = tempDetailPunishByStaff.concat(
          detail.listPunish,
        );
    });
    return tempDetailPunishByStaff;
  };

  const getDetailBonusByStaff = (
    staff: Staff,
    detailPunishAndBonusList: DetailPunishAndBonusList[],
  ) => {
    let tempDetailBonusByStaff: DetailPunishAndBonus[] = [];
    detailPunishAndBonusList.forEach((detail) => {
      if (detail.staffId === staff.id)
        tempDetailBonusByStaff = tempDetailBonusByStaff.concat(
          detail.listBonus,
        );
    });
    return tempDetailBonusByStaff;
  };

  useEffect(() => {
    if (data.length > 0) {
      let tempPaycheckList: Paycheck[][] = [];
      let tempWorkScheduleList: WorkSchedule[][] = [];
      let tempSalaryDebtList: SimpleTransaction[][] = [];
      let tempExpenseFormsByStaff: Transaction[][] = [];
      let tempDetailBonusByStaff: DetailPunishAndBonus[][] = [];
      let tempDetailPunishByStaff: DetailPunishAndBonus[][] = [];
      data.forEach((staff) => {
        const { tempSalaryDebtList: list, totalSalaryDebt } = getSalaryDebtList(
          staff,
          expenseForms,
        );
        tempSalaryDebtList.push(list);
        tempPaycheckList.push(getPaycheckList(staff, totalSalaryDebt));
        tempWorkScheduleList.push(getWorkScheduleList(staff, shiftList));
        tempExpenseFormsByStaff.push(
          getExpenseFormsByStaff(
            staff,
            expenseForms,
            getStaticRangeFilterTime(FilterMonth.ThisMonth),
          ),
        );
        tempDetailBonusByStaff.push(
          getDetailBonusByStaff(staff, detailPunishAndBonusList),
        );
        tempDetailPunishByStaff.push(
          getDetailPunishByStaff(staff, detailPunishAndBonusList),
        );
      });

      setPaycheckList(tempPaycheckList);
      setWorkScheduleList(tempWorkScheduleList);
      setSalaryDebtList(tempSalaryDebtList);
      setExpenseFormsByStaff(tempExpenseFormsByStaff);
      setDetailBonusListByStaff(tempDetailBonusByStaff);
      setDetailPunishListByStaff(tempDetailPunishByStaff);
    }
  }, [data, shiftList, expenseForms, detailPunishAndBonusList]);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-end py-4">
        <Button
          variant="green"
          className={cn(canCreateStaff ? "" : "hidden")}
          onClick={() => handleOpenStaffDialog(null)}
        >
          Add new staff
        </Button>
      </div>
      <CustomDatatable
        data={data}
        columns={staffTableColumns()}
        columnTitles={staffColumnTitles}
        infoTabs={[
          {
            render(row, setShowTabs) {
              return (
                <StaffInfoTab
                  row={row}
                  setShowTabs={setShowTabs}
                  canUpdateStaff={canUpdateStaff}
                  canDeleteStaff={canDeleteStaff}
                  onStaffUpdateButtonClicked={onStaffUpdateButtonClicked}
                  onStaffDeleteButtonClicked={onStaffDeleteButtonClicked}
                />
              );
            },
            tabName: "Infomation",
          },
          {
            render(row, setShowTabs) {
              return (
                <StaffWorkScheduleTab
                  row={row}
                  setShowTabs={setShowTabs}
                  workScheduleList={workScheduleList[row.index]}
                />
              );
            },
            tabName: "Work schedule",
          },
          {
            render(row, setShowTabs) {
              return (
                <StaffSalarySettingTab
                  row={row}
                  setShowTabs={setShowTabs}
                  canUpdateStaff={canUpdateStaff}
                  onStaffUpdateButtonClicked={onStaffUpdateButtonClicked}
                />
              );
            },
            tabName: "Salary setting",
          },
          {
            render(row, setShowTabs) {
              return (
                <StaffPaycheckTab
                  row={row}
                  setShowTabs={setShowTabs}
                  paycheckList={paycheckList[row.index]}
                  onStaffCalculateSalaryButtonClicked={
                    onStaffCalculateSalaryButtonClicked
                  }
                  detailBonusList={detailBonusListByStaff[row.index]}
                  detailPunishList={detailPunishListByStaff[row.index]}
                />
              );
            },
            tabName: "Paycheck",
          },
          {
            render(row, setShowTabs) {
              return (
                <StaffSalaryDebtTab
                  row={row}
                  setShowTabs={setShowTabs}
                  canMakePayment={canMakePayment}
                  salaryDebtList={salaryDebtList[row.index]}
                  expenseFormsByStaff={expenseFormsByStaff[row.index]}
                />
              );
            },
            tabName: "Salary debt",
          },
        ]}
        config={{
          defaultVisibilityState: staffDefaultVisibilityState,
        }}
      />
      <AddStaffDialog
        open={openStaffDialog}
        setOpen={setOpenStaffDialog}
        submit={handleSubmit}
        data={selectedStaff}
        title={selectedStaff ? "Update staff" : "Add new staff"}
      />
    </div>
  );
}

const StaffInfoTab = ({
  row,
  setShowTabs,
  onStaffUpdateButtonClicked,
  onStaffDeleteButtonClicked,
  canUpdateStaff = false,
  canDeleteStaff = false,
}: {
  row: Row<Staff>;
  canUpdateStaff?: boolean;
  canDeleteStaff?: boolean;
  setShowTabs: (value: boolean) => any;
  onStaffUpdateButtonClicked: (rowIndex: number) => any;
  onStaffDeleteButtonClicked: (rowIndex: number) => any;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const staff = row.original;
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [contentConfirmDialog, setContentConfirmDialog] = useState({
    title: "",
    content: "",
    type: "warning" as ConfirmDialogType,
  });
  const [isRemoving, setIsRemoving] = useState(false);
  const handleRemoveStaff = async () => {
    setIsRemoving(true);
    try {
      await onStaffDeleteButtonClicked(row.index);
      toast({
        variant: "default",
        title: "Remove staff successfully",
      });
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject(e);
    } finally {
      setIsRemoving(false);
    }
  };
  return (
    <div className="flex h-[300px] flex-col gap-4 px-4 py-4">
      <div className="flex flex-row">
        <div className="flex max-h-[350px] max-w-[200px] shrink-[5] grow-[5] flex-col">
          <AspectRatio
            className={cn(
              "h-[200px] w-[150px] rounded-sm",
              staff.avatar !== null && staff.avatar !== ""
                ? "border-2 border-black"
                : "",
            )}
            ratio={1 / 1}
          >
            <Image
              width={0}
              height={0}
              sizes="100vw"
              alt={`${staff.name} avatar`}
              src={
                staff.avatar !== null && staff.avatar !== ""
                  ? staff.avatar
                  : "/default-user-avatar.png"
              }
              className="h-full w-full rounded-sm border"
            />
          </AspectRatio>
        </div>
        <div className="flex shrink-[5] grow-[5] flex-row gap-2 text-[0.8rem]">
          <div className="flex flex-1 flex-col">
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[100px] font-normal">Staff ID:</p>
              <p>{staff.id}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[100px] font-normal">Staff name:</p>
              <p>{staff.name}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[100px] font-normal">Birthday:</p>
              <p>{formatDate(staff.birthday)}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[100px] font-normal">Sex:</p>
              <p>{staff.sex}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[100px] font-normal">CCCD:</p>
              <p>{staff.cccd}</p>
            </div>
          </div>
          <div className="flex flex-1 flex-col">
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[100px] font-normal">Position:</p>
              <p>{staff.position}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[100px] font-normal">Phone number:</p>
              <p>{staff.phoneNumber}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[100px] font-normal">Email:</p>
              <p>{staff.email}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[100px] font-normal">Address:</p>
              <p>{staff.address}</p>
            </div>
            <div>
              <p className="mb-2">Note: </p>
              <textarea
                readOnly
                disabled
                className={cn("h-[80px] w-full resize-none border-2 p-1")}
                defaultValue={staff.note}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <div className="flex-1" />
        <Button
          variant={"green"}
          onClick={(e) => onStaffUpdateButtonClicked(row.index)}
          className={cn(canUpdateStaff ? "" : "hidden")}
        >
          <PenLine size={16} fill="white" className="mr-2" />
          Update
        </Button>
        <Button
          variant={"red"}
          className={cn(canDeleteStaff ? "" : "hidden")}
          onClick={() => {
            setContentConfirmDialog({
              title: "Remove staff",
              content: `All data of this staff will be removed. Are you sure you want to remove staff named '${staff.name}' ?`,
              type: "warning",
            });
            setOpenConfirmDialog(true);
          }}
        >
          <Trash size={16} className="mr-2" />
          Remove
          {isRemoving && <LoadingCircle></LoadingCircle>}
        </Button>
      </div>
      <MyConfirmDialog
        open={openConfirmDialog}
        setOpen={setOpenConfirmDialog}
        title={contentConfirmDialog.title}
        content={contentConfirmDialog.content}
        type={contentConfirmDialog.type}
        onAccept={() => {
          setOpenConfirmDialog(false);
          handleRemoveStaff();
        }}
        onCancel={() => setOpenConfirmDialog(false)}
      />
    </div>
  );
};
const StaffWorkScheduleTab = ({
  row,
  setShowTabs,
  workScheduleList,
}: {
  row: Row<Staff>;
  setShowTabs: (value: boolean) => any;
  workScheduleList: WorkSchedule[];
}) => {
  return (
    <ScrollArea className="h-[300px]">
      <ScrollBar orientation="vertical" />

      <div className="flex h-full flex-col justify-between gap-4 py-2 pl-8 pr-4">
        <CustomDatatable
          data={workScheduleList}
          columns={workScheduleTableColumns()}
          columnTitles={workScheduleColumnTitles}
          config={{
            defaultVisibilityState: workScheduleDefaultVisibilityState,
            showDefaultSearchInput: false,
            showDataTableViewOptions: false,
            showRowSelectedCounter: false,
          }}
        />
      </div>
    </ScrollArea>
  );
};
const StaffSalarySettingTab = ({
  row,
  setShowTabs,
  onStaffUpdateButtonClicked,
  canUpdateStaff = false,
}: {
  row: Row<Staff>;
  setShowTabs: (value: boolean) => any;
  canUpdateStaff?: boolean;
  onStaffUpdateButtonClicked: (rowIndex: number) => any;
}) => {
  const staff = row.original;
  return (
    <div className="flex h-[300px] flex-col justify-between gap-4 py-2 pl-8 pr-4">
      <div className="flex flex-col gap-1">
        <div className="mb-2 flex flex-row border-b text-xs font-medium">
          <p className="w-[100px] font-normal">Payroll period:</p>
          <p>Monthly</p>
        </div>
        <div className="mb-2 flex flex-row border-b text-xs font-medium">
          <p className="w-[100px] font-normal">Salary type:</p>
          <p>{`${staff.salarySetting.salaryType} (${formatPrice(
            staff.salarySetting.salary,
          )} VND / ${SalaryUnitTable[staff.salarySetting.salaryType]})`}</p>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <div className="flex-1" />
        <Button
          variant={"green"}
          onClick={(e) => onStaffUpdateButtonClicked(row.index)}
          className={cn(canUpdateStaff ? "" : "hidden")}
        >
          <PenLine size={16} fill="white" className="mr-2" />
          Update
        </Button>
      </div>
    </div>
  );
};
const StaffPaycheckTab = ({
  row,
  setShowTabs,
  paycheckList,
  detailBonusList,
  detailPunishList,
  onStaffCalculateSalaryButtonClicked,
}: {
  row: Row<Staff>;
  setShowTabs: (value: boolean) => any;
  paycheckList: Paycheck[];
  detailPunishList: DetailPunishAndBonus[];
  detailBonusList: DetailPunishAndBonus[];
  onStaffCalculateSalaryButtonClicked?: (rowIndex: number) => any;
}) => {
  const [showDetailPunishList, setShowDetailPunishList] = useState(false);
  const [showDetailBonusList, setShowDetailBonusList] = useState(false);
  return (
    <div className="flex h-[300px] flex-col justify-between gap-4 py-2 pl-8 pr-4">
      <ScrollArea className="h-250px pr-2">
        <CustomDatatable
          data={paycheckList}
          columns={paycheckTableColumns()}
          columnTitles={paycheckColumnTitles}
          config={{
            defaultVisibilityState: paycheckDefaultVisibilityState,
            showDefaultSearchInput: false,
            showDataTableViewOptions: false,
            showRowSelectedCounter: false,
          }}
        />
        <span
          className="my-4 flex w-fit cursor-pointer flex-row items-center gap-2 font-semibold text-red-400 hover:opacity-80"
          onClick={() => setShowDetailPunishList((prev) => !prev)}
        >
          Show detail punish list
          {showDetailPunishList ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </span>
        {showDetailPunishList ? (
          <CustomDatatable<DetailPunishAndBonus>
            data={detailPunishList}
            columns={detailPunishAndBonusTableColumns()}
            columnTitles={detailPunishAndBonusColumnTitles}
            config={{
              defaultVisibilityState:
                detailPunishAndBonusDefaultVisibilityState,
              showDefaultSearchInput: false,
              showDataTableViewOptions: false,
              showRowSelectedCounter: false,
            }}
          />
        ) : null}

        <span
          className="my-4 flex w-fit cursor-pointer flex-row items-center gap-2 font-semibold text-blue-400 hover:opacity-80"
          onClick={() => setShowDetailBonusList((prev) => !prev)}
        >
          Show detail bonus list
          {showDetailBonusList ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </span>
        {showDetailBonusList ? (
          <CustomDatatable<DetailPunishAndBonus>
            data={detailBonusList}
            columns={detailPunishAndBonusTableColumns()}
            columnTitles={detailPunishAndBonusColumnTitles}
            config={{
              defaultVisibilityState:
                detailPunishAndBonusDefaultVisibilityState,
              showDefaultSearchInput: false,
              showDataTableViewOptions: false,
              showRowSelectedCounter: false,
            }}
          />
        ) : null}
      </ScrollArea>

      <div className="flex flex-row items-center gap-2">
        <div className="flex-1" />
        <Button
          variant={"green"}
          onClick={(e) => {
            if (onStaffCalculateSalaryButtonClicked)
              onStaffCalculateSalaryButtonClicked(row.index);
          }}
        >
          <Calculator size={16} className="mr-2" />
          Calculate salary
        </Button>
      </div>
    </div>
  );
};
const StaffSalaryDebtTab = ({
  row,
  setShowTabs,
  salaryDebtList,
  expenseFormsByStaff,
  canMakePayment = false,
}: {
  row: Row<Staff>;
  canMakePayment?: boolean;
  setShowTabs: (value: boolean) => any;
  salaryDebtList: SimpleTransaction[];
  expenseFormsByStaff: Transaction[];
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useDispatch();
  const staff = row.original;
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [openSalaryAdvanceDialog, setOpenSalaryAdvanceDialog] = useState(false);
  const handleOpenSalaryAdvanceDialog = (transaction: Transaction | null) => {
    setSelectedTransaction(transaction);
    setOpenSalaryAdvanceDialog(true);
  };

  const createPayment = async (value: Transaction) => {
    try {
      const paymentToSent = convertExpenseFormToSent(value);
      const res = await TransactionService.createNewExpenseForm(paymentToSent);
      const convertedPayment = convertExpenseFormReceived(res.data);
      dispatch(addTransaction(convertedPayment));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject();
    }
  };

  const handleCreatePayment = (value: Transaction) => {
    return createPayment(value);
  };
  return (
    <div className="flex h-[300px] flex-col justify-between gap-4 py-2 pl-8 pr-4">
      <CustomDatatable<SimpleTransaction>
        data={salaryDebtList}
        columns={salaryDebtTableColumns()}
        columnTitles={salaryDebtColumnTitles}
        config={{
          defaultVisibilityState: salaryDebtDefaultVisibilityState,
          showDefaultSearchInput: false,
          showDataTableViewOptions: false,
          showRowSelectedCounter: false,
        }}
      />
      <div className="flex flex-row items-center gap-2">
        <div className="flex-1" />
        <Button
          variant={"green"}
          className={cn(canMakePayment ? "" : "hidden")}
          onClick={(e) => handleOpenSalaryAdvanceDialog(null)}
        >
          <CreditCard size={16} className="mr-2" />
          Make payment
        </Button>
      </div>
      <SalaryAdvanceDialog
        open={openSalaryAdvanceDialog}
        setOpen={setOpenSalaryAdvanceDialog}
        data={selectedTransaction}
        staff={staff}
        submit={handleCreatePayment}
        historyData={expenseFormsByStaff}
      />
    </div>
  );
};
