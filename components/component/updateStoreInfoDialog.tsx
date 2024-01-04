import { Store } from "@/entities/Store";
import { useAppDispatch } from "@/hooks";
import { cn } from "@/lib/utils";
import { updateStoreInformation } from "@/reducers/storeReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import StoreService from "@/services/storeService";
import scrollbar_style from "@/styles/scrollbar.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import LoadingCircle from "../ui/loading_circle";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";

const updateStoreFormSchema = z.object({
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
    .min(0, { message: "Missing phone number!" })
    .max(10, { message: "Phone number must be at most 10 characters!" }),
  address: z
    .string()
    .trim()
    .max(100, { message: "Address must be at most 100 characters!" })
    .optional(),
  description: z.string(),
});

export default function UpdateStoreInformationDialog({
  DialogTrigger,
  triggerClassname,
  storeInfo,
}: {
  DialogTrigger: JSX.Element;
  triggerClassname?: string;
  storeInfo: Store;
}) {
  const [isUpdatingStore, setIsUpdatingStore] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const onSubmit = (values: z.infer<typeof updateStoreFormSchema>) => {
    const data: any = values;
    setIsUpdatingStore(true);
    StoreService.updateStoreInformation(data)
      .then((result) => {
        dispatch(updateStoreInformation(result.data));
        setOpen(false);
      })
      .catch((error) => axiosUIErrorHandler(error, toast, router))
      .finally(() => {
        setIsUpdatingStore(false);
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
            <h3 className="text-base font-semibold">Update store information</h3>
            <X
              size={24}
              className="rounded-full p-1 hover:cursor-pointer hover:bg-slate-200"
              onClick={() => setOpen(false)}
            />
          </div>
          <div className="flex-1">
            <FormContent
              onSubmit={onSubmit}
              isUpdatingStoreInfo={isUpdatingStore}
              setOpen={setOpen}
              storeInfo={storeInfo}
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
  isUpdatingStoreInfo,
  storeInfo,
}: {
  onSubmit: (values: any) => any;
  setOpen: (value: boolean) => any;
  isUpdatingStoreInfo: boolean;
  storeInfo: Store;
}) => {
  const form = useForm<z.infer<typeof updateStoreFormSchema>>({
    resolver: zodResolver(updateStoreFormSchema),
    defaultValues: { 
      name: storeInfo.name,
      description: storeInfo.description ?? "",
      phoneNumber: storeInfo.phoneNumber ?? "",
      email: storeInfo.email ?? "",
      address: storeInfo.address ?? "",
     },
  });

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
                  <h5 className="text-sm">Store name</h5>
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
            disabled={isUpdatingStoreInfo}
          >
            Save
            <LoadingCircle
              className={"ml-4 !w-4 " + (isUpdatingStoreInfo ? "" : "hidden")}
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
            disabled={isUpdatingStoreInfo}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};
