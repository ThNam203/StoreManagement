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
import { ViolationAndReward } from "@/entities/Attendance";
import { formatNumberInput } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string(),
  defaultValue: z.number(),
});

export const AddNewViolationOrRewardDailog = ({
  open,
  setOpen,
  data,
  submit,
  type,
}: {
  data: ViolationAndReward | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  submit?: (value: ViolationAndReward) => any;
  type: "Bonus" | "Punish";
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: undefined,
      defaultValue: undefined,
    },
  });
  const resetValues = (data: ViolationAndReward | null) => {
    if (data) {
      form.setValue("name", data.name);
      form.setValue("defaultValue", data.defaultValue);
    } else resetToEmptyForm();
  };

  const resetToEmptyForm = () => {
    form.reset();
  };

  useEffect(() => {
    if (open) resetValues(data);
  }, [open]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newItem: ViolationAndReward = {
      id: -1,
      name: values.name,
      defaultValue: values.defaultValue,
      type: type,
    };

    if (submit) {
      try {
        await submit(newItem);
      } catch (error) {
        console.log(error);
      } finally {
        setOpen(false);
        resetToEmptyForm();
      }
    }
  };

  const handleCancelDialog = () => {
    setOpen(false);
    resetToEmptyForm();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="flex min-w-[400px] flex-col justify-between"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            Add a new type of {type === "Bonus" ? "reward" : "violation"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex w-full flex-row items-center">
                      <FormLabel className="w-[100px]">Type</FormLabel>

                      <FormControl className="flex-1">
                        <Input
                          defaultValue={field.value}
                          onChange={(val) => {
                            form.setValue("name", val.target.value);
                          }}
                          className="w-full"
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="defaultValue"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <div className="flex flex-row items-center">
                      <FormLabel className="w-[100px]">Default value</FormLabel>

                      <FormControl className="flex-1">
                        <Input
                          placeholder="0"
                          defaultValue={field.value}
                          onChange={(e: any) => {
                            form.setValue("defaultValue", formatNumberInput(e));
                          }}
                          className="text-right"
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button variant={"green"} type="submit">
                  Save
                </Button>
                <Button
                  variant={"outline"}
                  type="button"
                  onClick={() => handleCancelDialog()}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
