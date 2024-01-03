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
import { QrScanner } from "@yudiel/react-qr-scanner";
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
  Scan,
  ScanLine,
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
import {
  Invoice,
  InvoiceDetail,
  InvoicePaymentMethod,
} from "@/entities/Invoice";
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
import InvoiceService from "@/services/invoiceService";
import { axiosUIErrorHandler } from "@/services/axiosUtils";
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
import NewCustomerDialog from "@/components/component/new_customer_dialog";
import SearchView from "@/components/component/SearchView";
import PropertiesString from "@/components/ui/properties_string_view";
import { Customer } from "@/entities/Customer";
import { decode } from "punycode";
import DiscountService from "@/services/discountService";
import { Discount, DiscountCode } from "@/entities/Discount";
import { format, isAfter, isBefore } from "date-fns";
import { addInvoice } from "@/reducers/invoicesReducer";
import * as invoiceReducer from "@/reducers/invoicesReducer";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import ProductService from "@/services/productService";
import CustomerService from "@/services/customerService";
import { setProducts } from "@/reducers/productsReducer";
import { setCustomers } from "@/reducers/customersReducer";
import { setDiscounts } from "@/reducers/discountsReducer";
import ChooseInvoiceToReturnDialog from "@/components/component/choose_invoice_to_return_dialog";
import { setCustomerGroups } from "@/reducers/customerGroupsReducer";
import { useRouter } from "next/navigation";

// TODO: add the staffId
function getNewInvoice(): Invoice {
  return {
    id: faker.number.int(),
    discountValue: 0,
    customerId: null,
    cash: 0,
    changed: 0,
    subTotal: 0,
    total: 0,
    discountCode: null,
    note: "",
    staffId: 1,
    paymentMethod: "Cash",
    createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    invoiceDetails: [],
  };
}

const ProductSearchItemView: (product: Product) => React.ReactNode = (
  product: Product,
) => {
  return (
    <div className="m-1 flex flex-row items-center gap-2 rounded-sm p-1 px-4 hover:cursor-pointer hover:bg-blue-200">
      <img
        className="h-10 w-10 border object-contain object-center"
        src={
          product.images && product.images.length > 0
            ? product.images[0]
            : "/default-product-img.jpg"
        }
      />
      <div className="flex flex-1 flex-col text-sm">
        <p className="font-semibold">
          {product.name}
          <PropertiesString
            propertiesString={product.propertiesString}
            className="ml-1"
          />
        </p>
        <p>ID: {product.id}</p>
        <p>In stock: {product.stock}</p>
      </div>
      <p className="text-base text-blue-400">
        {product.productPrice}/{product.salesUnits.name}
      </p>
    </div>
  );
};

const CustomerSearchItemView: (customer: Customer) => React.ReactNode = (
  customer: Customer,
) => {
  return (
    <div className="m-1 flex flex-row items-center gap-2 rounded-sm p-1 hover:cursor-pointer hover:bg-blue-200">
      <img
        className="h-10 w-10 border object-contain object-center"
        src={customer.image?.url ?? "/ic_user.png"}
      />
      <div className="flex flex-1 flex-col text-sm">
        <p>Name: {customer.name}</p>
        <p>ID: {customer.id}</p>
      </div>
    </div>
  );
};

export default function Sale() {
  const invoicesContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [chosenInvoicePosition, setChosenInvoicePosition] = useState(0);
  const [isCompletingInvoice, setIsCompletingInvoice] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const products = useAppSelector((state) => state.products.value);
  const customers = useAppSelector((state) => state.customers.value);
  const discounts = useAppSelector((state) => state.discounts.value);
  const dispatch = useAppDispatch();
  const [invoices, setInvoices] = useState<Invoice[]>([getNewInvoice()]); // invoices that are selling

  React.useEffect(() => {
    dispatch(showPreloader());

    const fetchData = async () => {
      const products = await ProductService.getAllProducts();
      const customers = await CustomerService.getAllCustomers();
      const customerGroups = await CustomerService.getAllCustomerGroups();
      const discounts = await DiscountService.getAllDiscounts();
      const invoices = await InvoiceService.getAllInvoices();
      dispatch(setProducts(products.data));
      dispatch(setCustomers(customers.data));
      dispatch(setDiscounts(discounts.data));
      dispatch(setCustomerGroups(customerGroups.data));
      dispatch(invoiceReducer.setInvoices(invoices.data));
    };

    fetchData()
      .catch((e) => axiosUIErrorHandler(e, toast, router))
      .finally(() => dispatch(disablePreloader()));
  }, []);

  const updateInvoice = (updateInvoice: Invoice) => {
    updateInvoice.subTotal = updateInvoice.invoiceDetails
      .map((v) => v.price * v.quantity)
      .reduce((prev, cur) => prev + cur, 0);
    updateInvoice.total = updateInvoice.subTotal - updateInvoice.discountValue;
    updateInvoice.cash = updateInvoice.total;

    setInvoices((invoices) => {
      return invoices.map((invoice) => {
        if (invoice.id === updateInvoice.id) return updateInvoice;
        else return invoice;
      });
    });
  };

  const deleteInvoice = (invoiceId: number) => {
    const invoicePosition = invoices.findIndex(
      (invoice) => invoice.id === invoiceId,
    );
    if (invoicePosition === -1)
      return toast({
        variant: "destructive",
        description: "Can't delete invoice, something went wrong!",
      });
    if (chosenInvoicePosition >= invoicePosition && chosenInvoicePosition > 0)
      setChosenInvoicePosition((prev) => prev - 1);

    setInvoices((invoices) => {
      const modifiedInvoices = invoices.filter(
        (invoice) => invoice.id !== invoiceId,
      );
      if (modifiedInvoices.length === 0) modifiedInvoices.push(getNewInvoice());
      return modifiedInvoices;
    });
  };

  const addNewInvoice = () => {
    setInvoices((invoices) => [...invoices, getNewInvoice()]);
  };

  const onProductClick = (currentInvoice: Invoice, product: Product) => {
    let modifiedInvoice = { ...currentInvoice };
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
        ...currentInvoice.invoiceDetails,
        detailInvoice,
      ];
    } else {
      modifiedInvoice = {
        ...currentInvoice,
        invoiceDetails: currentInvoice.invoiceDetails.map((v) => {
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

    updateInvoice(modifiedInvoice);
    return modifiedInvoice;
  };

  return (
    <>
      {showScanner ? (
        <div
          className="fixed z-[9] flex h-screen w-screen items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowScanner(false);
          }}
        >
          <div className="h-[500px] w-[500px]">
            <QrScanner
              onDecode={(result) => {
                setShowScanner(false);
                const product = products.find(
                  (product) => product.barcode === result,
                );
                if (product) {
                  onProductClick(invoices[chosenInvoicePosition], product);
                  toast({
                    description: "Scan product successfully",
                  });
                } else
                  toast({
                    description: "Can't find product with barcode " + result,
                    variant: "destructive",
                  });
              }}
              onError={(error) => {
                if (error)
                  toast({
                    title: error.name,
                    description: error.message,
                    variant: "destructive",
                  });
              }}
            />
          </div>
        </div>
      ) : null}
      <div className="flex h-screen w-screen flex-col bg-blue-500">
        <div className="flex h-[calc(35px+1rem)] flex-row items-center px-2">
          <div className="mx-2 my-auto w-[400px] min-w-[250px] max-w-[400px] rounded-sm bg-white">
            <SearchView
              placeholder="Find products by id or name"
              className="flex-1"
              choices={products}
              onSearchChange={(value) => setProductSearch(value)}
              itemView={ProductSearchItemView}
              onItemClick={(product) =>
                onProductClick(invoices[chosenInvoicePosition], product)
              }
              filter={(product) =>
                product.id.toString().includes(productSearch) ||
                product.name.toLowerCase().includes(productSearch.toLowerCase())
              }
              endIcon={
                <ScanLine
                  size={20}
                  color="rgb(156 163 175)"
                  className="mr-2 hover:cursor-pointer"
                  onClick={(e) => setShowScanner((prev) => !prev)}
                />
              }
              zIndex={10}
            />
          </div>
          <ChevronLeft
            size={26}
            color="white"
            className="mr-2 rounded-full p-1 hover:cursor-pointer hover:bg-black hover:bg-opacity-50"
            onClick={(e) => {
              if (invoicesContainerRef.current)
                invoicesContainerRef.current.scrollLeft -= 20;
            }}
          />
          <div
            ref={invoicesContainerRef}
            className="flex h-full max-w-[450px] flex-row overflow-hidden overflow-x-hidden overflow-y-hidden"
          >
            {invoices.map((val, idx) => (
              <div
                key={idx}
                className={cn(
                  "mt-2 flex h-full w-[100px] min-w-[100px] flex-row items-center rounded-t-sm px-2 pb-4 duration-200 ease-linear hover:cursor-pointer",
                  chosenInvoicePosition === idx
                    ? "bg-slate-200 font-semibold text-black"
                    : "text-white hover:bg-slate-700",
                )}
                onClick={(e) => setChosenInvoicePosition(idx)}
              >
                <p className="flex-1 text-sm">Invoice {idx + 1}</p>
                <AlertDialog>
                  <AlertDialogTrigger asChild disabled={isCompletingInvoice}>
                    <X
                      size={16}
                      className={cn(
                        "rounded-full p-[1px] duration-100 ease-linear",
                        chosenInvoicePosition === idx
                          ? "hover:bg-slate-600 hover:text-white"
                          : "hover:bg-slate-50 hover:bg-opacity-50",
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
                          e.stopPropagation();
                          if (isCompletingInvoice) return;
                          deleteInvoice(invoices[idx].id);
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
            className="mx-2 rounded-full p-1 hover:cursor-pointer hover:bg-black hover:bg-opacity-50"
            onClick={(e) => {
              if (invoicesContainerRef.current)
                invoicesContainerRef.current.scrollLeft += 20;
            }}
          />
          <PlusCircle
            size={26}
            color="white"
            className="rounded-full p-1 hover:cursor-pointer hover:bg-black hover:bg-opacity-50"
            onClick={() => addNewInvoice()}
          />
          <div className="min-w-[16px] flex-1" />
          {/* <ActionMenu /> */}
        </div>
        <InvoiceView
          isSubmittingInvoice={isCompletingInvoice}
          setIsSubmittingInvoice={setIsCompletingInvoice}
          onProductClick={onProductClick}
          updateInvoice={updateInvoice}
          deleteInvoice={deleteInvoice}
          discounts={discounts}
          products={products}
          invoice={invoices[chosenInvoicePosition]}
          customers={customers}
        />
      </div>
    </>
  );
}

const InvoiceView = ({
  isSubmittingInvoice,
  setIsSubmittingInvoice,
  onProductClick,
  updateInvoice,
  deleteInvoice,
  invoice,
  discounts,
  products,
  customers,
}: {
  isSubmittingInvoice: boolean;
  setIsSubmittingInvoice: (value: boolean) => any;
  onProductClick: (currentInvoice: Invoice, product: Product) => Invoice;
  updateInvoice: (invoice: Invoice) => any;
  deleteInvoice: (invoiceId: number) => any;
  invoice: Invoice;
  discounts: Discount[];
  products: Product[];
  customers: Customer[];
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [discountCode, setDiscountCode] = useState("");
  const [isGettingDiscountData, setIsGettingDiscountData] = useState(false);
  const [exceedStockDetailIds, setExceedStockDetailIds] = useState<number[]>(
    [],
  );
  const [customerSearch, setCustomerSearch] = useState("");
  const [chosenCustomer, setChosenCustomer] = useState<Customer | null>(null);
  const [openCompleteSheet, setOpenCompleteSheet] = useState(false);

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

    setIsSubmittingInvoice(true);
    await InvoiceService.uploadInvoice(submitInvoice)
      .then((response) => {
        deleteInvoice(invoice.id);
        setChosenCustomer(null);
        dispatch(addInvoice(response.data)); // add to sold invoices
        createInvoicePdf(submitInvoice, products);
      })
      .catch((e) => {
        axiosUIErrorHandler(e, toast, router);
      })
      .finally(() => {
        setIsSubmittingInvoice(false);
        setOpenCompleteSheet(false);
      });
  };

  React.useEffect(() => {
    updateExceedStockState();
  }, [invoice.invoiceDetails]);

  React.useEffect(() => {
    updateDiscountState();
  }, [invoice.invoiceDetails, invoice.discountCode]);

  const updateExceedStockState = () => {
    let exceedState = [...exceedStockDetailIds];
    invoice.invoiceDetails.forEach((detail) => {
      if (
        products.find((v) => v.id === detail.productId)!.stock < detail.quantity
      )
        exceedState.push(detail.id);
      else if (exceedStockDetailIds.includes(detail.id))
        exceedState = exceedState.filter((v) => v !== detail.id);
    });

    setExceedStockDetailIds(exceedState);
  };

  const resetDiscountState = () => {
    updateInvoice({
      ...invoice,
      discountValue: 0,
      discountCode: null,
    });
  };

  const updateDiscountState = () => {
    if (!invoice.discountCode) return resetDiscountState();
    const discountInfo = discounts.find(
      (discount) =>
        discount.discountCodes?.find(
          (code) => code.value === invoice.discountCode,
        ),
    )!;

    const totalDiscountableValue = invoice.invoiceDetails
      .map((detail) => {
        const detailProductGroup =
          products.find((product) => product.id === detail.productId)
            ?.productGroup ?? "";

        if (
          (discountInfo.productIds &&
            discountInfo.productIds.includes(detail.productId)) ||
          (discountInfo.productGroups &&
            discountInfo.productGroups.includes(detailProductGroup))
        ) {
          return detail.price * detail.quantity;
        }

        return 0;
      })
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    let discountValue: number;
    if (discountInfo.type === "COUPON") {
      discountValue = (discountInfo.value * totalDiscountableValue) / 100;
      if (discountInfo.maxValue && discountValue > discountInfo.maxValue)
        discountValue = discountInfo.maxValue;
    } else discountValue = discountInfo.value;

    if (discountValue > totalDiscountableValue)
      discountValue = totalDiscountableValue;
    updateInvoice({
      ...invoice,
      discountValue: discountValue,
    });
  };

  function onDiscountCodeEnter(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter" && e.currentTarget.value.length > 0) {
      const discountCode = e.currentTarget.value;
      setIsGettingDiscountData(true);
      DiscountService.getDiscountCodeInformation(discountCode)
        .then((data) => {
          const discountInfo = discounts.find(
            (discount) => discount.id === data.data.id,
          );
          if (!discountInfo)
            return toast({
              variant: "destructive",
              description: "Can't get discount information",
            });

          let discountCodeInfo: DiscountCode | null = null;
          if (discountInfo.discountCodes)
            discountCodeInfo =
              discountInfo.discountCodes.find(
                (code) => code.value === discountCode,
              ) ?? null;

          if (discountCodeInfo === null)
            return toast({
              variant: "destructive",
              description: "Invalid discount code",
            });
          if (discountCodeInfo.usedDate !== null)
            return toast({
              variant: "destructive",
              description: "Discount code is already used",
            });
          if (isBefore(new Date(), new Date(discountInfo.startDate)))
            return toast({
              variant: "destructive",
              description: "Discount code is not yet available",
            });
          if (isBefore(new Date(discountInfo.endDate), new Date()))
            return toast({
              variant: "destructive",
              description: "Discount code is expired",
            });

          updateInvoice({
            ...invoice,
            discountCode: discountCode,
          });
        })
        .catch((e) => {
          axiosUIErrorHandler(e, toast, router);
        })
        .finally(() => {
          setIsGettingDiscountData(false);
        });
    }
  }

  const onDiscountCodeRemove = (e: React.MouseEvent<SVGSVGElement>) => {
    updateInvoice({
      ...invoice,
      discountCode: null,
    });
    setDiscountCode("");
  };

  return (
    <div className="flex flex-1 flex-row bg-slate-200">
      <div className="flex shrink grow basis-7/12 flex-col">
        <div
          className={cn(
            scrollbar_style.scrollbar,
            "m-2 mr-1 flex max-h-[calc(100vh-40px-1rem-50px-0.75rem)] flex-1 flex-col gap-2 overflow-y-auto pr-1",
          )}
        >
          {invoice.invoiceDetails.map((detail, detailIdx) => (
            <InvoiceDetailView
              key={detailIdx}
              products={products}
              invoice={invoice}
              detailIndex={detailIdx}
              updateInvoice={updateInvoice}
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
        <div className="m-2 mt-0 flex h-[50px] flex-row items-center rounded-md bg-white">
          <Textarea
            placeholder="Invoice's note"
            value={invoice.note}
            onChange={(e) => {
              updateInvoice({
                ...invoice,
                note: e.currentTarget.value,
              });
            }}
            className={cn(
              scrollbar_style.scrollbar,
              "m-2 h-[40px] max-h-[80px] min-h-[40px] flex-1 resize-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
            )}
          />
          <div className="mx-4 flex min-w-[200px] flex-col text-sm">
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
                        .productPrice,
                  )
                  .reduce((prev, cur) => prev + cur, 0)}{" "}
                VNĐ
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="m-2 ml-0 flex shrink grow basis-5/12 flex-col rounded-md bg-white p-2">
        <div className="flex flex-row items-center gap-2">
          <div className="flex w-[250px] min-w-[250px] max-w-[400px] flex-row items-center rounded-sm bg-slate-200">
            <SearchView
              placeholder="Find customer"
              className="flex-1"
              choices={customers}
              onSearchChange={(value) => setCustomerSearch(value)}
              itemView={CustomerSearchItemView}
              inputColor="bg-slate-200"
              onItemClick={(customer) => {
                updateInvoice({
                  ...invoice,
                  customerId: customer.id,
                });
                setChosenCustomer(customer);
              }}
              filter={(customer) =>
                customer.id.toString().includes(customerSearch) ||
                customer.name
                  .toLowerCase()
                  .includes(customerSearch.toLowerCase())
              }
              triggerClassname="bg-slate-200"
              endIcon={
                <NewCustomerDialog
                  DialogTrigger={<Plus size={20} />}
                  triggerClassname="mr-2"
                />
              }
              zIndex={10}
            />
          </div>
          {chosenCustomer ? (
            <div className="flex h-[35px] flex-row items-center gap-2 rounded-md bg-blue-400 p-2 text-sm">
              <p>
                Customer:{" "}
                <span className="font-bold">{chosenCustomer.name}</span>
              </p>
              <X
                size={16}
                onClick={() => {
                  updateInvoice({
                    ...invoice,
                    customerId: null,
                  });
                  setChosenCustomer(null);
                }}
                className="cursor-pointer rounded-full hover:bg-white hover:bg-opacity-60"
              />
            </div>
          ) : null}
        </div>
        {/* 2.5rem is "Make Payment" button, 40px+1rem is the top bar, -40px-1rem is padding + margin + "find customer" button, 1rem is its own margin, 0.5rem is some random i put in because there was some mistake and i dont know how to find it :P */}
        <div className="my-2 flex max-h-[calc(100vh-2.5rem-40px-1rem-40px-1rem-1rem-0.5rem)] w-full flex-1 flex-row flex-wrap !content-start overflow-y-auto">
          {products.map((product, idx) => (
            <ProductView
              key={idx}
              product={product}
              onClick={() => onProductClick(invoice, product)}
            />
          ))}
        </div>
        <Sheet open={openCompleteSheet} onOpenChange={setOpenCompleteSheet}>
          <SheetTrigger asChild>
            <Button variant={"blue"} className="uppercase text-white">
              Make Payment
            </Button>
          </SheetTrigger>
          <SheetContent className="flex h-full min-w-[500px] flex-col rounded-l-2xl p-3">
            <SheetHeader>
              <p className="ml-4">{invoice.createdAt}</p>
            </SheetHeader>
            <div className="flex flex-1 flex-col gap-4 px-4">
              <p className="text-xl font-bold">GUEST</p>
              <div className="flex flex-row items-center justify-between">
                <p>Sub total</p>
                <p>{invoice.subTotal}</p>
              </div>
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row gap-4">
                  <p>Discount code</p>
                  {invoice.discountCode && invoice.discountCode.length > 0 ? (
                    <div className="flex flex-row items-center gap-1 rounded-sm bg-blue-300 p-1 text-xs">
                      <p>{invoice.discountCode}</p>
                      <X
                        size={16}
                        className="rounded-full p-[1px] hover:cursor-pointer hover:bg-slate-100"
                        onClick={onDiscountCodeRemove}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-row items-center">
                      <input
                        className="w-[120px] border-b border-black p-1 text-sm focus:outline-none"
                        value={discountCode}
                        disabled={isGettingDiscountData}
                        onChange={(e) => setDiscountCode(e.currentTarget.value)}
                        onKeyDown={onDiscountCodeEnter}
                      />
                      {isGettingDiscountData ? (
                        <LoadingCircle className="inline-block" />
                      ) : null}
                    </div>
                  )}
                </div>
                <p>{invoice.discountValue}</p>
              </div>
              <div className="flex flex-row items-center justify-between">
                <p className="font-semibold">Total</p>
                <p className="font-bold text-blue-500">{invoice.total}</p>
              </div>
              <div className="flex flex-row items-center justify-between">
                <Label htmlFor="customer_pay" className="text-md font-semibold">
                  Customer pay
                </Label>
                <input
                  id="customer_pay"
                  type="number"
                  value={invoice.cash}
                  onChange={(e) => {
                    updateInvoice({
                      ...invoice,
                      cash: e.currentTarget.valueAsNumber,
                    });
                  }}
                  className="text-md h-[24px] rounded-none border-0 border-b border-black p-0 text-right focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <div className="flex flex-row items-center justify-between">
                <RadioGroup
                  defaultValue="Cash"
                  className="flex flex-row gap-8"
                  onValueChange={(e) => {
                    updateInvoice({
                      ...invoice,
                      paymentMethod: e as InvoicePaymentMethod,
                    });
                  }}
                >
                  <div className="flex flex-row items-center">
                    <RadioGroupItem
                      id="cash_payment"
                      value={"Cash"}
                      className="mr-3"
                    ></RadioGroupItem>
                    <Label htmlFor="cash_payment">Cash</Label>
                  </div>
                  <div className="m-1 flex flex-row items-center">
                    <RadioGroupItem
                      id="bank_transfer_payment"
                      value="Bank Transfer"
                      className="mr-3"
                    ></RadioGroupItem>
                    <Label htmlFor="bank_transfer_payment">Bank transfer</Label>
                  </div>
                  <div className="flex flex-row items-center">
                    <RadioGroupItem
                      id="card_payment"
                      value="Card"
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
                className="h-[50px] w-full"
                onClick={onSubmitInvoice}
                disabled={isSubmittingInvoice}
              >
                COMPLETE
                {isSubmittingInvoice ? <LoadingCircle /> : null}
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
      className="flex max-h-[70px] w-1/3 flex-row items-center gap-2 rounded-sm border border-transparent px-3 py-5 hover:cursor-pointer hover:border-blue-300"
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
        className="h-[50px] w-[40px] border object-contain"
        alt="product image"
      />
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold">
          {product.name}
          <PropertiesString
            propertiesString={product.propertiesString}
            className="ml-1"
          />
        </p>
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
  onDeleteDetail,
  updateInvoice,
  showExceedError,
}: {
  products: Product[];
  invoice: Invoice;
  detailIndex: number;
  onDeleteDetail: () => any;
  updateInvoice: (invoice: Invoice) => any;
  showExceedError: boolean;
}) => {
  const detail = invoice.invoiceDetails[detailIndex];
  const detailProduct = products.find(
    (product) => product.id === detail.productId,
  )!;
  const [showDescription, setShowDescription] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  const updateQuantity = (value: number) => {
    if (isNaN(value) || value <= 0) value = 1;
    const updatedInvoice: Invoice = {
      ...invoice,
      invoiceDetails: invoice.invoiceDetails.map((v) =>
        v.id === detail.id ? { ...detail, quantity: value } : v,
      ),
    };

    updateInvoice(updatedInvoice);
  };

  const deleteDetail = () => {
    onDeleteDetail();
    const updatedInvoice: Invoice = {
      ...invoice,
      invoiceDetails: invoice.invoiceDetails.filter((v) => v.id !== detail.id),
    };
    updateInvoice(updatedInvoice);
  };

  const updateDetailDescription = (newDescription: string) => {
    const updatedInvoice: Invoice = {
      ...invoice,
      invoiceDetails: invoice.invoiceDetails.map((v) =>
        v.id === detail.id ? { ...detail, description: newDescription } : v,
      ),
    };
    updateInvoice(updatedInvoice);
  };

  return (
    <div className="group flex flex-col rounded-md bg-white px-2 py-4">
      <div className="mb-4 flex flex-row items-center text-[0.925rem] leading-5">
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
            <span className="ml-2 animate-marquee rounded-sm bg-blue-300 px-1 text-xs text-white">
              {detailProduct.propertiesString}
            </span>
          ) : null}
          {showExceedError ? (
            <span className="ml-2 animate-marquee rounded-sm bg-red-400 px-1 text-xs text-white">
              Quantity exceeds stock
            </span>
          ) : null}
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
            "invisible ml-[60px] rounded-full bg-slate-200 p-1 hover:cursor-pointer hover:bg-slate-300",
            detail.quantity >= 2 ? " group-hover:visible" : "",
          )}
          onClick={(e) => updateQuantity(detail.quantity - 1)}
        />
        <input
          type="number"
          min={1}
          value={detail.quantity}
          onChange={(e) => updateQuantity(e.currentTarget.valueAsNumber)}
          className="mx-2 w-[50px] border-b border-gray-500 text-center"
        />
        <Plus
          size={22}
          className="invisible rounded-full bg-slate-200 p-1 hover:cursor-pointer hover:bg-slate-300 group-hover:visible"
          onClick={(e) => updateQuantity(detail.quantity + 1)}
        />
        <div className="min-w-[80px] flex-1" />
        <div className="mr-[80px] min-w-[100px] border-b border-gray-500 text-end">
          <p>{detail.price}</p>
        </div>
        <div className="min-w-[100px] border-b border-gray-500 text-end">
          <p>{detail.price * detail.quantity}</p>
        </div>
      </div>
      {showDescription ? (
        <textarea
          value={detail.description}
          onChange={(e) => updateDetailDescription(e.currentTarget.value)}
          className="mx-auto mt-2 h-11 w-[96%] resize-none rounded-sm border p-1 text-xs"
          placeholder="Note..."
        />
      ) : null}
    </div>
  );
};

const ActionMenu = () => {
  const invoices = useAppSelector((state) => state.invoices.value);
  const [showMenu, setShowMenu] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  return (
    <>
      <Popover open={showMenu} onOpenChange={setShowMenu}>
        <PopoverTrigger className="mr-2">
          <AlignJustify size={24} color="white" className="end" />
        </PopoverTrigger>
        <PopoverContent className="mr-2 flex flex-col rounded-sm bg-white p-2">
          <div className="flex flex-row items-center gap-4 p-2 hover:cursor-pointer hover:bg-slate-200">
            <PieChart size={16} />
            <p className="text-sm font-medium">End of day report</p>
          </div>
          <div className="flex flex-row items-center gap-4 p-2 hover:cursor-pointer hover:bg-slate-200">
            <Undo size={16} />
            <p
              className="text-sm font-medium"
              onClick={() => {
                setShowReturnDialog(true);
                setShowMenu(false);
              }}
            >
              Return
            </p>
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
      <ChooseInvoiceToReturnDialog
        invoices={invoices}
        open={showReturnDialog}
        onOpenChange={setShowReturnDialog}
      />
    </>
  );
};
