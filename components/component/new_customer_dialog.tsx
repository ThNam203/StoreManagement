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
import CustomerService from "@/services/customerService";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { addCustomer } from "@/reducers/customersReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import { useToast } from "../ui/use-toast";
import AddNewThing from "../ui/add_new_thing_dialog";
import { addCustomerGroup } from "@/reducers/customerGroupsReducer";
import { useRouter } from "next/navigation";

const newCustomerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Missing name!" })
    .max(100, { message: "Customer name must be at most 100 characters!" }),
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
  sex: z.enum(["Male", "Female", "Not to say"]),
  description: z.string(),
  birthday: z.string(),
  customerGroup: z.string().min(1, "Missing group!").nullable(),
});

export default function NewCustomerDialog({
  DialogTrigger,
  triggerClassname,
}: {
  DialogTrigger: JSX.Element;
  triggerClassname?: string;
}) {
  const [isCreatingNewCustomer, setIsCreatingNewCustomer] = useState(false);
  const [open, setOpen] = useState(false);
  let [file, setFile] = useState<File | null>(null);
  const onFileChanged = (newFile: File | null) => setFile(newFile);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = (values: z.infer<typeof newCustomerFormSchema>) => {
    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append(
      "data",
      new Blob([JSON.stringify(values)], { type: "application/json" }),
    );
    setIsCreatingNewCustomer(true);
    CustomerService.uploadCustomer(formData)
      .then((result) => {
        dispatch(addCustomer(result.data));
        setOpen(false);
      })
      .catch((error) => axiosUIErrorHandler(error, toast, router))
      .finally(() => {
        setIsCreatingNewCustomer(false);
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
            <h3 className="text-base font-semibold">Add new customer</h3>
            <X
              size={24}
              className="rounded-full p-1 hover:cursor-pointer hover:bg-slate-200"
              onClick={() => setOpen(false)}
            />
          </div>
          <div className="flex flex-col gap-8 md:flex-row">
            <FormImage onImageChosen={onFileChanged} />
            <div className="flex-1">
              <FormContent
                onSubmit={onSubmit}
                isCreatingNewCustomer={isCreatingNewCustomer}
                setOpen={setOpen}
              />
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const FormImage = ({
  onImageChosen,
}: {
  onImageChosen: (file: File | null) => any;
}) => {
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    return () => {
      onImageChosen(null);
    };
  }, []);

  return (
    <div className="flex flex-row items-center gap-4 md:flex-col">
      <div className="relative">
        <div className="flex !h-[100px] min-w-[100px] max-w-[100px] items-center justify-center overflow-hidden rounded-full bg-slate-200">
          <img
            className={cn(
              "object-contain",
              file ? "h-full w-full" : "h-10 w-10",
            )}
            src={file ? URL.createObjectURL(file) : "/ic_user.png"}
          />
        </div>
        {file ? (
          <X
            size={16}
            className="absolute right-0 top-0 cursor-pointer"
            color="black"
            onClick={() => {
              setFile(null);
              onImageChosen(null);
            }}
          />
        ) : null}
      </div>
      <div className="w-full">
        <Label
          htmlFor="customer_img_input"
          className="flex h-[35px] w-full max-w-[150px] items-center justify-center rounded-md border border-[#00b43e] bg-transparent text-center text-[0.8rem] font-semibold text-black hover:cursor-pointer hover:bg-[#00b43e] hover:text-white"
        >
          Choose Image
        </Label>
        <input
          id="customer_img_input"
          type="file"
          onChange={(e) => {
            const file =
              e.target.files && e.target.files.length > 0
                ? e.target.files[0]
                : null;
            setFile(file);
            onImageChosen(file);
          }}
          onClick={(e) => (e.currentTarget.value = "")}
          className="hidden"
          accept="image/*"
        />
      </div>
    </div>
  );
};

const FormContent = ({
  onSubmit,
  setOpen,
  isCreatingNewCustomer,
}: {
  onSubmit: (values: any) => any;
  setOpen: (value: boolean) => any;
  isCreatingNewCustomer: boolean;
}) => {
  const { toast } = useToast();
  const router  = useRouter();
  const customerGroups = useAppSelector((state) => state.customerGroups.value);
  const form = useForm<z.infer<typeof newCustomerFormSchema>>({
    resolver: zodResolver(newCustomerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      sex: "Male",
      description: "",
      birthday: format(new Date(), "yyyy-MM-dd"),
      customerGroup: "",
    },
  });

  const dispatch = useAppDispatch();
  const [openNewCustomerGroupDialog, setOpenNewCustomerGroupDialog] =
    useState(false);
  const addNewCustomerGroup = async (groupName: string) => {
    try {
      const data = await CustomerService.uploadCustomerGroup(groupName);
      dispatch(addCustomerGroup(data.data));
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
                  <h5 className="text-sm">Customer name</h5>
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
          name="customerGroup"
          render={({ field }) => (
            <FormItem className="mb-2 flex flex-row">
              <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                <div className="flex flex-row items-center gap-2">
                  <h5 className="text-sm">Customer group</h5>
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
                        form.setValue("customerGroup", val, {
                          shouldValidate: true,
                        });
                      }}
                      choices={customerGroups.map((v) => v.name)}
                    />
                  </div>
                  <AddNewThing
                    title="Add new customer group"
                    placeholder="Group's name"
                    open={openNewCustomerGroupDialog}
                    onOpenChange={setOpenNewCustomerGroupDialog}
                    onAddClick={addNewCustomerGroup}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (
            <FormItem className="mb-2 flex flex-row">
              <FormLabel className="flex min-w-[150px] max-w-[150px] flex-col justify-center text-black">
                <div className="flex flex-row items-center gap-2">
                  <h5 className="text-sm">Birthday</h5>
                </div>
                <FormMessage className="mr-2 text-xs" />
              </FormLabel>
              <FormControl>
                <Input type="date" {...field} className="w-full" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sex"
          render={({ field }) => (
            <FormItem className="mb-3 flex flex-row">
              <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                <div className="flex flex-row items-center gap-2">
                  <h5 className="text-sm">Sex</h5>
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
                    <RadioGroupItem value="Male" id="r1" />
                    <Label htmlFor="r1">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Female" id="r2" />
                    <Label htmlFor="r2">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Not to say" id="r3" />
                    <Label htmlFor="r3">Not to say</Label>
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
            disabled={isCreatingNewCustomer}
          >
            Save
            <LoadingCircle
              className={"ml-4 !w-4 " + (isCreatingNewCustomer ? "" : "hidden")}
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
            disabled={isCreatingNewCustomer}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};
