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
import { useState } from "react";
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

const formSchema = z.object({
  id: z.any(),
  createdDate: z.string(),
  value: z.string(),
  creator: z.string(),
  transactionType: z.nativeEnum(TransactionType),
  targetType: z.nativeEnum(TargetType),
  targetName: z.string(),
  note: z.string().optional(),
});

type Props = {
  data?: Transaction;
  submit: (values: Transaction) => void;
};

export function MakeReceiptDialog({ data, submit }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      createdDate: new Date().toLocaleString(),
      value: "0",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const receipt: Transaction = {
      id: nanoid(9),
      createdDate: values.createdDate
        ? new Date(values.createdDate).toLocaleString()
        : new Date().toLocaleString(),
      formType: FormType.RECEIPT,
      description: "Receive from" + values.targetType,
      value: values.value,
      creator: values.creator,
      transactionType: values.transactionType,
      targetType: values.targetType,
      targetName: values.targetName,
      status: Status.PAID,
      note: values.note ? values.note : "",
    };
    if (submit) {
      submit(receipt);
      form.reset();
      setOpen(false);
    }
  }
  const [open, setOpen] = useState(false);
  function handleCancelDialog() {
    setOpen(false);
    form.reset();
  }

  const transactionTypes = Object.values(TransactionType);
  const staffList = ["NGUYEN VAN A", "NGUYEN VAN B", "NGUYEN VAN C"];
  const targetTypes = Object.values(TargetType);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Make Receipt Form</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Receipt Form</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-row items-start">
                <div className="flex flex-col ml-4 w-[400px]">
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center">
                        <FormLabel className="w-1/3">Receipt ID</FormLabel>

                        <FormControl className="w-2/3">
                          <Input placeholder="Automatic code" disabled />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="createdDate"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <div className="flex flex-row items-center">
                          <FormLabel className="w-1/3">Time</FormLabel>

                          <FormControl className="w-2/3">
                            <Input type="datetime-local" {...field} />
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
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl className="w-2/3">
                              <SelectTrigger>
                                <SelectValue placeholder="Select group" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {transactionTypes.map((type) => {
                                return (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
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
                              {...field}
                              onKeyUp={(e: any) => {
                                e.target.value = parseInt(e.target.value);
                                field.onChange(e);
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
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl className="w-2/3">
                              <SelectTrigger>
                                <SelectValue placeholder="Select staff" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {staffList.map((staff) => {
                                return (
                                  <SelectItem key={staff} value={staff}>
                                    {staff}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
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
                          <FormLabel className="w-1/3">Payer Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl className="w-2/3">
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {targetTypes.map((type) => {
                                return (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
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
                          <FormLabel className="w-1/3">Payer Name</FormLabel>

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
