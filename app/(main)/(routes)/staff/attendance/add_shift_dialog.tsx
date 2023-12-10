import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingCircle from "@/components/ui/loading_circle";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Shift, Status } from "@/entities/Attendance";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, set } from "date-fns";
import { ca, fi, is } from "date-fns/locale";
import { Info, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1),
  workingTime: z.object({
    start: z.string().min(2),
    end: z.string().min(2),
  }),
  edittingTime: z.object({
    start: z.string().min(2),
    end: z.string().min(2),
  }),
  status: z.string(),
});

export function AddShiftDialog({
  title = "Add a new shift",
  shift,
  submit,
  open,
  setOpen,
  handleRemoveShift,
}: {
  title?: string;
  shift: Shift | null;
  submit?: (value: Shift) => any;
  open: boolean;
  setOpen: (value: boolean) => void;
  handleRemoveShift?: (id: any) => any;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      workingTime: {
        start: "",
        end: "",
      },
      edittingTime: {
        start: "",
        end: "",
      },
      status: Status.Working,
    },
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const resetValues = (shift: Shift | null) => {
    setIsAdding(false);
    setIsRemoving(false);
    if (shift) {
      title = "Edit shift";
      form.setValue("name", shift.name);
      form.setValue(
        "workingTime.start",
        format(shift.workingTime.start, "HH:mm:ss")
      );
      form.setValue(
        "workingTime.end",
        format(shift.workingTime.end, "HH:mm:ss")
      );
      form.setValue(
        "edittingTime.start",
        format(shift.editingTime.start, "HH:mm:ss")
      );
      form.setValue(
        "edittingTime.end",
        format(shift.editingTime.end, "HH:mm:ss")
      );
      form.setValue("status", shift.status);
    } else resetToEmptyForm();
  };

  const resetToEmptyForm = () => {
    form.reset();
  };

  useEffect(() => {
    if (open) resetValues(shift);
  }, [open]);

  const stringTimeToDate = (strTime: string) => {
    if (strTime === "") return new Date();
    const split = strTime.split(":");
    const time = new Date();
    time.setHours(parseInt(split[0]), parseInt(split[1]));
    return time;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsAdding(true);
    const newShift: Shift = {
      id: shift ? shift.id : null,
      name: values.name,
      workingTime: {
        start: stringTimeToDate(values.workingTime.start),
        end: stringTimeToDate(values.workingTime.end),
      },
      editingTime: {
        start: stringTimeToDate(values.edittingTime.start),
        end: stringTimeToDate(values.edittingTime.end),
      },
      status: values.status as Status,
      dailyShiftList: shift ? shift.dailyShiftList : [],
    };

    if (submit) {
      try {
        await submit(newShift);
      } catch (error) {
        console.log(error);
      } finally {
        setIsAdding(false);
        setOpen(false);
        resetToEmptyForm();
      }
    }
  };

  const handleCancelDialog = () => {
    setOpen(false);
    resetValues(shift);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="w-[600px] h-[250px] flex flex-col justify-start gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="w-full flex flex-row items-center gap-2">
                      <FormLabel>
                        <div className="w-[150px] flex flex-row items-center space-x-2">
                          <h5 className="text-sm">Name</h5>
                        </div>
                      </FormLabel>

                      <FormControl>
                        <Input
                          defaultValue={field.value}
                          onChange={(val) => {
                            form.setValue("name", val.target.value);
                          }}
                          className="w-full"
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="w-full flex flex-row items-center gap-2">
                        <div className="flex flex-row items-center gap-2">
                          <FormLabel>
                            <h5 className="w-[150px] text-sm">Working from</h5>
                          </FormLabel>
                          <Input
                            type="time"
                            defaultValue={field.value.start}
                            onChange={(val) => {
                              form.setValue(
                                "workingTime.start",
                                val.target.value
                              );
                            }}
                          />
                        </div>
                        <div className="flex flex-row items-center gap-2">
                          <FormLabel>
                            <h5 className="text-sm">To</h5>
                          </FormLabel>
                          <Input
                            type="time"
                            defaultValue={field.value.end}
                            onChange={(val) => {
                              form.setValue(
                                "workingTime.end",
                                val.target.value
                              );
                            }}
                          />
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex flex-row items-center gap-2 my-1">
                <span className="font-semibold">
                  Time allowed for employees to clock in
                </span>
                <Info size={16} />
              </div>
              <FormField
                control={form.control}
                name="edittingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="w-full flex flex-row items-center gap-2">
                        <div className="flex flex-row items-center gap-2">
                          <FormLabel>
                            <h5 className="w-[150px] text-sm">
                              Timekeeping from
                            </h5>
                          </FormLabel>
                          <Input
                            type="time"
                            defaultValue={field.value.start}
                            onChange={(val) => {
                              form.setValue(
                                "edittingTime.start",
                                val.target.value
                              );
                            }}
                          />
                        </div>
                        <div className="flex flex-row items-center gap-2">
                          <FormLabel>
                            <h5 className="text-sm">To</h5>
                          </FormLabel>
                          <Input
                            type="time"
                            defaultValue={field.value.end}
                            onChange={(val) => {
                              form.setValue(
                                "edittingTime.end",
                                val.target.value
                              );
                            }}
                          />
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-row items-center gap-2">
                      <FormLabel>
                        <div className="w-[150px] flex flex-row items-center space-x-2">
                          <h5 className="text-sm">Status</h5>
                          <Info size={16} />
                        </div>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          defaultValue={shift ? shift.status : Status.Working}
                          className="flex flex-row items-center"
                        >
                          {Object.values(Status).map((status) => {
                            return (
                              <div
                                key={status}
                                className="flex flex-row items-center space-x-2 mr-11"
                                onClick={() => form.setValue("status", status)}
                              >
                                <RadioGroupItem
                                  value={status.toString()}
                                  id={status.toString()}
                                />
                                <Label htmlFor={status.toString()}>
                                  {status.toString()}
                                </Label>
                              </div>
                            );
                          })}
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className={cn("flex flex-row justify-end")}>
              <Button
                type="button"
                onClick={async () => {
                  if (handleRemoveShift && shift) {
                    setIsRemoving(true);
                    try {
                      await handleRemoveShift(shift.id);
                    } catch (error) {
                      console.log(error);
                    } finally {
                      setOpen(false);
                      resetToEmptyForm();
                      setIsRemoving(false);
                    }
                  }
                }}
                variant={"red"}
                className={cn("mr-3 gap-1", shift ? "visible" : "hidden")}
                disabled={isAdding || isRemoving}
              >
                <Trash size={16}></Trash>
                Remove
                {isRemoving ? <LoadingCircle></LoadingCircle> : null}
              </Button>
              <Button
                type="submit"
                onClick={async () => {
                  form.handleSubmit(onSubmit);
                }}
                variant={"green"}
                className="mr-3"
                disabled={isAdding || isRemoving}
              >
                {shift ? "Update" : "Add"}
                {isAdding ? <LoadingCircle></LoadingCircle> : null}
              </Button>
              <Button
                type="button"
                onClick={handleCancelDialog}
                disabled={isAdding || isRemoving}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
