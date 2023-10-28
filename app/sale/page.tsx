"use client";
import scrollbar_style from "@/styles/scrollbar.module.css";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { PopoverContent } from "@radix-ui/react-popover";
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
import { useEffect, useRef, useState } from "react";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

const ProductView = () => {
  return (
    <div className="w-1/3 flex flex-row px-3 py-5 border border-transparent  hover:border-blue-300 gap-2 items-center rounded-sm">
      <Image
        src={"https://i.pravatar.cc/300"}
        width={30}
        height={50}
        className="w-[30px] h-[50px] object-cover"
        alt="product"
      />
      <div className="flex flex-col gap-2">
        <p className="text-sm">Thuốc lá điện tử 333</p>
        <p className="text-sm font-semibold text-sky-700">44000</p>
      </div>
    </div>
  );
};

function ChoosePriceTable({
  choices,
  defaultValue,
  onValueChanged,
}: {
  choices: string[];
  defaultValue: string;
  onValueChanged?: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {defaultValue}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search price table..." className="h-9" />
          <CommandEmpty>Price table found!</CommandEmpty>
          <CommandGroup>
            {choices.map((choice, index) => (
              <CommandItem
                key={index}
                value={choice}
                onSelect={(_) => {
                  if (choice !== defaultValue && onValueChanged)
                    onValueChanged(choice);
                  setOpen(false);
                }}
              >
                {choice}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    defaultValue === choice ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

type ChosenProduct = {
  index: number;
  id: string;
  name: string;
  quantity: number;
  originalPrice: number;
  discount: number;
  discountByAmount: boolean;
  sellPrice?: number; // if sell price is specified -> remove discount
};

const ChosenProductView = ({ product }: { product: ChosenProduct }) => {
  return (
    <div className="rounded-md bg-white flex flex-col m-2 px-2 py-4 group">
      <div className="flex flex-row items-center leading-5 text-[0.925rem] mb-4">
        <p className="mx-4">{product.index}</p>
        <Trash size={16} />
        <p className="mx-4">{product.id}</p>
        <p className="flex-1">{product.name}</p>
        <MoreVertical className="mx-4" size={16} />
      </div>
      <div className="flex flex-row items-center">
        <Minus
          size={22}
          className="invisible group-hover:visible rounded-full p-1 bg-slate-200 hover:bg-slate-300 hover:cursor-pointer ml-[80px]"
        />
        <input
          type="number"
          min={0}
          value={product.quantity}
          className="border-b border-gray-500 mx-2 w-[50px] text-center"
        />
        <Plus
          size={22}
          className="invisible group-hover:visible rounded-full p-1 bg-slate-200 hover:bg-slate-300 hover:cursor-pointer"
        />
        <div className="flex-1 min-w-[80px]" />
        <Popover>
          <PopoverTrigger className="min-w-[100px] border-b text-end border-gray-500 mr-[80px]">
            <p>{product.originalPrice}</p>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col p-4 rounded-sm bg-white shadow-md shadow-gray-500">
            <div className="flex flex-row gap-2 mb-2">
              <p className="w-[100px] text-sm">Unit price</p>
              <input
                type="number"
                disabled
                value={product.originalPrice}
                className="w-[180px] border-b text-end border-gray-300 hover:cursor-not-allowed"
              />
            </div>
            <div className="flex flex-row mb-2">
              <p className="w-[100px] text-sm mr-2">Discount</p>
              <input
                type="number"
                value={product.discount}
                className="w-[calc(110px-0.5rem)] border-b text-end border-gray-300"
              />
              <p
                className={cn(
                  "rounded-sm mx-1 text-sm w-[35px] text-center bg-slate-200 text-black hover:cursor-pointer",
                  product.discountByAmount ? "text-white bg-slate-600" : ""
                )}
              >
                VND
              </p>
              <p
                className={cn(
                  "rounded-sm text-md w-[35px] text-center bg-slate-200 text-black hover:cursor-pointer",
                  product.discountByAmount ? "" : "text-white bg-slate-600"
                )}
              >
                %
              </p>
            </div>
            <div className="flex flex-row gap-2">
              <p className="w-[100px] text-sm">Selling price</p>
              <input
                type="number"
                value={product.sellPrice ? product.sellPrice : 0}
                className="w-[180px] border-b text-end border-gray-300"
              />
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger className="min-w-[100px] border-b text-end border-gray-500">
            <p>{product.originalPrice}</p>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col p-4 rounded-sm bg-white shadow-md shadow-gray-500">
            <div className="flex flex-row gap-2 mb-2">
              <p className="w-[120px] text-sm">Total price</p>
              <input
                type="number"
                disabled
                value={product.originalPrice}
                className="w-[180px] border-b text-end border-gray-300 hover:cursor-not-allowed"
              />
            </div>
            <div className="flex flex-row mb-2">
              <p className="w-[120px] text-sm mr-2">Discount</p>
              <input
                type="number"
                value={product.discount}
                className="w-[calc(110px-0.5rem)] border-b text-end border-gray-300"
              />
              <p
                className={cn(
                  "rounded-sm mx-1 text-sm w-[35px] text-center bg-slate-200 text-black hover:cursor-pointer",
                  product.discountByAmount ? "text-white bg-slate-600" : ""
                )}
              >
                VND
              </p>
              <p
                className={cn(
                  "rounded-sm text-md w-[35px] text-center bg-slate-200 text-black hover:cursor-pointer",
                  product.discountByAmount ? "" : "text-white bg-slate-600"
                )}
              >
                %
              </p>
            </div>
            <div className="flex flex-row gap-2">
              <p className="w-[120px] text-sm">Custome amount</p>
              <input
                type="number"
                value={0}
                className="w-[180px] border-b text-end border-gray-300"
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

function autoGrowTextArea(element: HTMLTextAreaElement) {
  element.style.height = "5px";
  element.style.height = element.scrollHeight + "px";
}

export default function Sale() {
  const invoicesContainerRef = useRef<HTMLDivElement>(null);
  const [invoices, setInvoices] = useState<string[]>([
    "Invoice 1",
    "Invoice 2",
    "Invoice 3",
    "Invoice 4",
    "Invoice 5",
    "Invoice 6",
  ]);
  const [chosenInvoicePosition, setChosenInvoicePosition] = useState(0);
  const [chosenProducts, setChosenProducts] = useState<ChosenProduct[]>([
    {
      index: 1,
      id: "SP000001",
      name: "Bao cao su con dom dom",
      quantity: 10,
      originalPrice: 20000,
      discount: 5000,
      discountByAmount: true,
    },
  ]);

  const [priceTable, setPriceTable] = useState("General Price");
  const changePriceTable = (newPriceTable: string) => {
    setPriceTable(newPriceTable);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-600">
      <div className="flex flex-row items-center h-[calc(35px+1rem)]">
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
                "flex flex-row items-center min-w-[100px] w-[100px] hover:cursor-pointer px-1 mt-2 pb-4 rounded-t-sm h-full",
                chosenInvoicePosition === idx
                  ? "bg-slate-200 text-black font-semibold"
                  : "hover:bg-slate-700 text-white"
              )}
              onClick={(e) => setChosenInvoicePosition(idx)}
            >
              <p className="flex-1 text-sm">{val}</p>
              <X
                size={16}
                className={cn(
                  "rounded-full p-[1px]",
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
          onClick={(e) => {
            setInvoices((prev) => [...prev, "Invoice " + prev.length + 1]);
          }}
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
            {chosenProducts.map((product, index) => (
              <ChosenProductView key={index} product={product} />
            ))}
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
                Total amount: <span className="font-semibold">123</span>
              </p>
              <p>
                Total cost:{" "}
                <span className="font-semibold">120.234.000 VNĐ</span>
              </p>
            </div>
          </div>
        </div>
        <div className="grow shrink basis-5/12 rounded-md m-2 bg-white p-2 flex flex-col">
          <div className="flex flex-row">
            <div className="flex flex-row bg-slate-200 items-center rounded-sm px-2 min-w-[250px] max-w-[400px] w-[250px] mr-2">
              <Search size={20} color="rgb(156 163 175)" />
              <Input
                placeholder="Find customer (F4)"
                className="h-[40px] w-[170px] flex-1 border-0 bg-slate-200 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
              />
              <Plus size={20} />
            </div>
            <ChoosePriceTable
              defaultValue={priceTable}
              choices={["General Price", "Black Friday"]}
              onValueChanged={changePriceTable}
            />
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
          <div className="flex flex-row flex-wrap flex-1 w-full max-h-[calc(100vh-2.5rem-40px-1rem-40px-1rem-1rem-0.5rem)] overflow-y-scroll my-2">
            {[
              1, 2, 3, 4, 5, 5, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
              1, 11, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            ].map((val, idx) => (
              <ProductView key={idx} />
            ))}
          </div>
          <Button className="uppercase hover:bg-blue-600 bg-blue-500 text-white">
            Make Payment
          </Button>
        </div>
      </div>
    </div>
  );
}
