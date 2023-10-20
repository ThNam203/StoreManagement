"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Staff } from "@/app/(main)/(routes)/staff/props";
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

const formSchema = z.object({
  id: z.any(),
  name: z.string().min(1, { message: "Name must be at least one character" }),
  birthday: z.string(),
  sex: z.string(),
  CCCD: z.string(),
  staffGroup: z.string(),
  position: z.string(),
  branch: z.string(),
  phoneNumber: z.string(),
  email: z.string().email({ message: "Please enter a valid email" }),
  address: z.string(),
});

type Props = {
  open: boolean;
  data?: Staff;
  submit: (values: Staff) => void;
  handleCloseDialog: () => void;
};

export function AddStaffDialog({
  open,
  data,
  submit,
  handleCloseDialog,
}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sex: "male",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newGroup: Staff = {
      id: -1,
      name: values.name,
      staffGroup: values.staffGroup,
      position: values.position,
      branch: values.branch,
      CCCD: values.CCCD,
      phoneNumber: values.phoneNumber,
      address: values.address,
      sex: values.sex,
      email: values.email,
      birthday: values.birthday.toString(),
    };
    if (submit) {
      submit(newGroup);
      form.reset();
    }
  }

  function handleCancelDialog() {
    handleCloseDialog();
    form.reset();
  }

  const branchList = ["Center Branch", "Branch 1", "Branch 2", "Branch 3"];
  const groupList = ["Group 1", "Group 2", "Group 3", "Group 4"];

  const positionList = ["Owner", "Cashier", "Safe Guard", "Manager", "Cleaner"];

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new staff</DialogTitle>
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
                        <FormLabel className="w-1/3">Staff ID</FormLabel>

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

                  <FormField
                    control={form.control}
                    name="CCCD"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <div className="flex flex-row items-center">
                          <FormLabel className="w-1/3">CCCD (*)</FormLabel>

                          <FormControl className="w-2/3">
                            <Input
                              {...field}
                              maxLength={12}
                              minLength={12}
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
                    name="staffGroup"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <div className="flex flex-row items-center">
                          <FormLabel className="w-1/3">Group</FormLabel>
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
                              {groupList.map((group) => {
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
                </div>
                <div className="flex flex-col ml-4 w-[400px]">
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <div className="flex flex-row items-center">
                          <FormLabel className="w-1/3">Position</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl className="w-2/3">
                              <SelectTrigger>
                                <SelectValue placeholder="Select position" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {positionList.map((position) => {
                                return (
                                  <SelectItem key={position} value={position}>
                                    {position}
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
                    name="branch"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <div className="flex flex-row items-center">
                          <FormLabel className="w-1/3">Branch</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl className="w-2/3">
                              <SelectTrigger>
                                <SelectValue placeholder="Select branch" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {branchList.map((branch) => {
                                return (
                                  <SelectItem key={branch} value={branch}>
                                    {branch}
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
