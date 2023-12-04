import { useState } from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import scrollbar_style from "@/styles/scrollbar.module.css";

export default function SearchView<T>({
  placeholder,
  choices,
  itemView,
  onSearchChange,
  onItemClick,
  filter,
  className,
  triggerClassname,
  iconColor,
  inputColor,
  endIcon,
}: {
  placeholder: string;
  choices: T[];
  itemView: (choice: T) => React.ReactNode;
  onSearchChange?: (value: string) => any;
  filter?: (choice: T) => boolean;
  onItemClick?: (choice: T) => any;
  className?: string;
  triggerClassname?: string;
  iconColor?: string;
  inputColor?: string;
  endIcon?: JSX.Element;
}) {
  const filteredChoices = filter ? choices.filter(filter) : choices;
  const [showSearchResult, setShowSearchResult] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "flex flex-row items-center bg-white",
          showSearchResult
            ? "rounded-t-sm"
            : "rounded-sm",
          triggerClassname
        )}
      >
        <Search size={20} color={iconColor ?? "rgb(156 163 175)"} className="ml-2" />
        <Input
          placeholder={placeholder}
          className={cn(
            "h-[35px] w-full border-0 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0",
            inputColor,
          )}
          onChange={(e) => {
            if (onSearchChange) onSearchChange(e.currentTarget.value);
            setShowSearchResult(true);
          }}
          onFocus={(e) => setShowSearchResult(true)}
          onBlur={(e) => setShowSearchResult(false)}
        />
          {endIcon}
      </div>
      {showSearchResult ? (
        <div
          className={cn(
            "flex flex-col border-none absolute top-full bg-white rounded-sm overflow-y-auto overflow-x-hidden max-h-[500px] left-0 right-0 h-auto shadow-[0px_5px_5px_1px_#A8A8A8]",
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
            filteredChoices.map((choice, index) => (
              <div
                key={index}
                onClick={(e) => {
                  if (onItemClick) onItemClick(choice);
                  setShowSearchResult(false);
                }}
                onMouseDown={(e) => e.preventDefault()}
              >
                {itemView(choice)}
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
