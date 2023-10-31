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
import { Customer, CustomerType, Sex, Status } from "@/entities/Customer";
import { removeCharNotANum } from "@/utils";

const formSchema = z.object({
  image: z.string().optional(),
  id: z.any(),
  name: z.string().min(1, { message: "Name must be at least one character" }),
  phoneNumber: z.string(),
  birthday: z.string().optional(),
  sex: z.nativeEnum(Sex),
  address: z.string(),
  customerType: z.nativeEnum(CustomerType),
  company: z.string().optional(),
  taxId: z.string().optional(),
  email: z.string().email().optional(),
  customerGroup: z.string(),
  note: z.string().optional(),
});

type Props = {
  data?: Customer;
  submit: (values: Customer) => void;
};

export function AddCustomerDialog({ data, submit }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sex: Sex.MALE,
      customerType: CustomerType.SINGLE,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newGroup: Customer = {
      id: nanoid(9),
      name: values.name,
      customerType: values.customerType,
      customerGroup: values.customerGroup,
      phoneNumber: values.phoneNumber,
      address: values.address,
      sex: values.sex,
      email: values.email ? values.email : "",
      birthday: values.birthday ? new Date(values.birthday) : new Date(),
      image: values.image ? values.image : "",
      creator: "",
      createdDate: new Date(),
      company: values.company ? values.company : "",
      note: values.note ? values.note : "",
      taxId: values.taxId ? values.taxId : "",
      debt: 0,
      sale: 0,
      finalSale: 0,
      lastTransaction: new Date(),
      status: Status.WORKING,
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

  const customerGroupList = ["Single", "Company"];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add new customer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new customer</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-row items-start">
                <div className="flex flex-col">
                  <Button
                    className="w-[150px] h-[150px] border-2 border-dashed"
                    variant={"outline"}
                  >
                    <Camera color="grey" />
                  </Button>
                  <Button variant={"default"} type="button" className="mt-4">
                    Choose image
                  </Button>
                </div>
                <div className="flex flex-col ml-4 w-[400px]">
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center">
                        <FormLabel className="w-1/3">Customer ID</FormLabel>

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
                          <FormLabel className="w-1/3">Customer Name</FormLabel>

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
                                removeCharNotANum(e);
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
                    name="birthday"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <div className="flex flex-row items-center">
                          <FormLabel className="w-1/3">Birthday</FormLabel>

                          <FormControl className="w-2/3">
                            <Input type="date" {...field} />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sex"
                    render={({ field }) => (
                      <FormItem className="mt-6 mb-2">
                        <div className="flex flex-row items-center">
                          <FormLabel className="w-1/3">Sex</FormLabel>
                          <FormControl>
                            <RadioGroup
                              defaultValue={field.value}
                              className="flex flex-row"
                              onChange={field.onChange}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="male" id="option-one" />
                                <Label htmlFor="option-one">Male</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="female"
                                  id="option-two"
                                />
                                <Label htmlFor="option-two">Female</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col ml-4 w-[400px]">
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
                  <FormField
                    control={form.control}
                    name="customerGroup"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <div className="flex flex-row items-center">
                          <FormLabel className="w-1/3">
                            Customer Group
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
                              {customerGroupList.map((group) => {
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
                <Button type="submit" variant={"default"} className="mr-3">
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
