"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import {
  ChoicesFilter,
  PageWithFilters,
  SearchFilter,
  TimeFilter,
} from "@/components/ui/filter";
import { cn } from "@/lib/utils";
import scrollbar_style from "@/styles/scrollbar.module.css";
import React, { useEffect, useRef, useState } from "react";
import { CatalogDatatable } from "./datatable";
import Media from "@/entities/Media";
import Product, { sampleProducts } from "@/entities/Product";
import { Check, Info, Pencil, Plus, PlusCircle, Trash, X } from "lucide-react";
import SearchAndChooseButton from "@/components/ui/catalog/search_filter";
import { ChooseImageButton } from "@/components/ui/catalog/choose_image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { nanoid } from "nanoid";

const productTypeFilterChoices = ["Goods", "Services", "Combo - Package"];
const productGroupFilterChoices = [
  "Cigarette",
  "Milk",
  "Soft drink",
  "Cosmetics",
  "Pastry",
  "Alcoholic drinks",
  "Fast food",
];
const productInventoryThresholdFilterChoices = [
  "All",
  "Below threshold",
  "Exceeding threshold",
  "Available in inventory",
  "Out of stock",
];
const productSupplierFilterChoices = [
  "Company A",
  "Company B",
  "Company C",
  "Company D",
  "Company E",
  "Company F",
];
const productPositionFilterChoices = [
  "Location A",
  "Location B",
  "Location C",
  "Location D",
  "Location E",
  "Location F",
  "Location G",
];
const productStatusFilterChoices = ["Selling", "Not selling", "All"];

const products = sampleProducts

const newProductFormSchema = z.object({
  barcode: z
    .string({ required_error: "Barcode is missing" })
    .trim()
    .min(1, { message: "Barcode is missing!" })
    .max(50, { message: "Barcode must be at most 50 characters!" }),
  productName: z
    .string()
    .trim()
    .min(1, { message: "Name is missing!" })
    .max(100, { message: "Product name must be at most 100 characters!" }),
  productGroup: z
    .string({ required_error: "Group is missing" })
    .trim()
    .min(1, { message: "Group is missing" }),
  productBrand: z.string().trim().optional(),
  location: z
    .string()
    .max(100, "Location must be at most 100 characters")
    .optional(),
  originalPrice: z
    .number()
    .min(0, { message: "Original price must be at least 0" })
    .max(Number.MAX_VALUE, {
      message: `Original price must be less than ${Number.MAX_VALUE}`,
    }),
  sellingPrice: z
    .number()
    .min(0, { message: "Selling price must be at least 0" })
    .max(Number.MAX_VALUE, {
      message: `Selling price must be less than ${Number.MAX_VALUE}`,
    }),
  stock: z
    .number()
    .int()
    .min(0, { message: "Stock must be at least 0" })
    .max(Number.MAX_VALUE, {
      message: `Stock must be less than ${Number.MAX_VALUE}`,
    }),
  weight: z
    .number()
    .min(0, { message: "Weight must be at least 0" })
    .max(Number.MAX_VALUE, {
      message: `Weight must be less than ${Number.MAX_VALUE}`,
    }),
  minStock: z
    .number()
    .int()
    .min(0, { message: "Value must be at least 0" })
    .max(Number.MAX_VALUE, {
      message: `Value must be less than ${Number.MAX_VALUE}`,
    }),
  maxStock: z
    .number()
    .int()
    .min(0, { message: "Value must be at least 0" })
    .max(Number.MAX_VALUE, {
      message: `Value must be less than ${Number.MAX_VALUE}`,
    }),
  images: z.array(z.string().nullable()).min(1).max(5),
  properties: z
    .array(
      z.object({
        key: z.string().min(1, "Missing property name!"),
        values: z.array(z.string()).min(1, "Propety needs at least 1 value"),
      })
    )
    .nullable(),
  units: z.object({
    baseUnit: z
      .string({ required_error: "Missing base unit" })
      .min(1, { message: "Missing base unit" })
      .max(100, { message: "Base unit must be less than 100 characters" }),
    otherUnits: z
      .array(
        z.object({
          unitName: z
            .string({ required_error: "Missing unit name" })
            .min(1, { message: "Missing unit name" })
            .max(100, { message: "Unit name must be less than 100" }),
          exchangeValue: z
            .number({ required_error: "Missing exchange value!" })
            .min(0, { message: "Value must be at least 0" })
            .max(Number.MAX_VALUE, {
              message: `Value must be lest than ${Number.MAX_VALUE}`,
            }),
          price: z
            .number({ required_error: "Missing price!" })
            .min(0, { message: "Value must be at least 0" })
            .max(Number.MAX_VALUE, {
              message: `Value must be less than ${Number.MAX_VALUE}`,
            }),
        })
      )
      .optional(),
  }),
  description: z.string(),
  note: z.string(),
});

const ProductNewUnitView = ({
  unitName,
  exchangeValue,
  price,
  onUnitNameChanged,
  onExchangeValueChanged,
  onPriceValueChanged,
  onRemoveClick,
}: {
  unitName: string;
  exchangeValue: number;
  price: number;
  onUnitNameChanged: (val: string) => void;
  onExchangeValueChanged: (val: number) => void;
  onPriceValueChanged: (val: number) => void;
  onRemoveClick: () => void;
}) => {
  return (
    <div className="flex flex-row items-center gap-4 text-[0.85rem] ml-4 mb-2">
      <div className="flex flex-col flex-1">
        <p className="font-semibold">Unit name</p>
        <input
          value={unitName}
          onChange={(e) => onUnitNameChanged(e.target.value)}
          className="border-b border-blue-300 p-1"
        />
      </div>
      <div className="flex flex-col flex-1">
        <p className="font-semibold">Exchange value</p>
        <input
          type="number"
          min={0}
          value={exchangeValue}
          onChange={(e) => onExchangeValueChanged(e.target.valueAsNumber)}
          className="border-b border-blue-300 p-1 text-end"
        />
      </div>
      <div className="flex flex-col flex-1">
        <p className="font-semibold">Price</p>
        <input
          value={price}
          type="number"
          min={0}
          onChange={(e) => onPriceValueChanged(e.target.valueAsNumber)}
          className="border-b border-blue-300 p-1 text-end"
        />
      </div>
      <Trash
        size={16}
        className="mr-4 hover:cursor-pointer"
        fill="black"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemoveClick();
        }}
      />
    </div>
  );
};

const NewProductPropertiesInputErrorFormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();

  if (!error) {
    return null;
  }

  let message: string = "";
  let customError: any = error;
  for (let i = 0; i < customError.length; i++) {
    if (customError[i] === undefined) continue;
    else {
      message = customError[i].key.message || customError[i].values.message;
      break;
    }
  }

  if (!message || message.length === 0)
    message = "Something went wrong, try later!";

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {message}
    </p>
  );
});
NewProductPropertiesInputErrorFormMessage.displayName = "FormMessage";

const NewProductUnitInputErrorFormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();

  if (!error) {
    return null;
  }

  let message: string = "";
  let customError: any = error;
  if (customError.baseUnit) message = customError.baseUnit.message;
  else {
    for (let i = 0; i < customError.otherUnits.length; i++) {
      if (customError.otherUnits[i] === undefined) continue;
      else {
        message =
          customError.otherUnits[i].unitName.message ||
          customError.otherUnits[i].exchangeValue.message ||
          customError.otherUnits[i].price.message;
        break;
      }
    }
  }

  if (!message || message.length === 0)
    message = "Something went wrong, try later!";

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {message}
    </p>
  );
});
NewProductUnitInputErrorFormMessage.displayName = "FormMessage";

const NewProductView = () => {
  const form = useForm<z.infer<typeof newProductFormSchema>>({
    resolver: zodResolver(newProductFormSchema),
    defaultValues: {
      barcode: "",
      productName: "",
      productGroup: "",
      productBrand: undefined,
      location: undefined,
      originalPrice: 0,
      sellingPrice: 0,
      stock: 0,
      weight: 0,
      minStock: 0,
      maxStock: 999999999,
      images: [null, null, null, null, null],
      properties: null,
      units: {
        baseUnit: "",
        otherUnits: undefined,
      },
      description: "",
      note: "",
    },
  });

  // if newFileUrl == null, it means the user removed image
  const handleImageChosen = (
    newFileUrl: string | null,
    index: number,
    productImages: (string | null)[]
  ) => {
    if (newFileUrl === null) {
      productImages[index] = null;
      for (let i = index; i < productImages.length - 1; i++) {
        productImages[i] = productImages[i + 1];
      }
      productImages[productImages.length - 1] = null;
    } else productImages[productImages.indexOf(null)] = newFileUrl;

    form.setValue("images", [...productImages], { shouldValidate: true });
  };

  const productPropertyChoices = ["Mau sac", "Hinh dang"];
  const [productPropertyInputValues, setProductPropertyInputValues] = useState<
    string[]
  >([]);

  function onSubmit(values: z.infer<typeof newProductFormSchema>) {
    console.log(newProductFormSchema);
  }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-30 z-[10]">
      <div
        className={cn(
          "rounded-md max-h-[95%] w-[95%] max-w-[960px] flex flex-col p-4 bg-white overflow-y-auto",
          scrollbar_style.scrollbar
        )}
      >
        <h3 className="font-semibold text-base mb-4">Add new product</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row w-full h-full md:gap-4">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row mb-2">
                      <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Barcode</h5>
                          <Info size={16} />
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
                  name="productName"
                  render={({ field }) => (
                    <FormItem className="flex flex-row mb-2">
                      <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Product name</h5>
                          <Info size={16} />
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
                  name="productGroup"
                  render={({ field }) => (
                    <FormItem className="flex flex-row mb-2">
                      <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Product group</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-row flex-1 min-h-[40px] border border-input rounded-md !m-0 items-center">
                          <div className="w-full h-full flex-1">
                            <SearchAndChooseButton
                              value={field.value}
                              placeholder="---Choose group---"
                              searchPlaceholder="Search product..."
                              // onValueChanged={setProductGroup}
                              onValueChanged={(val) => {
                                form.setValue(
                                  "productGroup",
                                  val === undefined ? "" : val,
                                  { shouldValidate: true }
                                );
                              }}
                              choices={["Abbbbbbbb", "B", "C"]}
                            />
                          </div>
                          <PlusCircle
                            size={16}
                            className="mx-2 hover:cursor-pointer"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productBrand"
                  render={({ field }) => (
                    <FormItem className="flex flex-row mb-2">
                      <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Product brand</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-row flex-1 min-h-[40px] border border-input rounded-md !m-0 items-center">
                          <div className="w-full h-full flex-1">
                            <SearchAndChooseButton
                              value={field.value}
                              placeholder="---Choose brand---"
                              searchPlaceholder="Search brand..."
                              onValueChanged={(val) => {
                                form.setValue("productBrand", val, {
                                  shouldValidate: true,
                                });
                              }}
                              choices={["Abbbbbbbb", "B", "C"]}
                            />
                          </div>
                          <PlusCircle
                            size={16}
                            className="mx-2 hover:cursor-pointer"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="flex flex-row mb-2">
                      <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Location</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-row flex-1 min-h-[40px] border border-input rounded-md !m-0 items-center">
                          <div className="w-full h-full flex-1">
                            <SearchAndChooseButton
                              value={field.value}
                              placeholder="---Choose location---"
                              searchPlaceholder="Search location..."
                              onValueChanged={(val) => {
                                form.setValue("productBrand", val, {
                                  shouldValidate: true,
                                });
                              }}
                              choices={["Abbbbbbbb", "B", "C"]}
                            />
                          </div>
                          <PlusCircle
                            size={16}
                            className="mx-2 hover:cursor-pointer"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem className="flex flex-row mb-2">
                      <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Weight</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl className="flex flex-row items-center flex-1 !mt-0">
                        <div className="focus-visible:outline-none">
                          <Input
                            type="number"
                            min={0}
                            className="flex-1 !m-0 text-end"
                            {...field}
                            onChange={(e) => {
                              form.setValue(
                                "weight",
                                isNaN(e.target.valueAsNumber)
                                  ? 0
                                  : e.target.valueAsNumber,
                                { shouldValidate: false }
                              );
                            }}
                          />
                          <p className="w-8 text-center">KG</p>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem className="flex flex-row mb-2">
                      <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Original price</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="flex-1 !m-0 text-end"
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            form.setValue(
                              "originalPrice",
                              isNaN(e.target.valueAsNumber)
                                ? 0
                                : e.target.valueAsNumber,
                              { shouldValidate: true }
                            )
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sellingPrice"
                  render={({ field }) => (
                    <FormItem className="flex flex-row mb-2">
                      <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Selling price</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="flex-1 !m-0 text-end"
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            form.setValue(
                              "sellingPrice",
                              isNaN(e.target.valueAsNumber)
                                ? 0
                                : e.target.valueAsNumber,
                              { shouldValidate: true }
                            )
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem className="flex flex-row mb-2">
                      <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Stock</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="flex-1 !m-0 text-end"
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            form.setValue(
                              "stock",
                              isNaN(e.target.valueAsNumber)
                                ? 0
                                : e.target.valueAsNumber,
                              {
                                shouldValidate: true,
                              }
                            )
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minStock"
                  render={({ field }) => (
                    <FormItem className="flex flex-row mb-2">
                      <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Min stock</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="flex-1 !m-0 text-end"
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            form.setValue(
                              "minStock",
                              isNaN(e.target.valueAsNumber)
                                ? 0
                                : e.target.valueAsNumber,
                              {
                                shouldValidate: true,
                              }
                            )
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxStock"
                  render={({ field }) => (
                    <FormItem className="flex flex-row mb-2">
                      <FormLabel className="flex flex-col w-[150px] text-black justify-center">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Max stock</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="flex-1 !m-0 text-end"
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            form.setValue(
                              "maxStock",
                              isNaN(e.target.valueAsNumber)
                                ? 0
                                : e.target.valueAsNumber,
                              {
                                shouldValidate: true,
                              }
                            )
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="my-4">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <div className="flex flex-row gap-2">
                        {field.value.map((imageLink, index) => (
                          <ChooseImageButton
                            key={index}
                            file={imageLink}
                            onImageChanged={(newFileUrl) => {
                              handleImageChosen(newFileUrl, index, field.value);
                            }}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="border rounded-sm mb-4">
              <FormField
                control={form.control}
                name="properties"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger className="text-sm bg-gray-200 p-3">
                            <div className="flex flex-row gap-10">
                              <p>Product properties</p>
                              <NewProductPropertiesInputErrorFormMessage />
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-col">
                              {field.value
                                ? field.value.map((value, index) => {
                                    return (
                                      <div
                                        key={index}
                                        className="flex flex-row items-center gap-2"
                                      >
                                        <Popover>
                                          <PopoverTrigger>
                                            <div className="ml-4 h-[35px] border-b flex flex-row justify-between items-center w-[250px]">
                                              <p className=" p-1 text-start">
                                                {value.key.length === 0
                                                  ? "Choose property..."
                                                  : value.key}
                                              </p>
                                              <Pencil size={16} />
                                            </div>
                                          </PopoverTrigger>
                                          <PopoverContent className="p-0">
                                            {productPropertyChoices.map(
                                              (choice, choiceIndex) => {
                                                return (
                                                  <div
                                                    key={choiceIndex}
                                                    className="p-2 hover:bg-slate-300 rounded-sm hover:cursor-pointer flex flex-row justify-between items-center"
                                                    onClick={() => {
                                                      if (
                                                        field.value![index]
                                                          .key === choice
                                                      ) {
                                                        field.value![
                                                          index
                                                        ].key = "";
                                                        return form.setValue(
                                                          "properties",
                                                          [...field.value!]
                                                        );
                                                      }

                                                      if (
                                                        !field.value!.every(
                                                          (
                                                            fieldVal,
                                                            fieldIdx
                                                          ) => {
                                                            return (
                                                              fieldVal.key !==
                                                              choice
                                                            );
                                                          }
                                                        )
                                                      ) {
                                                        form.setError(
                                                          "properties",
                                                          {
                                                            message:
                                                              "Property is already chosen!",
                                                          },
                                                          {
                                                            shouldFocus: true,
                                                          }
                                                        );
                                                        return;
                                                      }

                                                      field.value![index].key =
                                                        choice;

                                                      return form.setValue(
                                                        "properties",
                                                        [...field.value!]
                                                      );
                                                    }}
                                                  >
                                                    <p className="text-sm">
                                                      {choice}
                                                    </p>
                                                    {value.key === choice ? (
                                                      <Check size={16} />
                                                    ) : null}
                                                  </div>
                                                );
                                              }
                                            )}
                                          </PopoverContent>
                                        </Popover>
                                        <div className="flex flex-row flex-wrap items-center ml-8 flex-1">
                                          {value.values.map(
                                            (keyVal, keyIdx) => (
                                              <div
                                                key={keyIdx}
                                                className="flex flex-row p-1 bg-blue-300"
                                              >
                                                <p>{keyVal}</p>
                                                <X size={8} />
                                              </div>
                                            )
                                          )}
                                          <Input
                                            placeholder="Type value and enter"
                                            type="button"
                                            value={
                                              productPropertyInputValues[index]
                                            }
                                            onChange={(e) => {
                                              setProductPropertyInputValues(
                                                (prev) => {
                                                  prev[index] = e.target.value;
                                                  return [...prev];
                                                }
                                              );
                                            }}
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter") {
                                                if (
                                                  productPropertyInputValues[
                                                    index
                                                  ].trim().length > 0
                                                ) {
                                                  const newValue =
                                                    field.value!.map((v, i) => {
                                                      if (i === index) {
                                                        v.values.push(
                                                          productPropertyInputValues[
                                                            index
                                                          ]
                                                        );
                                                        setProductPropertyInputValues(
                                                          (prev) => {
                                                            prev[index] = "";
                                                            return [...prev];
                                                          }
                                                        );
                                                      }
                                                      return v;
                                                    });
                                                  form.setValue(
                                                    "properties",
                                                    newValue
                                                  );
                                                }
                                              }
                                            }}
                                            className="h-[35px] w-[200px] rounded-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 border-0 border-b"
                                          />
                                        </div>
                                        <Trash
                                          size={16}
                                          className="mr-4 hover:cursor-pointer"
                                          fill="black"
                                          onClick={(e) => {
                                            form.setValue(
                                              "properties",
                                              field.value!.filter(
                                                (_, idx) => idx !== index
                                              )
                                            );
                                            setProductPropertyInputValues(
                                              (prev) =>
                                                prev.filter(
                                                  (_, idx) => idx !== index
                                                )
                                            );
                                          }}
                                        />
                                      </div>
                                    );
                                  })
                                : null}
                            </div>
                            <Button
                              className="border bg-transparent hover:bg-slate-200 ml-4 mt-2 h-[35px]"
                              type="button"
                              onClick={(e) => {
                                let newVal: {
                                  key: string;
                                  values: string[];
                                }[];

                                if (field.value === null)
                                  newVal = [{ key: "", values: [] }];
                                else
                                  newVal = [
                                    ...field.value,
                                    { key: "", values: [] },
                                  ];
                                form.setValue("properties", newVal, {
                                  shouldValidate: false,
                                });
                                setProductPropertyInputValues((prev) => [
                                  ...prev,
                                  "",
                                ]);
                              }}
                            >
                              <Plus size={16} className="mr-2" />
                              Add property
                            </Button>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="border rounded-sm mb-4">
              <FormField
                control={form.control}
                name="units"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger className="text-sm bg-gray-200 p-3">
                            <div className="flex flex-row gap-10">
                              <p>Product units</p>
                              <NewProductUnitInputErrorFormMessage />
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-col">
                              <div className="flex flex-row m-2 ml-4 items-center gap-4">
                                <p>Base unit</p>
                                <Input
                                  value={field.value?.baseUnit}
                                  onChange={(e) => {
                                    form.setValue(
                                      "units",
                                      {
                                        baseUnit: e.target.value,
                                        otherUnits: field.value?.otherUnits,
                                      },
                                      { shouldValidate: true }
                                    );
                                  }}
                                />
                              </div>
                              {field.value?.otherUnits
                                ? field.value.otherUnits.map((value, index) => {
                                    return (
                                      <ProductNewUnitView
                                        key={index}
                                        unitName={value.unitName}
                                        price={value.price}
                                        exchangeValue={value.exchangeValue}
                                        onUnitNameChanged={(val: string) => {
                                          const newObj = {
                                            ...field.value!.otherUnits![index],
                                            unitName: val,
                                          };
                                          field.value!.otherUnits![index] =
                                            newObj;
                                          form.setValue(
                                            "units.otherUnits",
                                            [...field.value!.otherUnits!],

                                            { shouldValidate: true }
                                          );
                                        }}
                                        onPriceValueChanged={(val: number) => {
                                          const newObj = {
                                            ...field.value!.otherUnits![index],
                                            price: val,
                                          };
                                          field.value!.otherUnits![index] =
                                            newObj;
                                          form.setValue(
                                            "units",
                                            {
                                              baseUnit: field.value!.baseUnit,
                                              otherUnits: [
                                                ...field.value!.otherUnits!,
                                              ],
                                            },
                                            { shouldValidate: true }
                                          );
                                        }}
                                        onExchangeValueChanged={(
                                          val: number
                                        ) => {
                                          const newObj = {
                                            ...field.value!.otherUnits![index],
                                            exchangeValue: val,
                                          };
                                          field.value!.otherUnits![index] =
                                            newObj;
                                          form.setValue(
                                            "units",
                                            {
                                              baseUnit: field.value!.baseUnit,
                                              otherUnits: [
                                                ...field.value!.otherUnits!,
                                              ],
                                            },
                                            { shouldValidate: true }
                                          );
                                        }}
                                        onRemoveClick={() => {
                                          form.setValue(
                                            "units",
                                            {
                                              baseUnit: field.value!.baseUnit,
                                              otherUnits:
                                                field.value!.otherUnits!.filter(
                                                  (_, idx) => idx !== index
                                                ),
                                            },
                                            { shouldValidate: false }
                                          );
                                        }}
                                      />
                                    );
                                  })
                                : null}
                            </div>
                            <Button
                              type="button"
                              className="border bg-transparent hover:bg-slate-200 ml-4 mt-2 h-[35px]"
                              onClick={(e) => {
                                e.preventDefault();
                                if (
                                  field.value === undefined ||
                                  field.value.baseUnit.length === 0
                                ) {
                                  form.setError(
                                    "units",
                                    { message: "Please specify base unit!" },
                                    { shouldFocus: true }
                                  );
                                  return;
                                }

                                const newUnit = {
                                  unitName: "",
                                  exchangeValue: 0,
                                  price: 0,
                                };

                                const newVal =
                                  field.value!.otherUnits === undefined
                                    ? [newUnit]
                                    : [...field.value!.otherUnits!, newUnit];
                                form.setValue("units", {
                                  baseUnit: field.value!.baseUnit,
                                  otherUnits: newVal,
                                });
                              }}
                            >
                              <Plus size={16} className="mr-2" />
                              Add unit
                            </Button>
                            <Button
                              type="button"
                              onClick={() =>
                                console.log(form.getValues("units"))
                              }
                            >
                              Con c
                            </Button>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Save</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default function Catalog() {
  const [filtersChoice, setFiltersChoice] = useState<{
    type: string[];
    group: string[];
    inventoryThreshold: string;
    supplier: string[];
    position: string[];
    status: string;
  }>({
    type: ["Goods"],
    group: [],
    inventoryThreshold: "All",
    supplier: [],
    position: [],
    status: "All",
  });

  const updateTypeFilter = (choices: string[]) =>
    setFiltersChoice((prev) => ({ ...prev, type: choices }));
  const updateGroupFilter = (choices: string[]) =>
    setFiltersChoice((prev) => ({ ...prev, group: choices }));
  const updateInventoryThresholdFilter = (choice: string) =>
    setFiltersChoice((prev) => ({ ...prev, inventoryThreshold: choice }));
  const updateSupplierFilter = (choices: string[]) =>
    setFiltersChoice((prev) => ({ ...prev, supplier: choices }));
  const updatePositionFilter = (choices: string[]) =>
    setFiltersChoice((prev) => ({ ...prev, position: choices }));
  const updateStatusFilter = (choice: string) =>
    setFiltersChoice((prev) => ({ ...prev, status: choice }));

  const filters = [
    <ChoicesFilter
      key={1}
      title="Product type"
      defaultValues={filtersChoice.type}
      isSingleChoice={false}
      choices={productTypeFilterChoices}
      onMultiChoicesChanged={updateTypeFilter}
    />,
    <SearchFilter
      key={2}
      placeholder="Find group..."
      title="Product group"
      chosenValues={filtersChoice.group}
      choices={productGroupFilterChoices}
      onValuesChanged={updateGroupFilter}
      className="my-4"
    />,
    <ChoicesFilter
      key={3}
      title="Inventory"
      isSingleChoice
      defaultValue={filtersChoice.inventoryThreshold}
      choices={productInventoryThresholdFilterChoices}
      onSingleChoiceChanged={updateInventoryThresholdFilter}
      className="my-4"
    />,
    <SearchFilter
      key={4}
      title="Supplier"
      placeholder="Find supplier..."
      chosenValues={filtersChoice.supplier}
      onValuesChanged={updateSupplierFilter}
      choices={productSupplierFilterChoices}
      className="my-4"
    />,
    <SearchFilter
      key={5}
      title="Product position"
      placeholder="Find position..."
      chosenValues={filtersChoice.position}
      onValuesChanged={updatePositionFilter}
      choices={productPositionFilterChoices}
      className="my-4"
    />,
    <ChoicesFilter
      key={6}
      title="Product status"
      isSingleChoice
      defaultValue={filtersChoice.status}
      choices={productStatusFilterChoices}
      onSingleChoiceChanged={updateStatusFilter}
      className="my-4"
    />,
  ];

  return (
    <PageWithFilters title="Products" filters={filters}>
      <CatalogDatatable data={products} />
      {/* <NewProductView /> */}
    </PageWithFilters>
  );
}
