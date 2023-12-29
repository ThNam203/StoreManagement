"use client";

import { Staff } from "@/entities/Staff";
import { Row } from "@tanstack/react-table";
import { AddStaffDialog } from "../../../../../components/ui/staff/add_staff_dialog";

import { CustomDatatable } from "@/components/component/custom_datatable";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import LoadingCircle from "@/components/ui/loading_circle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RoleSettingDialog } from "@/components/ui/staff/role_setting_dialog";
import { useToast } from "@/components/ui/use-toast";
import { RoleSetting, defaultRoleSetting } from "@/entities/RoleSetting";
import { cn } from "@/lib/utils";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import { format } from "date-fns";
import { Check, Edit, Pen, PenLine, PlusCircle, Trash } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import {
  ConfirmDialogType,
  MyConfirmDialog,
} from "../../../../../components/ui/my_confirm_dialog";
import {
  userColumnTitles,
  userDefaultVisibilityState,
  userTableColumns,
} from "./table_columns";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { RoleList } from "@/components/ui/staff/role_setting_item";
import CustomCombobox from "@/components/component/CustomCombobox";
import { useAppSelector } from "@/hooks";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { addPosition, deletePosition } from "@/reducers/staffPositionReducer";
import StaffService from "@/services/staff_service";
import { AddPositionDialog } from "@/components/ui/staff/position_dialog";

export function DataTable({
  data,
  onSubmit,
  onStaffDeleteButtonClicked,
}: {
  data: Staff[];
  onSubmit: (values: Staff, avatar: File | null) => any;
  onStaffDeleteButtonClicked: (rowIndex: number) => void;
}) {
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [openStaffDialog, setOpenStaffDialog] = useState(false);
  const handleOpenStaffDialog = (staff: Staff | null) => {
    setSelectedStaff(staff ? staff : null);
    setOpenStaffDialog(true);
  };
  const handleSubmit = (values: Staff, avatar: File | null) => {
    if (onSubmit) {
      return onSubmit(values, avatar);
    }
  };

  const onStaffUpdateButtonClicked = (rowIndex: number) => {
    handleOpenStaffDialog(data[rowIndex]);
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-end py-4">
        <Button variant="green" onClick={() => handleOpenStaffDialog(null)}>
          Add new user
        </Button>
      </div>
      <CustomDatatable
        data={data}
        columns={userTableColumns()}
        columnTitles={userColumnTitles}
        infoTabs={[
          {
            render(row, setShowTabs) {
              return (
                <StaffInfoTab
                  row={row}
                  setShowTabs={setShowTabs}
                  onStaffUpdateButtonClicked={onStaffUpdateButtonClicked}
                  onStaffDeleteButtonClicked={onStaffDeleteButtonClicked}
                />
              );
            },
            tabName: "Infomation",
          },
          {
            render(row, setShowTabs) {
              return <RoleSettingTab row={row} setShowTabs={setShowTabs} />;
            },
            tabName: "Decentralization",
          },
        ]}
        config={{
          defaultVisibilityState: userDefaultVisibilityState,
        }}
      />
      <AddStaffDialog
        open={openStaffDialog}
        setOpen={setOpenStaffDialog}
        submit={handleSubmit}
        data={selectedStaff}
        title={selectedStaff ? "Update user" : "Add new user"}
      />
    </div>
  );
}

const StaffInfoTab = ({
  row,
  setShowTabs,
  onStaffUpdateButtonClicked,
  onStaffDeleteButtonClicked,
}: {
  row: Row<Staff>;
  setShowTabs: (value: boolean) => any;
  onStaffUpdateButtonClicked: (rowIndex: number) => any;
  onStaffDeleteButtonClicked: (rowIndex: number) => any;
}) => {
  const { toast } = useToast();
  const staff = row.original;
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [contentConfirmDialog, setContentConfirmDialog] = useState({
    title: "",
    content: "",
    type: "warning" as ConfirmDialogType,
  });
  const [isRemoving, setIsRemoving] = useState(false);
  const handleRemoveStaff = async () => {
    setIsRemoving(true);
    try {
      await onStaffDeleteButtonClicked(row.index);
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject(e);
    } finally {
      setIsRemoving(false);
    }
  };
  return (
    <div className="flex h-[300px] flex-col gap-4 px-4 py-4">
      <div className="flex flex-row">
        <div className="flex max-h-[350px] max-w-[200px] shrink-[5] grow-[5] flex-col">
          <AspectRatio
            className={cn(
              "h-[200px] w-[150px] rounded-sm",
              staff.avatar !== null && staff.avatar !== ""
                ? "border-2 border-black"
                : "",
            )}
            ratio={1 / 1}
          >
            <Image
              width={0}
              height={0}
              sizes="100vw"
              alt={`${staff.name} avatar`}
              src={
                staff.avatar !== null && staff.avatar !== ""
                  ? staff.avatar
                  : "/default-user-avatar.png"
              }
              className="h-full w-full rounded-sm border"
            />
          </AspectRatio>
        </div>
        <div className="flex shrink-[5] grow-[5] flex-row gap-2 text-[0.8rem]">
          <div className="flex flex-1 flex-col">
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[100px] font-normal">Staff ID:</p>
              <p>{staff.id}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[100px] font-normal">Staff name:</p>
              <p>{staff.name}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[100px] font-normal">Birthday:</p>
              <p>{format(staff.birthday, "dd/MM/yyyy")}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[100px] font-normal">Sex:</p>
              <p>{staff.sex}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[100px] font-normal">CCCD:</p>
              <p>{staff.cccd}</p>
            </div>
          </div>
          <div className="flex flex-1 flex-col">
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[100px] font-normal">Position:</p>
              <p>{staff.position}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[100px] font-normal">Phone number:</p>
              <p>{staff.phoneNumber}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[100px] font-normal">Email:</p>
              <p>{staff.email}</p>
            </div>
            <div className="mb-2 flex flex-row border-b font-medium">
              <p className="w-[100px] font-normal">Address:</p>
              <p>{staff.address}</p>
            </div>
            <div>
              <p className="mb-2">Note: </p>
              <textarea
                readOnly
                disabled
                className={cn("h-[80px] w-full resize-none border-2 p-1")}
                defaultValue={staff.note}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <div className="flex-1" />
        <Button
          variant={"green"}
          onClick={(e) => onStaffUpdateButtonClicked(row.index)}
        >
          <PenLine size={16} fill="white" className="mr-2" />
          Update
        </Button>
        <Button
          variant={"red"}
          onClick={() => {
            setContentConfirmDialog({
              title: "Remove staff",
              content: `All data of this staff will be removed. Are you sure you want to remove staff named '${staff.name}' ?`,
              type: "warning",
            });
            setOpenConfirmDialog(true);
          }}
        >
          <Trash size={16} className="mr-2" />
          Remove
          {isRemoving && <LoadingCircle></LoadingCircle>}
        </Button>
      </div>
      <MyConfirmDialog
        open={openConfirmDialog}
        setOpen={setOpenConfirmDialog}
        title={contentConfirmDialog.title}
        content={contentConfirmDialog.content}
        type={contentConfirmDialog.type}
        onAccept={() => {
          setOpenConfirmDialog(false);
          handleRemoveStaff();
        }}
        onCancel={() => setOpenConfirmDialog(false)}
      />
    </div>
  );
};

const schema = z.object({
  position: z.string().min(1, { message: "Position is missing" }),
});

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

const RoleSettingTab = ({
  row,
  setShowTabs,
  roleSetting,
}: {
  row: Row<Staff>;
  roleSetting?: RoleSetting;
  setShowTabs: (value: boolean) => any;
}) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const staff = row.original;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      position: staff.position,
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true);
    try {
      await updateRoleSetting(values.position, _roleSetting).then(() => {
        setIsLoading(false);
      });
    } catch (e) {
      axiosUIErrorHandler(e, toast);
    } finally {
      setIsLoading(false);
    }
  };
  const rawPositionList = useAppSelector((state) => state.staffPositions.value);
  const positionList = rawPositionList.map((position) => position.name);

  const positionInputRef = useRef<HTMLInputElement>(null);
  const [isAddingNewPosition, setIsAddingNewPosition] = useState(false);
  const [openAddPositionDialog, setOpenAddPositionDialog] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [contentConfirmDialog, setContentConfirmDialog] = useState({
    title: "",
    content: "",
    type: "warning" as ConfirmDialogType,
  });
  const [isRemoving, setIsRemoving] = useState(false);
  const [selectedData, setSelectedData] = useState<RoleSetting | null>(null);
  const [openRoleSettingDialog, setOpenRoleSettingDialog] = useState(false);
  const [_roleSetting, setRoleSetting] = useState<RoleSetting>(
    roleSetting ? roleSetting : defaultRoleSetting,
  );

  const handleRoleSettingChange = (value: RoleSetting) => {
    setRoleSetting(value);
  };
  const handleOpenRoleSettingDialog = (roleSetting: RoleSetting | null) => {
    setSelectedData(roleSetting);
    setOpenRoleSettingDialog(true);
  };

  const handleRoleSettingSubmit = async (values: RoleSetting) => {};

  const updateRoleSetting = async (position: string, value: RoleSetting) => {
    try {
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject(e);
    }
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

  const removePosition = async (name: string) => {
    try {
      const id: number = rawPositionList.find((pos) => pos.name === name)?.id;
      const res = await StaffService.deletePosition(id);
      console.log(res.data);
      dispatch(deletePosition(id));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject(e);
    }
  };

  const handleAddingNewPosition = async (newPosition: string) => {
    if (newPosition === "") {
      toast({
        variant: "destructive",
        description: "Please enter position name",
      });
      return;
    }
    if (positionList.includes(newPosition)) {
      toast({
        variant: "destructive",
        description: "Position existed",
      });
      return;
    }
    return addNewPosition(newPosition).then(() => {
      form.setValue("position", newPosition);
      setOpenAddPositionDialog(false);
    });
  };

  const handleRemovePosition = (position: string) => {
    return removePosition(position);
  };

  const endIconsPositionCombobox: JSX.Element[] = [
    <div key={1} className="flex flex-row items-center gap-2">
      <PlusCircle
        className="h-4 w-4 opacity-50 hover:cursor-pointer hover:opacity-100"
        onClick={() => setOpenAddPositionDialog(true)}
      />
      <Pen
        className="h-4 w-4 opacity-50 hover:cursor-pointer hover:opacity-100"
        onClick={() => setOpenRoleSettingDialog(true)}
      />
    </div>,
  ];
  return (
    <div className="flex flex-col justify-between gap-4 px-4 pt-4">
      <div className="w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 text-sm"
          >
            <ScrollArea className="h-[500px] min-w-[600px]">
              <div className="flex w-full flex-col gap-4">
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem className="flex w-[350px] flex-row items-center gap-2">
                      <FormLabel className="w-[100px]">
                        <p className="text-sm">Role</p>
                      </FormLabel>
                      <FormControl className="flex-1">
                        <CustomCombobox<string>
                          placeholder="Select role"
                          searchPlaceholder={"Find role..."}
                          value={field.value}
                          choices={positionList}
                          valueView={OptionView}
                          itemSearchView={(choice) =>
                            OptionSearchView(choice, field.value)
                          }
                          onItemClick={(val) => form.setValue("position", val)}
                          endIcons={endIconsPositionCombobox}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-3 gap-4">
                  {
                    <RoleList
                      roleSetting={_roleSetting}
                      onChange={handleRoleSettingChange}
                    />
                  }
                </div>
              </div>
            </ScrollArea>
          </form>
        </Form>
      </div>
      <div className="flex flex-row items-center gap-2">
        <div className="flex-1" />
        <Button variant={"green"}>
          <PenLine size={16} fill="white" className="mr-2" />
          Update
          {isRemoving && <LoadingCircle></LoadingCircle>}
        </Button>
        <Button
          variant={"red"}
          onClick={() => {
            setContentConfirmDialog({
              title: "Remove staff",
              content: `All data of this staff will be removed. Are you sure you want to remove staff named '${staff.name}' ?`,
              type: "warning",
            });
            setOpenConfirmDialog(true);
          }}
        >
          <Trash size={16} className="mr-2" />
          Remove
        </Button>
      </div>
      <MyConfirmDialog
        open={openConfirmDialog}
        setOpen={setOpenConfirmDialog}
        title={contentConfirmDialog.title}
        content={contentConfirmDialog.content}
        type={contentConfirmDialog.type}
        onAccept={() => {
          setOpenConfirmDialog(false);
          //function here
        }}
        onCancel={() => setOpenConfirmDialog(false)}
      />
      <RoleSettingDialog
        open={openRoleSettingDialog}
        setOpen={setOpenRoleSettingDialog}
        roleSetting={selectedData}
        staff={staff}
        title="Edit role"
        submit={handleRoleSettingSubmit}
      />
      <AddPositionDialog
        data={null}
        open={openAddPositionDialog}
        setOpen={setOpenAddPositionDialog}
        title="Add new role"
        submit={handleAddingNewPosition}
      />
    </div>
  );
};
