import CustomCombobox from "@/components/component/CustomCombobox";
import { AddNewViolationOrRewardDailog } from "@/components/ui/attendance/addViolationOrRewardDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingCircle from "@/components/ui/loading_circle";
import { MyCombobox } from "@/components/ui/my_combobox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  AttendanceRecord,
  BonusAndPunish,
  DailyShift,
  ViolationAndReward,
} from "@/entities/Attendance";
import { useAppSelector } from "@/hooks";
import { cn } from "@/lib/utils";
import { addReward } from "@/reducers/shiftRewardReducer";
import { addViolation } from "@/reducers/shiftViolationReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import ShiftService from "@/services/shift_service";
import { formatNumberInput, formatPrice, zodErrorHandler } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { add, format } from "date-fns";
import { Check, PlusCircle, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as z from "zod";
import {
  ConfirmDialogType,
  MyConfirmDialog,
} from "../../../../../components/ui/my_confirm_dialog";
import { useRouter } from "next/navigation";

const OptionView = (option: string): React.ReactNode => {
  return <p className="whitespace-nowrap text-xs">{option}</p>;
};

const OptionSearchView = (
  option: string,
  selectedOption: string | null,
): React.ReactNode => {
  const chosen = selectedOption && selectedOption === option;
  return (
    <div
      className={cn(
        "flex cursor-pointer items-center justify-between px-1",
        chosen ? "bg-green-100" : "",
      )}
    >
      <div>
        <p className="px-1 py-2 text-sm">{option}</p>
      </div>
      {chosen ? <Check size={16} color="green" /> : null}
    </div>
  );
};

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
  canCreateAttendance = false,
  canUpdateAttendance = false,
  canDeleteAttendance = false,
}: {
  attendanceRecord: AttendanceRecord | null;
  dailyShift: DailyShift | null;
  open: boolean;
  setOpen: (value: boolean) => void;
  canCreateAttendance?: boolean;
  canUpdateAttendance?: boolean;
  canDeleteAttendance?: boolean;
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
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [punishList, setPunishList] = useState<BonusAndPunish[]>([
    {
      name: "",
      value: NaN,
      times: NaN,
    },
  ]);
  const violationList = useAppSelector((state) => state.violations.value);
  const violationNames = violationList.map((violation) => violation.name);
  const rewardList = useAppSelector((state) => state.rewards.value);
  const rewardNames = rewardList.map((reward) => reward.name);
  const [bonusList, setBonusList] = useState<BonusAndPunish[]>([
    {
      name: "",
      value: NaN,
      times: NaN,
    },
  ]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [contentConfirmDialog, setContentConfirmDialog] = useState({
    title: "",
    content: "",
    type: "warning" as ConfirmDialogType,
  });
  const [openAddViolationOrRewardDialog, setOpenAddViolationOrRewardDialog] =
    useState(false);
  const [selectedItem, setSelectedItem] = useState<ViolationAndReward | null>(
    null,
  );
  const [selectedType, setSelectedType] = useState<"Bonus" | "Punish">("Bonus");

  const resetValues = (attendanceRecord: AttendanceRecord | null) => {
    setIsAdding(false);
    setIsRemoving(false);
    if (attendanceRecord) {
      form.setValue("note", attendanceRecord.note);
      form.setValue("hasAttend", attendanceRecord.hasAttend);
      form.setValue("punishList", attendanceRecord.bonus);
      form.setValue("rewardList", attendanceRecord.punish);
      setPunishList(attendanceRecord.punish);
      setBonusList(attendanceRecord.bonus);
      console.log("form set value", form.getValues());
    } else resetToEmptyForm();
  };

  const resetToEmptyForm = () => {
    form.reset();
    setPunishList([]);
    setBonusList([]);
  };

  useEffect(() => {
    if (open) resetValues(attendanceRecord);
  }, [open]);
  useEffect(() => {
    form.setValue("punishList", punishList);
  }, [punishList]);
  useEffect(() => {
    form.setValue("rewardList", bonusList);
  }, [bonusList]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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

  const addNewViolationOrReward = async (value: ViolationAndReward) => {
    try {
      const res = await ShiftService.createViolationAndReward(value);
      if (value.type === "Punish") dispatch(addViolation(res.data));
      else dispatch(addReward(res.data));
      return Promise.resolve(res.data);
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject(e);
    }
  };
  const handleOpenViolationOrRewardDialog = (
    data: ViolationAndReward | null,
    type: "Bonus" | "Punish",
  ) => {
    setSelectedType(type);
    setSelectedItem(data);
    setOpenAddViolationOrRewardDialog(true);
  };
  const handleAddVIolationOrReward = (value: ViolationAndReward) => {
    return addNewViolationOrReward(value);
  };

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
                    <TabsList className="flex w-full flex-row items-center justify-start">
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
                        <div className="flex w-full flex-col rounded-sm">
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
                                  <CustomCombobox<string>
                                    placeholder="Select violation"
                                    searchPlaceholder={"Find violation..."}
                                    value={punish.name}
                                    choices={violationNames}
                                    valueView={OptionView}
                                    showSearchInput={false}
                                    className="bg-white"
                                    itemSearchView={(choice) =>
                                      OptionSearchView(choice, punish.name)
                                    }
                                    endIcon={
                                      <PlusCircle
                                        className={cn(
                                          "h-4 w-4 opacity-50 hover:cursor-pointer hover:opacity-100",
                                          canCreateAttendance ? "" : "hidden",
                                        )}
                                        onClick={() =>
                                          handleOpenViolationOrRewardDialog(
                                            null,
                                            "Punish",
                                          )
                                        }
                                      />
                                    }
                                    onItemClick={(val) => {
                                      const violation = violationList.find(
                                        (violation) => violation.name === val,
                                      );
                                      let applyValue = 0;
                                      if (violation)
                                        applyValue = violation.defaultValue;
                                      let newPunishList: BonusAndPunish[] = [
                                        ...punishList,
                                      ].map((punish, i) =>
                                        i === index
                                          ? {
                                              ...punish,
                                              name: val,
                                              times: 1,
                                              value: applyValue,
                                            }
                                          : punish,
                                      );
                                      setPunishList(newPunishList);
                                    }}
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
                                      let newPunishList: BonusAndPunish[] = [
                                        ...punishList,
                                      ].map((punish, i) =>
                                        i === index
                                          ? {
                                              ...punish,
                                              times: formatNumberInput(val),
                                            }
                                          : punish,
                                      );
                                      setPunishList(newPunishList);
                                    }}
                                  />
                                </div>
                                <div className="flex w-[150px] flex-row justify-end">
                                  <Input
                                    className="w-[100px] text-right text-sm"
                                    placeholder="0"
                                    defaultValue={
                                      punish.value
                                        ? formatPrice(punish.value)
                                        : ""
                                    }
                                    onChange={(val) => {
                                      let newPunishList: BonusAndPunish[] = [
                                        ...punishList,
                                      ].map((punish, i) =>
                                        i === index
                                          ? {
                                              ...punish,
                                              value: formatNumberInput(val),
                                            }
                                          : punish,
                                      );
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
                        <div className="flex w-full flex-col rounded-sm">
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
                          {bonusList.map((bonus, index) => {
                            return (
                              <div
                                key={index}
                                className={cn(
                                  "flex w-full flex-row items-center justify-start bg-gray-100 p-2",
                                )}
                              >
                                <div className="w-[300px]">
                                  <CustomCombobox<string>
                                    placeholder="Select reward"
                                    searchPlaceholder={"Find reward..."}
                                    value={bonus.name}
                                    choices={rewardNames}
                                    valueView={OptionView}
                                    showSearchInput={false}
                                    className=" bg-white"
                                    itemSearchView={(choice) =>
                                      OptionSearchView(choice, bonus.name)
                                    }
                                    endIcon={
                                      <PlusCircle
                                        className={cn(
                                          "h-4 w-4 opacity-50 hover:cursor-pointer hover:opacity-100",
                                          canCreateAttendance ? "" : "hidden",
                                        )}
                                        onClick={() =>
                                          handleOpenViolationOrRewardDialog(
                                            null,
                                            "Bonus",
                                          )
                                        }
                                      />
                                    }
                                    onItemClick={(val) => {
                                      const reward = rewardList.find(
                                        (reward) => reward.name === val,
                                      );
                                      let applyValue = 0;
                                      if (reward)
                                        applyValue = reward.defaultValue;
                                      let newRewardList: BonusAndPunish[] = [
                                        ...bonusList,
                                      ].map((reward, i) =>
                                        i === index
                                          ? {
                                              ...reward,
                                              name: val,
                                              times: 1,
                                              value: applyValue,
                                            }
                                          : reward,
                                      );

                                      setBonusList(newRewardList);
                                    }}
                                  />
                                </div>
                                <div className="flex w-[100px] flex-row justify-end gap-2">
                                  <Input
                                    className="w-[50px] text-right text-sm"
                                    placeholder="0"
                                    defaultValue={
                                      bonus.times ? bonus.times : ""
                                    }
                                    onChange={(val) => {
                                      let newRewardList: BonusAndPunish[] = [
                                        ...bonusList,
                                      ].map((reward, i) =>
                                        i === index
                                          ? {
                                              ...reward,
                                              times: formatNumberInput(val),
                                            }
                                          : reward,
                                      );
                                      setBonusList(newRewardList);
                                    }}
                                  />
                                </div>
                                <div className="flex w-[150px] flex-row justify-end">
                                  <Input
                                    className="w-[100px] text-right text-sm"
                                    placeholder="0"
                                    defaultValue={
                                      bonus.value
                                        ? formatPrice(bonus.value)
                                        : ""
                                    }
                                    onChange={(val) => {
                                      let newRewardList: BonusAndPunish[] = [
                                        ...bonusList,
                                      ].map((reward, i) =>
                                        i === index
                                          ? {
                                              ...reward,
                                              value: formatNumberInput(val),
                                            }
                                          : reward,
                                      );
                                      setBonusList(newRewardList);
                                    }}
                                  />
                                </div>
                                <div className="flex w-[150px] flex-row justify-end">
                                  <p>
                                    {formatPrice(
                                      isNaN(bonus.times * bonus.value)
                                        ? 0
                                        : bonus.times * bonus.value,
                                    )}
                                  </p>
                                </div>
                                <div className="flex w-[50px] justify-end">
                                  <Trash
                                    key={index}
                                    size={16}
                                    onClick={() => {
                                      const newRewardList: BonusAndPunish[] =
                                        bonusList.filter(
                                          (bonus, i) => i !== index,
                                        );
                                      setBonusList(newRewardList);
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
                              ...bonusList,
                            ];
                            newRewardList.push({
                              name: "",
                              value: NaN,
                              times: NaN,
                            });
                            setBonusList(newRewardList);
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
                    className={cn(
                      "mr-3 gap-1",
                      canDeleteAttendance ? "" : "hidden",
                    )}
                    disabled={isAdding || isRemoving}
                  >
                    <Trash size={16}></Trash>
                    Remove
                    {isRemoving ? <LoadingCircle></LoadingCircle> : null}
                  </Button>
                  <Button
                    type="submit"
                    onClick={() => {
                      try {
                        formSchema.parse(form.getValues());
                      } catch (e) {
                        zodErrorHandler(e, toast);
                      }
                    }}
                    variant={"green"}
                    className={cn("mr-3", canUpdateAttendance ? "" : "hidden")}
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
        <AddNewViolationOrRewardDailog
          data={selectedItem}
          type={selectedType}
          open={openAddViolationOrRewardDialog}
          setOpen={setOpenAddViolationOrRewardDialog}
          submit={handleAddVIolationOrReward}
        />
      </DialogContent>
    </Dialog>
  );
}
