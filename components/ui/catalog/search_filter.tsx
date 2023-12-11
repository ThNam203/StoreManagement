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
import { Check, CheckSquare, Square, X } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "../popover";

export default function SearchAndChooseButton({
  value,
  className,
  placeholder,
  searchPlaceholder,
  choices,
  onValueChanged,
}: {
  value: string | null;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  choices: string[];
  onValueChanged: (val: string | null) => void;
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const results = choices
    .filter((choice) =>
      choice.toLowerCase().includes(searchInput.trim().toLowerCase())
    )
    .map((choice, idx) => (
      <li
        key={idx}
        className="p-2 bg-white hover:cursor-pointer hover:bg-slate-300 flex flex-row items-center"
        onClick={(e) => {
          if (choice === value) onValueChanged(null);
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
    results.unshift(
      <li
        key={results.length + 1}
        className="p-2 bg-white hover:cursor-pointer hover:bg-slate-300 flex flex-row items-center"
        onClick={(e) => {
          if (value !== undefined) onValueChanged(null);
          setIsPopoverOpen(false);
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
      >
        <p className="flex-1 text-gray-500 italic">Remove value</p>
      </li>
    );
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger className="w-full h-full min-h-[40px]">
        <p className="text-xs leading-4 px-2 text-start">
          {value ? value : placeholder}
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

export function SearchAndChooseMultiple({
  value,
  className,
  choices,
  onValueChanged,
}: {
  value: string[];
  className?: string;
  choices: string[];
  onValueChanged: (values: string[]) => void;
}) {
  const [searchInput, setSearchInput] = useState("");
  const [showSearchResult, setShowSearchResult] = useState(false);

  const filteredChoices = choices
    .filter((choice) =>
      choice.toLowerCase().includes(searchInput.trim().toLowerCase())
    )
    .map((choice, idx) => (
      <li
        key={idx}
        className="p-2 bg-white hover:cursor-pointer hover:bg-slate-300 flex flex-row items-center"
        onClick={(e) => {
          if (value.includes(choice))
            onValueChanged(value.filter((v) => v !== choice));
          else onValueChanged([...value, choice]);
          e.stopPropagation();
          setShowSearchResult(false);
          setSearchInput("");
        }}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
      >
        <p className="flex-1">{choice}</p>
        {value.includes(choice) ? <Check size={16} /> : null}
      </li>
    ));

  if (choices.length > 0)
    if (choices.length === value.length) {
      filteredChoices.unshift(
        <li
          key={-1}
          className="p-2 bg-white hover:cursor-pointer hover:bg-slate-300 flex flex-row items-center font-semibold"
          onClick={(e) => {
            onValueChanged([]);
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
        >
          <p className="flex-1">All group</p>
          <CheckSquare size={16} />
        </li>
      );
    } else
      filteredChoices.unshift(
        <li
          key={-1}
          className="p-2 bg-white hover:cursor-pointer hover:bg-slate-300 flex flex-row items-center font-semibold"
          onClick={(e) => {
            onValueChanged([...choices]);
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
        >
          <p className="flex-1">All group</p>
          <Square size={16} />
        </li>
      );

  return (
    <div
      className={cn(
        "relative border py-1 px-2 rounded-md text-sm !mt-0",
        scrollbar_style.scrollbar,
        className
      )}
    >
      <div className="flex flex-row gap-1 flex-wrap items-center max-h-[100px] overflow-y-auto">
        {value.map((rs, idx) => (
          <div
            key={idx}
            className="flex flex-row p-1 bg-blue-400 text-white text-xs rounded-md items-center gap-[2px]"
          >
            <p>{rs}</p>
            <X
              size={16}
              color="white"
              className="p-[2px] hover:cursor-pointer"
              onClick={() => onValueChanged(value.filter((v) => v !== rs))}
            />
          </div>
        ))}
        <Input
          className="flex-1 !m-0 !p-0 border-0 h-[32px] !rounded-none focus-visible:outline-none placeholder:text-xs focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
          value={searchInput}
          onChange={(e) => {
            setShowSearchResult(true);
            setSearchInput(e.target.value);
          }}
          onFocus={() => setShowSearchResult(true)}
          onBlur={() => setShowSearchResult(false)}
        />
      </div>
      {showSearchResult ? (
        <div
          className={cn(
            "flex flex-col border-none absolute top-full bg-white rounded-sm overflow-y-auto overflow-x-hidden max-h-[200px] left-0 right-0 h-auto shadow-[0px_5px_5px_1px_#A8A8A8]",
            scrollbar_style.scrollbar,
            showSearchResult ? "rounded-t-none" : ""
          )}
        >
          {filteredChoices.length === 0 ? (
            <div
              className="h-10 flex justify-center items-center bg-white"
              onMouseDown={(e) => e.preventDefault()}
            >
              <p>No results found!</p>
            </div>
          ) : (
            filteredChoices
          )}
        </div>
      ) : null}
    </div>
  );
}
