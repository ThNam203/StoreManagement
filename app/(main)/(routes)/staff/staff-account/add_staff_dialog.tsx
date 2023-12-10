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
import { DatePicker } from "@/components/ui/datepicker";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  SalarySetting,
  SalaryType,
  SalaryUnitTable,
} from "@/entities/SalarySetting";
import { Sex, Staff } from "@/entities/Staff";
import { removeCharNotANum } from "@/utils";
import { CircleDollarSign, Info, PlusCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ChooseImageButton } from "./choose_image";
import { fi } from "date-fns/locale";
import LoadingCircle from "@/components/ui/loading_circle";

const createSchema = z.object({
  avatar: z.string(),
  name: z.string().min(1, { message: "Name must be at least one character" }),
  birthday: z.date(),
  sex: z.string(),
  cccd: z.string().min(1, { message: "CCCD is empty" }),
  position: z.string().min(1, { message: "Position is empty" }),
  phoneNumber: z.string().min(1, { message: "Phone number is empty" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  address: z.string().min(1, { message: "Address is empty" }),
  note: z.string().optional(),
  salary: z.number(),
  salaryType: z.nativeEnum(SalaryType),
});
const updateSchema = z.object({
  avatar: z.string(),
  name: z.string().min(1, { message: "Name must be at least one character" }),
  birthday: z.date(),
  sex: z.string(),
  cccd: z.string().min(1, { message: "CCCD is empty" }),
  position: z.string().min(1, { message: "Position is empty" }),
  phoneNumber: z.string().min(1, { message: "Phone number is empty" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .optional(),
  address: z.string().min(1, { message: "Address is empty" }),
  note: z.string().optional(),
  salary: z.number(),
  salaryType: z.nativeEnum(SalaryType),
});

export function AddStaffDialog({
  open,
  setOpen,
  data,
  submit,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: Staff | null;
  submit: (values: Staff, avatar: File | null) => any;
}) {
  const form = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(data ? updateSchema : createSchema),
    defaultValues: {
      avatar: undefined,
      birthday: new Date(),
      sex: Sex.MALE,
      salary: undefined,
      salaryType: SalaryType.ByShift,
    },
  });

  const onSubmit = async (values: z.infer<typeof createSchema>) => {
    const newStaff: Staff = {
      avatar: values.avatar,
      id: data ? data.id : -1,
      name: values.name,
      phoneNumber: values.phoneNumber,
      cccd: values.cccd,
      salaryDebt: 0,
      note: "",
      birthday: new Date(values.birthday),
      sex: values.sex as Sex,
      email: values.email,
      password: values.password,
      address: values.address,
      position: values.position,
      createAt: new Date(),
      role: "STAFF",
      salarySetting: {
        salary: values.salary,
        salaryType: SalaryType.ByShift,
      },
    };

    if (submit) {
      setIsLoading(true);
      try {
        await submit(newStaff, staffAvatar).then(() => {
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
  const [positionList, setPositionList] = useState([
    "Cashier",
    "Safe Guard",
    "Manager",
    "Cleaner",
  ]);
  const positionInputRef = useRef<HTMLInputElement>(null);
  const [openAddPositionDialog, setOpenAddPositionDialog] = useState(false);
  const [salarySetting, setSalarySetting] = useState<SalarySetting>({
    salary: 0,
    salaryType: SalaryType.ByShift,
  });
  const [staffAvatar, setStaffAvatar] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleCancelDialog() {
    setOpen(false);
    form.reset();
  }

  useEffect(() => {
    if (open) resetValues(data);
  }, [open]);

  const resetValues = (staff: Staff | null) => {
    setIsLoading(false);
    if (staff) {
      form.setValue("avatar", staff.avatar);
      form.setValue("name", staff.name);
      form.setValue("birthday", staff.birthday);
      form.setValue("sex", staff.sex);
      form.setValue("cccd", staff.cccd);
      form.setValue("position", staff.position);
      form.setValue("phoneNumber", staff.phoneNumber);
      form.setValue("email", staff.email);
      form.setValue("address", staff.address);
      form.setValue("note", staff.note);
      form.setValue("salary", staff.salarySetting.salary);
      form.setValue("salaryType", staff.salarySetting.salaryType);
    } else resetToEmptyForm();
    setSalarySetting({
      salary: form.getValues("salary"),
      salaryType: form.getValues("salaryType"),
    });
  };

  const resetToEmptyForm = () => {
    form.reset();
    setStaffAvatar(null);
  };

  const handleAddingNewPosition = () => {
    if (!positionInputRef.current) return;
    if (positionList.includes(positionInputRef.current?.value)) return;
    setPositionList((prev) => [...prev, positionInputRef.current?.value!]);
    setOpenAddPositionDialog(false);
  };

  const onSalaryTypeChange = (value: string) => {
    setSalarySetting((prev) => ({
      ...prev,
      salaryType: value as SalaryType,
    }));
  };

  const onImageChange = (image: File | null) => {
    form.setValue("avatar", image ? URL.createObjectURL(image) : "");
    setStaffAvatar(image);
  };

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
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{data ? "Update staff" : "Add new staff"}</DialogTitle>
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
                      <FormField
                        control={form.control}
                        name="avatar"
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <div className="">
                              <FormControl className="w-2/3">
                                <ChooseImageButton
                                  fileUrl={field.value}
                                  onImageChanged={onImageChange}
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
                        name="cccd"
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
                    </div>
                    <div className="flex flex-col ml-4 w-[450px]">
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
                                  type="tel"
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
                                  <h5 className="text-sm">
                                    {data ? "Update password" : "Password"}
                                  </h5>
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
                      <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <div className="flex flex-row items-center">
                              <FormLabel className="w-1/3">
                                <div className="flex flex-row items-center space-x-2">
                                  <h5 className="text-sm">Note</h5>
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
                        <div className="flex flex-row items-center justify-between">
                          <div className="p-4 flex flex-row items-center justify-between">
                            <span className="w-[100px] whitespace-nowrap font-semibold">
                              Salary type
                            </span>
                            <FormField
                              control={form.control}
                              name="salaryType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <div className="min-w-[400px] flex flex-row items-center gap-2">
                                      <MyCombobox
                                        className="w-full"
                                        defaultValue={field.value}
                                        choices={Object.values(SalaryType)}
                                        onValueChange={(val) => {
                                          form.setValue(
                                            "salaryType",
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
                          </div>
                          <div className="p-4 flex flex-row items-center justify-between">
                            <FormField
                              control={form.control}
                              name="salary"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex flex-row items-center justify-between gap-10">
                                    <FormLabel>
                                      <span className="w-[100px] whitespace-nowrap font-semibold">
                                        Default
                                      </span>
                                    </FormLabel>
                                    <FormControl>
                                      <div className="w-[250px] flex flex-row items-center gap-2 whitespace-nowrap">
                                        <Input
                                          defaultValue={field.value}
                                          className="w-[150px] text-right"
                                          placeholder="0"
                                          onChange={(e) => {
                                            removeCharNotANum(e);
                                            form.setValue(
                                              "salary",
                                              !Number.isNaN(
                                                Number.parseInt(e.target.value)
                                              )
                                                ? Number.parseInt(
                                                    e.target.value
                                                  )
                                                : 0
                                            );
                                          }}
                                        />
                                        <span>{`/ ${
                                          SalaryUnitTable[
                                            salarySetting.salaryType
                                          ]
                                        }`}</span>
                                      </div>
                                    </FormControl>
                                  </div>
                                </FormItem>
                              )}
                            />
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
