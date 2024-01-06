"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Check, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import CustomCombobox from "@/components/component/CustomCombobox";
import { DatePicker } from "@/components/ui/datepicker";
import { useToast } from "@/components/ui/use-toast";
import {
  FormType,
  Status,
  Stranger,
  TargetType,
  Transaction,
  TransactionDesc,
  TransactionType,
} from "@/entities/Transaction";
import { cn } from "@/lib/utils";
import { addStranger } from "@/reducers/transactionStrangerReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import TransactionService from "@/services/transaction_service";
import { formatNumberInput } from "@/utils";
import {
  convertStrangerReceived,
  convertStrangerToSent,
} from "@/utils/transactionApiUtils";
import { useDispatch } from "react-redux";
import AddTargetDailog from "@/components/ui/fund-ledger/addTargetDialog";
import { useAppSelector } from "@/hooks";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  time: z.date(),
  value: z.number(),
  transactionType: z.nativeEnum(TransactionType),
  targetType: z.nativeEnum(TargetType),
  targetName: z.string(),
  note: z.string().optional(),
});

type Props = {
  data: Transaction | null;
  submit: (values: Transaction) => any;
  open: boolean;
  setOpen: (open: boolean) => void;
};

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

export function MakeReceiptDialog({ data, submit, open, setOpen }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      time: new Date(),
      value: undefined,
      targetType: TargetType.OTHER,
      targetName: undefined,
    },
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const transactionTypes = Object.values(TransactionType);
  const targetTypes = Object.values(TargetType);
  const [selectedTargetType, setSelectedTargetType] = useState<TargetType>(
    TargetType.OTHER,
  );
  const strangerList = useAppSelector(
    (state) => state.transactionStranger.value,
  );
  const staffList = useAppSelector((state) => state.staffs.value);
  const customerList = useAppSelector((state) => state.customers.value);
  const supplierList = useAppSelector((state) => state.suppliers.value);
  const [targetNames, setTargetNames] = useState<string[]>([]);
  const [targetNameSearch, setTargetNameSearch] = useState<string>("");
  const [openAddTargetDialog, setOpenAddTargetDialog] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<Stranger | null>(null);

  useEffect(() => {
    if (open) resetValues(data);
  }, [open]);

  const resetValues = (data: Transaction | null) => {
    resetToEmptyForm();

    if (data) {
      form.setValue("time", data.time);
      form.setValue("value", data.value);
      form.setValue("transactionType", data.transactionType);
      form.setValue("targetType", data.targetType);
      handleTargetTypeChange(data.targetType);
      form.setValue("targetName", data.targetName);
      form.setValue("note", data.note);
    }
  };
  const resetToEmptyForm = () => {
    form.reset();
    handleTargetTypeChange(TargetType.OTHER);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let targetId = -1;
    if (selectedTargetType === TargetType.OTHER) {
      const stranger = strangerList.find(
        (stranger) => stranger.name === values.targetName,
      );
      if (stranger) targetId = stranger.id;
    } else if (selectedTargetType === TargetType.STAFF) {
      const staff = staffList.find((staff) => staff.name === values.targetName);
      if (staff) targetId = staff.id;
    } else if (selectedTargetType === TargetType.CUSTOMER) {
      const customer = customerList.find(
        (customer) => customer.name === values.targetName,
      );
      if (customer) targetId = customer.id;
    } else if (selectedTargetType === TargetType.SUPPLIER) {
      const supplier = supplierList.find(
        (supplier) => supplier.name === values.targetName,
      );
      if (supplier) targetId = supplier.id;
    }

    const receipt: Transaction = {
      id: data ? data.id : -1,
      time: values.time,
      formType: FormType.RECEIPT,
      description: TransactionDesc.RECEIPT_OTHER,
      value: values.value,
      targetId: targetId,
      creator: "",
      transactionType: values.transactionType,
      targetType: values.targetType,
      targetName: values.targetName,
      status: Status.PAID,
      note: values.note ? values.note : "",
      linkFormId: -1,
    };

    if (submit) {
      try {
        await submit(receipt);
      } catch (e) {
        console.log(e);
      } finally {
        form.reset();
        setOpen(false);
      }
    }
  };
  function handleCancelDialog() {
    setOpen(false);
    form.reset();
  }

  const handleOpenAddTargetDialog = (target: Stranger | null) => {
    setSelectedTarget(target);
    setOpenAddTargetDialog(true);
  };

  const addNewStranger = async (stranger: Stranger) => {
    try {
      const strangerToSent = convertStrangerToSent(stranger);
      const res = await TransactionService.createNewStranger(strangerToSent);
      dispatch(addStranger(res.data));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject(e);
    } finally {
    }
  };

  const handleAddNewStranger = async (stranger: Stranger) => {
    return addNewStranger(stranger).then(() => {
      setTargetNames((prev) => [...prev, stranger.name]);
    });
  };

  const handleTargetTypeChange = (targetType: TargetType) => {
    setSelectedTargetType(targetType);
    if (targetType === TargetType.OTHER) {
      const strangerNames = strangerList.map((stranger) => stranger.name);
      setTargetNames(strangerNames);
    } else if (targetType === TargetType.STAFF) {
      const staffNameList = staffList.map((staff) => staff.name);
      setTargetNames(staffNameList);
    } else if (targetType === TargetType.CUSTOMER) {
      const customerNames = customerList.map((customer) => customer.name);
      setTargetNames(customerNames);
    } else if (targetType === TargetType.SUPPLIER) {
      const supplierNames = supplierList.map((supplier) => supplier.name);
      setTargetNames(supplierNames);
    }
    form.setValue("targetType", targetType);
    form.resetField("targetName");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {data ? "Receipt form" : "Create receipt form"}
          </DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-row items-start">
                <div className="ml-4 flex w-[400px] flex-col">
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <div className="flex flex-row items-center">
                          <FormLabel className="w-1/3">Time</FormLabel>

                          <FormControl className="w-2/3">
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
                      <FormItem className="mt-2">
                        <div className="flex flex-row items-center">
                          <FormLabel className="w-1/3">Receipt type</FormLabel>
                          <FormControl className="w-2/3">
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
                    name="value"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <div className="flex flex-row items-center">
                          <FormLabel className="w-1/3">Value</FormLabel>

                          <FormControl className="w-2/3">
                            <Input
                              placeholder="0"
                              defaultValue={field.value}
                              onChange={(e: any) => {
                                form.setValue("value", formatNumberInput(e));
                              }}
                              className="text-right"
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="targetType"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <div className="flex flex-row items-center">
                          <FormLabel className="w-1/3">Payer type</FormLabel>
                          <FormControl className="w-2/3">
                            <CustomCombobox<string>
                              placeholder="Select type"
                              searchPlaceholder={"Find type..."}
                              value={field.value}
                              choices={targetTypes}
                              valueView={OptionView}
                              showSearchInput={false}
                              itemSearchView={(choice) =>
                                OptionSearchView(choice, field.value)
                              }
                              onItemClick={(val) =>
                                handleTargetTypeChange(val as TargetType)
                              }
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="targetName"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <div className="flex flex-row items-center">
                          <FormLabel className="w-1/3">Payer name</FormLabel>

                          <FormControl className="w-2/3">
                            <CustomCombobox<string>
                              placeholder="Select receiver"
                              searchPlaceholder={"Find receiver..."}
                              value={field.value}
                              choices={targetNames}
                              valueView={OptionView}
                              itemSearchView={(choice) =>
                                OptionSearchView(choice, field.value)
                              }
                              onItemClick={(val) => {
                                if (val === field.value)
                                  form.resetField("targetName");
                                else form.setValue("targetName", val);
                              }}
                              filter={(targetName) =>
                                targetName.includes(targetNameSearch)
                              }
                              onSearchChange={setTargetNameSearch}
                              endIcon={
                                <PlusCircle
                                  className={cn(
                                    "h-4 w-4 opacity-50 hover:cursor-pointer hover:opacity-100",
                                    selectedTargetType === TargetType.OTHER
                                      ? "visible"
                                      : "hidden",
                                  )}
                                  onClick={() =>
                                    handleOpenAddTargetDialog(null)
                                  }
                                />
                              }
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

              <div className="flex flex-row justify-end">
                <Button
                  type="submit"
                  onClick={() => {
                    console.log(form.getValues());
                  }}
                  variant={"blue"}
                  className="mr-3"
                >
                  Save
                </Button>
                <Button type="button" onClick={handleCancelDialog}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <AddTargetDailog
          target={selectedTarget}
          open={openAddTargetDialog}
          setOpen={setOpenAddTargetDialog}
          type="expense"
          submit={handleAddNewStranger}
        />
      </DialogContent>
    </Dialog>
  );
}
