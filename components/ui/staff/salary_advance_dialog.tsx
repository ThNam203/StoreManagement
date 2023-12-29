"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, PasswordInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingCircle from "@/components/ui/loading_circle";
import { MyCombobox } from "@/components/ui/my_combobox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  SalarySetting,
  SalaryType,
  SalaryUnitTable,
} from "@/entities/SalarySetting";
import { Sex, Staff } from "@/entities/Staff";
import { useAppSelector } from "@/hooks";
import { addPosition, deletePosition } from "@/reducers/staffPositionReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import StaffService from "@/services/staff_service";
import { formatNumberInput, formatPrice, removeCharNotANum } from "@/utils";
import {
  Check,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Info,
  PlusCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  DetailSalaryDebt,
  FormType,
  Status,
  TargetType,
  Transaction,
  TransactionDesc,
  TransactionType,
} from "@/entities/Transaction";
import CustomCombobox from "@/components/component/CustomCombobox";
import { cn } from "@/lib/utils";
import { CustomDatatable } from "@/components/component/custom_datatable";
import {
  detailSalaryDebtColumnTitles,
  detailSalaryDebtDefaultVisibilityState,
  detailSalaryDebtTableColumns,
} from "@/app/(main)/(routes)/staff/staff-account/table_columns";

const OptionView = (option: string): React.ReactNode => {
  return <p className="whitespace-nowrap text-xs">{option}</p>;
};

const OptionSearchView = (
  option: string,
  selectedOption: string | null,
): React.ReactNode => {
  const chosen = selectedOption && selectedOption === option;
  return (
    <div
      className={cn(
        "flex cursor-pointer items-center justify-between px-1",
        chosen ? "bg-green-100" : "",
      )}
    >
      <div>
        <p className="px-1 py-2 text-sm">{option}</p>
      </div>
      {chosen ? <Check size={16} color="green" /> : null}
    </div>
  );
};

const schema = z.object({
  value: z.number(),
  time: z.date(),
  transactionType: z.nativeEnum(TransactionType),
  note: z.string().optional(),
});

export function SalaryAdvanceDialog({
  open,
  setOpen,
  data,
  historyData,
  staff,
  submit,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: Transaction | null;
  historyData?: Transaction[];
  staff: Staff;
  submit?: (transaction: Transaction) => any;
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      time: new Date(),
      transactionType: TransactionType.CASH,
      value: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const expense: Transaction = {
      id: -1,
      time: values.time,
      formType: FormType.EXPENSE,
      description: TransactionDesc.EXPENSE_STAFF,
      value: values.value,
      targetId: staff.id,
      creator: "",
      transactionType: values.transactionType,
      targetType: TargetType.STAFF,
      targetName: staff.name,
      status: Status.PAID,
      note: values.note ? values.note : "",
      linkFormId: -1,
    };
    console.log("before submit", expense);

    if (submit) {
      setIsLoading(true);
      try {
        await submit(expense);
      } catch (e) {
        console.log(e);
      } finally {
        form.reset();
        setOpen(false);
        setIsLoading(false);
      }
    }
  };
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const transactionTypes = Object.values(TransactionType);
  const [currentDebt, setCurrentDebt] = useState(0);
  const [debtLater, setDebtLater] = useState(0);
  const [detailSalaryDebtList, setDetailSalaryDebtList] = useState<
    DetailSalaryDebt[]
  >([]);

  const getDetailSalaryDebtList = (historyData: Transaction[]) => {
    let tempDetailSalaryDebtList: DetailSalaryDebt[] = [];
    let paid = 0;
    historyData.forEach((transaction) => {
      paid += transaction.value;
      const detailSalaryDebt: DetailSalaryDebt = {
        id: transaction.id,
        totalSalary: staff.salaryDebt,
        paid: paid,
        needToPay: staff.salaryDebt - paid,
        value: transaction.value,
      };
      tempDetailSalaryDebtList.push(detailSalaryDebt);
    });
    setCurrentDebt(staff.salaryDebt - paid);
    setDebtLater(staff.salaryDebt - paid);
    return tempDetailSalaryDebtList;
  };

  function handleCancelDialog() {
    setOpen(false);
    form.reset();
  }

  useEffect(() => {
    if (open) resetValues(data);
  }, [open]);

  const resetValues = (transaction: Transaction | null) => {
    setIsLoading(false);
    resetToEmptyForm();
    if (transaction) {
      form.setValue("time", transaction.time);
      form.setValue("transactionType", transaction.transactionType);
      form.setValue("value", transaction.value);
      form.setValue("note", transaction.note);
    }
    if (historyData) {
      const detailSalaryDebtList = getDetailSalaryDebtList(historyData);
      setDetailSalaryDebtList(detailSalaryDebtList);
    }
  };

  const resetToEmptyForm = () => {
    form.reset();
    setCurrentDebt(0);
    setDebtLater(0);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{`Salary advance for ${staff.name} (Id: ${staff.id})`}</DialogTitle>
        </DialogHeader>

        <div className="w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 text-sm"
            >
              <div className="w-full border-b border-gray-200 pb-2 text-sm">
                <span className="font-semibold text-blue-500">
                  {staff.name}
                </span>
                <span> | </span>
                <span className="text-black">{`Position: ${staff.position}`}</span>
              </div>
              <div className="flex flex-row items-start justify-between gap-8">
                <div className="flex w-[450px] flex-col gap-2">
                  <div className="flex h-10 flex-row items-center">
                    <p className="w-[150px] font-medium">Current debt:</p>
                    <p className="flex-1 text-right">
                      {formatPrice(currentDebt)}
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row items-center">
                          <FormLabel className="w-[150px]">Value:</FormLabel>

                          <FormControl className="flex-1">
                            <Input
                              placeholder="0"
                              defaultValue={field.value}
                              onChange={(e: any) => {
                                const value = formatNumberInput(e);
                                form.setValue("value", value);
                                setDebtLater(currentDebt - value);
                              }}
                              className="text-right"
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  <div className="flex h-10 flex-row items-center">
                    <p className="w-[150px] font-medium">Debt later:</p>
                    <p className="flex-1 text-right">
                      {formatPrice(debtLater)}
                    </p>
                  </div>
                </div>
                <div className="flex w-[450px] flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row items-center">
                          <FormLabel className="w-[150px]">Time:</FormLabel>

                          <FormControl className="flex-1">
                            <div>
                              <DatePicker
                                value={field.value}
                                onChange={(date) => form.setValue("time", date)}
                              />
                            </div>
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="transactionType"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row items-center">
                          <FormLabel className="w-[150px]">
                            Expense type:
                          </FormLabel>
                          <FormControl className="flex-1">
                            <CustomCombobox<string>
                              placeholder="Select type"
                              searchPlaceholder={"Find type..."}
                              value={field.value}
                              choices={transactionTypes}
                              valueView={OptionView}
                              showSearchInput={false}
                              itemSearchView={(choice) =>
                                OptionSearchView(choice, field.value)
                              }
                              onItemClick={(val) => {
                                form.setValue(
                                  "transactionType",
                                  val as TransactionType,
                                );
                              }}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <div className="flex flex-row items-center">
                          <FormLabel className="w-1/3">Note</FormLabel>

                          <FormControl className="w-2/3">
                            <Input {...field} />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex w-full flex-col gap-2">
                <CustomDatatable<DetailSalaryDebt>
                  data={detailSalaryDebtList}
                  columns={detailSalaryDebtTableColumns()}
                  columnTitles={detailSalaryDebtColumnTitles}
                  config={{
                    defaultVisibilityState:
                      detailSalaryDebtDefaultVisibilityState,
                    showDefaultSearchInput: false,
                    showDataTableViewOptions: false,
                    showRowSelectedCounter: false,
                  }}
                />
              </div>

              <div className="flex flex-row justify-end">
                <Button
                  type="submit"
                  onClick={() => {}}
                  variant={"green"}
                  className="mr-3"
                  disabled={isLoading}
                >
                  Create expense form
                  {isLoading && <LoadingCircle></LoadingCircle>}
                </Button>
                <Button
                  type="button"
                  onClick={handleCancelDialog}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
