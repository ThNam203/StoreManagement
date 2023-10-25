"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { nanoid } from "nanoid";
import { Supplier } from "@/entities/Supplier";

const formSchema = z.object({
  id: z.any(),
  name: z.string().min(1, { message: "Name must be at least one character" }),
  phoneNumber: z.string(),
  address: z.string(),
  email: z.string().email(),
  supplierGroup: z.string(),
  companyName: z.string(),
  note: z.string().optional(),
});

type Props = {
  data?: Supplier;
  submit: (values: Supplier) => void;
};

export function AddSupplierDialog({ data, submit }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newGroup: Supplier = {
      id: nanoid(9),
      name: values.name,
      phoneNumber: values.phoneNumber,
      address: values.address,
      email: values.email,
      supplierGroup: values.supplierGroup,
      image: "",
      description: "",
      companyName: values.companyName,
      creator: "",
      createdDate: new Date().toLocaleDateString("en-GB"),
      status: "",
      note: values.note ? values.note : "",
    };
    if (submit) {
      submit(newGroup);
      form.reset();
      setOpen(false);
    }
  }

  const [open, setOpen] = useState(false);
  function handleCancelDialog() {
    setOpen(false);
    form.reset();
  }

  const supplierGroups = ["Group 1", "Group 2", "Group 3", "Group 4"];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add new supplier</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new staff</DialogTitle>
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
                        <FormLabel className="w-1/3">Supplier ID</FormLabel>

                        <FormControl className="w-2/3">
                          <Input placeholder="Automatic code" disabled />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <div className="flex flex-row items-center">
                          <FormLabel className="w-1/3">Name (*)</FormLabel>

                          <FormControl className="w-2/3">
                            <Input {...field} />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <div className="flex flex-row items-center">
                          <FormLabel className="w-1/3">Phone number</FormLabel>

                          <FormControl>
                            <Input
                              {...field}
                              maxLength={11}
                              minLength={10}
                              className="w-2/3"
                              onKeyUp={(e: any) => {
                                e.target.value = e.target.value.replace(
                                  /\D/g,
                                  ""
                                );
                                // Pass the event to the field prop
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
                    name="address"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <div className="flex flex-row items-center">
                          <FormLabel className="w-1/3">Address</FormLabel>

                          <FormControl className="w-2/3">
                            <Input {...field} />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col ml-4 w-[400px]">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <div className="flex flex-row items-center">
                          <FormLabel className="w-1/3">Email</FormLabel>

                          <FormControl className="w-2/3">
                            <Input type="email" {...field} />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <div className="flex flex-row items-center">
                          <FormLabel className="w-1/3">Company</FormLabel>

                          <FormControl className="w-2/3">
                            <Input {...field} />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="supplierGroup"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <div className="flex flex-row items-center">
                          <FormLabel className="w-1/3">
                            Supplier Group
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
                              {supplierGroups.map((group) => {
                                return (
                                  <SelectItem key={group} value={group}>
                                    {group}
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
