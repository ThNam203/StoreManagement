"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogFooter,
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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import LoadingCircle from "@/components/ui/loading_circle";
import { Stranger } from "@/entities/Transaction";

const strangerSchema = z.object({
  name: z.string().min(1, { message: "Name is missing" }),
  phoneNumber: z.string().min(1, { message: "Phone number is missing" }),
  address: z.string().optional(),
  note: z.string().optional(),
});

const AddTargetDailog = ({
  target,
  open,
  setOpen,
  type = "expense",
  submit,
}: {
  target: Stranger | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  type?: "expense" | "receive";
  submit?: (values: Stranger) => any;
}) => {
  const form = useForm<z.infer<typeof strangerSchema>>({
    resolver: zodResolver(strangerSchema),
    defaultValues: {
      name: undefined,
      phoneNumber: undefined,
      address: undefined,
      note: undefined,
    },
  });
  const onSubmit = async (values: z.infer<typeof strangerSchema>) => {
    const stranger: Stranger = {
      id: -1,
      name: values.name,
      phoneNumber: values.phoneNumber,
      address: values.address ? values.address : "",
      note: values.note ? values.note : "",
    };

    if (submit) {
      setIsLoading(true);
      try {
        await submit(stranger).then(() => {
          form.reset();
          setOpen(false);
        });
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    }
  };
  function handleCancelDialog() {
    setOpen(false);
    form.reset();
  }

  useEffect(() => {
    if (open) resetValues(target);
    console.log("render");
  }, [open]);

  const resetValues = (stranger: Stranger | null) => {
    setIsLoading(false);
    if (stranger) {
      form.setValue("name", stranger.name);
      form.setValue("phoneNumber", stranger.phoneNumber);
      form.setValue("address", stranger.address);
      form.setValue("note", stranger.note);
    } else resetToEmptyForm();
  };

  const resetToEmptyForm = () => {
    form.reset();
  };
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[425px] md:max-w-[500px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {type === "expense" ? "Add receiver" : "Add payer"}
              </DialogTitle>
            </DialogHeader>
            <div className="my-2 flex flex-col items-start ">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center">
                    <FormLabel className="flex w-[150px] flex-col items-start">
                      <p className="text-sm">
                        {type === "expense" ? "Receiver" : "Payer"}
                      </p>
                      <FormMessage className="mr-2 text-xs" />
                    </FormLabel>
                    <FormControl className="sm:w-[200px] md:w-[250px]">
                      <Input
                        defaultValue={field.value}
                        onChange={(val) => {
                          form.setValue("name", val.target.value);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center">
                    <FormLabel className="flex w-[150px] flex-col items-start">
                      <p className="text-sm">Phone number</p>
                      <FormMessage className="mr-2 text-xs" />
                    </FormLabel>
                    <FormControl className="sm:w-[200px] md:w-[250px]">
                      <Input
                        maxLength={10}
                        defaultValue={field.value}
                        onChange={(val) => {
                          form.setValue("phoneNumber", val.target.value);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center">
                    <FormLabel className="flex w-[150px] flex-col items-start">
                      <p className="text-sm">Address</p>
                      <FormMessage className="mr-2 text-xs" />
                    </FormLabel>
                    <FormControl className="sm:w-[200px] md:w-[250px]">
                      <Input
                        defaultValue={field.value}
                        onChange={(val) => {
                          form.setValue("address", val.target.value);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center">
                    <FormLabel className="flex w-[150px] flex-col items-start">
                      <p className="text-sm">Note</p>
                      <FormMessage className="mr-2 text-xs" />
                    </FormLabel>
                    <FormControl className="sm:w-[200px] md:w-[250px]">
                      <Input
                        defaultValue={field.value}
                        onChange={(val) => {
                          form.setValue("note", val.target.value);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex flex-row items-end">
              <Button
                variant={"green"}
                type="submit"
                onClick={() => {
                  console.log("submit", form.getValues());
                }}
              >
                Save
                {isLoading && <LoadingCircle></LoadingCircle>}
              </Button>
              <Button
                variant={"outline"}
                type="button"
                onClick={() => {
                  handleCancelDialog();
                }}
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTargetDailog;
