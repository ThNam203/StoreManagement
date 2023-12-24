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
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { MyConfirmDialog } from "../my_confirm_dialog";
import { DataTable } from "../../../app/(main)/(routes)/staff/attendance/datatable";
import { DailyShift, Shift } from "@/entities/Attendance";
import { ca, da, el, fi, is } from "date-fns/locale";
import LoadingCircle from "@/components/ui/loading_circle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { create } from "domain";
import { createRangeDate } from "@/utils";

const formSchema = z.object({
  date: z.date(),
  isRepeat: z.boolean(),
  repeatPeriod: z.string(),
  startRepeat: z.date(),
  finishRepeat: z.date(),
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
  onUpdateDailyShifts,
}: {
  shiftList: Shift[];
  specificShift: DailyShift | null;
  staffList: Staff[];
  submit?: (values: DailyShift[]) => any;
  onUpdateDailyShifts?: (dailyShift: DailyShift[]) => any;
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
      shiftName: undefined,
      note: "",
    },
  });
  const { toast } = useToast();
  let attendStaffList: Staff[] = [];
  const [tempAttendStaffList, setTempAttendStaffList] = useState<Staff[]>([]);
  const repeatPeriodList = ["daily", "weekly", "monthly"];
  const [isRepeat, setIsRepeat] = useState(false);
  const [openConfirmOverwritingDialog, setOpenConfirmOverwritingDialog] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExisted, setIsExisted] = useState(false);

  useEffect(() => {
    if (open) resetValues(specificShift);
  }, [open]);

  const resetValues = (specificShift: DailyShift | null) => {
    setIsLoading(false);
    setIsRepeat(false);
    if (specificShift) {
      form.setValue("date", specificShift.date);
      form.setValue("shiftName", specificShift.shiftName);
      form.setValue("note", specificShift.note);
      form.setValue("isRepeat", false);
      form.setValue("repeatPeriod", "daily");
      form.setValue("startRepeat", specificShift.date);
      form.setValue("finishRepeat", specificShift.date);
      specificShift.attendList.forEach((attend) => {
        const staff = staffList.find((staff) => staff.id === attend.staffId);
        if (staff) attendStaffList.push(staff);
      });
      setTempAttendStaffList(attendStaffList);
    } else resetToEmptyForm();
  };
  const resetToEmptyForm = () => {
    form.reset();
    attendStaffList = [];
    setTempAttendStaffList([]);
    setIsRepeat(false);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // check if shift is existed to give id for BE to update
    if (!specificShift) {
      const existedShift = shiftList.find(
        (shift) => shift.name === values.shiftName,
      );
      if (existedShift) {
        const existedDailyShift = existedShift.dailyShiftList.find(
          (dailyShift) =>
            dailyShift.date.toLocaleDateString() ===
            values.date.toLocaleDateString(),
        );
        if (existedDailyShift) {
          specificShift = existedDailyShift;
        } else {
          specificShift = {
            id: -1,
            shiftId: existedShift.id,
            shiftName: existedShift.name,
            date: values.date,
            note: values.note,
            attendList: [],
          };
        }
      } else return;
    }

    const updatedDailyShift: DailyShift = {
      id: specificShift.id,
      shiftId: specificShift ? specificShift.shiftId : -1,
      shiftName: values.shiftName,
      date: values.date,
      note: values.note,
      attendList: [],
    };
    tempAttendStaffList.forEach((staff) => {
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
      // create a list of daily shift
      const { repeatPeriod, startRepeat, finishRepeat } = values;
      startRepeat.setHours(0, 0, 0, 0);
      finishRepeat.setHours(0, 0, 0, 0);

      const repeatPeriodIndex = repeatPeriodList.findIndex(
        (period) => period === repeatPeriod,
      );
      if (repeatPeriodIndex === -1) return;

      const repeatPeriodValue =
        repeatPeriodIndex === 0 ? 1 : repeatPeriodIndex === 1 ? 7 : 30;
      const repeatPeriodCount = Math.floor(
        (finishRepeat.getTime() - startRepeat.getTime()) /
          (repeatPeriodValue * 24 * 60 * 60 * 1000),
      );

      for (let i = 0; i <= repeatPeriodCount; i++) {
        const newDate = new Date(
          startRepeat.getTime() + repeatPeriodValue * i * 24 * 60 * 60 * 1000,
        );

        const newDailyShift = { ...updatedDailyShift };
        newDailyShift.date = newDate;
        newDailyShift.attendList = newDailyShift.attendList.map((attend) => {
          return { ...attend, date: newDate };
        });
        const shift = shiftList.find(
          (shift) => shift.id === specificShift!.shiftId,
        );
        if (shift) {
          const existedDailyShift = shift.dailyShiftList.find(
            (dailyShift) =>
              dailyShift.date.toLocaleDateString() ===
              newDate.toLocaleDateString(),
          );

          if (existedDailyShift) newDailyShift.id = existedDailyShift.id;
          else newDailyShift.id = -1;
        }

        dailyShiftList.push(newDailyShift);
      }
    } else {
      dailyShiftList.push(updatedDailyShift);
    }

    if (isRepeat) {
      console.log("repeat");
      if (isExisted) {
        console.log("update daily shift");
        handleUpdateDailyShift(dailyShiftList);
      } else {
        console.log("create new daily shift");
        handleCreateNewDailyShift(dailyShiftList);
      }
    } else {
      console.log("not repeat");
      if (updatedDailyShift.id === -1) {
        console.log("create daily shift");
        handleCreateNewDailyShift(dailyShiftList);
      } else {
        console.log("update new daily shift");
        handleUpdateDailyShift(dailyShiftList);
      }
    }
  };

  const handleUpdateDailyShift = async (dailyShiftList: DailyShift[]) => {
    if (onUpdateDailyShifts) {
      setIsLoading(true);
      try {
        await onUpdateDailyShifts(dailyShiftList);
      } catch (error) {
        console.log(error);
      } finally {
        resetToEmptyForm();
        setOpen(false);
        setIsLoading(false);
      }
    }
  };

  const handleCreateNewDailyShift = async (dailyShiftList: DailyShift[]) => {
    if (submit) {
      setIsLoading(true);
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
  };

  const isShiftExisted = (
    shiftName: string,
    range: { startDate: Date; endDate: Date },
    shiftList: Shift[],
  ): boolean => {
    const shift = shiftList.find((shift) => shift.name === shiftName);
    if (!shift) return false;
    const rangeDate = createRangeDate(range);
    const rangeLocalDateString = rangeDate.map((date) =>
      date.toLocaleDateString(),
    );
    for (let i = 0; i < shift.dailyShiftList.length; i++) {
      if (
        rangeLocalDateString.includes(
          shift.dailyShiftList[i].date.toLocaleDateString(),
        )
      )
        return true;
    }
    return false;
  };

  function handleCancelDialog() {
    setOpen(false);
    resetValues(specificShift);
  }

  const handleDataChange = (data: Staff[]) => {
    attendStaffList = data;
    setTempAttendStaffList(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Set a work schedule</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[500px] w-[1000px] pr-2">
              <div className="flex h-full w-full flex-col justify-start gap-2">
                <div className="flex w-full flex-row items-center justify-between">
                  <div className="flex flex-row items-center gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex flex-row items-center gap-2">
                            <FormLabel>
                              <div className="flex w-[100px] flex-row items-center space-x-2">
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
                                  if (!!isChecked) {
                                    form.setValue(
                                      "finishRepeat",
                                      new Date(
                                        new Date().getFullYear(),
                                        11,
                                        31,
                                      ),
                                    );
                                  } else {
                                    form.setValue(
                                      "finishRepeat",
                                      form.getValues("startRepeat"),
                                    );
                                  }
                                  form.setValue("isRepeat", !!isChecked);
                                  setIsRepeat(!!isChecked);
                                }}
                              />
                            </FormControl>
                            <FormLabel>
                              <h5 className="cursor-pointer text-sm">Repeat</h5>
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
                              "flex w-full flex-row items-center gap-2",
                              isRepeat ? "visible" : "hidden",
                            )}
                          >
                            <FormLabel>
                              <div
                                className={cn(
                                  "flex w-[100px] flex-row items-center space-x-2",
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
                                  onChange={(date) => {
                                    if (
                                      date.getTime() <
                                      form.getValues("startRepeat").getTime()
                                    ) {
                                      const currentDate =
                                        form.getValues("finishRepeat");
                                      form.setValue(
                                        "finishRepeat",
                                        currentDate,
                                      );
                                      toast({
                                        description:
                                          "Finish date must be after start date",
                                        variant: "destructive",
                                      });
                                    } else form.setValue("finishRepeat", date);
                                  }}
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
                        <div className="flex w-full flex-row items-center gap-2">
                          <FormLabel>
                            <div className="flex w-[100px] flex-row items-center space-x-2">
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
                        <div className="flex w-full flex-row items-center gap-2">
                          <FormLabel>
                            <div className="flex w-[100px] flex-row items-center space-x-2">
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
            <div className="mt-2 flex flex-row justify-end">
              <Button
                type="button"
                onClick={() => {
                  // check if attend staff list is empty
                  if (tempAttendStaffList.length === 0) {
                    toast({
                      description:
                        "Please select at least 1 staff to attend this shift",
                      variant: "destructive",
                    });
                    return;
                  }

                  if (isRepeat) {
                    // check if shift is existed to avoid overwriting shift
                    const checkIsExisted = isShiftExisted(
                      form.getValues("shiftName"),
                      {
                        startDate: form.getValues("startRepeat"),
                        endDate: form.getValues("finishRepeat"),
                      },
                      shiftList,
                    );
                    setIsExisted(checkIsExisted);
                    if (checkIsExisted) {
                      setOpenConfirmOverwritingDialog(true);
                      return;
                    }
                  }

                  form.handleSubmit(onSubmit)();
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
        <MyConfirmDialog
          open={openConfirmOverwritingDialog}
          setOpen={setOpenConfirmOverwritingDialog}
          onAccept={() => {
            setOpenConfirmOverwritingDialog(false);
            form.handleSubmit(onSubmit)();
          }}
          onCancel={() => setOpenConfirmOverwritingDialog(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
