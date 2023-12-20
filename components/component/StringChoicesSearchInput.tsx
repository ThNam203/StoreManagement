import { cn } from "@/lib/utils";
import { Check, CheckSquare, Square, X } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import scrollbar_style from "@/styles/scrollbar.module.css";

type Value = {
  id: any;
  value: string;
};

export function MultipleChoicesSearchInput({
  value,
  className,
  choices,
  onValueChanged,
}: {
  value: Value[];
  className?: string;
  choices: Value[];
  onValueChanged: (values: Value[]) => void;
}) {
  const [searchInput, setSearchInput] = useState("");
  const [showSearchResult, setShowSearchResult] = useState(false);

  const filteredChoices = choices
    .filter((choice) =>
      choice.value.toLowerCase().includes(searchInput.trim().toLowerCase()),
    )
    .map((choice, idx) => (
      <li
        key={idx}
        className="flex flex-row items-center bg-white p-2 hover:cursor-pointer hover:bg-slate-300"
        onClick={(e) => {
          if (value.find((v) => v.id === choice.id))
            onValueChanged(value.filter((v) => v.id !== choice.id));
          else onValueChanged([...value, choice]);
          e.stopPropagation();
          setShowSearchResult(false);
          setSearchInput("");
        }}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
      >
        <p className="flex-1">{choice.value}</p>
        {value.map((v) => v.id).includes(choice.id) ? (
          <Check size={16} />
        ) : null}
      </li>
    ));

  if (choices.length > 0)
    if (choices.length === value.length) {
      filteredChoices.unshift(
        <li
          key={-1}
          className="flex flex-row items-center bg-white p-2 font-semibold hover:cursor-pointer hover:bg-slate-300"
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
        </li>,
      );
    } else
      filteredChoices.unshift(
        <li
          key={-1}
          className="flex flex-row items-center bg-white p-2 font-semibold hover:cursor-pointer hover:bg-slate-300"
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
        </li>,
      );

  return (
    <div
      className={cn(
        "relative !mt-0 rounded-md border px-2 py-1 text-sm",
        scrollbar_style.scrollbar,
        className,
      )}
    >
      <div className="flex max-h-[100px] flex-row flex-wrap items-center gap-1 overflow-y-auto">
        {value.map((rs, idx) => (
          <div
            key={idx}
            className="flex flex-row items-center gap-[2px] rounded-md bg-blue-400 p-1 text-xs text-white"
          >
            <p>{rs.value}</p>
            <X
              size={16}
              color="white"
              className="p-[2px] hover:cursor-pointer"
              onClick={() =>
                onValueChanged(value.filter((v) => v.id !== rs.id))
              }
            />
          </div>
        ))}
        <Input
          className="!m-0 h-[32px] flex-1 !rounded-none border-0 !p-0 placeholder:text-xs focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
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
            "absolute left-0 right-0 top-full flex h-auto max-h-[200px] flex-col overflow-y-auto overflow-x-hidden rounded-sm border-none bg-white shadow-[0px_5px_5px_1px_#A8A8A8]",
            scrollbar_style.scrollbar,
            showSearchResult ? "rounded-t-none" : "",
          )}
        >
          {filteredChoices.length === 0 ? (
            <div
              className="flex h-10 items-center justify-center bg-white"
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
