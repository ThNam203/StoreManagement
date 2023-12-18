"use client";
import scrollbar_style from "@/styles/scrollbar.module.css";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Minus, MoreVertical, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@/entities/Product";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Invoice, InvoicePaymentMethod } from "@/entities/Invoice";
import { faker } from "@faker-js/faker";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import InvoiceService from "@/services/invoice_service";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import { useToast } from "@/components/ui/use-toast";
import createInvoicePdf from "./createInvoicePdf";
import LoadingCircle from "@/components/ui/loading_circle";
import DiscountService from "@/services/discount_service";
import { setInvoices } from "@/reducers/invoicesReducer";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ReturnInvoiceClient,
  ReturnInvoiceDetailClient,
  ReturnInvoiceDetailServer,
  ReturnInvoiceServer,
} from "@/entities/ReturnInvoice";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import ProductService from "@/services/product_service";
import { setProducts } from "@/reducers/productsReducer";
import CustomerService from "@/services/customer_service";
import { setCustomers } from "@/reducers/customersReducer";
import { setDiscounts } from "@/reducers/discountsReducer";
import { setReturnInvoices } from "@/reducers/returnInvoicesReducer";
import ReturnInvoiceService from "@/services/return_invoice_service";
import { formatNumberInput } from "@/utils";

export default function InvoiceReturnPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [isCompletingReturn, setIsCompletingReturn] = useState(false);

  const products = useAppSelector((state) => state.products.value);
  const customers = useAppSelector((state) => state.customers.value);
  const discounts = useAppSelector((state) => state.discounts.value);

  // include original invoice and modified using returnedInvoices that have been returned before
  // use to define maxQuantity that can return and discountValue is the total discount value that have been returned
  const [modifiedOriginialInvoice, setModifiedOriginialInvoice] = useState<
    Invoice | undefined
  >(undefined);
  const [returnInvoice, setReturnInvoice] = useState<
    ReturnInvoiceClient | undefined
  >();

  React.useEffect(() => {
    const getData = async () => {
      try {
        dispatch(showPreloader());
        const invoices = await InvoiceService.getAllInvoices();
        dispatch(setInvoices(invoices.data));

        const products = await ProductService.getAllProducts();
        dispatch(setProducts(products.data));

        const customers = await CustomerService.getAllCustomers();
        dispatch(setCustomers(customers.data));

        const discounts = await DiscountService.getAllDiscounts();
        dispatch(setDiscounts(discounts.data));

        const returnInvoices =
          await ReturnInvoiceService.getAllReturnInvoices();
        dispatch(setReturnInvoices(returnInvoices.data));

        let foundInvoice = invoices.data.find(
          (invoice) => invoice.id === Number(params.get("invoiceId")),
        );

        if (!foundInvoice) {
          router.back();
          toast({
            variant: "destructive",
            description: "Can not find the invoice to return",
          });
        }

        // there could have been other return that have been made
        const returnedInvoices = returnInvoices.data.filter(
          (v) => v.invoiceId === Number(params.get("invoiceId")),
        );

        if (returnedInvoices.length > 0)
          foundInvoice = {
            ...foundInvoice!,
            invoiceDetails: foundInvoice!.invoiceDetails.map((detail) => {
              // find the product number that have been returned
              const returnedNumber = returnedInvoices
                .map((v) =>
                  v.returnDetails.find(
                    (returnDetail) =>
                      returnDetail.productId === detail.productId,
                  ),
                )
                .map((v) => v?.quantity ?? 0)
                .reduce((prev, cur) => cur + prev, 0);

              return {
                ...detail,
                quantity: detail.quantity - returnedNumber,
              };
            }),
            discountValue:
              foundInvoice!.discountValue -
              returnedInvoices
                .map((v) => v.discountValue)
                .reduce((prev, cur) => prev + cur, 0),
          };

        setModifiedOriginialInvoice(foundInvoice);
        setReturnInvoice({
          id: faker.number.int(),
          discountValue: 0,
          returnFee: 0,
          createdAt: new Date().toISOString(),
          total: 0,
          subTotal: 0,
          paymentMethod: "Cash",
          staffId: foundInvoice!.staffId,
          returnDetails: foundInvoice!.invoiceDetails.map((v) => ({
            ...v,
            quantity: 0,
            maxQuantity: v.quantity,
          })),
          note: "",
          invoiceId: foundInvoice!.id,
        });
      } catch (e) {
        axiosUIErrorHandler(e, toast);
        router.back();
      } finally {
        dispatch(disablePreloader());
      }
    };
    getData();
  }, []);

  const onSubmitReturnInvoice = async () => {
    const transformedInvoice: ReturnInvoiceServer = { ...returnInvoice! };
    const submitInvoice: any = JSON.parse(JSON.stringify(transformedInvoice));

    delete submitInvoice.id;
    delete submitInvoice.createdAt;
    delete submitInvoice.staffId;
    delete submitInvoice.subTotal;
    delete submitInvoice.total;
    if (submitInvoice.returnDetails)
      submitInvoice.returnDetails.forEach((v: any) => {
        delete v.id;
        delete v.maxQuantity;
      });

    setIsCompletingReturn(true);
    await ReturnInvoiceService.uploadReturnInvoice(submitInvoice)
      .then((response) => {
        createInvoicePdf(returnInvoice!, products)
        router.back();
      })
      .catch((e) => {
        axiosUIErrorHandler(e, toast);
      })
      .finally(() => {
        setIsCompletingReturn(false);
      });
  };

  React.useEffect(() => {
    updateDiscountState();
  }, [returnInvoice?.returnDetails]);

  React.useEffect(() => {
    if (returnInvoice)
      setReturnInvoice((prev) => {
        const subTotal = prev!.returnDetails
          .map((r) => r.price * r.quantity)
          .reduce((prev, cur) => cur + prev, 0);
        return {
          ...prev!,
          subTotal: subTotal,
          total: subTotal - prev!.discountValue + prev!.returnFee,
        };
      });
  }, [
    returnInvoice?.returnFee,
    returnInvoice?.discountValue,
    returnInvoice?.returnDetails,
  ]);

  const updateDiscountState = () => {
    if (
      !returnInvoice ||
      !modifiedOriginialInvoice ||
      !modifiedOriginialInvoice.discountCode
    )
      return;

    const discountInfo = discounts.find(
      (discount) =>
        discount.discountCodes?.find(
          (code) => code.value === modifiedOriginialInvoice!.discountCode,
        ),
    )!;

    const totalDiscountableValue = returnInvoice!.returnDetails
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

    if (discountValue > modifiedOriginialInvoice!.discountValue)
      discountValue = modifiedOriginialInvoice!.discountValue; // there could have been some discounted products that have been returned before

    setReturnInvoice((prev) => ({
      ...prev!,
      discountValue: discountValue,
    }));
  };

  if (!returnInvoice) return null;
  return (
    <div className="flex h-screen flex-1 flex-row bg-slate-200">
      <div className="flex shrink grow basis-2/3 flex-col">
        <div
          className={cn(
            scrollbar_style.scrollbar,
            "m-2 mr-1 flex-1 gap-2 pr-1",
          )}
        >
          <div className="flex flex-col gap-2 overflow-y-auto">
            {returnInvoice.returnDetails.map((detail, detailIdx) => (
              <ReturnInvoiceDetailView
                key={detailIdx}
                products={products}
                returnInvoice={returnInvoice}
                detailIdx={detailIdx}
                setReturnInvoice={setReturnInvoice}
              />
            ))}
          </div>
        </div>
        <div className="m-2 mt-0 flex h-[50px] flex-row items-center rounded-md bg-white">
          <Textarea
            placeholder="Invoice's note"
            value={returnInvoice.note}
            onChange={(e) => {
              setReturnInvoice({
                ...returnInvoice,
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
                {returnInvoice.returnDetails
                  .map((v) => v.quantity)
                  .reduce((prev, cur) => prev + cur, 0)}
              </span>
            </p>
            <p>
              Total cost:{" "}
              <span className="font-semibold">
                {returnInvoice.subTotal}{" "}
                VNĐ
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="m-2 ml-0 flex shrink grow basis-1/3 flex-col rounded-md bg-white p-2">
        <p className="ml-4">{returnInvoice.createdAt}</p>
        <div className="flex flex-1 flex-col gap-4 px-4">
          <p className="text-xl font-bold">GUEST</p>
          <div className="flex flex-row items-center justify-between">
            <p>Total original purchase</p>
            <p>{returnInvoice.subTotal}</p>
          </div>
          <div className="flex flex-row items-center justify-between">
            <p>Discount</p>
            <p>{returnInvoice.discountValue}</p>
          </div>
          <div className="flex flex-row items-center justify-between">
            <p>Return fee</p>
            <input
              type="number"
              min={0}
              value={returnInvoice.returnFee}
              onChange={(e) => {
                setReturnInvoice((prev) => ({
                  ...prev!,
                  returnFee: isNaN(e.currentTarget.valueAsNumber)
                    ? 0
                    : e.currentTarget.valueAsNumber,
                }));
              }}
              className="border-b-2 border-gray-500 p-1 pr-0 text-end focus:outline-none"
            />
          </div>
          <div className="flex flex-row items-center justify-between">
            <p className="font-semibold">Total refund</p>
            <p className="font-bold text-blue-500">{returnInvoice.total}</p>
          </div>
          <div className="flex flex-row items-center justify-between">
            <RadioGroup
              defaultValue={returnInvoice.paymentMethod}
              className="flex flex-row gap-8"
              onValueChange={(e) => {
                setReturnInvoice((prev) => ({
                  ...prev!,
                  paymentMethod: e as InvoicePaymentMethod,
                }));
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
        </div>
        <Button
          variant={"blue"}
          type="submit"
          className="h-[50px] w-full"
          onClick={onSubmitReturnInvoice}
          disabled={isCompletingReturn}
        >
          COMPLETE
          {isCompletingReturn ? <LoadingCircle /> : null}
        </Button>
      </div>
    </div>
  );
}

const ReturnInvoiceDetailView = ({
  products,
  returnInvoice,
  detailIdx,
  setReturnInvoice,
}: {
  products: Product[];
  returnInvoice: ReturnInvoiceClient;
  detailIdx: number;
  setReturnInvoice: (invoice: ReturnInvoiceClient) => any;
}) => {
  const detail = returnInvoice.returnDetails[detailIdx];
  const detailProduct = products.find(
    (product) => product.id === detail.productId,
  )!;
  const [showDescription, setShowDescription] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  const updateQuantity = (value: number) => {
    if (isNaN(value) || value < 0) value = 0;
    if (value > detail.maxQuantity) value = detail.maxQuantity;
    const updatedInvoice: ReturnInvoiceClient = {
      ...returnInvoice,
      returnDetails: returnInvoice.returnDetails.map((v) =>
        v.id === detail.id ? { ...detail, quantity: value } : v,
      ),
    };

    setReturnInvoice(updatedInvoice);
  };

  const updateDetailDescription = (newDescription: string) => {
    const updatedInvoice: ReturnInvoiceClient = {
      ...returnInvoice,
      returnDetails: returnInvoice.returnDetails.map((v) =>
        v.id === detail.id ? { ...detail, description: newDescription } : v,
      ),
    };
    setReturnInvoice(updatedInvoice);
  };

  return (
    <div className="group flex flex-col rounded-md bg-white px-2 py-4">
      <div className="mb-4 flex flex-row items-center text-[0.925rem] leading-5">
        <p className="mx-4">{detailIdx}</p>
        <p className="mx-4">ID-{detailProduct.id}</p>
        <p className="flex-1">
          {detailProduct.name}
          {detailProduct.propertiesString ? (
            <span className="ml-2 animate-marquee rounded-sm bg-blue-300 px-1 text-xs text-white">
              {detailProduct.propertiesString}
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
            detail.quantity >= 1 ? "group-hover:visible" : "",
          )}
          onClick={(e) => updateQuantity(detail.quantity - 1)}
        />
        <div className="flex flex-col items-center">
          <input
            type="number"
            min={0}
            max={detail.maxQuantity}
            value={detail.quantity}
            onChange={(e) => updateQuantity(e.currentTarget.valueAsNumber)}
            className="mx-2 w-[50px] border-b border-gray-500 text-center"
          />
          <p className="text-xs text-gray-400">Max: {detail.maxQuantity}</p>
        </div>
        <Plus
          size={22}
          className={cn(
            "invisible rounded-full bg-slate-200 p-1 hover:cursor-pointer hover:bg-slate-300 group-hover:visible",
            detail.quantity <= detail.maxQuantity ? "group-hover:visible" : "",
          )}
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
