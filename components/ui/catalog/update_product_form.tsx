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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import scrollbar_style from "@/styles/scrollbar.module.css";
import React, { useEffect, useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "../textarea";
import ProductService from "@/services/productService";
import { Product } from "@/entities/Product";
import LoadingCircle from "../loading_circle";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
import { useAppSelector } from "@/hooks";
import { useRouter } from "next/navigation";

const productFormSchema = z.object({
  barcode: z
    .string({ required_error: "Barcode is missing" })
    .trim()
    .min(0, { message: "Barcode is missing!" })
    .max(50, { message: "Barcode must be at most 50 characters!" }),
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is missing!" })
    .max(100, { message: "Product name must be at most 100 characters!" }),
  productGroup: z
    .string({ required_error: "Group is missing" })
    .trim()
    .min(1, { message: "Group is missing" })
    .nullable(),
  productBrand: z.string().trim().nullable(),
  location: z
    .string()
    .max(100, "Location must be at most 100 characters")
    .nullable(),
  originalPrice: z
    .number()
    .min(0, { message: "Original price must be at least 0" })
    .max(Number.MAX_VALUE, {
      message: `Original price must be less than ${Number.MAX_VALUE}`,
    }),
  productPrice: z
    .number()
    .min(0, { message: "Product price must be at least 0" })
    .max(Number.MAX_VALUE, {
      message: `Product price must be less than ${Number.MAX_VALUE}`,
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
        id: z.number(),
        key: z.string().min(1, "Missing property name!"),
        value: z.string().min(1, "Missing property value"),
      }),
    )
    .nullable(),
  unit: z.object({
    name: z
      .string()
      .min(1, "Missing unit name")
      .max(100, "Unit name's must not be longer thanh 100"),
    exchangeValue: z.number().min(0, "Exchange value must be greater than 0"),
    basicUnit: z.string(),
  }),
  description: z.string(),
  note: z.string(),
});

export const UpdateProductView = ({
  onChangeVisibility,
  product,
  productIndex,
  onProductUpdated,
  addNewLocation,
  addNewGroup,
  addNewBrand,
  addNewProperties,
  onUpdateProperty,
  onDeleteProperty,
}: {
  onChangeVisibility: (val: boolean) => void;
  product: Product;
  productIndex: number;
  onProductUpdated: (data: Product) => any;
  addNewLocation: (value: string) => any;
  addNewGroup: (value: string) => any;
  addNewBrand: (value: string) => any;
  addNewProperties: (value: string) => any;
  onUpdateProperty: (value: string, propertyId: number) => any;
  onDeleteProperty: (deletePropertyId: number) => any;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const productLocationChoices = useAppSelector(
    (state) => state.productLocations.value,
  );
  const productGroupChoices = useAppSelector(
    (state) => state.productGroups.value,
  );
  const productBrandChoices = useAppSelector(
    (state) => state.productBrands.value,
  );
  const productPropertyChoices = useAppSelector(
    (state) => state.productProperties.value,
  );
  const [newChosenImages, setNewChosenImages] = useState<(File | string)[]>(
    product.images ? [...product.images] : [],
  );
  const [isCreatingNewProduct, setIsCreatingNewProduct] = useState(false);
  const [openGroup, setOpenGroup] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);
  const [openProperty, setOpenProperty] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      ...product,
      images: [
        ...(product.images ? product.images : []),
        ...new Array(
          Math.max(0, 5 - (product.images ? product.images.length : 0)),
        ).fill(null),
      ],
      productBrand: product.productBrand ?? "",
      weight: product.weight ?? 0,
      unit: product.salesUnits,
      properties: product.productProperties
        ? product.productProperties.map((property) => {
            return {
              id: productPropertyChoices.find(
                (v) => v.name === property.propertyName,
              )?.id,
              key: property.propertyName,
              value: property.propertyValue,
            };
          })
        : null,
    },
  });

  // if newFileUrl == null, it means the user removed image
  const handleImageChosen = (newFileUrl: File | null, index: number) => {
    if (newFileUrl === null) {
      newChosenImages.splice(index, 1);
    } else newChosenImages.push(newFileUrl);

    const formValue: any[] = newChosenImages.map((file) => {
      if (typeof file === "string") return file;
      else return URL.createObjectURL(file);
    });
    while (formValue.length < 5) formValue.push(null);
    form.setValue("images", formValue, { shouldValidate: true });
    setNewChosenImages(newChosenImages);
  };

  function onSubmit(values: z.infer<typeof productFormSchema>) {
    const data: any = {
      ...product,
      ...values,
      images: newChosenImages.filter((file) => typeof file === "string"),
    };

    setIsCreatingNewProduct(true);
    ProductService.updateProduct(
      data,
      newChosenImages.filter((file) => typeof file !== "string") as File[],
    )
      .then((result) => {
        onProductUpdated(result.data);
      })
      .catch((e) => axiosUIErrorHandler(e, toast, router))
      .finally(() => {
        onChangeVisibility(false);
        setIsCreatingNewProduct(false);
      });
  }

  return (
    <div className="fixed left-0 top-0 z-[10] flex h-screen w-screen items-center justify-center bg-black bg-opacity-30">
      <div
        className={cn(
          "flex max-h-[95%] w-[95%] max-w-[960px] flex-col overflow-y-auto rounded-md bg-white p-4",
          scrollbar_style.scrollbar,
        )}
      >
        <div className="mb-4 flex flex-row items-center justify-between">
          <h3 className="text-base font-semibold">Update product</h3>
          <X
            size={24}
            className="rounded-full p-1 hover:cursor-pointer hover:bg-slate-200"
            onClick={() => onChangeVisibility(false)}
          />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
          >
            <div className="flex h-full w-full flex-col md:flex-row md:gap-4">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem className="mb-2 flex flex-row">
                      <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Barcode</h5>
                          <Info size={16} />
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
                  name="name"
                  render={({ field }) => (
                    <FormItem className="mb-2 flex flex-row">
                      <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Product name</h5>
                          <Info size={16} />
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
                  name="productGroup"
                  render={({ field }) => (
                    <FormItem className="mb-2 flex flex-row">
                      <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Product group</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <div className="!m-0 flex min-h-[40px] flex-1 flex-row items-center rounded-md border border-input">
                          <div className="h-full w-full flex-1">
                            <SearchAndChooseButton
                              value={field.value}
                              placeholder="---Choose group---"
                              searchPlaceholder="Search product..."
                              // onValueChanged={setProductGroup}
                              onValueChanged={(val) => {
                                form.setValue("productGroup", val, {
                                  shouldValidate: true,
                                });
                              }}
                              choices={productGroupChoices.map((c) => c.name)}
                            />
                          </div>
                          <AddNewThing
                            title="Add new group"
                            placeholder="Group's name"
                            open={openGroup}
                            onOpenChange={setOpenGroup}
                            onAddClick={addNewGroup}
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
                    <FormItem className="mb-2 flex flex-row">
                      <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Product brand</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <div className="!m-0 flex min-h-[40px] flex-1 flex-row items-center rounded-md border border-input">
                          <div className="h-full w-full flex-1">
                            <SearchAndChooseButton
                              value={field.value}
                              placeholder="---Choose brand---"
                              searchPlaceholder="Search brand..."
                              onValueChanged={(val) => {
                                form.setValue("productBrand", val, {
                                  shouldValidate: true,
                                });
                              }}
                              choices={productBrandChoices.map((c) => c.name)}
                            />
                          </div>
                          <AddNewThing
                            title="Add new brand"
                            placeholder="Brand's name"
                            open={openBrand}
                            onOpenChange={setOpenBrand}
                            onAddClick={addNewBrand}
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
                    <FormItem className="mb-2 flex flex-row">
                      <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Location</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <div className="!m-0 flex min-h-[40px] flex-1 flex-row items-center rounded-md border border-input">
                          <div className="h-full w-full flex-1">
                            <SearchAndChooseButton
                              value={field.value}
                              placeholder="---Choose location---"
                              searchPlaceholder="Search location..."
                              onValueChanged={(val) => {
                                form.setValue("location", val, {
                                  shouldValidate: true,
                                });
                              }}
                              choices={productLocationChoices.map(
                                (c) => c.name,
                              )}
                            />
                          </div>
                          <AddNewThing
                            title="Add new location"
                            placeholder="Location's name"
                            open={openLocation}
                            onOpenChange={setOpenLocation}
                            onAddClick={addNewLocation}
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
                    <FormItem className="mb-2 flex flex-row">
                      <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Weight</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl className="!mt-0 flex flex-1 flex-row items-center">
                        <div className="focus-visible:outline-none">
                          <Input
                            type="number"
                            min={0}
                            className="!m-0 flex-1 text-end"
                            {...field}
                            onChange={(e) => {
                              form.setValue(
                                "weight",
                                isNaN(e.target.valueAsNumber)
                                  ? 0
                                  : e.target.valueAsNumber,
                                { shouldValidate: false },
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
                    <FormItem className="mb-2 flex flex-row">
                      <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Original price</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="!m-0 flex-1 text-end"
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            form.setValue(
                              "originalPrice",
                              isNaN(e.target.valueAsNumber)
                                ? 0
                                : e.target.valueAsNumber,
                              { shouldValidate: true },
                            )
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productPrice"
                  render={({ field }) => (
                    <FormItem className="mb-2 flex flex-row">
                      <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Product price</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="!m-0 flex-1 text-end"
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            form.setValue(
                              "productPrice",
                              isNaN(e.target.valueAsNumber)
                                ? 0
                                : e.target.valueAsNumber,
                              { shouldValidate: true },
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
                    <FormItem className="mb-2 flex flex-row">
                      <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Stock</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="!m-0 flex-1 text-end"
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
                              },
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
                    <FormItem className="mb-2 flex flex-row">
                      <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Min stock</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="!m-0 flex-1 text-end"
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
                              },
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
                    <FormItem className="mb-2 flex flex-row">
                      <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Max stock</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="!m-0 flex-1 text-end"
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
                              },
                            )
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unit.name"
                  render={({ field }) => (
                    <FormItem className="mb-2 flex flex-row">
                      <FormLabel className="flex w-[150px] flex-col justify-center text-black">
                        <div className="flex flex-row items-center gap-2">
                          <h5 className="text-sm">Unit name</h5>
                          <Info size={16} />
                        </div>
                        <FormMessage className="mr-2 text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="!m-0 flex-1 text-end"
                          min={0}
                          {...form.register("unit.name")}
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
                            fileUrl={imageLink}
                            onImageChanged={(newFileUrl) => {
                              handleImageChosen(newFileUrl, index);
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
            <div className="mb-4 rounded-sm border">
              <FormField
                control={form.control}
                name="properties"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger className="bg-gray-200 p-3 text-sm">
                            <div className="flex flex-row gap-10">
                              <p>Product properties</p>
                              <ProductPropertiesInputErrorFormMessage />
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
                                            <div className="ml-4 flex h-[35px] w-[250px] flex-row items-center justify-between border-b">
                                              {!value.key ||
                                              value.key.length === 0 ? (
                                                <>
                                                  <p className=" p-1 text-start">
                                                    Choose property...
                                                  </p>
                                                </>
                                              ) : (
                                                <>
                                                  <p className=" p-1 text-start">
                                                    {value.key}
                                                  </p>
                                                  <UpdatePropertyView
                                                    property={value}
                                                    onDeleteClick={
                                                      onDeleteProperty
                                                    }
                                                    onUpdateClick={
                                                      onUpdateProperty
                                                    }
                                                    onUpdateSuccess={(
                                                      newVal,
                                                      valId,
                                                    ) => {
                                                      const newValue =
                                                        field.value!.map((v) =>
                                                          v.id === valId
                                                            ? {
                                                                ...v,
                                                                key: newVal,
                                                              }
                                                            : v,
                                                        );

                                                      form.setValue(
                                                        "properties",
                                                        newValue,
                                                      );
                                                    }}
                                                    onDeleteSuccess={(
                                                      propertyId,
                                                    ) => {
                                                      form.setValue(
                                                        "properties",
                                                        field.value!.filter(
                                                          (v) =>
                                                            v.id !== propertyId,
                                                        ),
                                                      );
                                                    }}
                                                  ></UpdatePropertyView>
                                                </>
                                              )}
                                            </div>
                                          </PopoverTrigger>
                                          <PopoverContent className="p-0">
                                            {productPropertyChoices.map(
                                              (choice, choiceIndex) => {
                                                return (
                                                  <div
                                                    key={choiceIndex}
                                                    className="flex flex-row items-center justify-between rounded-sm p-2 hover:cursor-pointer hover:bg-slate-300"
                                                    onClick={() => {
                                                      if (
                                                        field.value![index]
                                                          .key === choice.name
                                                      ) {
                                                        field.value![
                                                          index
                                                        ].key = "";

                                                        form.setValue(
                                                          "properties",
                                                          [...field.value!],
                                                        );
                                                      } else if (
                                                        !field.value!.every(
                                                          (
                                                            fieldVal,
                                                            fieldIdx,
                                                          ) => {
                                                            return (
                                                              fieldVal.key !==
                                                              choice.name
                                                            );
                                                          },
                                                        )
                                                      ) {
                                                        toast({
                                                          description:
                                                            "Property has already been chosen",
                                                          variant:
                                                            "destructive",
                                                        });
                                                        return;
                                                      } else {
                                                        field.value![index].id =
                                                          choice.id;

                                                        field.value![
                                                          index
                                                        ].key = choice.name;

                                                        form.setValue(
                                                          "properties",
                                                          [...field.value!],
                                                        );
                                                      }
                                                    }}
                                                  >
                                                    <p className="text-sm">
                                                      {choice.name}
                                                    </p>
                                                    {value.key ===
                                                    choice.name ? (
                                                      <Check size={16} />
                                                    ) : null}
                                                  </div>
                                                );
                                              },
                                            )}
                                          </PopoverContent>
                                        </Popover>
                                        <div className="ml-8 flex flex-1 flex-row flex-wrap items-center gap-1">
                                          <Input
                                            placeholder="Type value and enter"
                                            value={field.value![index].value}
                                            onChange={(e) => {
                                              const properties = field.value!;
                                              properties[index].value =
                                                e.currentTarget.value;
                                              form.setValue("properties", [
                                                ...properties,
                                              ]);
                                            }}
                                            className="h-[35px] w-[200px] rounded-none border-0 border-b focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
                                                (_, idx) => idx !== index,
                                              ),
                                            );
                                          }}
                                        />
                                      </div>
                                    );
                                  })
                                : null}
                            </div>
                            <div className="flex flex-row">
                              <Button
                                variant={"green"}
                                className="ml-4 mt-2 h-[35px]"
                                type="button"
                                onClick={(e) => {
                                  let newVal: {
                                    id: number;
                                    key: string;
                                    value: string;
                                  }[];
                                  if (
                                    field.value === null ||
                                    field.value === undefined
                                  )
                                    newVal = [
                                      { id: 123123, key: "", value: "" },
                                    ];
                                  /// 123123 is trash number
                                  else
                                    newVal = [
                                      ...field.value,
                                      { id: 123123, key: "", value: "" }, /// 123123 is trash number
                                    ];
                                  form.setValue("properties", newVal, {
                                    shouldValidate: false,
                                  });
                                }}
                              >
                                <Plus size={16} className="mr-2" />
                                New property
                              </Button>
                              <ButtonAddNewThing
                                triggerTitle="Add property"
                                title="Add new property"
                                placeholder="Property's name"
                                open={openProperty}
                                onOpenChange={setOpenProperty}
                                onAddClick={addNewProperties}
                              />
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
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
            <div className="mb-4 rounded-sm border">
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="justify-center bg-gray-200 p-3 text-sm text-black">
                      <h5 className="text-sm">Note</h5>
                      <FormMessage className="mr-2 text-xs" />
                    </FormLabel>
                    <FormControl className="border-none">
                      <Textarea
                        className="!mt-0 min-h-[100px]  flex-1 resize-none !rounded-none p-2 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
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
                disabled={isCreatingNewProduct}
              >
                Save
                <LoadingCircle
                  className={
                    "ml-4 !w-4 " + (isCreatingNewProduct ? "" : "hidden")
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
                  onChangeVisibility(false);
                }}
                disabled={isCreatingNewProduct}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

const ProductPropertiesInputErrorFormMessage = React.forwardRef<
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
      message = customError[i].id
        ? customError[i].id.message
        : customError[i].value
          ? customError[i].value.message
          : null;
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
ProductPropertiesInputErrorFormMessage.displayName = "FormMessage";

const AddNewThing = ({
  title,
  placeholder,
  open,
  onOpenChange,
  onAddClick,
}: {
  title: string;
  placeholder: string;
  open: boolean;
  onOpenChange: (value: boolean) => any;
  onAddClick: (value: string) => Promise<any>;
}) => {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger>
        <PlusCircle size={16} className="mx-2" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <div className="!my-4 flex flex-row items-center gap-3 text-sm">
            <label htmlFor="alert_input" className="w-36 font-semibold">
              {placeholder}
            </label>
            <input
              id="alert_input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 rounded-sm border p-1"
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant={"green"}
            onClick={async (e) => {
              setIsLoading(true);
              await onAddClick(value);
              setIsLoading(false);
              onOpenChange(false);
            }}
            disabled={isLoading}
          >
            Done
            {isLoading ? <LoadingCircle /> : null}
          </Button>
          <AlertDialogCancel
            className={
              "!h-[35px] bg-red-400 text-white hover:bg-red-500 hover:text-white"
            }
            disabled={isLoading}
          >
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const ButtonAddNewThing = ({
  triggerTitle,
  title,
  placeholder,
  open,
  onOpenChange,
  onAddClick,
}: {
  triggerTitle: string;
  title: string;
  placeholder: string;
  open: boolean;
  onOpenChange: (value: boolean) => any;
  onAddClick: (value: string) => Promise<any>;
}) => {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger>
        <Button
          variant={"green"}
          className="ml-4 mt-2 h-[35px] border"
          type="button"
        >
          {triggerTitle}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <div className="!my-4 flex flex-row items-center gap-3 text-sm">
            <label htmlFor="alert_input" className="w-36 font-semibold">
              {placeholder}
            </label>
            <input
              id="alert_input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 rounded-sm border p-1"
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant={"green"}
            onClick={async (e) => {
              setIsLoading(true);
              await onAddClick(value);
              setIsLoading(false);
              onOpenChange(false);
            }}
            disabled={isLoading}
          >
            Done
            {isLoading ? <LoadingCircle /> : null}
          </Button>
          <AlertDialogCancel
            className={
              "!h-[35px] bg-red-400 text-white hover:bg-red-500 hover:text-white"
            }
            disabled={isLoading}
          >
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const UpdatePropertyView = ({
  property,
  onUpdateClick,
  onUpdateSuccess,
  onDeleteClick,
  onDeleteSuccess,
}: {
  property: {
    id: number;
    key: string;
  };
  onUpdateClick: (value: string, propertyId: number) => Promise<any>;
  onUpdateSuccess: (value: string, propertyId: number) => any;
  onDeleteClick: (propertyId: number) => Promise<any>;
  onDeleteSuccess: (propertyId: number) => any;
}) => {
  const Input = ({
    inputValue,
    setOpen,
  }: {
    inputValue: string;
    setOpen: any;
  }) => {
    const [value, setValue] = useState(inputValue);
    const [isLoading, setIsLoading] = useState(false);

    return (
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Change property</AlertDialogTitle>
          <div className="!my-4 flex flex-row items-center gap-3 text-sm">
            <label htmlFor="alert_input" className="w-36 font-semibold">
              Property&apos;s name
            </label>

            <input
              id="alert_input"
              defaultValue={property.key}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 rounded-sm border p-1"
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant={"green"}
            onClick={async (e) => {
              setIsLoading(true);
              await onUpdateClick(value, property.id)
                .then(() => {
                  onUpdateSuccess(value, property.id);
                })
                .finally(() => {
                  setIsLoading(false);
                  setOpen(false);
                });
            }}
            disabled={isLoading}
          >
            Done
            {isLoading ? <LoadingCircle /> : null}
          </Button>
          <Button
            variant={"red"}
            onClick={async (e) => {
              setIsLoading(true);
              await onDeleteClick(property.id)
                .then(() => {
                  onDeleteSuccess(property.id);
                })
                .finally(() => {
                  setIsLoading(false);
                  setOpen(false);
                });
            }}
            disabled={isLoading}
          >
            Delete property
            {isLoading ? <LoadingCircle /> : null}
          </Button>
          <AlertDialogCancel
            className={
              "!h-[35px] bg-red-400 text-white hover:bg-red-500 hover:text-white"
            }
            disabled={isLoading}
          >
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    );
  };
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger onClick={(e) => e.stopPropagation()}>
        <Pencil size={16} />
      </AlertDialogTrigger>
      <Input inputValue={property.key} setOpen={setOpen} />
    </AlertDialog>
  );
};

type CartesianResult = Record<string, string>;
function cartesian(
  input: { values: string[]; key: string }[],
): CartesianResult[] {
  const inputObj: Record<string, any[]> = {};
  input.forEach((value) => {
    inputObj[value.key] = value.values;
  });

  const keys = Object.keys(inputObj);
  const r: CartesianResult[] = [];
  const max: number = keys.length - 1;

  function helper(obj: Record<string, any>, i: number): void {
    const currentKey = keys[i];
    const currentArray = inputObj[currentKey];

    for (let j = 0, l = currentArray.length; j < l; j++) {
      const newObj = { ...obj, [currentKey]: currentArray[j] };
      if (i === max) {
        r.push(newObj as CartesianResult);
      } else {
        helper(newObj, i + 1);
      }
    }
  }

  helper({}, 0);
  return r;
}
