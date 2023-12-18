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
import { axiosUIErrorHandler } from "@/services/axios_utils";
import { useToast } from "../ui/use-toast";
import AddNewThing from "../ui/add_new_thing_dialog";
import SupplierService from "@/services/supplier_service";
import { addSupplierGroup } from "@/reducers/supplierGroupsReducer";
import { addSupplier } from "@/reducers/suppliersReducer";

const newSupplierFormSchema = z.object({
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

export default function NewSupplierDialog({
  DialogTrigger,
  triggerClassname,
}: {
  DialogTrigger: JSX.Element;
  triggerClassname?: string;
}) {
  const [isCreatingNewSupplier, setIsCreatingNewSupplier] = useState(false);
  const [open, setOpen] = useState(false);
  let [file, setFile] = useState<File | null>(null);
  const onFileChanged = (newFile: File | null) => setFile(newFile);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const onSubmit = (values: z.infer<typeof newSupplierFormSchema>) => {
    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("data", new Blob([JSON.stringify(values)], { type: "application/json" }));
    setIsCreatingNewSupplier(true);
    SupplierService.uploadSupplier(formData)
      .then((result) => {
        dispatch(addSupplier(result.data));
        setOpen(false);
      })
      .catch((error) => axiosUIErrorHandler(error, toast))
      .finally(() => {
        setIsCreatingNewSupplier(false);
      });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className={triggerClassname} asChild>{DialogTrigger}</AlertDialogTrigger>
      <AlertDialogContent
        className="max-w-[960px] !w-[500px] md:!w-[600px]"
        asChild
      >
        <div
          className={cn(
            "rounded-md max-h-[95%] w-full flex flex-col p-4 bg-white overflow-y-auto",
            scrollbar_style.scrollbar
          )}
        >
          <div className="flex flex-row items-center justify-between mb-2">
            <h3 className="font-semibold text-base">Add new supplier</h3>
            <X
              size={24}
              className="hover:cursor-pointer rounded-full hover:bg-slate-200 p-1"
              onClick={() => setOpen(false)}
            />
          </div>
            <div className="flex-1">
              <FormContent
                onSubmit={onSubmit}
                isCreatingNewSupplier={isCreatingNewSupplier}
                setOpen={setOpen}
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
}: {
  onSubmit: (values: any) => any;
  setOpen: (value: boolean) => any;
  isCreatingNewSupplier: boolean;
}) => {
  const { toast } = useToast();
  const supplierGroups = useAppSelector((state) => state.supplierGroups.value)
  const form = useForm<z.infer<typeof newSupplierFormSchema>>({
    resolver: zodResolver(newSupplierFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      status: "Active",
      description: "",
      companyName: "",
      supplierGroupName: "",
    },
  });

  const dispatch = useAppDispatch();
  const [openNewSupplierGroupDialog, setOpenNewSupplierGroupDialog] =
    useState(false);
  const addNewSupplierGroup = async (groupName: string) => {
    try {
      const data = await SupplierService.uploadSupplierGroup(groupName);
      dispatch(addSupplierGroup(data.data))
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject(e)
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
            <FormItem className="flex flex-row mb-2">
              <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                <div className="flex flex-row items-center gap-2">
                  <h5 className="text-sm">Supplier name</h5>
                </div>
                <FormMessage className="mr-2 text-xs" />
              </FormLabel>
              <FormControl>
                <Input className="flex-1 !m-0" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-row mb-2">
              <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                <div className="flex flex-row items-center gap-2">
                  <h5 className="text-sm">Email</h5>
                </div>
                <FormMessage className="mr-2 text-xs" />
              </FormLabel>
              <FormControl>
                <Input className="flex-1 !m-0" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="flex flex-row mb-2">
              <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                <div className="flex flex-row items-center gap-2">
                  <h5 className="text-sm">Phone number</h5>
                </div>
                <FormMessage className="mr-2 text-xs" />
              </FormLabel>
              <FormControl>
                <Input className="flex-1 !m-0" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="flex flex-row mb-2">
              <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                <div className="flex flex-row items-center gap-2">
                  <h5 className="text-sm">Address</h5>
                </div>
                <FormMessage className="mr-2 text-xs" />
              </FormLabel>
              <FormControl>
                <Input className="flex-1 !m-0" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="supplierGroupName"
          render={({ field }) => (
            <FormItem className="flex flex-row mb-2">
              <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                <div className="flex flex-row items-center gap-2">
                  <h5 className="text-sm">Supplier group</h5>
                </div>
                <FormMessage className="mr-2 text-xs" />
              </FormLabel>
              <FormControl>
                <div className="flex flex-row flex-1 min-h-[40px] border border-input rounded-md !m-0 items-center">
                  <div className="w-full h-full flex-1">
                    <SearchAndChooseButton
                      value={field.value}
                      placeholder="---Choose group---"
                      searchPlaceholder="Search group..."
                      onValueChanged={(val) => {
                        form.setValue(
                          "supplierGroupName",
                          val,
                          { shouldValidate: true }
                        );
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
            <FormItem className="flex flex-row mb-2">
              <FormLabel className="flex flex-col min-w-[150px] max-w-[150px] text-black justify-center">
                <div className="flex flex-row items-center gap-2">
                  <h5 className="text-sm">Company</h5>
                </div>
                <FormMessage className="mr-2 text-xs" />
              </FormLabel>
              <FormControl>
                <Input className="flex-1 !m-0" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-row mb-3">
              <FormLabel className="flex flex-col w-[150px] text-black justify-center">
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
        <div className="border rounded-sm mb-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-black justify-center text-sm bg-gray-200 p-3">
                  <h5 className="text-sm">Description</h5>
                  <FormMessage className="mr-2 text-xs" />
                </FormLabel>
                <FormControl className="border-none">
                  <Textarea
                    className="flex-1 resize-none p-2 !mt-0 min-h-[100px] !rounded-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
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
            className="px-4 min-w-[150px] uppercase"
            disabled={isCreatingNewSupplier}
          >
            Save
            <LoadingCircle
              className={"!w-4 ml-4 " + (isCreatingNewSupplier ? "" : "hidden")}
            />
          </Button>
          <Button
            variant={"green"}
            type="button"
            className="px-4 min-w-[150px] bg-gray-400 hover:bg-gray-500 uppercase"
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
