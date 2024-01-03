import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import scrollbar_style from "@/styles/scrollbar.module.css";
import { Input } from "../ui/input";

// export function DefaultCustomCombobox<T>({
//   searchPlaceholder,
//   value,
//   choices,
//   valueView,
//   itemSearchView,
//   onSearchChange,
//   startIcon,
//   onItemClick,
//   filter,
//   className,
// }: {
//   searchPlaceholder: string;
//   value: T | null;
//   choices: T[];
//   valueView: (choice: T | null) => React.ReactNode;
//   itemSearchView: (choice: T) => React.ReactNode;
//   onSearchChange?: (value: string) => any;
//   filter?: (choice: T) => boolean;
//   onItemClick?: (choice: T) => any;
//   startIcon?: JSX.Element;
//   className?: string;
// }) {
//   const filteredChoices = filter ? choices.filter(filter) : choices;
//   const [showSearch, setShowSearch] = useState(false);

//   return (
//     <div
//       className={cn(
//         "relative flex min-h-[40px] items-center rounded-sm border p-2 duration-100 ease-linear hover:bg-gray-100",
//         className,
//       )}
//     >
//       <div
//         className="flex w-full cursor-pointer flex-row items-center gap-1"
//         onClick={() => setShowSearch((prev) => !prev)}
//       >
//         {startIcon}
//         <div className="min-w-[60px] flex-1 overflow-hidden">
//           {value ? valueView(value) : null}
//         </div>
//         {showSearch ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//       </div>
//       {showSearch ? (
//         <div className="absolute left-0 right-0 top-full z-10 min-w-[200px] overflow-hidden rounded-sm bg-white shadow-[0px_0px_5px_1px_#A8A8A8]">
//           <div className={"flex flex-row items-center !border-b-0 bg-white"}>
//             <Search size={20} color={"rgb(156 163 175)"} className="ml-2" />
//             <Input
//               placeholder={searchPlaceholder}
//               autoFocus
//               className={
//                 "h-[35px] w-full border-0 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
//               }
//               onChange={(e) => {
//                 if (onSearchChange) onSearchChange(e.currentTarget.value);
//                 setShowSearch(true);
//               }}
//               onFocus={(e) => setShowSearch(true)}
//               onBlur={(e) => setShowSearch(false)}
//             />
//           </div>
//           <div
//             className={cn(
//               "flex h-auto max-h-[500px] flex-col overflow-y-auto overflow-x-hidden border-none",
//               scrollbar_style.scrollbar,
//             )}
//           >
//             {filteredChoices.length === 0 ? (
//               <div
//                 className="flex h-10 items-center justify-center bg-white"
//                 onMouseDown={(e) => e.preventDefault()}
//               >
//                 <p>No results found!</p>
//               </div>
//             ) : (
//               filteredChoices.map((choice, index) => (
//                 <div
//                   key={index}
//                   onClick={(e) => {
//                     if (onItemClick) onItemClick(choice);
//                     setShowSearch(false);
//                   }}
//                   onMouseDown={(e) => e.preventDefault()}
//                 >
//                   {itemSearchView(choice)}
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }

export default function CustomCombobox<T>({
  searchPlaceholder,
  placeholder = "Select an option",
  value,
  choices,
  valueView,
  itemSearchView,
  onSearchChange,
  startIcon,
  endIcon,
  endIcons,
  showSearchInput = true,
  onItemClick,
  filter,
  className,
  disabled = false,
}: {
  searchPlaceholder: string;
  placeholder?: string;
  value: T | null;
  choices: T[];
  valueView: (choice: T) => React.ReactNode;
  itemSearchView: (choice: T) => React.ReactNode;
  onSearchChange?: (value: string) => any;
  filter?: (choice: T) => boolean;
  onItemClick?: (choice: T) => any;
  showSearchInput?: boolean;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  endIcons?: JSX.Element[];
  className?: string;
  disabled?: boolean;
}) {
  let filteredChoices = filter ? choices.filter(filter) : choices;
  const [showSearch, setShowSearch] = useState(false);
  const comboboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div
      ref={comboboxRef}
      className={cn(
        "relative flex select-none items-center rounded-sm border",
        className,
        disabled ? "pointer-events-none opacity-40" : "",
      )}
    >
      <div className="z-0 flex w-full cursor-pointer flex-row items-center gap-1 p-2 duration-100 ease-linear hover:bg-gray-100">
        <div
          className="flex w-full flex-row items-center"
          onClick={() => setShowSearch((prev) => !prev)}
        >
          {startIcon}
          <div className="min-w-[60px] flex-1 overflow-hidden">
            {value ? (
              valueView(value)
            ) : (
              <p className="z-0 text-sm text-neutral-500">{placeholder}</p>
            )}
          </div>
          {showSearch ? (
            <ChevronUp size={16} color="gray" />
          ) : (
            <ChevronDown size={16} color="gray" />
          )}
        </div>

        {endIcon}
        {endIcons}
      </div>
      <div
        className={cn(
          "absolute left-0 right-0 top-full z-10 mt-1 min-w-[200px] overflow-hidden rounded-sm bg-white shadow-[0px_0px_5px_1px_#A8A8A8] duration-100 ease-linear",
          showSearch ? "visible" : "hidden",
        )}
      >
        <div
          className={cn(
            "flex flex-row items-center !border-b-0 bg-white",
            showSearchInput ? "" : "hidden",
          )}
        >
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
          />
        </div>
        <div
          className={cn(
            "flex h-auto max-h-[200px] flex-col overflow-y-auto overflow-x-hidden border-none",
            scrollbar_style.scrollbar,
          )}
        >
          {filteredChoices.length === 0 ? (
            <div
              className="flex h-10 items-center justify-center bg-white"
              onMouseDown={(e) => e.preventDefault()}
            >
              <p className="text-sm">No result found!</p>
            </div>
          ) : (
            filteredChoices.map((choice, index) => (
              <div
                key={index}
                onClick={(e) => {
                  console.log("clicked", choice);
                  if (onItemClick) onItemClick(choice);

                  setShowSearch(false);
                }}
                className="duration-100 ease-linear hover:bg-gray-100"
              >
                {itemSearchView(choice)}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
