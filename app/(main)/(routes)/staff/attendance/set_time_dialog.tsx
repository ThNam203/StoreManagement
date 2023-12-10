import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/datepicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { ConfirmOverwritingDialog } from "./confirm_dialog";
import { DataTable } from "./datatable";
import { DailyShift, Shift } from "@/entities/Attendance";
import { ca, da } from "date-fns/locale";
import LoadingCircle from "@/components/ui/loading_circle";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  date: z.date(),
  isRepeat: z.boolean(),
  repeatPeriod: z.string(),
  startRepeat: z.date(),
  finishRepeat: z.date(),
  shiftName: z.string().min(1),
  note: z.string(),
});

export function SetTimeDialog({
  shiftList,
  specificShift,
  staffList,
  submit,
  open,
  setOpen,
  onUpdateDailyShift,
}: {
  shiftList: Shift[];
  specificShift: DailyShift | null;
  staffList: Staff[];
  submit?: (values: DailyShift[]) => any;
  onUpdateDailyShift?: (dailyShift: DailyShift) => any;
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
      finishRepeat: new Date(new Date().getFullYear() + 1, 11, 31),
      shiftName: undefined,
      note: "",
    },
  });
  let attendStaffList: Staff[] = [];
  const repeatPeriodList = ["daily", "weekly", "monthly"];
  const [isRepeat, setIsRepeat] = useState(false);
  const [openConfirmOverwritingDialog, setOpenConfirmOverwritingDialog] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) resetValues(specificShift);
  }, [open]);

  const resetValues = (specificShift: DailyShift | null) => {
    setIsLoading(false);
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
    setIsRepeat(false);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!specificShift) return;
    setIsLoading(true);
    const updatedDailyShift: DailyShift = {
      id: specificShift.id,
      shiftId: specificShift ? specificShift.shiftId : -1,
      shiftName: values.shiftName,
      date: values.date,
      note: values.note,
      attendList: [],
    };
    attendStaffList.forEach((staff) => {
      updatedDailyShift.attendList.push({
        id: -1,
        staffId: staff.id,
        staffName: staff.name,
        hasAttend: false,
        date: values.date,
        note: "",
        bonus: [],
        punish: [],
      });
    });

    let dailyShiftList: DailyShift[] = [];
    if (isRepeat) {
      const { repeatPeriod, startRepeat, finishRepeat } = values;
      const repeatPeriodIndex = repeatPeriodList.findIndex(
        (period) => period === repeatPeriod
      );
      if (repeatPeriodIndex === -1) return;

      const repeatPeriodValue =
        repeatPeriodIndex === 0 ? 1 : repeatPeriodIndex === 1 ? 7 : 30;
      const repeatPeriodCount = Math.floor(
        (finishRepeat.getTime() - startRepeat.getTime()) /
          (repeatPeriodValue * 24 * 60 * 60 * 1000)
      );
      for (let i = 0; i <= repeatPeriodCount; i++) {
        const newDate = new Date(
          startRepeat.getTime() + repeatPeriodValue * i * 24 * 60 * 60 * 1000
        );
        const newDailyShift = { ...updatedDailyShift };
        newDailyShift.date = newDate;
        dailyShiftList.push(newDailyShift);
      }
    } else {
      dailyShiftList.push(updatedDailyShift);
    }

    if (specificShift.attendList.length > 0) {
      console.log("update specific shift", specificShift);
      if (onUpdateDailyShift) {
        try {
          await onUpdateDailyShift(updatedDailyShift);
        } catch (error) {
          console.log(error);
        } finally {
          resetToEmptyForm();
          setOpen(false);
          setIsLoading(false);
        }
      }
    } else {
      console.log("submit new shift");
      if (submit) {
        try {
          await submit(dailyShiftList);
        } catch (error) {
          console.log(error);
        } finally {
          resetToEmptyForm();
          setOpen(false);
          setIsLoading(false);
        }
      }
    }
  };

  const isShiftExisted = (
    shiftName: string,
    date: Date,
    shiftList: Shift[]
  ): boolean => {
    const shift = shiftList.find((shift) => shift.name === shiftName);
    if (!shift) return false;
    const index = shift.dailyShiftList.findIndex(
      (dailyShift) =>
        dailyShift.date.toLocaleDateString() === date.toLocaleDateString()
    );
    if (index === -1) return false;
    return true;
  };

  function handleCancelDialog() {
    setOpen(false);
    resetValues(specificShift);
  }

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
            <ScrollArea className="w-[1000px] h-[500px] pr-2">
              <div className="h-full w-full flex flex-col justify-start gap-2">
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
                                  onChange={(date) =>
                                    form.setValue("date", date)
                                  }
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
            </ScrollArea>
            <div className="flex flex-row justify-end mt-2">
              <Button
                type="submit"
                onClick={() => {
                  form.handleSubmit(onSubmit);
                }}
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
        <ConfirmOverwritingDialog
          open={openConfirmOverwritingDialog}
          setOpen={setOpenConfirmOverwritingDialog}
        />
      </DialogContent>
    </Dialog>
  );
}
