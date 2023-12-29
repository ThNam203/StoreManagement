"use client";
import { CalendarDays, ChevronRight, Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { z } from "zod";
import { cn } from "@/lib/utils";
import scrollbar_style from "@/styles/scrollbar.module.css";
import LoadingCircle from "@/components/ui/loading_circle";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DateRangePicker } from "react-date-range";
import { useState } from "react";
import DiscountService, {
  UploadDiscountDataType,
} from "@/services/discountService";
import { addDiscount, updateDiscount } from "@/reducers/discountsReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import { format, parse, toDate } from "date-fns";
import { Button } from "../button";
import { Discount } from "@/entities/Discount";
import { MultipleChoicesSearchInput } from "@/components/component/StringChoicesSearchInput";

const discountFormSchema = z.object({
  name: z
    .string()
    .min(1, "Missing name")
    .max(100, "No bigger than 100 characters"),
  value: z
    .number()
    .min(0, "Value must be at least 0")
    .max(Number.MAX_VALUE, "Value must be less than " + Number.MAX_VALUE),
  amount: z
    .number()
    .min(0, "Amount must be at least 0")
    .max(Number.MAX_VALUE, "Value must be less than " + Number.MAX_VALUE),
  maxValue: z
    .number()
    .min(0, "Max value must be at least 0")
    .max(Number.MAX_VALUE, "Max value must be less than " + Number.MAX_VALUE)
    .nullable(),
  status: z.boolean(),
  type: z.enum(["COUPON", "VOUCHER"]),
  productGroups: z.array(z.string()).nullable(),
  productIds: z.array(z.number()).nullable(),
  description: z.string(),
  minSubTotal: z.number(),
  time: z.object({
    startDate: z.date(),
    endDate: z.date(),
  }),
});

export default function UpdateDiscountForm({
  setOpen,
  discount,
}: {
  setOpen: (value: boolean) => any;
  discount: Discount;
}) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false);
  const [isCreatingNewDiscount, setIsCreatingNewDiscount] = useState(false);
  const productGroups = useAppSelector((state) => state.productGroups.value);
  const products = useAppSelector((state) => state.products.value);
  const form = useForm<z.infer<typeof discountFormSchema>>({
    resolver: zodResolver(discountFormSchema),
    defaultValues: {
      name: discount.name,
      value: discount.value,
      maxValue: discount.maxValue,
      status: discount.status,
      type: discount.type,
      amount: discount.amount,
      productGroups: discount.productGroups,
      productIds: discount.productIds,
      description: discount.description,
      minSubTotal: discount.minSubTotal,
      time: {
        startDate: new Date(discount.startDate),
        endDate: new Date(discount.endDate),
      },
    },
  });

  const onSubmit = (values: z.infer<typeof discountFormSchema>) => {
    setIsCreatingNewDiscount(true);
    const data: any = {
      ...discount,
      ...values,
      startDate: format(values.time.startDate, "yyyy-MM-dd"),
      endDate: format(values.time.endDate, "yyyy-MM-dd"),
      maxValue: values.type === "COUPON" ? values.maxValue : null,
    };

    delete data.time;

    DiscountService.updateDiscount(data)
      .then((result) => {
        dispatch(updateDiscount(result.data));
        setOpen(false);
      })
      .catch((e) => axiosUIErrorHandler(e, toast))
      .finally(() => {
        setIsCreatingNewDiscount(false);
      });
  };

  return (
    <div className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-transparent backdrop-blur-sm">
      <div
        className="w-[90vw] max-w-[1080px] rounded-sm shadow-md shadow-[#a2a2a2]"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className={cn(
            "flex max-h-[95vh] w-full flex-col overflow-y-auto rounded-md bg-white p-4",
            scrollbar_style.scrollbar,
          )}
        >
          <div className="mb-2 flex flex-row items-center justify-between">
            <h3 className="text-base font-semibold">Update discount</h3>
            <X
              size={24}
              className="rounded-full p-1 hover:cursor-pointer hover:bg-slate-200"
              onClick={() => setOpen(false)}
            />
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              className="text-sm"
            >
              <div className="flex flex-col gap-2 lg:flex-row">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="mb-2 flex flex-row">
                        <FormLabel className="flex h-[41.6px] w-[150px] flex-col justify-center text-black">
                          <h5 className="text-sm">Discount name</h5>
                          <FormMessage className="mr-2 text-xs" />
                        </FormLabel>
                        <FormControl>
                          <Input className="!m-0 flex-1" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-1 flex-row items-center gap-1">
                    <FormField
                      control={form.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem className="mb-2 flex flex-1 flex-row">
                          <FormLabel className="flex h-[41.6px] w-[150px] flex-col justify-center text-black">
                            <h5 className="text-sm">Value</h5>
                            <FormMessage className="mr-2 text-xs" />
                          </FormLabel>
                          <FormControl>
                            <div
                              className={cn(
                                "!mt-0 flex flex-row items-center gap-2 rounded-md border p-2",
                                form.getValues("type") === "COUPON"
                                  ? "max-w-[70px]"
                                  : "flex-1",
                              )}
                            >
                              <input
                                className="!m-0 w-full flex-1 border-0 text-end focus-visible:outline-none"
                                type="number"
                                min={0}
                                max={
                                  form.getValues("type") === "COUPON"
                                    ? 100
                                    : undefined
                                }
                                value={field.value}
                                onChange={(e) =>
                                  form.setValue(
                                    "value",
                                    e.currentTarget.valueAsNumber,
                                  )
                                }
                              />
                              {form.getValues("type") === "COUPON" ? (
                                <p>%</p>
                              ) : null}
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {form.getValues("type") === "COUPON" ? (
                      <FormField
                        control={form.control}
                        name="maxValue"
                        render={({ field }) => {
                          return (
                            <FormItem className="mb-2 flex flex-row">
                              <FormLabel className="flex flex-col justify-center text-black">
                                <p className="mx-2 whitespace-nowrap">
                                  Max value
                                </p>
                                <FormMessage className="mr-2 text-xs" />
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="!m-0 w-[100px] flex-1 text-end lg:w-[140px] xl:w-[180px]"
                                  type="number"
                                  value={field.value ? field.value : 0}
                                  min={0}
                                  onChange={(e) => {
                                    if (isNaN(e.currentTarget.valueAsNumber))
                                      form.setValue("maxValue", 0);
                                    else
                                      form.setValue(
                                        "maxValue",
                                        e.currentTarget.valueAsNumber,
                                      );
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          );
                        }}
                      />
                    ) : null}
                  </div>

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem className="mb-2 flex flex-row">
                        <FormLabel className="flex h-[41.6px] w-[150px] flex-col justify-center text-black">
                          <h5 className="text-sm">Amount</h5>
                          <FormMessage className="mr-2 text-xs" />
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            className="!m-0 flex-1 text-end"
                            value={field.value}
                            onChange={(e) =>
                              form.setValue(
                                "amount",
                                e.currentTarget.valueAsNumber,
                              )
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="mb-2 flex flex-row">
                        <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                          <h5 className="text-sm">Type</h5>
                          <FormMessage className="mr-2 text-xs" />
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            className="flex flex-row text-sm"
                          >
                            <div className="flex items-center space-x-2 p-1">
                              <RadioGroupItem value="COUPON" id="z1" />
                              <Label htmlFor="z1">Coupon</Label>
                            </div>
                            <div className="flex items-center space-x-2 p-1">
                              <RadioGroupItem value="VOUCHER" id="z2" />
                              <Label htmlFor="z2">Voucher</Label>
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
                </div>
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="productGroups"
                    render={({ field }) => (
                      <FormItem className="mb-2 mt-0 flex flex-row">
                        <FormLabel className="flex min-w-[150px] flex-col justify-center text-black">
                          <div className="flex flex-row items-center gap-2">
                            <h5 className="text-sm">Product groups</h5>
                          </div>
                          <FormMessage className="mr-2 text-xs" />
                        </FormLabel>
                        <FormControl>
                          {/* TODO: group can be deleted, if bug, implement a filter */}
                          <MultipleChoicesSearchInput
                            value={
                              field.value
                                ? field.value.map((v) => {
                                    const group = productGroups.find(
                                      (p) => p.name === v,
                                    )!;
                                    return {
                                      id: group.id,
                                      value: group.name,
                                    };
                                  })
                                : []
                            }
                            choices={productGroups.map((p) => ({
                              id: p.id,
                              value: p.name,
                            }))}
                            onValueChanged={(val) =>
                              form.setValue(
                                "productGroups",
                                val.map((v) => v.value),
                              )
                            }
                            className="z-10 w-full"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="productIds"
                    render={({ field }) => (
                      <FormItem className="mb-2 flex flex-row">
                        <FormLabel className="flex min-w-[150px] flex-col justify-center text-black">
                          <div className="flex flex-row items-center gap-2">
                            <h5 className="text-sm">Products</h5>
                          </div>
                          <FormMessage className="mr-2 text-xs" />
                        </FormLabel>
                        <FormControl>
                          <MultipleChoicesSearchInput
                            value={products
                              .filter(
                                (product) =>
                                  field.value &&
                                  field.value.includes(product.id),
                              )
                              .map((product) => ({
                                id: product.id,
                                value:
                                  product.name +
                                  (product.propertiesString
                                    ? ` (${product.propertiesString})`
                                    : ""),
                              }))}
                            choices={products.map((p) => ({
                              id: p.id,
                              value:
                                p.name +
                                (p.propertiesString
                                  ? ` (${p.propertiesString})`
                                  : ""),
                            }))}
                            onValueChanged={(val) =>
                              form.setValue(
                                "productIds",
                                val.map((product) => product.id),
                              )
                            }
                            className="w-full"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem className="mb-2 flex flex-row">
                        <FormLabel className="flex h-[41.6px] w-[150px] flex-col justify-center text-black">
                          <h5 className="text-sm">Apply time</h5>
                          <FormMessage className="mr-2 text-xs" />
                        </FormLabel>
                        <FormControl>
                          <>
                            <div
                              className="!mt-0 flex h-[41.6px] flex-1 flex-row items-center justify-between rounded-md border px-2 hover:cursor-pointer"
                              onClick={(e) => setIsTimeRangeOpen(true)}
                            >
                              <p>
                                {format(field.value.startDate, "dd LLL, yyyy")}
                                <ChevronRight
                                  size={20}
                                  className="mx-1 inline-block"
                                />
                                {format(field.value.endDate, "dd LLL, yyyy")}
                              </p>
                              <CalendarDays size={16} />
                            </div>
                            {isTimeRangeOpen ? (
                              <TimeFilterRangePicker
                                defaultValue={field.value}
                                onValueChange={(value) =>
                                  form.setValue("time", value)
                                }
                                setIsRangeFilterOpen={setIsTimeRangeOpen}
                              />
                            ) : null}
                          </>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="mb-2 flex flex-row py-1">
                        <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                          <h5 className="text-sm">Status</h5>
                          <FormMessage className="mr-2 text-xs" />
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            defaultValue={String(field.value)}
                            onValueChange={(value) => {
                              if (value === "true") field.onChange(true);
                              field.onChange(false);
                            }}
                            className="flex flex-row text-sm"
                          >
                            <div className="flex items-center space-x-2 p-1">
                              <RadioGroupItem value="true" id="r1" />
                              <Label htmlFor="r1">Active</Label>
                            </div>
                            <div className="flex items-center space-x-2 p-1">
                              <RadioGroupItem value="false" id="r2" />
                              <Label htmlFor="r2">Disabled</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-row gap-8">
                <div className="flex-1" />
                <Button
                  variant={"green"}
                  type="submit"
                  className="min-w-[150px] px-4 uppercase"
                  disabled={isCreatingNewDiscount}
                >
                  Save
                  <LoadingCircle
                    className={
                      "ml-4 !w-4 " + (isCreatingNewDiscount ? "" : "hidden")
                    }
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
                  disabled={isCreatingNewDiscount}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

const TimeFilterRangePicker = ({
  defaultValue,
  onValueChange,
  setIsRangeFilterOpen,
}: {
  defaultValue: { startDate: Date; endDate: Date };
  onValueChange?: (val: { startDate: Date; endDate: Date }) => void;
  setIsRangeFilterOpen: (val: boolean) => void;
}) => {
  const [tempRange, setTempRange] = useState(defaultValue);

  return (
    <div
      className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center bg-transparent"
      onClick={(e) => {
        setIsRangeFilterOpen(false);
        e.stopPropagation();
      }}
    >
      <div
        className="flex flex-col items-center border bg-white shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <DateRangePicker
          ranges={[{ ...tempRange, key: "selection" }]}
          onChange={(item) => {
            if (
              item.selection.startDate &&
              item.selection.endDate &&
              item.selection.key
            ) {
              setTempRange({
                startDate: item.selection.startDate,
                endDate: item.selection.endDate,
              });
            }
          }}
        />
        <Button
          className="mb-2 mt-2 w-96 bg-blue-400 text-white hover:bg-blue-500"
          onClick={(e) => {
            e.stopPropagation();
            if (onValueChange) onValueChange(tempRange);
            setIsRangeFilterOpen(false);
          }}
        >
          Done
        </Button>
      </div>
    </div>
  );
};
