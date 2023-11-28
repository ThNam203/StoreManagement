import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "./button";
import LoadingCircle from "./loading_circle";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Textarea } from "./textarea";
import scrollbar_style from "@/styles/scrollbar.module.css";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "./label";
import { Input } from "./input";
import SearchAndChooseButton from "./catalog/search_filter";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "./alert-dialog";
import { useState } from "react";
import { DatePicker } from "./datepicker";

const newCustomerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is missing!" })
    .max(100, { message: "Customer name must be at most 100 characters!" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is missing!" })
    .max(100, { message: "Email must be at most 100 characters!" })
    .email({ message: "Email not valid!" }),
  phoneNumber: z
    .string({ required_error: "Phone number is missing" })
    .trim()
    .min(1, { message: "Group is missing" })
    .max(10, { message: "Phone number must be at most 10 characters!" }),
  address: z
    .string()
    .trim()
    .max(100, { message: "Address must be at most 100 characters!" })
    .optional(),
  sex: z.enum(["Male", "Female", "Not to say"]),
  description: z.string(),
  birthday: z.date(),
  customerGroup: z.string(),
});

export default function NewCustomerDialog({
  DialogTrigger,
}: {
  DialogTrigger: JSX.Element;
}) {
  const [open, setOpen] = useState(false);
  const onSubmit = () => {};

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>{DialogTrigger}</AlertDialogTrigger>
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
            <h3 className="font-semibold text-base">Add new customer</h3>
            <X
              size={24}
              className="hover:cursor-pointer rounded-full hover:bg-slate-200 p-1"
              onClick={() => setOpen(false)}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <FormImage onImageChosen={() => {}} />
            <div className="flex-1">
              <FormContent onSubmit={onSubmit} />
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

  return (
    <div className="flex flex-row gap-4 md:flex-col items-center">
      <div className="relative">
        <div className="min-w-[100px] max-w-[100px] !h-[100px] rounded-full flex items-center justify-center overflow-hidden bg-slate-200">
          <img
            className={cn(
              "object-contain",
              file ? "w-full h-full" : "h-10 w-10"
            )}
            src={file ? URL.createObjectURL(file) : "ic_user.svg"}
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
          className="w-full max-w-[150px] flex items-center justify-center rounded-md text-center hover:cursor-pointer bg-transparent hover:bg-[#00b43e] border border-[#00b43e] h-[35px] text-black hover:text-white font-semibold text-[0.8rem]"
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
          onClick={(e) => e.currentTarget.value = ""}
          className="hidden"
          accept="image/*"
        />
      </div>
    </div>
  );
};

const FormContent = ({ onSubmit }: { onSubmit: () => any }) => {
  const form = useForm<z.infer<typeof newCustomerFormSchema>>({
    resolver: zodResolver(newCustomerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      sex: "Male",
      description: "",
      birthday: new Date(),
      customerGroup: "",
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
            <FormItem className="flex flex-row mb-2">
              <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                <div className="flex flex-row items-center gap-2">
                  <h5 className="text-sm">Customer name</h5>
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
          name="customerGroup"
          render={({ field }) => (
            <FormItem className="flex flex-row mb-2">
              <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                <div className="flex flex-row items-center gap-2">
                  <h5 className="text-sm">Customer group</h5>
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
                          "customerGroup",
                          val === undefined ? "" : val,
                          { shouldValidate: true }
                        );
                      }}
                      choices={["a", "b", "c"]}
                    />
                  </div>
                  {/* <AddNewThing
                          title="Add new group"
                          placeholder="Group's name"
                          open={openGroup}
                          onOpenChange={setOpenGroup}
                          onAddClick={addNewGroup}
                        /> */}
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (
            <FormItem className="flex flex-row mb-2">
              <FormLabel className="flex flex-col min-w-[150px] max-w-[150px] text-black justify-center">
                <div className="flex flex-row items-center gap-2">
                  <h5 className="text-sm">Birthday</h5>
                </div>
                <FormMessage className="mr-2 text-xs" />
              </FormLabel>
              <FormControl>
                <DatePicker value={field.value} onChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sex"
          render={({ field }) => (
            <FormItem className="flex flex-row mb-3">
              <FormLabel className="flex flex-col w-[150px] text-black justify-center">
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
            // disabled={isCreatingNewProduct}
          >
            Save
            {/* <LoadingCircle
            className={
              "!w-4 ml-4 " + (isCreatingNewProduct ? "" : "hidden")
            }
          /> */}
          </Button>
          <Button
            variant={"green"}
            type="button"
            className="px-4 min-w-[150px] bg-gray-400 hover:bg-gray-500 uppercase"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              //   onChangeVisibility(false);
            }}
            // disabled={isCreatingNewProduct}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};
