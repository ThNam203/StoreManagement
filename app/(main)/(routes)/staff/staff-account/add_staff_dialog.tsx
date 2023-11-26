"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input, PasswordInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MyCombobox } from "@/components/ui/my_combobox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BonusUnit,
  SalarySetting,
  SalaryType,
  SalaryUnitTable,
} from "@/entities/SalarySetting";
import { Sex, Staff } from "@/entities/Staff";
import { removeCharNotANum } from "@/utils";
import {
  AlignJustify,
  Camera,
  CircleDollarSign,
  Eye,
  EyeOff,
  Info,
  PlusCircle,
} from "lucide-react";
import { nanoid } from "nanoid";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CustomInput } from "./custom_input";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DatePicker } from "@/components/ui/datepicker";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name must be at least one character" }),
  birthday: z.date(),
  sex: z.string(),
  CCCD: z.string().min(1, { message: "CCCD is empty" }),
  position: z.string().min(1, { message: "Position is empty" }),
  phoneNumber: z.string().min(1, { message: "Phone number is empty" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  address: z.string(),
  note: z.string().optional(),
  baseSalary: z.object({
    value: z.number().min(1, { message: "Salary must be greator than 0" }),
    salaryType: z.nativeEnum(SalaryType),
  }),
  baseBonus: z.object({
    saturday: z.object({
      value: z.number(),
      unit: z.nativeEnum(BonusUnit),
    }),
    sunday: z.object({
      value: z.number(),
      unit: z.nativeEnum(BonusUnit),
    }),
    dayOff: z.object({
      value: z.number(),
      unit: z.nativeEnum(BonusUnit),
    }),
    holiday: z.object({
      value: z.number(),
      unit: z.nativeEnum(BonusUnit),
    }),
  }),
  overtimeBonus: z.object({
    saturday: z.object({
      value: z.number(),
      unit: z.nativeEnum(BonusUnit),
    }),
    sunday: z.object({
      value: z.number(),
      unit: z.nativeEnum(BonusUnit),
    }),
    dayOff: z.object({
      value: z.number(),
      unit: z.nativeEnum(BonusUnit),
    }),
    holiday: z.object({
      value: z.number(),
      unit: z.nativeEnum(BonusUnit),
    }),
  }),
});

export function AddStaffDialog({
  data,
  submit,
}: {
  data?: Staff;
  submit: (values: Staff) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      birthday: new Date(),
      sex: Sex.MALE,
      baseSalary: {
        value: 0,
        salaryType: SalaryType.ByShift,
      },
      baseBonus: {
        saturday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        sunday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        dayOff: {
          value: 0,
          unit: BonusUnit["%"],
        },
        holiday: {
          value: 0,
          unit: BonusUnit["%"],
        },
      },
      overtimeBonus: {
        saturday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        sunday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        dayOff: {
          value: 0,
          unit: BonusUnit["%"],
        },
        holiday: {
          value: 0,
          unit: BonusUnit["%"],
        },
      },
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const newStaff: Staff = {
      avatar: "",
      id: nanoid(9).toUpperCase(),
      name: values.name,
      phoneNumber: values.phoneNumber,
      CCCD: values.CCCD,
      salaryDebt: 0,
      note: "",
      birthday: new Date(values.birthday),
      sex: values.sex as Sex,
      email: values.email,
      password: values.password,
      address: values.address,
      position: values.position,
      createAt: new Date(),
      salarySetting: {
        baseSalary: values.baseSalary,
        baseBonus: values.baseBonus,
        overtimeBonus: values.overtimeBonus,
      },
    };

    if (submit) {
      submit(newStaff);
      form.reset();
      setOpen(false);
    }
  }
  const [open, setOpen] = useState(false);
  function handleCancelDialog() {
    setOpen(false);
    form.reset();
    setOvertimeBonusViewOption(false);
  }

  const [positionList, setPositionList] = useState([
    "Owner",
    "Cashier",
    "Safe Guard",
    "Manager",
    "Cleaner",
  ]);
  const positionInputRef = useRef<HTMLInputElement>(null);
  const [openAddPositionDialog, setOpenAddPositionDialog] = useState(false);

  const handleAddingNewPosition = () => {
    if (!positionInputRef.current) return;
    if (positionList.includes(positionInputRef.current?.value)) return;
    setPositionList((prev) => [...prev, positionInputRef.current?.value!]);
    setOpenAddPositionDialog(false);
  };

  const onSalaryTypeChange = (value: string) => {
    setSalarySetting((prev) => ({
      ...prev,
      baseSalary: {
        value: prev.baseSalary.value,
        salaryType: value as SalaryType,
      },
    }));
  };

  const [salarySetting, setSalarySetting] = useState<SalarySetting>({
    baseSalary: {
      value: 0,
      salaryType: SalaryType.ByShift,
    },
    baseBonus: {
      saturday: {
        value: 0,
        unit: BonusUnit["%"],
      },
      sunday: {
        value: 0,
        unit: BonusUnit["%"],
      },
      dayOff: {
        value: 0,
        unit: BonusUnit["%"],
      },
      holiday: {
        value: 0,
        unit: BonusUnit["%"],
      },
    },
    overtimeBonus: {
      saturday: {
        value: 0,
        unit: BonusUnit["%"],
      },
      sunday: {
        value: 0,
        unit: BonusUnit["%"],
      },
      dayOff: {
        value: 0,
        unit: BonusUnit["%"],
      },
      holiday: {
        value: 0,
        unit: BonusUnit["%"],
      },
    },
  });

  const [baseBonusViewOption, setBaseBonusViewOption] = useState<
    Record<string, boolean>
  >({ Saturday: false, Sunday: false, "Day off": true, Holiday: true });

  const [overtimeBonusViewOption, setOvertimeBonusViewOption] =
    useState<boolean>(false);

  const addPositionDailog = (
    <Dialog
      open={openAddPositionDialog}
      onOpenChange={setOpenAddPositionDialog}
    >
      <DialogTrigger asChild>
        <PlusCircle className="w-4 h-4 opacity-50 hover:cursor-pointer hover:opacity-100" />
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add a new position</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-6 items-center gap-4">
          <Label htmlFor="name" className="text-right grid-col-1 col-span-1">
            Position
          </Label>
          <Input ref={positionInputRef} className="grid-col-2 col-span-5" />
        </div>
        <DialogFooter>
          <Button
            variant={"default"}
            type="button"
            onClick={handleAddingNewPosition}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add new staff</Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Add new staff</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 text-sm"
            >
              <Tabs defaultValue="infomation">
                <TabsList>
                  <TabsTrigger value="infomation">Infomation</TabsTrigger>
                  <TabsTrigger value="salary-setting">
                    Salary setting
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="infomation"
                  className="min-w-[1200px] h-[350px] pt-2"
                >
                  <div className="flex flex-row items-start justify-between">
                    <div className="flex flex-col">
                      <Button
                        className="w-[150px] h-[150px] border-2 border-dashed"
                        type="button"
                        variant={"outline"}
                      >
                        <Camera color="grey" />
                      </Button>
                      <Button
                        variant={"default"}
                        type="button"
                        className="mt-4"
                      >
                        Choose image
                      </Button>
                    </div>
                    <div className="flex flex-col ml-4 w-[450px]">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <div className="flex flex-row items-center">
                              <FormLabel className="w-1/3">
                                <div className="flex flex-row items-center space-x-2">
                                  <h5 className="text-sm">Name</h5>
                                  <Info size={16} />
                                </div>
                              </FormLabel>
                              <FormControl className="w-2/3">
                                <Input {...field} />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="birthday"
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <div className="flex flex-row items-center">
                              <FormLabel className="w-1/3">
                                <div className="flex flex-row items-center space-x-2">
                                  <h5 className="text-sm">Birthday</h5>
                                  <Info size={16} />
                                </div>
                              </FormLabel>

                              <FormControl className="w-2/3">
                                <div>
                                  <DatePicker
                                    onChange={(date) =>
                                      form.setValue("birthday", date)
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
                        name="sex"
                        render={({ field }) => (
                          <FormItem className="mt-6 mb-2">
                            <div className="flex flex-row items-center">
                              <FormLabel className="w-1/3">
                                <div className="flex flex-row items-center space-x-2">
                                  <h5 className="text-sm">Sex</h5>
                                  <Info size={16} />
                                </div>
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  defaultValue={field.value}
                                  className="flex flex-row"
                                  onChange={field.onChange}
                                >
                                  {Object.values(Sex).map((gender) => {
                                    return (
                                      <div
                                        key={gender}
                                        className="flex items-center space-x-2"
                                      >
                                        <RadioGroupItem
                                          value={gender}
                                          id={gender}
                                        />
                                        <Label htmlFor={gender}>{gender}</Label>
                                      </div>
                                    );
                                  })}
                                </RadioGroup>
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="CCCD"
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <div className="flex flex-row items-center">
                              <FormLabel className="w-1/3">
                                <div className="flex flex-row items-center space-x-2">
                                  <h5 className="text-sm">CCCD</h5>
                                  <Info size={16} />
                                </div>
                              </FormLabel>

                              <FormControl className="w-2/3">
                                <Input
                                  {...field}
                                  maxLength={12}
                                  minLength={12}
                                  onKeyUp={(e: any) => {
                                    removeCharNotANum(e);
                                    field.onChange(e);
                                  }}
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col ml-4 w-[450px]">
                      <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <div className="flex flex-row items-center">
                              <FormLabel className="w-1/3">
                                <div className="flex flex-row items-center space-x-2">
                                  <h5 className="text-sm">Position</h5>
                                  <Info size={16} />
                                </div>
                              </FormLabel>
                              <FormControl>
                                <MyCombobox
                                  defaultValue={field.value}
                                  onValueChange={(val) => {
                                    form.setValue("position", val);
                                  }}
                                  className="w-2/3"
                                  placeholder="Search position..."
                                  choices={positionList}
                                  endIcon={addPositionDailog}
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <div className="flex flex-row items-center">
                              <FormLabel className="w-1/3">
                                <div className="flex flex-row items-center space-x-2">
                                  <h5 className="text-sm">Phone number</h5>
                                  <Info size={16} />
                                </div>
                              </FormLabel>

                              <FormControl>
                                <Input
                                  {...field}
                                  maxLength={11}
                                  minLength={10}
                                  className="w-2/3"
                                  onKeyUp={(e: any) => {
                                    removeCharNotANum(e);
                                    field.onChange(e);
                                  }}
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <div className="flex flex-row items-center">
                              <FormLabel className="w-1/3">
                                <div className="flex flex-row items-center space-x-2">
                                  <h5 className="text-sm">Email</h5>
                                  <Info size={16} />
                                </div>
                              </FormLabel>

                              <FormControl className="w-2/3">
                                <Input type="email" {...field} />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <div className="flex flex-row items-center">
                              <FormLabel className="w-1/3">
                                <div className="flex flex-row items-center space-x-2">
                                  <h5 className="text-sm">Password</h5>
                                  <Info size={16} />
                                </div>
                              </FormLabel>

                              <FormControl className="w-2/3">
                                <PasswordInput {...field} />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <div className="flex flex-row items-center">
                              <FormLabel className="w-1/3">
                                <div className="flex flex-row items-center space-x-2">
                                  <h5 className="text-sm">Address</h5>
                                  <Info size={16} />
                                </div>
                              </FormLabel>

                              <FormControl className="w-2/3">
                                <Input {...field} />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent
                  value="salary-setting"
                  className="min-w-[1200px] h-[350px] pt-2"
                >
                  <ScrollArea className="h-full pr-4">
                    <div className="flex flex-col gap-6">
                      <div className="w-full rounded shadow-[0px_5px_15px_rgba(0,0,0,.1)] overflow-hidden">
                        <div className="p-4 flex flex-row items-center">
                          <CircleDollarSign className="mr-2 w-4 h-4 text-yellow-500" />
                          <span className="font-semibold">Staff salary</span>
                        </div>
                        <Separator />
                        <div className="p-4 flex flex-row items-center justify-between">
                          <span className="w-1/12 whitespace-nowrap font-semibold">
                            Salary type
                          </span>
                          <div className="w-11/12 flex flex-row items-center justify-between">
                            <FormField
                              control={form.control}
                              name="baseSalary"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <div className="min-w-[500px] flex flex-row items-center gap-2">
                                      <MyCombobox
                                        className="w-full"
                                        defaultValue={field.value.salaryType}
                                        choices={Object.values(SalaryType)}
                                        onValueChange={(val) => {
                                          form.setValue(
                                            "baseSalary.salaryType",
                                            val as SalaryType
                                          );
                                          onSalaryTypeChange(val);
                                        }}
                                      />
                                      <Info className="w-6 h-6" />
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <AlignJustify className="w-4 h-4 opacity-50 hover:opacity-100 hover:cursor-pointer ease-linear duration-100" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-auto">
                                {Object.keys(baseBonusViewOption).map(
                                  (key, index) => {
                                    return (
                                      <div
                                        className="flex flex-row items-center space-x-2 p-2 rounded-md select-none hover:cursor-pointer hover:bg-[#f5f5f4] ease-linear duration-100"
                                        key={key + index}
                                        onClick={() => {
                                          setBaseBonusViewOption((prev) => ({
                                            ...prev,
                                            [key]: !baseBonusViewOption[key],
                                          }));
                                        }}
                                      >
                                        <Checkbox
                                          key={key + index}
                                          id={key + index}
                                          className="capitalize"
                                          checked={baseBonusViewOption[key]}
                                          onCheckedChange={(value) => {
                                            setBaseBonusViewOption((prev) => ({
                                              ...prev,
                                              [key]: !!value,
                                            }));
                                          }}
                                        ></Checkbox>
                                        <Label className="cursor-pointer">
                                          {key}
                                        </Label>
                                      </div>
                                    );
                                  }
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <div className="p-4 flex flex-row items-center justify-between bg-sky-100">
                          <div className="w-3/12 flex flex-row items-center justify-between gap-12">
                            <span className="font-semibold">Wage</span>
                          </div>
                          <div className="w-9/12 flex flex-row items-center justify-end text-right">
                            <div
                              className={cn(
                                "w-[200px] px-2 font-semibold",
                                baseBonusViewOption["Saturday"] === true
                                  ? "visile"
                                  : "hidden"
                              )}
                            >
                              Saturday
                            </div>
                            <div
                              className={cn(
                                "w-[200px] px-2 font-semibold",
                                baseBonusViewOption["Sunday"] === true
                                  ? "visile"
                                  : "hidden"
                              )}
                            >
                              Sunday
                            </div>
                            <div
                              className={cn(
                                "w-[200px] px-2 font-semibold",
                                baseBonusViewOption["Day off"] === true
                                  ? "visile"
                                  : "hidden"
                              )}
                            >
                              Day off
                            </div>
                            <div
                              className={cn(
                                "w-[200px] px-2 font-semibold",
                                baseBonusViewOption["Holiday"] === true
                                  ? "visile"
                                  : "hidden"
                              )}
                            >
                              Holiday
                            </div>
                          </div>
                        </div>
                        <Separator />
                        <div className="p-4 flex flex-row items-center justify-between">
                          <FormField
                            control={form.control}
                            name="baseSalary"
                            render={({ field }) => (
                              <FormItem>
                                <div className="w-3/12 flex flex-row items-center justify-between gap-12">
                                  <FormLabel>
                                    <span className="font-semibold">
                                      Default
                                    </span>
                                  </FormLabel>
                                  <FormControl>
                                    <div className="w-[250px] flex flex-row items-center gap-2 whitespace-nowrap">
                                      <Input
                                        defaultValue={field.value.value}
                                        className="w-[150px] text-right"
                                        onChange={(e) => {
                                          removeCharNotANum(e);
                                          form.setValue(
                                            "baseSalary.value",
                                            !Number.isNaN(
                                              Number.parseInt(e.target.value)
                                            )
                                              ? Number.parseInt(e.target.value)
                                              : 0
                                          );
                                        }}
                                      />
                                      <span>{`/ ${
                                        SalaryUnitTable[
                                          salarySetting.baseSalary.salaryType
                                        ]
                                      }`}</span>
                                    </div>
                                  </FormControl>
                                </div>
                              </FormItem>
                            )}
                          />
                          <div className="w-9/12 flex flex-row items-center justify-end">
                            <FormField
                              control={form.control}
                              name="baseBonus"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <div className="flex flex-row items-center">
                                      <CustomInput
                                        className={cn(
                                          baseBonusViewOption["Saturday"] ===
                                            true
                                            ? "visile"
                                            : "hidden"
                                        )}
                                        defaultValue={
                                          field.value.saturday.value
                                        }
                                        defaultUnit={field.value.saturday.unit}
                                        onValueChange={(val, unit) => {
                                          form.setValue(
                                            "baseBonus.saturday.value",
                                            val
                                          );
                                          form.setValue(
                                            "baseBonus.saturday.unit",
                                            unit
                                          );
                                        }}
                                      />
                                      <CustomInput
                                        className={cn(
                                          baseBonusViewOption["Sunday"] === true
                                            ? "visile"
                                            : "hidden"
                                        )}
                                        defaultValue={field.value.sunday.value}
                                        defaultUnit={field.value.sunday.unit}
                                        onValueChange={(val, unit) => {
                                          form.setValue(
                                            "baseBonus.sunday.value",
                                            val
                                          );
                                          form.setValue(
                                            "baseBonus.sunday.unit",
                                            unit
                                          );
                                        }}
                                      />
                                      <CustomInput
                                        className={cn(
                                          baseBonusViewOption["Day off"] ===
                                            true
                                            ? "visile"
                                            : "hidden"
                                        )}
                                        defaultValue={field.value.dayOff.value}
                                        defaultUnit={field.value.dayOff.unit}
                                        onValueChange={(val, unit) => {
                                          form.setValue(
                                            "baseBonus.dayOff.value",
                                            val
                                          );
                                          form.setValue(
                                            "baseBonus.dayOff.unit",
                                            unit
                                          );
                                        }}
                                      />
                                      <CustomInput
                                        className={cn(
                                          baseBonusViewOption["Holiday"] ===
                                            true
                                            ? "visile"
                                            : "hidden"
                                        )}
                                        defaultValue={field.value.holiday.value}
                                        defaultUnit={field.value.holiday.unit}
                                        onValueChange={(val, unit) => {
                                          form.setValue(
                                            "baseBonus.holiday.value",
                                            val
                                          );
                                          form.setValue(
                                            "baseBonus.holiday.unit",
                                            unit
                                          );
                                        }}
                                      />
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="w-full rounded shadow-[0px_5px_15px_rgba(0,0,0,.1)] overflow-hidden">
                        <div className="p-4 flex flex-row items-center justify-between gap-6">
                          <div className="min-w-[500px] flex flex-row items-center gap-2">
                            <span className="w-1/3 whitespace-nowrap font-semibold">
                              Overtime pay
                            </span>
                          </div>
                          <Switch
                            defaultChecked={false}
                            checked={overtimeBonusViewOption}
                            onCheckedChange={(val) =>
                              setOvertimeBonusViewOption(!!val)
                            }
                          />
                        </div>
                        <div
                          className={cn(
                            overtimeBonusViewOption === true
                              ? "visible"
                              : "hidden"
                          )}
                        >
                          <div
                            className={cn(
                              "p-4 flex flex-row items-center justify-between bg-sky-100"
                            )}
                          >
                            <div className="w-3/12 flex flex-row items-center justify-between gap-12">
                              <span className="font-semibold">Wage</span>
                            </div>
                            <div className="w-9/12 flex flex-row items-center justify-end text-right">
                              <span className="w-[200px] px-2 font-semibold">
                                Saturday
                              </span>
                              <span className="w-[200px] px-2 font-semibold">
                                Sunday
                              </span>
                              <span className="w-[200px] px-2 font-semibold">
                                Day off
                              </span>
                              <span className="w-[200px] px-2 font-semibold">
                                Holiday
                              </span>
                            </div>
                          </div>
                          <Separator />
                          <div className="p-4 flex flex-row items-center justify-between">
                            <div className="w-3/12 flex flex-row items-center justify-between gap-12">
                              <span className="font-semibold">Default</span>
                            </div>
                            <div className="w-9/12 flex flex-row items-center justify-end">
                              <FormField
                                control={form.control}
                                name="overtimeBonus"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <div className="flex flex-row items-center">
                                        <CustomInput
                                          defaultValue={
                                            field.value.saturday.value
                                          }
                                          defaultUnit={
                                            field.value.saturday.unit
                                          }
                                          onValueChange={(val, unit) => {
                                            form.setValue(
                                              "overtimeBonus.saturday.value",
                                              val
                                            );
                                            form.setValue(
                                              "overtimeBonus.saturday.unit",
                                              unit
                                            );
                                          }}
                                        />
                                        <CustomInput
                                          defaultValue={
                                            field.value.sunday.value
                                          }
                                          defaultUnit={field.value.sunday.unit}
                                          onValueChange={(val, unit) => {
                                            form.setValue(
                                              "overtimeBonus.sunday.value",
                                              val
                                            );
                                            form.setValue(
                                              "overtimeBonus.sunday.unit",
                                              unit
                                            );
                                          }}
                                        />
                                        <CustomInput
                                          defaultValue={
                                            field.value.dayOff.value
                                          }
                                          defaultUnit={field.value.dayOff.unit}
                                          onValueChange={(val, unit) => {
                                            form.setValue(
                                              "overtimeBonus.dayOff.value",
                                              val
                                            );
                                            form.setValue(
                                              "overtimeBonus.dayOff.unit",
                                              unit
                                            );
                                          }}
                                        />
                                        <CustomInput
                                          defaultValue={
                                            field.value.holiday.value
                                          }
                                          defaultUnit={field.value.holiday.unit}
                                          onValueChange={(val, unit) => {
                                            form.setValue(
                                              "overtimeBonus.holiday.value",
                                              val
                                            );
                                            form.setValue(
                                              "overtimeBonus.holiday.unit",
                                              unit
                                            );
                                          }}
                                        />
                                      </div>
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>

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
        </div>
      </DialogContent>
    </Dialog>
  );
}
