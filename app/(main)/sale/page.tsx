"use client";
import scrollbar_style from "@/styles/scrollbar.module.css";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  AlignJustify,
  ChevronLeft,
  ChevronRight,
  FileDown,
  FilePlus,
  Filter,
  Info,
  ListFilter,
  Minus,
  MoreVertical,
  PieChart,
  Plus,
  PlusCircle,
  Search,
  Trash,
  Undo,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { Product } from "@/entities/Product";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Invoice, InvoiceDetail } from "@/entities/Invoice";
import { addInvoice, updateInvoice } from "@/reducers/invoicesReducer";
import { format } from "date-fns";
import { faker } from "@faker-js/faker";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import InvoiceService from "@/services/invoice_service";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import { useToast } from "@/components/ui/use-toast";

export default function Sale() {
  const invoicesContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { toast } = useToast()
  const [chosenInvoicePosition, setChosenInvoicePosition] = useState(0);
  const products = useAppSelector((state) => state.products.value);
  const invoices = useAppSelector((state) => state.invoices.value);

  const onProductClick = (product: Product) => {
    let invoice = { ...invoices[chosenInvoicePosition] };

    if (invoice.invoiceDetails.every((v) => v.productId !== product.id)) {
      invoice.invoiceDetails = [
        ...invoice.invoiceDetails,
        {
          id: faker.number.int(),
          quantity: 1,
          price: product.productPrice,
          description: "",
          productId: product.id,
        },
      ];
    } else {
      invoice = {
        ...invoice,
        invoiceDetails: invoice.invoiceDetails.map((v) => {
          return v.productId === product.id
            ? {
                ...v,
                quantity: v.quantity + 1,
              }
            : v;
        }),
      };
    }
    dispatch(updateInvoice(invoice));
  };

  const onSubmitInvoice = () => {
    const invoice = invoices[chosenInvoicePosition];
    console.log(invoice)
    InvoiceService.uploadInvoice(invoice).then((response) => {
      console.log(response.data)
    }).catch((e) => axiosUIErrorHandler(e, toast))
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-600">
      <div className="flex flex-row items-center h-[calc(35px+1rem)] px-2">
        <div className="flex flex-row bg-white items-center rounded-sm pl-2 min-w-[250px] max-w-[400px] w-[400px] mx-2 my-auto">
          <Search size={20} color="rgb(156 163 175)" />
          <Input
            placeholder="Tìm hàng hóa (F3)"
            className="h-[35px] flex-1 border-0 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
          />
        </div>
        <ChevronLeft
          size={26}
          color="white"
          className="hover:cursor-pointer hover:bg-black hover:bg-opacity-50 p-1 rounded-full mr-2"
          onClick={(e) => {
            if (invoicesContainerRef.current)
              invoicesContainerRef.current.scrollLeft -= 20;
          }}
        />
        <div
          ref={invoicesContainerRef}
          className="flex flex-row h-full overflow-hidden max-w-[450px] overflow-x-hidden overflow-y-hidden"
        >
          {invoices.map((val, idx) => (
            <div
              key={idx}
              className={cn(
                "flex flex-row items-center min-w-[100px] w-[100px] hover:cursor-pointer px-2 mt-2 pb-4 rounded-t-sm h-full ease-linear duration-200",
                chosenInvoicePosition === idx
                  ? "bg-slate-200 text-black font-semibold"
                  : "hover:bg-slate-700 text-white"
              )}
              onClick={(e) => setChosenInvoicePosition(idx)}
            >
              <p className="flex-1 text-sm">Invoice {idx + 1}</p>
              <X
                size={16}
                className={cn(
                  "rounded-full p-[1px] ease-linear duration-100",
                  chosenInvoicePosition === idx
                    ? "hover:bg-slate-600 hover:text-white"
                    : "hover:bg-opacity-50 hover:bg-slate-50"
                )}
              />
            </div>
          ))}
        </div>
        <ChevronRight
          size={26}
          color="white"
          className="hover:cursor-pointer hover:bg-black hover:bg-opacity-50 p-1 rounded-full mx-2"
          onClick={(e) => {
            if (invoicesContainerRef.current)
              invoicesContainerRef.current.scrollLeft += 20;
          }}
        />
        <PlusCircle
          size={26}
          color="white"
          className="hover:cursor-pointer hover:bg-black hover:bg-opacity-50 p-1 rounded-full"
        />
        <div className="flex-1 min-w-[16px]" />
        <Popover>
          <PopoverTrigger className="mr-2">
            <AlignJustify size={24} color="white" className="end" />
          </PopoverTrigger>
          <PopoverContent className="flex flex-col rounded-sm bg-white p-2 mr-2">
            <div className="flex flex-row items-center gap-4 p-2 hover:cursor-pointer hover:bg-slate-200">
              <PieChart size={16} />
              <p className="text-sm font-medium">End of day report</p>
            </div>
            <div className="flex flex-row items-center gap-4 p-2 hover:cursor-pointer hover:bg-slate-200">
              <Undo size={16} />
              <p className="text-sm font-medium">Return</p>
            </div>
            <div className="flex flex-row items-center gap-4 p-2 hover:cursor-pointer hover:bg-slate-200">
              <FileDown size={16} />
              <p className="text-sm font-medium">New Receipt</p>
            </div>
            <div className="flex flex-row items-center gap-4 p-2 hover:cursor-pointer hover:bg-slate-200">
              <FilePlus size={16} />
              <p className="text-sm font-medium">Import</p>
            </div>
            <div className="flex flex-row items-center gap-4 p-2 hover:cursor-pointer hover:bg-slate-200">
              <Info size={16} />
              <p className="text-sm font-medium">Shortcuts</p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex-1 bg-slate-200 flex flex-row">
        <div className="flex flex-col grow shrink basis-7/12">
          <div className="flex flex-col flex-1">
            {invoices[chosenInvoicePosition].invoiceDetails.map(
              (detail, detailIdx) => (
                <InvoiceDetailView
                  key={detailIdx}
                  products={products}
                  invoice={invoices[chosenInvoicePosition]}
                  detailIndex={detailIdx}
                />
              )
            )}
          </div>
          <div className="flex flex-row min-h-[50px] bg-white rounded-md m-2 items-center">
            <Textarea
              placeholder="Invoice's note"
              onInput={(e) => autoGrowTextArea(e.currentTarget)}
              className={cn(
                scrollbar_style.scrollbar,
                "flex-1 m-2 resize-none max-h-[80px] min-h-[40px] h-[40px] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              )}
            />
            <div className="flex flex-col text-sm mx-4 min-w-[200px]">
              <p>
                Total quantity:{" "}
                <span className="font-semibold">
                  {invoices[chosenInvoicePosition].invoiceDetails
                    .map((v) => v.quantity)
                    .reduce((prev, cur) => prev + cur, 0)}
                </span>
              </p>
              <p>
                Total cost:{" "}
                <span className="font-semibold">
                  {invoices[chosenInvoicePosition].invoiceDetails
                    .map((v) => v.quantity * products.find(product => product.id === v.productId)!.productPrice)
                    .reduce((prev, cur) => prev + cur, 0)}{" "}
                  VNĐ
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="grow shrink basis-5/12 rounded-md m-2 ml-0 bg-white p-2 flex flex-col">
          <div className="flex flex-row">
            <div className="flex flex-row bg-slate-200 items-center rounded-sm px-2 min-w-[250px] max-w-[400px] w-[250px] mr-2">
              <Search size={20} color="rgb(156 163 175)" />
              <Input
                placeholder="Find customer (F4)"
                className="h-[40px] w-[170px] flex-1 border-0 bg-slate-200 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
              />
              <Plus size={20} />
            </div>
            <div className="flex-1" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <ListFilter size={20} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter by ...</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger className="ml-2">
                  <Filter size={20} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter by ...</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {/* 2.5rem is "Make Payment" button, 35px+1rem is the top bar, -40px-1rem is padding + margin + "find customer" button, 1rem is its own margin, 0.5rem is some random i put in because there was some mistake and i dont know how to find itP */}
          <div className="flex flex-row flex-wrap flex-1 w-full max-h-[calc(100vh-2.5rem-40px-1rem-40px-1rem-1rem-0.5rem)] overflow-y-auto my-2">
            {products.map((product, idx) => (
              <ProductView
                key={idx}
                product={product}
                onClick={() => {
                  onProductClick(product);
                }}
              />
            ))}
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant={"blue"} className="uppercase text-white">
                Make Payment
              </Button>
            </SheetTrigger>
            <SheetContent className="h-full p-3 flex flex-col min-w-[500px] rounded-l-2xl">
              <SheetHeader>
                <p className="ml-4">{invoices[chosenInvoicePosition].createdAt}</p>
              </SheetHeader>
              <div className="flex flex-col flex-1 gap-4 px-4">
                <p className="text-xl font-bold">GUEST</p>
                <div className="flex flex-row items-center justify-between">
                  <p>Sub total</p>
                  <p>{invoices[chosenInvoicePosition].subTotal}</p>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-row gap-4">
                    <p>Discount code</p>
                    <input className="border-b text-sm border-black w-[120px]"/>
                  </div>
                  <p>{invoices[chosenInvoicePosition].discount}</p>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <p className="font-semibold">Total</p>
                  <p className="font-bold text-blue-500">
                    {invoices[chosenInvoicePosition].total}
                  </p>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <Label
                    htmlFor="customer_pay"
                    className="font-semibold text-md"
                  >
                    Customer pay
                  </Label>
                  <input
                    id="customer_pay"
                    type="number"
                    value={invoices[chosenInvoicePosition].cash}
                    onChange={(e) => {
                      dispatch(
                        updateInvoice({
                          ...invoices[chosenInvoicePosition],
                          cash: e.currentTarget.valueAsNumber,
                        })
                      );
                    }}
                    className="text-right border-0 border-b border-black h-[24px] rounded-none p-0 text-md focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="flex flex-row items-center justify-between">
                  <RadioGroup defaultValue="cash" className="flex flex-row gap-8  ">
                    <div className="flex flex-row items-center">
                      <RadioGroupItem
                        id="cash_payment"
                        value="cash"
                        className="mr-3"
                      ></RadioGroupItem>
                      <Label htmlFor="cash_payment">Cash</Label>
                    </div>
                    <div className="flex flex-row items-center m-1">
                      <RadioGroupItem
                        id="bank_transfer_payment"
                        value="bank_transfer"
                        className="mr-3"
                      ></RadioGroupItem>
                      <Label htmlFor="bank_transfer_payment">Bank transfer</Label>
                    </div>
                    <div className="flex flex-row items-center">
                      <RadioGroupItem
                        id="card_payment"
                        value="card"
                        className="mr-3"
                      ></RadioGroupItem>
                      <Label htmlFor="card_payment">Card</Label>
                    </div>
                  </RadioGroup>
                </div>
                {invoices[chosenInvoicePosition].cash >
                invoices[chosenInvoicePosition].total ? (
                  <div className="flex flex-row items-center justify-between text-sm">
                    <p>Give change to customer</p>
                    <p>
                      {invoices[chosenInvoicePosition].cash -
                        invoices[chosenInvoicePosition].total}
                    </p>
                  </div>
                ) : null}
              </div>
              <SheetFooter>
                <Button
                  variant={"blue"}
                  type="submit"
                  className="w-full h-[50px]"
                  onClick={onSubmitInvoice}
                >
                  COMPLETE
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}

const ProductView = ({
  product,
  onClick,
}: {
  product: Product;
  onClick: () => any;
}) => {
  return (
    <div
      className="w-1/3 max-h-[70px] hover:cursor-pointer flex flex-row px-3 py-5 border border-transparent hover:border-blue-300 gap-2 items-center rounded-sm"
      onClick={onClick}
    >
      <Image
        src={
          product.images && product.images[0]
            ? product.images[0]
            : "/default-product-img.jpg"
        }
        width={30}
        height={50}
        className="w-[40px] h-[50px] object-contain border"
        alt="product image"
      />
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold">{product.name}</p>
        <p className="text-xs font-semibold text-sky-700">
          {product.productPrice}
        </p>
      </div>
    </div>
  );
};

const InvoiceDetailView = ({
  products,
  invoice,
  detailIndex,
}: {
  products: Product[],
  invoice: Invoice;
  detailIndex: number;
}) => {
  const dispatch = useAppDispatch();
  const detail = invoice.invoiceDetails[detailIndex];
  const detailProduct = products.find(product => product.id === detail.productId)!

  const changeQuantity = (value: number) => {
    if (value < 0 && detail.quantity == 0) return;
    const updatedInvoice: Invoice = {
      ...invoice,
      invoiceDetails: invoice.invoiceDetails.map((v) =>
        v.id === detail.id
          ? { ...detail, quantity: detail.quantity + value }
          : v
      ),
    };
    dispatch(updateInvoice(updatedInvoice));
  };

  const removeDetail = () => {
    const updatedInvoice: Invoice = {
      ...invoice,
      invoiceDetails: invoice.invoiceDetails.filter((v) => v.id !== detail.id),
    };
    dispatch(updateInvoice(updatedInvoice));
  };

  return (
    <div className="rounded-md bg-white flex flex-col m-2 px-2 py-4 group">
      <div className="flex flex-row items-center leading-5 text-[0.925rem] mb-4">
        <p className="mx-4">{detailIndex}</p>
        <Trash
          size={16}
          onClick={removeDetail}
          className="hover:cursor-pointer"
          fill="black"
        />
        <p className="mx-4">{detailProduct.id}</p>
        <p className="flex-1">{detailProduct.name}</p>
        <MoreVertical className="mx-4" size={16} />
      </div>
      <div className="flex flex-row items-center">
        <Minus
          size={22}
          className="invisible group-hover:visible rounded-full p-1 bg-slate-200 hover:bg-slate-300 hover:cursor-pointer ml-[80px]"
          onClick={(e) => changeQuantity(-1)}
        />
        <input
          type="number"
          min={0}
          value={detail.quantity}
          className="border-b border-gray-500 mx-2 w-[50px] text-center"
        />
        <Plus
          size={22}
          className="invisible group-hover:visible rounded-full p-1 bg-slate-200 hover:bg-slate-300 hover:cursor-pointer"
          onClick={(e) => changeQuantity(1)}
        />
        <div className="flex-1 min-w-[80px]" />
        <div className="min-w-[100px] border-b text-end border-gray-500 mr-[80px]">
          <p>{detail.price}</p>
        </div>
        <div className="min-w-[100px] border-b text-end border-gray-500">
          <p>{detail.price * detail.quantity}</p>
        </div>
      </div>
    </div>
  );
};

function autoGrowTextArea(element: HTMLTextAreaElement) {
  element.style.height = "5px";
  element.style.height = element.scrollHeight + "px";
}