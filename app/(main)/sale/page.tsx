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
  Pencil,
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
import {
  addInvoice,
  createNewInvoice,
  deleteInvoice,
  updateInvoice,
} from "@/reducers/invoicesReducer";
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
import createInvoicePdf from "./createInvoicePdf";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import LoadingCircle from "@/components/ui/loading_circle";
import NewCustomerDialog from "@/components/ui/new_customer_dialog";

export default function Sale() {
  const invoicesContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [chosenInvoicePosition, setChosenInvoicePosition] = useState(0);
  const products = useAppSelector((state) => state.products.value);
  const invoices = useAppSelector((state) => state.invoices.value);
  const [isCompletingInvoice, setIsCompletingInvoice] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen bg-blue-500">
      <div className="flex flex-row items-center h-[calc(35px+1rem)] px-2">
        <div className="flex flex-row bg-white items-center rounded-sm pl-2 min-w-[250px] max-w-[400px] w-[400px] mx-2 my-auto">
          <Search size={20} color="rgb(156 163 175)" />
          <div className="flex-1">
            <Input
              placeholder="Find products..."
              className="h-[35px] w-full border-0 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
            />
          </div>
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
              <AlertDialog>
                <AlertDialogTrigger asChild disabled={isCompletingInvoice}>
                  <X
                    size={16}
                    className={cn(
                      "rounded-full p-[1px] ease-linear duration-100",
                      chosenInvoicePosition === idx
                        ? "hover:bg-slate-600 hover:text-white"
                        : "hover:bg-opacity-50 hover:bg-slate-50"
                    )}
                  />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Remove invoice {idx + 1}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure to delete the invoice?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        if (isCompletingInvoice) return;
                        dispatch(deleteInvoice(invoices[idx].id));
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
          onClick={() => dispatch(createNewInvoice())}
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
      <InvoiceView
        isCompletingInvoice={isCompletingInvoice}
        setIsCompletingInvoice={setIsCompletingInvoice}
        products={products}
        invoice={invoices[chosenInvoicePosition]}
      />
    </div>
  );
}

const InvoiceView = ({
  isCompletingInvoice,
  setIsCompletingInvoice,
  invoice,
  products,
}: {
  isCompletingInvoice: boolean;
  setIsCompletingInvoice: (value: boolean) => any;
  invoice: Invoice;
  products: Product[];
}) => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [discountCode, setDiscountCode] = useState("");
  const [showAddNewCustomer, setShowAddNewCustomer] = useState(false);

  const onProductClick = (product: Product) => {
    let modifiedInvoice = { ...invoice };
    let detailInvoice: InvoiceDetail;

    if (
      modifiedInvoice.invoiceDetails.every((v) => v.productId !== product.id)
    ) {
      detailInvoice = {
        id: faker.number.int(),
        quantity: 1,
        price: product.productPrice,
        description: "",
        productId: product.id,
      };
      modifiedInvoice.invoiceDetails = [
        ...invoice.invoiceDetails,
        detailInvoice,
      ];
    } else {
      modifiedInvoice = {
        ...invoice,
        invoiceDetails: invoice.invoiceDetails.map((v) => {
          if (v.productId === product.id) {
            detailInvoice = {
              ...v,
              quantity: v.quantity + 1,
            };
            return detailInvoice;
          }
          return v;
        }),
      };
    }

    onDetailQuantityChanged(detailInvoice!.quantity, detailInvoice!);
    dispatch(updateInvoice(modifiedInvoice));
  };

  const updateDiscountCode = (value: string) => {
    const modifiedInvoice = {
      ...invoice,
      discountCode: value,
    };
    dispatch(updateInvoice(modifiedInvoice));
  };

  const onSubmitInvoice = async () => {
    if (exceedStockDetailIds.length > 0)
      return toast({
        description:
          "Product exceeds stock, please check your product's quantity",
        variant: "destructive",
      });
    const submitInvoice: any = JSON.parse(JSON.stringify(invoice));
    if (submitInvoice["id"]) delete submitInvoice.id;
    if (submitInvoice.invoiceDetails)
      submitInvoice.invoiceDetails.forEach((v: any) => delete v.id);

    setIsCompletingInvoice(true);
    await InvoiceService.uploadInvoice(submitInvoice)
      .then((response) => {
        dispatch(deleteInvoice(invoice.id));
        createInvoicePdf(submitInvoice, products);
      })
      .catch((e) => {
        axiosUIErrorHandler(e, toast);
      })
      .finally(() => {
        setIsCompletingInvoice(false);
      });
  };

  const [exceedStockDetailIds, setExceedStockDetailIds] = useState<number[]>(
    []
  );
  function onDetailQuantityChanged(value: number, detail: InvoiceDetail): any {
    let exceedState = [...exceedStockDetailIds];
    if (products.find((v) => v.id === detail.productId)!.stock < value)
      exceedState.push(detail.id);
    else if (exceedStockDetailIds.includes(detail.id))
      exceedState = exceedState.filter((v) => v !== detail.id);

    setExceedStockDetailIds(exceedState);
  }

  return (
    <div className="flex-1 bg-slate-200 flex flex-row">
      <div className="flex flex-col grow shrink basis-7/12">
        <div
          className={cn(
            scrollbar_style.scrollbar,
            "flex flex-col flex-1 gap-2 m-2 pr-1 mr-1 overflow-y-auto max-h-[calc(100vh-40px-1rem-50px-0.75rem)]"
          )}
        >
          {invoice.invoiceDetails.map((detail, detailIdx) => (
            <InvoiceDetailView
              key={detailIdx}
              products={products}
              invoice={invoice}
              detailIndex={detailIdx}
              onDetailQuantityChange={(value: number) =>
                onDetailQuantityChanged(value, detail)
              }
              showExceedError={exceedStockDetailIds.includes(detail.id)}
              onDeleteDetail={() => {
                const idx = exceedStockDetailIds.indexOf(detail.id);
                if (idx !== -1)
                  setExceedStockDetailIds((v) => {
                    v.splice(idx, 1);
                    return v;
                  });
              }}
            />
          ))}
        </div>
        <div className="flex flex-row h-[50px] bg-white rounded-md m-2 mt-0 items-center">
          <Textarea
            placeholder="Invoice's note"
            value={invoice.note}
            onChange={(e) => {
              dispatch(
                updateInvoice({
                  ...invoice,
                  note: e.currentTarget.value,
                })
              );
            }}
            className={cn(
              scrollbar_style.scrollbar,
              "flex-1 m-2 resize-none max-h-[80px] min-h-[40px] h-[40px] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            )}
          />
          <div className="flex flex-col text-sm mx-4 min-w-[200px]">
            <p>
              Total quantity:{" "}
              <span className="font-semibold">
                {invoice.invoiceDetails
                  .map((v) => v.quantity)
                  .reduce((prev, cur) => prev + cur, 0)}
              </span>
            </p>
            <p>
              Total cost:{" "}
              <span className="font-semibold">
                {invoice.invoiceDetails
                  .map(
                    (v) =>
                      v.quantity *
                      products.find((product) => product.id === v.productId)!
                        .productPrice
                  )
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
            <NewCustomerDialog DialogTrigger={<Plus size={20} />} />
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
        {/* 2.5rem is "Make Payment" button, 40px+1rem is the top bar, -40px-1rem is padding + margin + "find customer" button, 1rem is its own margin, 0.5rem is some random i put in because there was some mistake and i dont know how to find it :P */}
        <div className="flex flex-row flex-wrap flex-1 !content-start w-full max-h-[calc(100vh-2.5rem-40px-1rem-40px-1rem-1rem-0.5rem)] overflow-y-auto my-2">
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
              <p className="ml-4">{invoice.createdAt}</p>
            </SheetHeader>
            <div className="flex flex-col flex-1 gap-4 px-4">
              <p className="text-xl font-bold">GUEST</p>
              <div className="flex flex-row items-center justify-between">
                <p>Sub total</p>
                <p>{invoice.subTotal}</p>
              </div>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row gap-4">
                  <p>Discount code</p>
                  {invoice.discountCode && invoice.discountCode.length > 0 ? (
                    <div className="flex flex-row rounded-sm p-1 text-xs items-center gap-1 bg-blue-300">
                      <p>{invoice.discountCode}</p>
                      <X
                        size={16}
                        className="hover:bg-slate-100 rounded-full p-[1px] hover:cursor-pointer"
                        onClick={() => updateDiscountCode("")}
                      />
                    </div>
                  ) : (
                    <input
                      className="border-b text-sm border-black w-[120px]"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.currentTarget.value)}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          e.currentTarget.value.length > 0
                        )
                          updateDiscountCode(e.currentTarget.value);
                      }}
                    />
                  )}
                </div>
                <p>{invoice.discount}</p>
              </div>
              <div className="flex flex-row items-center justify-between">
                <p className="font-semibold">Total</p>
                <p className="font-bold text-blue-500">{invoice.total}</p>
              </div>
              <div className="flex flex-row items-center justify-between">
                <Label htmlFor="customer_pay" className="font-semibold text-md">
                  Customer pay
                </Label>
                <input
                  id="customer_pay"
                  type="number"
                  value={invoice.cash}
                  onChange={(e) => {
                    dispatch(
                      updateInvoice({
                        ...invoice,
                        cash: e.currentTarget.valueAsNumber,
                      })
                    );
                  }}
                  className="text-right border-0 border-b border-black h-[24px] rounded-none p-0 text-md focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <div className="flex flex-row items-center justify-between">
                <RadioGroup
                  defaultValue="cash"
                  className="flex flex-row gap-8  "
                >
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
              {invoice.cash > invoice.total ? (
                <div className="flex flex-row items-center justify-between text-sm">
                  <p>Give change to customer</p>
                  <p>{invoice.cash - invoice.total}</p>
                </div>
              ) : null}
            </div>
            <SheetFooter>
              <Button
                variant={"blue"}
                type="submit"
                className="w-full h-[50px]"
                onClick={onSubmitInvoice}
                disabled={isCompletingInvoice}
              >
                COMPLETE
                {isCompletingInvoice ? <LoadingCircle /> : null}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

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
        <div className="flex flex-row gap-1">
          <p className="text-sm font-semibold">{product.name}</p>
          {product.propertiesString ? (
            <div className="rounded-sm bg-blue-300 text-white px-1 max-w-[80px] whitespace-nowrap overflow-hidden">
              <p className="text-xs animate-marquee">
                {product.propertiesString}
              </p>
            </div>
          ) : null}
        </div>
        <p className="text-xs font-semibold text-sky-700">
          {product.productPrice}/{product.salesUnits.name}
        </p>
      </div>
    </div>
  );
};

const InvoiceDetailView = ({
  products,
  invoice,
  detailIndex,
  onDetailQuantityChange,
  onDeleteDetail,
  showExceedError,
}: {
  products: Product[];
  invoice: Invoice;
  detailIndex: number;
  onDeleteDetail: () => any;
  onDetailQuantityChange: (value: number) => any;
  showExceedError: boolean;
}) => {
  const dispatch = useAppDispatch();
  const detail = invoice.invoiceDetails[detailIndex];
  const detailProduct = products.find(
    (product) => product.id === detail.productId
  )!;
  const [showDescription, setShowDescription] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  const updateQuantity = (value: number) => {
    if (isNaN(value) || value <= 0) value = 1;
    const updatedInvoice: Invoice = {
      ...invoice,
      invoiceDetails: invoice.invoiceDetails.map((v) =>
        v.id === detail.id ? { ...detail, quantity: value } : v
      ),
    };

    onDetailQuantityChange(value);
    dispatch(updateInvoice(updatedInvoice));
  };

  const deleteDetail = () => {
    onDeleteDetail();
    const updatedInvoice: Invoice = {
      ...invoice,
      invoiceDetails: invoice.invoiceDetails.filter((v) => v.id !== detail.id),
    };
    dispatch(updateInvoice(updatedInvoice));
  };

  const updateDetailDescription = (newDescription: string) => {
    const updatedInvoice: Invoice = {
      ...invoice,
      invoiceDetails: invoice.invoiceDetails.map((v) =>
        v.id === detail.id ? { ...detail, description: newDescription } : v
      ),
    };
    dispatch(updateInvoice(updatedInvoice));
  };

  return (
    <div className="rounded-md bg-white flex flex-col px-2 py-4 group">
      <div className="flex flex-row items-center leading-5 text-[0.925rem] mb-4">
        <p className="mx-4">{detailIndex}</p>
        <Trash
          size={16}
          onClick={deleteDetail}
          className="hover:cursor-pointer"
          fill="black"
        />
        <p className="mx-4">{detailProduct.id}</p>
        <p className="flex-1">
          {detailProduct.name}
          {detailProduct.propertiesString ? (
            <span className="px-1 ml-2 rounded-sm bg-blue-300 text-white text-xs animate-marquee">
              {detailProduct.propertiesString}
            </span>
          ) : (
            ""
          )}
          {showExceedError ? (
            <span className="px-1 ml-2 rounded-sm bg-red-400 text-white text-xs animate-marquee">
              Quantity exceeds stock
            </span>
          ) : (
            ""
          )}
        </p>
        <Popover open={showPopover} onOpenChange={setShowPopover}>
          <PopoverTrigger asChild>
            <MoreVertical className="mx-4 hover:cursor-pointer" size={16} />
          </PopoverTrigger>
          <PopoverContent asChild>
            <Button
              onClick={() => {
                if (showDescription) {
                  updateDetailDescription("");
                  setShowDescription(false);
                } else setShowDescription(true);
                setShowPopover(false);
              }}
              className="w-[100px] hover:bg-slate-200"
            >
              <Pencil size={16} className="mr-3" />
              <p>Note</p>
            </Button>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-row items-center px-[20px]">
        <Minus
          size={22}
          className={cn(
            "invisible rounded-full p-1 bg-slate-200 hover:bg-slate-300 hover:cursor-pointer ml-[60px]",
            detail.quantity >= 2 ? " group-hover:visible" : ""
          )}
          onClick={(e) => updateQuantity(detail.quantity - 1)}
        />
        <input
          type="number"
          min={1}
          value={detail.quantity}
          onChange={(e) => updateQuantity(e.currentTarget.valueAsNumber)}
          className="border-b border-gray-500 mx-2 w-[50px] text-center"
        />
        <Plus
          size={22}
          className="invisible group-hover:visible rounded-full p-1 bg-slate-200 hover:bg-slate-300 hover:cursor-pointer"
          onClick={(e) => updateQuantity(detail.quantity + 1)}
        />
        <div className="flex-1 min-w-[80px]" />
        <div className="min-w-[100px] border-b text-end border-gray-500 mr-[80px]">
          <p>{detail.price}</p>
        </div>
        <div className="min-w-[100px] border-b text-end border-gray-500">
          <p>{detail.price * detail.quantity}</p>
        </div>
      </div>
      {showDescription ? (
        <textarea
          value={detail.description}
          onChange={(e) => updateDetailDescription(e.currentTarget.value)}
          className="resize-none h-11 w-[96%] p-1 border mt-2 mx-auto text-xs rounded-sm"
          placeholder="Note..."
        />
      ) : null}
    </div>
  );
};

function autoGrowTextArea(element: HTMLTextAreaElement) {
  element.style.height = "5px";
  element.style.height = element.scrollHeight + "px";
}
