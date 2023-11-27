import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/datepicker";
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
import { MyCombobox } from "@/components/ui/my_combobox";
import { Textarea } from "@/components/ui/textarea";
import { Staff } from "@/entities/Staff";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { DailyShift, Shift } from "./attendance_table";
import { DataTable } from "./datatable";

const formSchema = z.object({
  date: z.date(),
  isRepeat: z.boolean(),
  repeatPeriod: z.string().optional(),
  startRepeat: z.date().optional(),
  finishRepeat: z.date().optional(),
  shiftName: z.string(),
  note: z.string(),
});

export function SetTimeDialog({
  shiftList,
  specificShift,
  staffList,
  submit,
  open,
  setOpen,
}: {
  shiftList: Shift[];
  specificShift: DailyShift | null;
  staffList: Staff[];
  submit?: (values: Shift[]) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      isRepeat: false,
      repeatPeriod: "daily",
      startRepeat: new Date(),
      finishRepeat: new Date(),
      shiftName: "",
      note: "",
    },
  });
  let attendStaffList: Staff[] = [];

  useEffect(() => {
    if (open) resetValues(specificShift);
  }, [open]);

  const resetValues = (specificShift: DailyShift | null) => {
    if (specificShift) {
      form.setValue("date", specificShift.date);
      form.setValue("shiftName", specificShift.shiftName);
      form.setValue("note", specificShift.note);
      specificShift.attendList.forEach((attend) => {
        const staff = staffList.find((staff) => staff.id === attend.staffId);
        if (staff) attendStaffList.push(staff);
      });
    } else resetToEmptyForm();
  };
  const resetToEmptyForm = () => {
    form.reset();
    attendStaffList = [];
  };
  useEffect(() => {
    console.log("change", attendStaffList);
  }, [attendStaffList]);

  const repeatPeriodList = ["daily", "weekly", "monthly"];

  function onSubmit(values: z.infer<typeof formSchema>) {
    const updatedDailyShift: DailyShift = {
      shiftId: null,
      shiftName: values.shiftName,
      date: values.date,
      note: values.note,
      attendList: [],
    };
    attendStaffList.forEach((staff) => {
      updatedDailyShift.attendList.push({
        staffId: staff.id,
        staffName: staff.name,
        hasAttend: false,
        date: values.date,
        timeIn: new Date(),
        timeOut: new Date(),
        note: "",
      });
    });
    const newShiftList = [...shiftList];

    newShiftList.forEach((shift) => {
      if (shift.name === values.shiftName) {
        const index = shift.dailyShiftList.findIndex(
          (dailyShift) =>
            dailyShift.date.toLocaleDateString() ===
            values.date.toLocaleDateString()
        );
        updatedDailyShift.shiftId = shift.id;
        if (index !== -1) {
          shift.dailyShiftList[index] = updatedDailyShift;
        } else {
          shift.dailyShiftList.push(updatedDailyShift);
        }
      }
    });
    if (submit) {
      submit(newShiftList);
      resetToEmptyForm();
      setOpen(false);
    }
  }
  function handleCancelDialog() {
    setOpen(false);
    // resetValues(specificShift);
  }

  const [isRepeat, setIsRepeat] = useState(false);
  const handleDataChange = (data: Staff[]) => {
    attendStaffList = data;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Set a work schedule</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="w-[1000px] h-[500px] flex flex-col justify-start gap-2">
              <div className="w-full flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row items-center gap-2">
                          <FormLabel>
                            <div className="w-[100px] flex flex-row items-center space-x-2">
                              <h5 className="text-sm">
                                {isRepeat ? "Start date" : "Date"}
                              </h5>
                              <Info size={16} />
                            </div>
                          </FormLabel>

                          <FormControl>
                            <div className="w-[220px]">
                              <DatePicker
                                value={field.value}
                                onChange={(date) => form.setValue("date", date)}
                              />
                            </div>
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isRepeat"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(isChecked) => {
                                form.setValue("isRepeat", !!isChecked);
                                setIsRepeat(!!isChecked);
                              }}
                            />
                          </FormControl>
                          <FormLabel>
                            <h5 className="text-sm cursor-pointer">Repeat</h5>
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="repeatPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row items-center gap-2">
                          <FormControl>
                            <MyCombobox
                              choices={repeatPeriodList}
                              defaultValue={repeatPeriodList[0]}
                              onValueChange={(val) =>
                                form.setValue("repeatPeriod", val)
                              }
                              className="w-[100px]"
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-row items-center gap-2">
                  <FormField
                    control={form.control}
                    name="finishRepeat"
                    render={({ field }) => (
                      <FormItem>
                        <div
                          className={cn(
                            "w-full flex flex-row items-center gap-2",
                            isRepeat ? "visible" : "hidden"
                          )}
                        >
                          <FormLabel>
                            <div
                              className={cn(
                                "w-[100px] flex flex-row items-center space-x-2"
                              )}
                            >
                              <h5 className="text-sm">Finish date</h5>
                              <Info size={16} />
                            </div>
                          </FormLabel>
                          <FormControl>
                            <div className={cn("w-[220px]")}>
                              <DatePicker
                                value={field.value}
                                onChange={(date) =>
                                  form.setValue("finishRepeat", date)
                                }
                              />
                            </div>
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="shiftName"
                  render={({ field }) => (
                    <FormItem>
                      <div className="w-full flex flex-row items-center gap-2">
                        <FormLabel>
                          <div className="w-[100px] flex flex-row items-center space-x-2">
                            <h5 className="text-sm">Shift</h5>
                            <Info size={16} />
                          </div>
                        </FormLabel>
                        <FormControl>
                          <MyCombobox
                            defaultValue={field.value}
                            onValueChange={(val) => {
                              form.setValue("shiftName", val);
                            }}
                            className="w-[200px]"
                            placeholder="Find shift.."
                            choices={shiftList.map((shift) => shift.name)}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <div className="w-full flex flex-row items-center gap-2">
                        <FormLabel>
                          <div className="w-[100px] flex flex-row items-center space-x-2">
                            <h5 className="text-sm">Note</h5>
                            <Info size={16} />
                          </div>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            defaultValue={field.value}
                            className="resize-none"
                            placeholder="Take note"
                            onChange={(e) => {
                              form.setValue("note", e.target.value);
                            }}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <DataTable
                defaultData={attendStaffList}
                staffList={staffList}
                onDataChange={handleDataChange}
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
