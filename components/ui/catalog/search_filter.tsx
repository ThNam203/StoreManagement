import { cn } from "@/lib/utils";
import scrollbar_style from "@/styles/scrollbar.module.css";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../accordion";
import { Input } from "../input";
import { useState } from "react";
import { Check } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "../popover";

export default function SearchAndChooseButton({
  value,
  className,
  placeholder,
  searchPlaceholder,
  choices,
  onValueChanged,
}: {
  value: string | undefined;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  choices: string[];
  onValueChanged: (val: string | undefined) => void;
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const results = choices
    .filter((choice) => choice.includes(searchInput.trim()))
    .map((choice, idx) => (
      <li
        key={idx}
        className="p-2 bg-white hover:cursor-pointer hover:bg-slate-300 flex flex-row items-center"
        onClick={(e) => {
          if (choice === value) onValueChanged(undefined);
          else onValueChanged(choice);
          e.stopPropagation();
          setIsPopoverOpen(false);
        }}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
      >
        <p className="flex-1">{choice}</p>
        {choice == value ? <Check size={16} /> : null}
      </li>
    ));

    if (results.length > 0) {
      results.unshift(<li
        key={results.length + 1}
        className="p-2 bg-white hover:cursor-pointer hover:bg-slate-300 flex flex-row items-center"
        onClick={(e) => {
          if (value !== undefined) onValueChanged(undefined);
          setIsPopoverOpen(false);
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
      >
      <p className="flex-1 text-gray-500 italic">Remove value</p>
      </li>)
    }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger className="w-full h-full min-h-[40px]">
        <p className="text-xs leading-4 px-2 text-start">
          {value !== undefined ? value : placeholder}
        </p>
      </PopoverTrigger>
      <PopoverContent className="overflow-hidden shadow-sm shadow-gray-600 data-[state=open]:overflow-visible p-[1px] bg-white w-[272px] h-full !rounded-none -mt-1">
        <div className="flex flex-col">
          <Input
            className="w-full h-full !m-0 border-0 !rounded-none focus-visible:outline-none placeholder:text-xs focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
            value={searchInput}
            placeholder={searchPlaceholder}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <div
            className={cn(
              "absolute top-[100%] text-xs overflow-y-auto left-0 max-h-[200px] w-full shadow-sm shadow-gray-600 z-[10]",
              scrollbar_style.scrollbar
            )}
          >
            <ul>
              {results.length > 0 ? (
                results
              ) : (
                <li
                  className="p-2 bg-white flex flex-row items-center"
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                >
                  <p className="flex-1">No results found!</p>
                </li>
              )}
            </ul>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
