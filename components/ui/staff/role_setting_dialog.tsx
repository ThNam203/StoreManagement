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
import { Role, RoleSetting, defaultRoleSetting } from "@/entities/RoleSetting";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import { zodErrorHandler } from "@/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RoleList } from "./role_setting_item";

const schema = z.object({
  role: z.string(),
});

export function RoleSettingDialog({
  open,
  setOpen,
  role,
  submit,
  title,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  role: Role;
  submit?: (role: Role) => any;
  title: string;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: undefined,
    },
  });
  const onSubmit = async (values: z.infer<typeof schema>) => {
    const roleToSubmit: Role = {
      positionId: role.positionId,
      positionName: values.role,
      roleSetting: _roleSetting,
    };
    if (submit) {
      setIsLoading(true);
      try {
        await submit(roleToSubmit).then(() => {
          handleCancelDialog();
          toast({
            variant: "default",
            title: "Add new role successfully",
          });
        });
      } catch (e) {
        axiosUIErrorHandler(e, toast, router);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [_roleSetting, setRoleSetting] =
    useState<RoleSetting>(defaultRoleSetting);

  useEffect(() => {
    if (open) resetValues(role);
  }, [open]);

  const resetValues = (role: Role) => {
    resetToEmptyForm();
    setIsLoading(false);
    if (role.positionId !== -1) {
      setRoleSetting(role.roleSetting);
      form.setValue("role", role.positionName);
    }
  };

  const resetToEmptyForm = () => {
    form.reset();
    setRoleSetting(defaultRoleSetting);
  };

  function handleCancelDialog() {
    setOpen(false);
    resetToEmptyForm();
  }

  const handleRoleSettingChange = (value: RoleSetting) => {
    setRoleSetting(value);
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
                    name="role"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2 space-y-0">
                        <FormLabel className="w-[100px]">
                          <p className="text-sm">Role</p>
                        </FormLabel>
                        <FormControl className="w-[full]">
                          <Input
                            defaultValue={field.value}
                            onChange={(e) => {
                              form.setValue("role", e.target.value);
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-3 gap-2 max-sm:grid-cols-2">
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
                  type="submit"
                  onClick={() => {
                    try {
                      schema.parse(form.getValues());
                    } catch (e) {
                      zodErrorHandler(e, toast);
                    }
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
      </DialogContent>
    </Dialog>
  );
}
