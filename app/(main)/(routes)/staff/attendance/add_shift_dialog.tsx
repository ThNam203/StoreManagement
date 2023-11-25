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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Info } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Shift, Status } from "./attendance_table";

const formSchema = z.object({
  name: z.string().min(1),
  workingTime: z.object({
    start: z.string(),
    end: z.string(),
  }),
  edittingTime: z.object({
    start: z.string(),
    end: z.string(),
  }),
  status: z.string(),
});

export function AddShiftDialog({
  title = "Add a new shift",
  triggerElement,
  shift,
  submit,
}: {
  triggerElement: JSX.Element;
  title?: string;
  shift?: Shift;
  submit?: (value: Shift) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: shift ? shift.name : "",
      workingTime: {
        start: shift ? format(shift.workingTime.start, "HH:mm:ss") : "",
        end: shift ? format(shift.workingTime.end, "HH:mm:ss") : "",
      },
      edittingTime: {
        start: shift ? format(shift.editingTime.start, "HH:mm:ss") : "",
        end: shift ? format(shift.editingTime.end, "HH:mm:ss") : "",
      },
      status: shift ? shift.status : Status.Working,
    },
  });

  const stringTimeToDate = (strTime: string) => {
    if (strTime === "") return new Date();
    const split = strTime.split(":");
    const time = new Date();
    time.setHours(parseInt(split[0]), parseInt(split[1]));
    return time;
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
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
      submit(newShift);
      form.reset();
      setOpen(false);
    }
  }

  function handleCancelDialog() {
    setOpen(false);
    form.reset();
  }

  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="w-[600px] h-[250px] flex flex-col justify-start gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="w-full flex flex-row items-center gap-2">
                      <FormLabel>
                        <div className="w-[150px] flex flex-row items-center space-x-2">
                          <h5 className="text-sm">Name</h5>
                          <Info size={16} />
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

              <div className="flex flex-row items-center">
                <FormField
                  control={form.control}
                  name="workingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="w-full flex flex-row items-center gap-2">
                          <div className="flex flex-row items-center gap-2">
                            <FormLabel>
                              <h5 className="w-[150px] text-sm">
                                Working from
                              </h5>
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
              </div>
              <div className="flex flex-row items-center gap-2">
                <span className="font-semibold">
                  Time allowed for employees to clock in
                </span>
                <Info size={16} />
              </div>
              <div className="flex flex-row items-center">
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
              </div>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="mt-6 mb-2">
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
      </DialogContent>
    </Dialog>
  );
}
