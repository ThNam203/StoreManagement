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
import LoadingCircle from "@/components/ui/loading_circle";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const schema = z.object({
  position: z.string(),
});

export function AddPositionDialog({
  open,
  setOpen,
  data,
  submit,
  title,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: string | null;
  submit: (newPosition: string) => any;
  title: string;
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      position: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (submit) {
      setIsLoading(true);
      try {
        await submit(values.position).then(() => {
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
  const [isLoading, setIsLoading] = useState(false);

  function handleCancelDialog() {
    setOpen(false);
    form.reset();
  }

  useEffect(() => {
    if (open) resetValues(data);
  }, [open]);

  const resetValues = (position: string | null) => {
    setIsLoading(false);
    if (position) {
      form.setValue("position", position);
    } else resetToEmptyForm();
  };

  const resetToEmptyForm = () => {
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="min-w-[350px]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 text-sm"
            >
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-4 space-y-0">
                    <FormLabel className="w-fit">
                      <h5 className="text-sm">Name:</h5>
                    </FormLabel>
                    <FormControl className="flex-1">
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex flex-row justify-end">
                <Button
                  type="submit"
                  variant={"green"}
                  className="mr-3"
                  disabled={isLoading}
                >
                  Save
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
