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
import SearchAndChooseButton, {
  SearchAndChooseMultiple,
} from "@/components/ui/catalog/search_filter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DateRangePicker } from "react-date-range";
import { useState } from "react";
import DiscountService, {
  UploadDiscountDataType,
} from "@/services/discount_service";
import { addDiscount, updateDiscount } from "@/reducers/discountsReducer";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import { format, parse, toDate } from "date-fns";
import { Button } from "../button";
import { Discount } from "@/entities/Discount";

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

    delete data.time

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
    <div className="fixed top-0 left-0 w-screen h-screen bg-transparent backdrop-blur-sm flex items-center justify-center z-10">
      <div
        className="w-[90vw] max-w-[1080px] shadow-md shadow-[#a2a2a2] rounded-sm"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className={cn(
            "rounded-md max-h-[95vh] w-full flex flex-col p-4 bg-white overflow-y-auto",
            scrollbar_style.scrollbar
          )}
        >
          <div className="flex flex-row items-center justify-between mb-2">
            <h3 className="font-semibold text-base">Update discount</h3>
            <X
              size={24}
              className="hover:cursor-pointer rounded-full hover:bg-slate-200 p-1"
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
                      <FormItem className="flex flex-row mb-2">
                        <FormLabel className="flex flex-col w-[150px] text-black justify-center h-[41.6px]">
                          <h5 className="text-sm">Discount name</h5>
                          <FormMessage className="mr-2 text-xs" />
                        </FormLabel>
                        <FormControl>
                          <Input className="flex-1 !m-0" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-1 flex-row gap-1 items-center">
                    <FormField
                      control={form.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem className="flex-1 flex flex-row mb-2">
                          <FormLabel className="flex flex-col w-[150px] text-black justify-center h-[41.6px]">
                            <h5 className="text-sm">Value</h5>
                            <FormMessage className="mr-2 text-xs" />
                          </FormLabel>
                          <FormControl>
                            <div
                              className={cn(
                                "border flex flex-row items-center p-2 gap-2 rounded-md !mt-0",
                                form.getValues("type") === "COUPON"
                                  ? "max-w-[70px]"
                                  : "flex-1"
                              )}
                            >
                              <input
                                className="flex-1 text-end !m-0 border-0 focus-visible:outline-none w-full"
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
                                    e.currentTarget.valueAsNumber
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
                            <FormItem className="flex flex-row mb-2">
                              <FormLabel className="flex flex-col text-black justify-center">
                                <p className="whitespace-nowrap mx-2">
                                  Max value
                                </p>
                                <FormMessage className="mr-2 text-xs" />
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="flex-1 !m-0 text-end w-[100px] lg:w-[140px] xl:w-[180px]"
                                  type="number"
                                  value={field.value ? field.value : 0}
                                  min={0}
                                  onChange={(e) => {
                                    if (isNaN(e.currentTarget.valueAsNumber))
                                      form.setValue("maxValue", 0);
                                    else
                                      form.setValue(
                                        "maxValue",
                                        e.currentTarget.valueAsNumber
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
                      <FormItem className="flex flex-row mb-2">
                        <FormLabel className="flex flex-col w-[150px] text-black justify-center h-[41.6px]">
                          <h5 className="text-sm">Amount</h5>
                          <FormMessage className="mr-2 text-xs" />
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            className="flex-1 !m-0 text-end"
                            value={field.value}
                            onChange={(e) =>
                              form.setValue(
                                "amount",
                                e.currentTarget.valueAsNumber
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
                      <FormItem className="flex flex-row mb-2">
                        <FormLabel className="flex flex-col w-[150px] text-black justify-center">
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
                </div>
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="productGroups"
                    render={({ field }) => (
                      <FormItem className="flex flex-row mb-2 mt-0">
                        <FormLabel className="flex flex-col min-w-[150px] text-black justify-center">
                          <div className="flex flex-row items-center gap-2">
                            <h5 className="text-sm">Product groups</h5>
                          </div>
                          <FormMessage className="mr-2 text-xs" />
                        </FormLabel>
                        <FormControl>
                          <SearchAndChooseMultiple
                            value={field.value ? field.value : []}
                            choices={productGroups.map((p) => p.name)}
                            onValueChanged={(val) =>
                              form.setValue("productGroups", val)
                            }
                            className="w-full z-10"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="productIds"
                    render={({ field }) => (
                      <FormItem className="flex flex-row mb-2">
                        <FormLabel className="flex flex-col min-w-[150px] text-black justify-center">
                          <div className="flex flex-row items-center gap-2">
                            <h5 className="text-sm">Products</h5>
                          </div>
                          <FormMessage className="mr-2 text-xs" />
                        </FormLabel>
                        <FormControl>
                          <SearchAndChooseMultiple
                            value={products
                              .filter(
                                (product) =>
                                  field.value &&
                                  field.value.includes(product.id)
                              )
                              .map(
                                (product) =>
                                  product.name +
                                  (product.propertiesString
                                    ? ` (${product.propertiesString})`
                                    : "")
                              )}
                            choices={products.map(
                              (p) =>
                                p.name +
                                (p.propertiesString
                                  ? ` (${p.propertiesString})`
                                  : "")
                            )}
                            onValueChanged={(val) =>
                              form.setValue(
                                "productIds",
                                products
                                  .filter((product) =>
                                    val.includes(
                                      product.name +
                                        (product.propertiesString
                                          ? ` (${product.propertiesString})`
                                          : "")
                                    )
                                  )
                                  .map((product) => product.id)
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
                      <FormItem className="flex flex-row mb-2">
                        <FormLabel className="flex flex-col w-[150px] text-black justify-center h-[41.6px]">
                          <h5 className="text-sm">Apply time</h5>
                          <FormMessage className="mr-2 text-xs" />
                        </FormLabel>
                        <FormControl>
                          <>
                            <div
                              className="flex-1 h-[41.6px] !mt-0 flex flex-row items-center border rounded-md justify-between px-2 hover:cursor-pointer"
                              onClick={(e) => setIsTimeRangeOpen(true)}
                            >
                              <p>
                                {format(field.value.startDate, "dd LLL, yyyy")}
                                <ChevronRight
                                  size={20}
                                  className="inline-block mx-1"
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
                      <FormItem className="flex flex-row mb-2 py-1">
                        <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                          <h5 className="text-sm">Status</h5>
                          <FormMessage className="mr-2 text-xs" />
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            defaultValue={String(field.value)}
                            onValueChange={(value) => {if (value === "true") field.onChange(true); field.onChange(false)}}
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
                  className="px-4 min-w-[150px] uppercase"
                  disabled={isCreatingNewDiscount}
                >
                  Save
                  <LoadingCircle
                    className={
                      "!w-4 ml-4 " + (isCreatingNewDiscount ? "" : "hidden")
                    }
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
      className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-transparent z-10"
      onClick={(e) => {
        setIsRangeFilterOpen(false);
        e.stopPropagation();
      }}
    >
      <div
        className="flex flex-col items-center border shadow-md bg-white"
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
          className="bg-blue-400 hover:bg-blue-500 text-white mt-2 w-96 mb-2"
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
