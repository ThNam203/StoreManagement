import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import {
  AttendanceRecord,
  BonusAndPunish,
  DailyShift,
  Shift,
  Status,
} from "@/entities/Attendance";
import { Staff } from "@/entities/Staff";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, set } from "date-fns";
import { ChevronDown, ChevronUp, Info, PlusCircle, Trash } from "lucide-react";
import { use, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MyCombobox } from "@/components/ui/my_combobox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fi, is } from "date-fns/locale";
import { ne } from "@faker-js/faker";
import { cn } from "@/lib/utils";
import { formatNumberInput, formatPrice } from "@/utils";
import LoadingCircle from "@/components/ui/loading_circle";
import {
  ConfirmDialogType,
  MyConfirmDialog,
} from "../../../../../components/ui/my_confirm_dialog";

const formSchema = z.object({
  note: z.string(),
  hasAttend: z.boolean(),
  punishList: z
    .array(
      z.object({
        name: z.string(),
        times: z.number(),
        value: z.number(),
      }),
    )
    .optional(),
  rewardList: z
    .array(
      z.object({
        name: z.string(),
        times: z.number(),
        value: z.number(),
      }),
    )
    .optional(),
});

export function TimeKeepingDialog({
  attendanceRecord,
  dailyShift,
  open,
  setOpen,
  onRemoveAttendanceRecord,
  onUpdateAttendanceRecord,
}: {
  attendanceRecord: AttendanceRecord | null;
  dailyShift: DailyShift | null;
  open: boolean;
  setOpen: (value: boolean) => void;
  onRemoveAttendanceRecord?: (attendanceRecord: AttendanceRecord) => any;
  onUpdateAttendanceRecord?: (attendanceRecord: AttendanceRecord) => any;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: "",
      hasAttend: attendanceRecord ? attendanceRecord.hasAttend : true,
      punishList: [],
      rewardList: [],
    },
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [punishList, setPunishList] = useState<BonusAndPunish[]>([
    {
      name: "",
      value: NaN,
      times: NaN,
    },
  ]);
  const [punishTypeList, setPunishTypeList] = useState<string[]>([
    "Go to work late",
    "Early leave",
    "Unexcused absence",
  ]);
  const [rewardList, setRewardList] = useState<BonusAndPunish[]>([
    {
      name: "",
      value: NaN,
      times: NaN,
    },
  ]);
  const [rewardTypeList, setRewardTypeList] = useState<string[]>([
    "No absence",
    "Good attitude",
  ]);
  const [openAddPunishDialog, setOpenAddPunishDialog] = useState(false);
  const punishTypeInputRef = useRef<HTMLInputElement>(null);
  const [openAddRewardDialog, setOpenAddRewardDialog] = useState(false);
  const rewardTypeInputRef = useRef<HTMLInputElement>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [contentConfirmDialog, setContentConfirmDialog] = useState({
    title: "",
    content: "",
    type: "warning" as ConfirmDialogType,
  });

  const resetValues = (attendanceRecord: AttendanceRecord | null) => {
    setIsAdding(false);
    setIsRemoving(false);
    if (attendanceRecord) {
      form.setValue("note", attendanceRecord.note);
      form.setValue("hasAttend", attendanceRecord.hasAttend);
      form.setValue("punishList", attendanceRecord.bonus);
      form.setValue("rewardList", attendanceRecord.punish);
      setPunishList(attendanceRecord.punish);
      setRewardList(attendanceRecord.bonus);
      console.log("form set value", form.getValues());
    } else resetToEmptyForm();
  };

  const resetToEmptyForm = () => {
    form.reset();
    setPunishList([
      {
        name: "",
        value: NaN,
        times: NaN,
      },
    ]);
    setRewardList([
      {
        name: "",
        value: NaN,
        times: NaN,
      },
    ]);
  };

  useEffect(() => {
    if (open) resetValues(attendanceRecord);
  }, [open]);
  useEffect(() => {
    form.setValue("punishList", punishList);
  }, [punishList]);
  useEffect(() => {
    form.setValue("rewardList", rewardList);
  }, [rewardList]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("get in submit");
    const newAttendanceRecord: AttendanceRecord = {
      ...attendanceRecord!,
      note: values.note,
      hasAttend: values.hasAttend,
      bonus: values.rewardList ? values.rewardList : [],
      punish: values.punishList ? values.punishList : [],
    };
    if (onUpdateAttendanceRecord) {
      console.log("submit", newAttendanceRecord);
      setIsAdding(true);
      try {
        await onUpdateAttendanceRecord(newAttendanceRecord).then(() => {
          setOpen(false);
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsAdding(false);
        resetToEmptyForm();
      }
    }
  };

  function handleCancelDialog() {
    setOpen(false);
    resetValues(attendanceRecord);
  }
  const handleRemoveAttendanceRecord = async () => {
    if (onRemoveAttendanceRecord) {
      setIsRemoving(true);
      try {
        await onRemoveAttendanceRecord(attendanceRecord!).then(() => {
          setOpen(false);
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsRemoving(false);
      }
    }
  };

  const handleAddingNewPunishType = () => {
    if (!punishTypeInputRef.current) return;
    if (punishTypeInputRef.current?.value === "") return;
    if (punishTypeList.includes(punishTypeInputRef.current?.value)) return;
    setPunishTypeList((prev) => [...prev, punishTypeInputRef.current?.value!]);
    setOpenAddPunishDialog(false);
  };
  const handleAddingNewRewardType = () => {
    if (!rewardTypeInputRef.current) return;
    if (rewardTypeInputRef.current?.value === "") return;
    if (rewardTypeList.includes(rewardTypeInputRef.current?.value)) return;
    setRewardTypeList((prev) => [...prev, rewardTypeInputRef.current?.value!]);
    setOpenAddRewardDialog(false);
  };

  const addNewPunishDailog = (
    <Dialog open={openAddPunishDialog} onOpenChange={setOpenAddPunishDialog}>
      <DialogTrigger asChild>
        <PlusCircle className="h-4 w-4 opacity-50 hover:cursor-pointer hover:opacity-100" />
      </DialogTrigger>
      <DialogContent
        className="flex h-[200px] w-[600px] flex-col justify-between"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add a new type of punishment</DialogTitle>
        </DialogHeader>

        <div className="flex flex-row items-center justify-start">
          <Label htmlFor="name" className="w-[100px]">
            Type
          </Label>
          <Input ref={punishTypeInputRef} className="w-[300px]" />
        </div>
        <DialogFooter>
          <Button
            variant={"green"}
            type="button"
            onClick={handleAddingNewPunishType}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  const addNewRewardDailog = (
    <Dialog open={openAddRewardDialog} onOpenChange={setOpenAddRewardDialog}>
      <DialogTrigger asChild>
        <PlusCircle className="h-4 w-4 opacity-50 hover:cursor-pointer hover:opacity-100" />
      </DialogTrigger>
      <DialogContent
        className="flex h-[200px] w-[600px] flex-col justify-between"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add a new type of reward</DialogTitle>
        </DialogHeader>

        <div className="flex flex-row items-center justify-start">
          <Label htmlFor="name" className="w-[100px]">
            Type
          </Label>
          <Input ref={rewardTypeInputRef} className="w-[300px]" />
        </div>
        <DialogFooter>
          <Button
            variant={"green"}
            type="button"
            onClick={handleAddingNewRewardType}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            <span className="mr-2 font-semibold">
              {attendanceRecord ? attendanceRecord.staffName : ""}
            </span>
            <span className="text-xs text-gray-500">
              ID: {attendanceRecord ? attendanceRecord.staffId : ""}
            </span>
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="w-full">
              <div className="flex h-[400px] w-[800px] flex-col justify-between gap-3 pr-2">
                <div className="flex w-full flex-col">
                  <div className="flex flex-row items-center justify-between gap-8">
                    <div className="flex flex-col items-start gap-2">
                      <div className="flex flex-row items-center justify-start">
                        <p className="w-[100px] pb-1 text-sm font-semibold">
                          Date
                        </p>
                        <p className="w-[250px] border-b pb-1 text-sm">
                          {attendanceRecord
                            ? format(attendanceRecord.date, "eeee, dd/MM/yyyy")
                            : ""}
                        </p>
                      </div>
                      <div className="flex flex-row items-center justify-start">
                        <p className="w-[100px] pb-1 text-sm font-semibold">
                          Shift
                        </p>
                        <p className="w-[250px] border-b pb-1 text-sm">
                          {dailyShift ? dailyShift.shiftName : ""}
                        </p>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <textarea
                              className="w-[400px] resize-none rounded-md border p-4 text-sm"
                              defaultValue={field.value}
                              onChange={(val) => {
                                form.setValue("note", val.target.value);
                              }}
                              placeholder="Note..."
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <Tabs defaultValue="time-keeping" className="w-full">
                    <TabsList>
                      <TabsTrigger value="time-keeping">
                        Time keeping
                      </TabsTrigger>
                      <TabsTrigger value="punish">Punishment</TabsTrigger>
                      <TabsTrigger value="reward">Reward</TabsTrigger>
                    </TabsList>
                    <TabsContent value="time-keeping">
                      <div className="flex flex-row items-center justify-start">
                        <p className="w-[150px] pb-1 text-sm font-semibold">
                          Time keeping
                        </p>
                        <FormField
                          control={form.control}
                          name="hasAttend"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <MyCombobox
                                  choices={["Present", "Absent"]}
                                  defaultValue={
                                    field.value === true ? "Present" : "Absent"
                                  }
                                  onValueChange={(val) => {
                                    form.setValue(
                                      "hasAttend",
                                      val === "Present" ? true : false,
                                    );
                                  }}
                                  className="w-[150px]"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="punish">
                      <div className="flex flex-col items-start">
                        <div className="flex w-full flex-col overflow-hidden rounded-md">
                          <div className="flex w-full flex-row items-center justify-start bg-blue-100 p-2">
                            <span className="test-sm w-[300px] font-semibold">
                              Type of punishment
                            </span>
                            <span className="test-sm w-[100px] text-end font-semibold">
                              Times
                            </span>
                            <span className="test-sm w-[150px] text-end font-semibold">
                              Applied value
                            </span>
                            <span className="test-sm w-[150px] text-end font-semibold">
                              Total
                            </span>
                          </div>
                          {punishList.map((punish, index) => {
                            return (
                              <div
                                key={index}
                                className={cn(
                                  "flex w-full flex-row items-center justify-start bg-gray-100 p-2",
                                )}
                              >
                                <div className="w-[300px]">
                                  <MyCombobox
                                    choices={punishTypeList}
                                    placeholder="Choose type of violation"
                                    defaultValue={punish.name}
                                    className="w-[250px]"
                                    onValueChange={(val) => {
                                      const newPunishList: BonusAndPunish[] = [
                                        ...punishList,
                                      ].map((punish, i) =>
                                        i === index
                                          ? { ...punish, name: val }
                                          : punish,
                                      );
                                      setPunishList(newPunishList);
                                    }}
                                    endIcon={addNewPunishDailog}
                                  />
                                </div>
                                <div className="flex w-[100px] flex-row justify-end gap-2">
                                  <Input
                                    className="w-[50px] text-right text-sm"
                                    placeholder="0"
                                    defaultValue={
                                      punish.times ? punish.times : ""
                                    }
                                    onChange={(val) => {
                                      const newPunishList: BonusAndPunish[] = [
                                        ...punishList,
                                      ];
                                      newPunishList[index].times =
                                        formatNumberInput(val);
                                      setPunishList(newPunishList);
                                    }}
                                  />
                                </div>
                                <div className="flex w-[150px] flex-row justify-end">
                                  <Input
                                    className="w-[100px] text-right text-sm"
                                    placeholder="0"
                                    defaultValue={
                                      punish.value ? punish.value : ""
                                    }
                                    onChange={(val) => {
                                      const newPunishList: BonusAndPunish[] = [
                                        ...punishList,
                                      ];
                                      newPunishList[index].value =
                                        formatNumberInput(val);
                                      setPunishList(newPunishList);
                                    }}
                                  />
                                </div>
                                <div className="flex w-[150px] flex-row justify-end">
                                  <p>
                                    {formatPrice(
                                      isNaN(punish.times * punish.value)
                                        ? 0
                                        : punish.times * punish.value,
                                    )}
                                  </p>
                                </div>
                                <div className="flex w-[50px] justify-end">
                                  <Trash
                                    key={index}
                                    size={16}
                                    onClick={() => {
                                      const newPunishList: BonusAndPunish[] =
                                        punishList.filter(
                                          (punish, i) => i !== index,
                                        );

                                      setPunishList(newPunishList);
                                    }}
                                    className=" cursor-pointer opacity-60 hover:opacity-100"
                                  ></Trash>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-3"
                          onClick={() => {
                            const newPunishList: BonusAndPunish[] = [
                              ...punishList,
                            ];
                            newPunishList.push({
                              name: "",
                              value: NaN,
                              times: NaN,
                            });
                            setPunishList(newPunishList);
                          }}
                        >
                          + Add violation
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="reward">
                      <div className="flex flex-col items-start">
                        <div className="flex w-full flex-col overflow-hidden rounded-md">
                          <div className="flex w-full flex-row items-center justify-start bg-blue-100 p-2">
                            <span className="test-sm w-[300px] font-semibold">
                              Type of reward
                            </span>
                            <span className="test-sm w-[100px] text-end font-semibold">
                              Times
                            </span>
                            <span className="test-sm w-[150px] text-end font-semibold">
                              Applied value
                            </span>
                            <span className="test-sm w-[150px] text-end font-semibold">
                              Total
                            </span>
                          </div>
                          {rewardList.map((reward, index) => {
                            return (
                              <div
                                key={index}
                                className={cn(
                                  "flex w-full flex-row items-center justify-start bg-gray-100 p-2",
                                )}
                              >
                                <div className="w-[300px]">
                                  <MyCombobox
                                    choices={rewardTypeList}
                                    placeholder="Choose type of reward"
                                    defaultValue={reward.name}
                                    className="w-[250px]"
                                    onValueChange={(val) => {
                                      const newRewardList: BonusAndPunish[] = [
                                        ...rewardList,
                                      ].map((reward, i) =>
                                        i === index
                                          ? { ...reward, name: val }
                                          : reward,
                                      );

                                      setRewardList(newRewardList);
                                    }}
                                    endIcon={addNewRewardDailog}
                                  />
                                </div>
                                <div className="flex w-[100px] flex-row justify-end gap-2">
                                  <Input
                                    className="w-[50px] text-right text-sm"
                                    placeholder="0"
                                    defaultValue={
                                      reward.times ? reward.times : ""
                                    }
                                    onChange={(val) => {
                                      const newRewardList: BonusAndPunish[] = [
                                        ...rewardList,
                                      ];
                                      newRewardList[index].times =
                                        formatNumberInput(val);
                                      setRewardList(newRewardList);
                                    }}
                                  />
                                </div>
                                <div className="flex w-[150px] flex-row justify-end">
                                  <Input
                                    className="w-[100px] text-right text-sm"
                                    placeholder="0"
                                    defaultValue={
                                      reward.value ? reward.value : ""
                                    }
                                    onChange={(val) => {
                                      const newRewardList: BonusAndPunish[] = [
                                        ...rewardList,
                                      ];
                                      newRewardList[index].value =
                                        formatNumberInput(val);
                                      console.log(
                                        "newRewardList",
                                        newRewardList,
                                      );
                                      setRewardList(newRewardList);
                                    }}
                                  />
                                </div>
                                <div className="flex w-[150px] flex-row justify-end">
                                  <p>
                                    {formatPrice(
                                      isNaN(reward.times * reward.value)
                                        ? 0
                                        : reward.times * reward.value,
                                    )}
                                  </p>
                                </div>
                                <div className="flex w-[50px] justify-end">
                                  <Trash
                                    key={index}
                                    size={16}
                                    onClick={() => {
                                      const newRewardList: BonusAndPunish[] =
                                        rewardList.filter(
                                          (reward, i) => i !== index,
                                        );
                                      setRewardList(newRewardList);
                                    }}
                                    className="cursor-pointer opacity-60 hover:opacity-100"
                                  ></Trash>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-3"
                          onClick={() => {
                            const newRewardList: BonusAndPunish[] = [
                              ...rewardList,
                            ];
                            newRewardList.push({
                              name: "",
                              value: NaN,
                              times: NaN,
                            });
                            setRewardList(newRewardList);
                          }}
                        >
                          + Add reward
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                <div className="flex flex-row justify-end">
                  <Button
                    type="button"
                    onClick={() => {
                      setContentConfirmDialog({
                        title: "Warning",
                        content:
                          "Are you sure you want to remove this attendance record?",
                        type: "warning",
                      });
                      setOpenConfirmDialog(true);
                    }}
                    variant={"red"}
                    className="mr-3 gap-1"
                    disabled={isAdding || isRemoving}
                  >
                    <Trash size={16}></Trash>
                    Remove
                    {isRemoving ? <LoadingCircle></LoadingCircle> : null}
                  </Button>
                  <Button
                    type="submit"
                    onClick={() => {
                      console.log("submit", form.getValues());
                      form.handleSubmit(onSubmit);
                    }}
                    variant={"green"}
                    className="mr-3"
                    disabled={isAdding || isRemoving}
                  >
                    Save
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
              </div>
            </ScrollArea>
          </form>
        </Form>
        <MyConfirmDialog
          open={openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          title={contentConfirmDialog.title}
          content={contentConfirmDialog.content}
          type={contentConfirmDialog.type}
          onAccept={() => {
            setOpenConfirmDialog(false);
            handleRemoveAttendanceRecord();
          }}
          onCancel={() => setOpenConfirmDialog(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
