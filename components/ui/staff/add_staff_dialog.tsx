"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CustomCombobox from "@/components/component/CustomCombobox";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, PasswordInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingCircle from "@/components/ui/loading_circle";
import { MyCombobox } from "@/components/ui/my_combobox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  SalarySetting,
  SalaryType,
  SalaryUnitTable,
} from "@/entities/SalarySetting";
import { Sex, Staff } from "@/entities/Staff";
import { useAppSelector } from "@/hooks";
import { cn } from "@/lib/utils";
import { addPosition } from "@/reducers/staffPositionReducer";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import StaffService from "@/services/staff_service";
import { formatNumberInput, removeCharNotANum, zodErrorHandler } from "@/utils";
import { format } from "date-fns";
import { Check, CircleDollarSign, Info, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { ChooseImageButton } from "./choose_image";
import { AddPositionDialog } from "./position_dialog";

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

const createSchema = z.object({
  avatar: z.string().optional(),
  name: z.string().min(1, { message: "Name is missing" }),
  birthday: z.string(),
  sex: z.string(),
  cccd: z.string().min(1, { message: "CCCD is missing" }),
  position: z.string().min(1, { message: "Position is missing" }),
  phoneNumber: z.string().min(1, { message: "Phone number is missing" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  address: z.string().optional(),
  note: z.string().optional(),
  salary: z.number().min(0, { message: "Salary must be greater than 0" }),
  salaryType: z.nativeEnum(SalaryType),
});
const updateSchema = z.object({
  avatar: z.string().optional(),
  name: z.string().min(1, { message: "Name is missing" }),
  birthday: z.string(),
  sex: z.string(),
  cccd: z.string().min(1, { message: "CCCD is missing" }),
  position: z.string().min(1, { message: "Position is missing" }),
  phoneNumber: z.string().min(1, { message: "Phone number is missing" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().nullable(),
  address: z.string().optional(),
  note: z.string().optional(),
  salary: z.number().min(0, { message: "Salary must be greater than 0" }),
  salaryType: z.nativeEnum(SalaryType),
});
export type DisableField = "email" | "password" | "position";
export type HiddenField =
  | "salary"
  | "password"
  | "note"
  | "cccd"
  | "phoneNumber"
  | "email";

export function AddStaffDialog({
  open,
  setOpen,
  data,
  submit,
  title,
  disableFields = [],
  hiddenFields = [],
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: Staff | null;
  submit: (values: Staff, avatar: File | null) => any;
  title: string;
  disableFields?: DisableField[];
  hiddenFields?: HiddenField[];
}) {
  const form = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(data ? updateSchema : createSchema),
    defaultValues: {
      avatar: undefined,
      birthday: undefined,
      sex: Sex.MALE,
      salary: undefined,
      salaryType: SalaryType.ByShift,
      password: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof createSchema>) => {
    const newStaff: Staff = {
      avatar: values.avatar ? values.avatar : "",
      id: data ? data.id : -1,
      name: values.name,
      phoneNumber: values.phoneNumber,
      cccd: values.cccd,
      salaryDebt: 0,
      note: values.note ? values.note : "",
      birthday: convertStringToDate(values.birthday),
      sex: values.sex as Sex,
      email: values.email,
      password: values.password === "" ? null : values.password,
      address: values.address ? values.address : "",
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
          toast({
            variant: "default",
            title: "Add staff successfully",
          });
        });
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const { toast } = useToast();
  const dispatch = useDispatch();
  const roleList = useAppSelector((state) => state.role.value);
  const roleNames = roleList.map((role) => role.positionName);
  console.log("roleNames", roleNames);
  const [openAddPositionDialog, setOpenAddPositionDialog] = useState(false);
  const [salarySetting, setSalarySetting] = useState<SalarySetting>({
    salary: 0,
    salaryType: SalaryType.ByShift,
  });
  const [staffAvatar, setStaffAvatar] = useState<File | null>(null);
  const [isAddingNewPosition, setIsAddingNewPosition] = useState(false);
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
      form.setValue("avatar", staff.avatar ? staff.avatar : "");
      form.setValue("name", staff.name);
      form.setValue("birthday", convertDateToString(staff.birthday));
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

  const addNewPosition = async (name: string) => {
    setIsAddingNewPosition(true);
    try {
      const newPosition = { name: name };
      const res = await StaffService.createNewPosition(newPosition);
      console.log(res.data);
      dispatch(addPosition(res.data));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject(e);
    } finally {
      setIsAddingNewPosition(false);
    }
  };

  const handleAddingNewPosition = (newPosition: string) => {
    if (newPosition === "") {
      toast({
        variant: "destructive",
        description: "Please enter position name",
      });
      return;
    }
    if (roleNames.includes(newPosition)) {
      toast({
        variant: "destructive",
        description: "Position existed",
      });
      return;
    }
    return addNewPosition(newPosition).then(() => {
      form.setValue("position", newPosition);
      setOpenAddPositionDialog(false);
      toast({
        variant: "default",
        title: "Add new position successfully",
        description:
          "Please go to role setting page to set role for new position",
      });
    });
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

  const convertDateToString = (date: Date) => {
    const formated = format(date, "yyyy-MM-dd");
    return formated;
  };

  const convertStringToDate = (date: string) => {
    const split = date.split("-");
    const formated = new Date(
      Number(split[0]),
      Number(split[1]) - 1,
      Number(split[2]),
    );
    return formated;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 text-sm"
            >
              <Tabs defaultValue="infomation">
                <TabsList className="flex w-full flex-row items-center justify-start">
                  <TabsTrigger value="infomation">Infomation</TabsTrigger>
                  <TabsTrigger
                    value="salary-setting"
                    className={cn(
                      hiddenFields.includes("salary") ? "hidden" : "",
                    )}
                  >
                    Salary setting
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="infomation"
                  className="h-[350px] min-w-[1200px] pt-2"
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
                                  fileUrl={field.value ? field.value : ""}
                                  onImageChanged={onImageChange}
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="ml-4 flex w-[450px] flex-col">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <div className="flex flex-row items-center">
                              <FormLabel className="w-1/3">
                                <h5 className="text-sm">Name</h5>
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
                                <h5 className="text-sm">Birthday</h5>
                              </FormLabel>

                              <FormControl className="w-2/3">
                                <Input type="date" {...field} />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sex"
                        render={({ field }) => (
                          <FormItem className="mb-2 mt-6">
                            <div className="flex flex-row items-center">
                              <FormLabel className="w-1/3">
                                <h5 className="text-sm">Sex</h5>
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
                                <h5 className="text-sm">CCCD</h5>
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
                        disabled={disableFields.includes("position")}
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <div className="flex flex-row items-center">
                              <FormLabel className="w-1/3">
                                <h5 className="text-sm">Position</h5>
                              </FormLabel>
                              <FormControl className="flex-1">
                                <CustomCombobox<string>
                                  placeholder="Select position"
                                  searchPlaceholder={"Find position..."}
                                  value={field.value}
                                  choices={roleNames}
                                  valueView={OptionView}
                                  itemSearchView={(choice) =>
                                    OptionSearchView(choice, field.value)
                                  }
                                  onItemClick={(val) =>
                                    form.setValue("position", val)
                                  }
                                  endIcon={
                                    <PlusCircle
                                      className="h-4 w-4 opacity-50 hover:cursor-pointer hover:opacity-100"
                                      onClick={() =>
                                        setOpenAddPositionDialog(true)
                                      }
                                    />
                                  }
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="ml-4 flex w-[450px] flex-col">
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <div className="flex flex-row items-center">
                              <FormLabel className="w-1/3">
                                <h5 className="text-sm">Phone number</h5>
                              </FormLabel>

                              <FormControl>
                                <Input
                                  {...field}
                                  maxLength={10}
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
                        disabled={disableFields.includes("email")}
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <div className="flex flex-row items-center">
                              <FormLabel className="w-1/3">
                                <h5 className="text-sm">Email</h5>
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
                        disabled={disableFields.includes("password")}
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <div className="flex flex-row items-center">
                              <FormLabel className="w-1/3">
                                <h5 className="text-sm">
                                  {data ? "Update password" : "Password"}
                                </h5>
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
                                <h5 className="text-sm">Address</h5>
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
                                <h5 className="text-sm">Note</h5>
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
                  className="h-[350px] min-w-[1200px] pt-2"
                >
                  <ScrollArea className="h-full pr-4">
                    <div className="flex flex-col gap-6">
                      <div className="w-full overflow-hidden rounded shadow-[0px_5px_15px_rgba(0,0,0,.1)]">
                        <div className="flex flex-row items-center p-4">
                          <CircleDollarSign className="mr-2 h-4 w-4 text-yellow-500" />
                          <span className="font-semibold">Staff salary</span>
                        </div>
                        <Separator />
                        <div className="flex flex-row items-center justify-between">
                          <div className="flex flex-row items-center justify-between p-4">
                            <span className="w-[100px] whitespace-nowrap font-semibold">
                              Salary type
                            </span>
                            <FormField
                              control={form.control}
                              name="salaryType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <div className="flex min-w-[400px] flex-row items-center gap-2">
                                      <MyCombobox
                                        className="w-full"
                                        defaultValue={field.value}
                                        choices={Object.values(SalaryType)}
                                        onValueChange={(val) => {
                                          form.setValue(
                                            "salaryType",
                                            val as SalaryType,
                                          );
                                          onSalaryTypeChange(val);
                                        }}
                                      />
                                      <Info className="h-6 w-6" />
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="flex flex-row items-center justify-between p-4">
                            <FormField
                              control={form.control}
                              name="salary"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex flex-row items-center justify-between gap-10">
                                    <FormLabel className="flex flex-col items-start">
                                      <span className="w-[100px] whitespace-nowrap font-semibold">
                                        Default
                                      </span>
                                    </FormLabel>
                                    <FormControl>
                                      <div className="flex w-[250px] flex-row items-center gap-2 whitespace-nowrap">
                                        <Input
                                          defaultValue={field.value}
                                          className="w-[150px] text-right"
                                          placeholder="0"
                                          onChange={(e) => {
                                            form.setValue(
                                              "salary",
                                              formatNumberInput(e),
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
                    try {
                      if (data) {
                        console.log(updateSchema.parse(form.getValues()));
                      } else {
                        console.log(createSchema.parse(form.getValues()));
                      }
                    } catch (e) {
                      zodErrorHandler(e, toast);
                    }
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
        <AddPositionDialog
          open={openAddPositionDialog}
          setOpen={setOpenAddPositionDialog}
          data={null}
          submit={handleAddingNewPosition}
          title="Add new position"
        />
      </DialogContent>
    </Dialog>
  );
}
