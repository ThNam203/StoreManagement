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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Camera } from "lucide-react";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  FormType,
  Status,
  TargetType,
  Transaction,
  TransactionType,
} from "@/entities/Transaction";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { nanoid } from "nanoid";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { MyCombobox } from "@/components/ui/my_combobox";
import { DatePicker } from "@/components/ui/datepicker";
import { formatNumberInput } from "@/utils";

const formSchema = z.object({
  createdDate: z.date(),
  value: z.number(),
  creator: z.string(),
  transactionType: z.nativeEnum(TransactionType),
  targetType: z.nativeEnum(TargetType),
  targetName: z.string(),
  note: z.string().optional(),
});

type Props = {
  data: Transaction | null;
  submit: (values: Transaction) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function MakeExpenseDialog({ data, submit, open, setOpen }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      createdDate: new Date(),
      value: NaN,
    },
  });

  useEffect(() => {
    resetValues(data);
  }, [data]);

  const resetValues = (data: Transaction | null) => {
    if (data) {
      form.setValue("createdDate", data.createdDate);
      form.setValue("value", data.value);
      form.setValue("creator", data.creator);
      form.setValue("transactionType", data.transactionType);
      form.setValue("targetType", data.targetType);
      form.setValue("targetName", data.targetName);
      form.setValue("note", data.note);
    } else resetToEmptyForm();
  };
  const resetToEmptyForm = () => {
    form.reset();
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const expense: Transaction = {
      id: data ? data.id : -1,
      createdDate: values.createdDate
        ? new Date(values.createdDate)
        : new Date(),
      formType: FormType.EXPENSE,
      description: "Pay for" + values.targetType,
      value: values.value,
      creator: values.creator,
      transactionType: values.transactionType,
      targetType: values.targetType,
      targetName: values.targetName,
      status: Status.PAID,
      note: values.note ? values.note : "",
    };
    if (submit) {
      submit(expense);
      form.reset();
      setOpen(false);
    }
  }
  function handleCancelDialog() {
    setOpen(false);
    form.reset();
  }

  const transactionTypes = Object.values(TransactionType);
  const staffList = ["NGUYEN VAN A", "NGUYEN VAN B", "NGUYEN VAN C"];
  const targetTypes = Object.values(TargetType);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Expense Form</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-row items-start">
                <div className="ml-4 flex w-[400px] flex-col">
                  <FormField
                    control={form.control}
                    name="createdDate"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <div className="flex flex-row items-center">
                          <FormLabel className="w-1/3">Time</FormLabel>

                          <FormControl className="w-2/3">
                            <div>
                              <DatePicker
                                onChange={(date) =>
                                  form.setValue("createdDate", date)
                                }
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
                          <FormLabel className="w-1/3">
                            Transaction Type
                          </FormLabel>
                          <FormControl className="w-2/3">
                            <MyCombobox
                              choices={transactionTypes}
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                              placeholder="Select type"
                              canRemoveOption={false}
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
                              type="number"
                              placeholder="0"
                              defaultValue={field.value}
                              onChange={(e: any) => {
                                form.setValue("value", formatNumberInput(e));
                              }}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="creator"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <div className="flex flex-row items-center">
                          <FormLabel className="w-1/3">Creator</FormLabel>
                          <FormControl className="w-2/3">
                            <MyCombobox
                              choices={staffList}
                              defaultValue={field.value}
                              onValueChange={(val) => {
                                form.setValue("creator", val);
                              }}
                              placeholder="Select creator"
                              canRemoveOption={false}
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
                          <FormLabel className="w-1/3">Receiver Type</FormLabel>
                          <FormControl className="w-2/3">
                            <MyCombobox
                              choices={targetTypes}
                              defaultValue={field.value}
                              onValueChange={(val) => {
                                form.setValue("targetType", val as TargetType);
                              }}
                              placeholder="Select type"
                              canRemoveOption={false}
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
                          <FormLabel className="w-1/3">Receiver Name</FormLabel>

                          <FormControl className="w-2/3">
                            <Input {...field} />
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
                  onClick={form.handleSubmit(onSubmit)}
                  variant={"default"}
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
      </DialogContent>
    </Dialog>
  );
}
