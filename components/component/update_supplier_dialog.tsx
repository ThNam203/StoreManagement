import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import LoadingCircle from "../ui/loading_circle";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import scrollbar_style from "@/styles/scrollbar.module.css";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import SearchAndChooseButton from "../ui/catalog/search_filter";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import { useToast } from "../ui/use-toast";
import AddNewThing from "../ui/add_new_thing_dialog";
import SupplierService from "@/services/supplierService";
import { addSupplierGroup } from "@/reducers/supplierGroupsReducer";
import { addSupplier, updateSupplier } from "@/reducers/suppliersReducer";
import { Supplier } from "@/entities/Supplier";
import { useRouter } from "next/navigation";

const updateSupplierFormSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .trim()
    .min(1, { message: "Missing name!" })
    .max(100, { message: "Supplier name must be at most 100 characters!" }),
  email: z
    .string()
    .trim()
    .max(100, { message: "Email must be at most 100 characters!" })
    .email({ message: "Email not valid!" })
    .or(z.literal("")),
  phoneNumber: z
    .string({ required_error: "Phone number is missing" })
    .trim()
    .min(1, { message: "Missing group!" })
    .max(10, { message: "Phone number must be at most 10 characters!" }),
  address: z
    .string()
    .trim()
    .max(100, { message: "Address must be at most 100 characters!" })
    .optional(),
  status: z.enum(["Active", "Disabled"]),
  description: z.string(),
  companyName: z.string(),
  supplierGroupName: z.string().min(1, "Missing group!").nullable(),
});

export default function UpdateSupplierDialog({
  DialogTrigger,
  triggerClassname,
  supplier,
}: {
  DialogTrigger: JSX.Element;
  triggerClassname?: string;
  supplier: Supplier;
}) {
  const [isUpdatingSupplier, setIsUpdatingSupplier] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const onSubmit = (values: z.infer<typeof updateSupplierFormSchema>) => {
    const data: any = values;
    setIsUpdatingSupplier(true);
    SupplierService.updateSupplier(data)
      .then((result) => {
        dispatch(updateSupplier(result.data));
        setOpen(false);
      })
      .catch((error) => axiosUIErrorHandler(error, toast, router))
      .finally(() => {
        setIsUpdatingSupplier(false);
      });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className={triggerClassname} asChild>
        {DialogTrigger}
      </AlertDialogTrigger>
      <AlertDialogContent
        className="!w-[500px] max-w-[960px] md:!w-[600px]"
        asChild
      >
        <div
          className={cn(
            "flex max-h-[95%] w-full flex-col overflow-y-auto rounded-md bg-white p-4",
            scrollbar_style.scrollbar,
          )}
        >
          <div className="mb-2 flex flex-row items-center justify-between">
            <h3 className="text-base font-semibold">Update supplier</h3>
            <X
              size={24}
              className="rounded-full p-1 hover:cursor-pointer hover:bg-slate-200"
              onClick={() => setOpen(false)}
            />
          </div>
          <div className="flex-1">
            <FormContent
              onSubmit={onSubmit}
              isCreatingNewSupplier={isUpdatingSupplier}
              setOpen={setOpen}
              supplier={supplier}
            />
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const FormContent = ({
  onSubmit,
  setOpen,
  isCreatingNewSupplier,
  supplier,
}: {
  onSubmit: (values: any) => any;
  setOpen: (value: boolean) => any;
  isCreatingNewSupplier: boolean;
  supplier: Supplier;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const supplierGroups = useAppSelector((state) => state.supplierGroups.value);
  const form = useForm<z.infer<typeof updateSupplierFormSchema>>({
    resolver: zodResolver(updateSupplierFormSchema),
    defaultValues: { ...supplier },
  });

  const dispatch = useAppDispatch();
  const [openNewSupplierGroupDialog, setOpenNewSupplierGroupDialog] =
    useState(false);
  const addNewSupplierGroup = async (groupName: string) => {
    try {
      const data = await SupplierService.uploadSupplierGroup(groupName);
      dispatch(addSupplierGroup(data.data));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast, router);
      return Promise.reject(e);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mb-2 flex flex-row">
              <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                <div className="flex flex-row items-center gap-2">
                  <h5 className="text-sm">Supplier name</h5>
                </div>
                <FormMessage className="mr-2 text-xs" />
              </FormLabel>
              <FormControl>
                <Input className="!m-0 flex-1" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mb-2 flex flex-row">
              <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                <div className="flex flex-row items-center gap-2">
                  <h5 className="text-sm">Email</h5>
                </div>
                <FormMessage className="mr-2 text-xs" />
              </FormLabel>
              <FormControl>
                <Input className="!m-0 flex-1" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="mb-2 flex flex-row">
              <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                <div className="flex flex-row items-center gap-2">
                  <h5 className="text-sm">Phone number</h5>
                </div>
                <FormMessage className="mr-2 text-xs" />
              </FormLabel>
              <FormControl>
                <Input className="!m-0 flex-1" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="mb-2 flex flex-row">
              <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                <div className="flex flex-row items-center gap-2">
                  <h5 className="text-sm">Address</h5>
                </div>
                <FormMessage className="mr-2 text-xs" />
              </FormLabel>
              <FormControl>
                <Input className="!m-0 flex-1" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="supplierGroupName"
          render={({ field }) => (
            <FormItem className="mb-2 flex flex-row">
              <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                <div className="flex flex-row items-center gap-2">
                  <h5 className="text-sm">Supplier group</h5>
                </div>
                <FormMessage className="mr-2 text-xs" />
              </FormLabel>
              <FormControl>
                <div className="!m-0 flex min-h-[40px] flex-1 flex-row items-center rounded-md border border-input">
                  <div className="h-full w-full flex-1">
                    <SearchAndChooseButton
                      value={field.value}
                      placeholder="---Choose group---"
                      searchPlaceholder="Search group..."
                      onValueChanged={(val) => {
                        form.setValue("supplierGroupName", val, {
                          shouldValidate: true,
                        });
                      }}
                      choices={supplierGroups.map((v) => v.name)}
                    />
                  </div>
                  <AddNewThing
                    title="Add new supplier group"
                    placeholder="Group's name"
                    open={openNewSupplierGroupDialog}
                    onOpenChange={setOpenNewSupplierGroupDialog}
                    onAddClick={addNewSupplierGroup}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem className="mb-2 flex flex-row">
              <FormLabel className="flex min-w-[150px] max-w-[150px] flex-col justify-center text-black">
                <div className="flex flex-row items-center gap-2">
                  <h5 className="text-sm">Company</h5>
                </div>
                <FormMessage className="mr-2 text-xs" />
              </FormLabel>
              <FormControl>
                <Input className="!m-0 flex-1" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="mb-3 flex flex-row">
              <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                <div className="flex flex-row items-center gap-2">
                  <h5 className="text-sm">Status</h5>
                </div>
                <FormMessage className="mr-2 text-xs" />
              </FormLabel>
              <FormControl>
                <RadioGroup
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  className="flex flex-row"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Active" id="r1" />
                    <Label htmlFor="r1">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Disabled" id="r2" />
                    <Label htmlFor="r2">Disabled</Label>
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="mb-4 rounded-sm border">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="justify-center bg-gray-200 p-3 text-sm text-black">
                  <h5 className="text-sm">Description</h5>
                  <FormMessage className="mr-2 text-xs" />
                </FormLabel>
                <FormControl className="border-none">
                  <Textarea
                    className="!mt-0 min-h-[100px] flex-1 resize-none !rounded-none p-2 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
                    onKeyDown={(e) => e.stopPropagation()}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-row gap-8">
          <div className="flex-1" />
          <Button
            variant={"green"}
            type="submit"
            className="min-w-[150px] px-4 uppercase"
            disabled={isCreatingNewSupplier}
          >
            Save
            <LoadingCircle
              className={"ml-4 !w-4 " + (isCreatingNewSupplier ? "" : "hidden")}
            />
          </Button>
          <Button
            variant={"green"}
            type="button"
            className="min-w-[150px] bg-gray-400 px-4 uppercase hover:bg-gray-500"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpen(false);
            }}
            disabled={isCreatingNewSupplier}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};
