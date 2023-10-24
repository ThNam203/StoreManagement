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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Textarea } from "../../../../../components/ui/textarea";
import { StaffGroup } from "@/app/(main)/(routes)/staff/entities";
import { nanoid } from "nanoid";
import { useState } from "react";

const formSchema = z.object({
  group_name: z.string().min(1, {
    message: "Group name must be at least 1 characters.",
  }),
  note: z.string(),
});

type Props = {
  data?: StaffGroup | null;
  submit: (values: StaffGroup) => void;
};

export function AddGroupDialog({ data, submit }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      group_name: "",
      note: "",
    },
    values: {
      group_name: data && data.groupName ? data.groupName : "",
      note: data && data.note ? data.note : "",
    },
  });
  const [open, setOpen] = useState(false);
  function onSubmit(values: z.infer<typeof formSchema>) {
    const newGroup = {
      id: data && data.id ? data.id : nanoid(9),
      groupName: values.group_name,
      group: "",
      note: values.note,
      operation: {
        remove: true,
        edit: true,
      },
    };
    submit(newGroup);
    form.reset();
    setOpen(false);
  }

  const handleCancelDialog = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add new group</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] xl:w-[500px]">
        <DialogHeader>
          <DialogTitle>Add new group</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="group_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group name (*)</FormLabel>
                  <FormControl className="w-full">
                    <Input placeholder="Group name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl className="w-full">
                    <Textarea placeholder="Note" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
      </DialogContent>
    </Dialog>
  );
}