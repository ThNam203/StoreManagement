import { cn } from "@/lib/utils";
import scrollbar_style from "@/styles/scrollbar.module.css";
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
      choice.toLowerCase().includes(searchInput.trim().toLowerCase()),
    )
    .map((choice, idx) => (
      <li
        key={idx}
        className="flex flex-row items-center bg-white p-2 hover:cursor-pointer hover:bg-slate-300"
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
        className="flex flex-row items-center bg-white p-2 hover:cursor-pointer hover:bg-slate-300"
        onClick={(e) => {
          if (value !== undefined) onValueChanged(null);
          setIsPopoverOpen(false);
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
      >
        <p className="flex-1 italic text-gray-500">Remove value</p>
      </li>,
    );
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger className="h-full min-h-[40px] w-full">
        {/* TODO: INPUT */}
        <p className="px-2 text-start text-xs leading-4">
          {value ? value : placeholder}
        </p>
      </PopoverTrigger>
      <PopoverContent className="-mt-1 h-full w-[272px] overflow-hidden !rounded-none bg-white p-[1px] shadow-sm shadow-gray-600 data-[state=open]:overflow-visible">
        <div className="flex flex-col">
          <Input
            className="!m-0 h-full w-full !rounded-none border-0 placeholder:text-xs focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
            value={searchInput}
            placeholder={searchPlaceholder}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <div
            className={cn(
              "absolute left-0 top-[100%] z-[10] max-h-[200px] w-full overflow-y-auto text-xs shadow-sm shadow-gray-600",
              scrollbar_style.scrollbar,
            )}
          >
            <ul>
              {results.length > 0 ? (
                results
              ) : (
                <li
                  className="flex flex-row items-center bg-white p-2"
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
