"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingCircle from "@/components/ui/loading_circle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { RoleSetting, defaultRoleSetting } from "@/entities/RoleSetting";
import { Staff } from "@/entities/Staff";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { RoleList } from "./role_setting_item";
import { Trash } from "lucide-react";
import { ConfirmDialogType, MyConfirmDialog } from "../my_confirm_dialog";
import { useAppSelector } from "@/hooks";
import StaffService from "@/services/staff_service";
import { deletePosition } from "@/reducers/staffPositionReducer";

const schema = z.object({
  position: z.string().min(1, { message: "Position is missing" }),
});

export function RoleSettingDialog({
  open,
  setOpen,
  roleSetting,
  staff,
  submit,
  title,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  roleSetting: RoleSetting | null;
  staff: Staff;
  submit?: (roleSetting: RoleSetting) => any;
  title: string;
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      position: undefined,
    },
  });
  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (submit) {
      setIsLoading(true);
      try {
        await submit(_roleSetting).then(() => {
          handleCancelDialog();
        });
      } catch (e) {
        axiosUIErrorHandler(e, toast);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const rawPositionList = useAppSelector((state) => state.staffPositions.value);
  const [_roleSetting, setRoleSetting] =
    useState<RoleSetting>(defaultRoleSetting);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [contentConfirmDialog, setContentConfirmDialog] = useState({
    title: "",
    content: "",
    type: "warning" as ConfirmDialogType,
  });

  useEffect(() => {
    if (open) resetValues(roleSetting);
  }, [open]);

  const resetValues = (roleSetting: RoleSetting | null) => {
    resetToEmptyForm();
    setIsLoading(false);
    if (roleSetting) {
      setRoleSetting(roleSetting);
    }
    form.setValue("position", staff.position);
  };

  const resetToEmptyForm = () => {
    form.reset();
    setRoleSetting(defaultRoleSetting);
  };

  function handleCancelDialog() {
    setOpen(false);
    form.reset();
  }

  const handleRoleSettingChange = (value: RoleSetting) => {
    setRoleSetting(value);
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
              <ScrollArea className="h-[500px] min-w-[600px]">
                <div className="mt-2 flex w-full flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2 space-y-0">
                        <FormLabel className="w-[100px]">
                          <p className="text-sm">Role</p>
                        </FormLabel>
                        <FormControl className="w-[full]">
                          <Input
                            defaultValue={field.value}
                            onChange={(e) => {
                              form.setValue("position", e.target.value);
                            }}
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

              <div className="flex flex-row justify-end gap-2">
                <Button
                  variant={"red"}
                  type="button"
                  onClick={() => {
                    setContentConfirmDialog({
                      title: "Remove staff",
                      content: `Are you sure you want to remove this role ?`,
                      type: "warning",
                    });
                    setOpenConfirmDialog(true);
                  }}
                >
                  <Trash size={16} className="mr-2" />
                  Remove
                  {isRemoving && <LoadingCircle></LoadingCircle>}
                </Button>
                <Button
                  type="submit"
                  onClick={() => {
                    form.handleSubmit(onSubmit);
                  }}
                  variant={"green"}
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
        <MyConfirmDialog
          open={openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          title={contentConfirmDialog.title}
          content={contentConfirmDialog.content}
          type={contentConfirmDialog.type}
          onAccept={async () => {
            try {
              setIsRemoving(true);
              await removePosition(staff.position).then(() => {
                handleCancelDialog();
              });
            } catch (e) {
              axiosUIErrorHandler(e, toast);
            } finally {
              setOpenConfirmDialog(false);
              setIsRemoving(false);
            }
          }}
          onCancel={() => setOpenConfirmDialog(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
