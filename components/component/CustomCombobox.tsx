import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import scrollbar_style from "@/styles/scrollbar.module.css";
import { Input } from "../ui/input";

export default function CustomCombobox<T>({
  searchPlaceholder,
  value,
  choices,
  valueView,
  itemSearchView,
  onSearchChange,
  startIcon,
  onItemClick,
  filter,
  className,
  zIndex,
}: {
  searchPlaceholder: string;
  value: T | null;
  choices: T[];
  valueView: (choice: T) => React.ReactNode;
  itemSearchView: (choice: T) => React.ReactNode;
  onSearchChange?: (value: string) => any;
  filter?: (choice: T) => boolean;
  onItemClick?: (choice: T) => any;
  startIcon?: JSX.Element;
  className?: string;
  zIndex?: number;
}) {
  const filteredChoices = filter ? choices.filter(filter) : choices;
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div
      className={cn("relative min-h-[40px] rounded-sm border p-2", className)}
    >
      <div
        className="flex h-full cursor-pointer items-center gap-[2px]"
        onClick={() => setShowSearch((prev) => !prev)}
      >
        {startIcon}
        <div className="min-w-[60px] overflow-hidden">
          {value ? valueView(value) : null}
        </div>
        {showSearch ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </div>
      {showSearch ? (
        <div className="absolute left-0 right-0 top-full min-w-[200px] overflow-hidden rounded-sm bg-white shadow-[0px_0px_5px_1px_#A8A8A8]">
          <div className={"flex flex-row items-center !border-b-0 bg-white"}>
            <Search size={20} color={"rgb(156 163 175)"} className="ml-2" />
            <Input
              placeholder={searchPlaceholder}
              className={
                "h-[35px] w-full border-0 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
              }
              onChange={(e) => {
                if (onSearchChange) onSearchChange(e.currentTarget.value);
                setShowSearch(true);
              }}
              onFocus={(e) => setShowSearch(true)}
              onBlur={(e) => setShowSearch(false)}
            />
          </div>
          <div
            className={cn(
              "flex h-auto max-h-[500px] flex-col overflow-y-auto overflow-x-hidden border-none",
              scrollbar_style.scrollbar,
            )}
            style={{ zIndex: zIndex }}
          >
            {filteredChoices.length === 0 ? (
              <div
                className="flex h-10 items-center justify-center bg-white"
                onMouseDown={(e) => e.preventDefault()}
              >
                <p>No results found!</p>
              </div>
            ) : (
              filteredChoices.map((choice, index) => (
                <div
                  key={index}
                  onClick={(e) => {
                    if (onItemClick) onItemClick(choice);
                    setShowSearch(false);
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {itemSearchView(choice)}
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
