"use client";

import scrollbar_style from "../../styles/scrollbar.module.css";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { DateRangePicker } from "react-date-range";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "./checkbox";
import { cn } from "@/lib/utils";
import { CalendarDays, Check, Maximize2, PlusCircle, X, XCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { useEffect, useState } from "react";
import { Input } from "./input";
import { ScrollArea } from "./scroll-area";

const ChoicesFilter = ({
  title,
  isSingleChoice,
  showPlusButton,
  alwaysOpen,
  choices,
  className,
  defaultPosition,
  defaultPositions,
  onPlusButtonClicked,
  onSingleChoiceChanged,
  onMultiChoicesChanged,
}: {
  title: string;
  isSingleChoice: boolean;
  showPlusButton?: boolean;
  alwaysOpen?: boolean;
  choices: string[];
  className?: string;
  defaultPosition?: number;
  defaultPositions?: number[];
  onPlusButtonClicked?: () => void;
  onSingleChoiceChanged?: (position: number, value: string) => void;
  onMultiChoicesChanged?: (positions: number[], values: string[]) => void;
}) => {
  if (defaultPosition == undefined) defaultPosition = -1;
  if (defaultPositions == undefined) defaultPositions = [];
  const multiChoicesHandler = (
    checkedState: boolean | "indeterminate",
    position: number
  ) => {
    if (checkedState === true) {
      if (!defaultPositions!.includes(position)) {
        defaultPositions!.push(position);
      }
    } else {
      const removePos = defaultPositions!.indexOf(position);
      if (removePos != -1) {
        defaultPositions!.splice(removePos, 1);
      }
    }

    if (onMultiChoicesChanged)
      onMultiChoicesChanged(
        defaultPositions!,
        choices.filter((val, index) => defaultPositions!.includes(index))
      );
  };

  return (
    <Accordion
      type="single"
      collapsible={!alwaysOpen}
      defaultValue="item-1"
      className={cn("w-[260px] bg-white rounded-md px-4", className)}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger showArrowFunc={alwaysOpen ? "hidden" : ""}>
          <div className="flex flex-row items-center w-full">
            <p className="text-[0.8rem] leading-4 font-bold text-start flex-1">
              {title}
            </p>
            {showPlusButton === true ? (
              <PlusCircle
                className={alwaysOpen ? "ml-2" : "mx-2"}
                size={16}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onPlusButtonClicked) onPlusButtonClicked();
                }}
              />
            ) : null}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {isSingleChoice ? (
            <RadioGroup
              className="gap-3 pb-2"
              defaultValue={defaultPosition.toString()}
              onValueChange={(position) => {
                if (onSingleChoiceChanged)
                  onSingleChoiceChanged(
                    parseInt(position),
                    choices[parseInt(position)]
                  );
              }}
            >
              {choices.map((choice, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <RadioGroupItem value={index.toString()} id={title + index} />
                  <Label
                    htmlFor={title + index}
                    className="text-[0.8rem] hover:cursor-pointer font-normal"
                  >
                    {choice}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="flex flex-col gap-3 pb-2">
              {choices.map((choice, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Checkbox
                    value={index}
                    id={title + index}
                    onCheckedChange={(checkedState) =>
                      multiChoicesHandler(checkedState, index)
                    }
                  />
                  <Label
                    htmlFor={title + index}
                    className="text-[0.8rem] hover:cursor-pointer font-normal"
                  >
                    {choice}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

enum FilterDay {
  Today = "Today",
  LastDay = "Last day",
}

enum FilterWeek {
  ThisWeek = "This week",
  LastWeek = "Last week",
  Last7Days = "Last 7 days",
}

enum FilterMonth {
  ThisMonth = "This month",
  LastMonth = "Last month",
  Last30Days = "Last 30 days",
}

enum FilterQuarter {
  ThisQuarter = "This quarter",
  LastQuarter = "Last quarter",
}

enum FilterYear {
  ThisYear = "This year",
  LastYear = "Last year",
  AllTime = "All time",
}

type FilterTime =
  | FilterDay
  | FilterWeek
  | FilterMonth
  | FilterQuarter
  | FilterYear;

const TimeFilter = ({
  title,
  className,
  alwaysOpen,
  filterDay = [FilterDay.Today, FilterDay.LastDay],
  filterWeek = [FilterWeek.ThisWeek, FilterWeek.LastWeek, FilterWeek.Last7Days],
  filterMonth = [
    FilterMonth.ThisMonth,
    FilterMonth.LastMonth,
    FilterMonth.Last30Days,
  ],
  filterQuarter = [FilterQuarter.ThisQuarter, FilterQuarter.LastQuarter],
  filterYear = [FilterYear.ThisYear, FilterYear.LastYear, FilterYear.AllTime],
  onSingleTimeFilterChanged,
  onRangeTimeFilterChanged,
}: {
  title: string;
  className?: string;
  alwaysOpen?: boolean;
  filterDay?: FilterDay[];
  filterWeek?: FilterWeek[];
  filterMonth?: FilterMonth[];
  filterQuarter?: FilterQuarter[];
  filterYear?: FilterYear[];
  onSingleTimeFilterChanged: (filterTime: FilterTime) => void;
  onRangeTimeFilterChanged: (range: { startDate: Date; endDate: Date }) => void;
}) => {
  const [singleTime, setSingleTime] = useState<FilterTime>(FilterYear.AllTime);
  const [isSingleFilter, setIsSingleFilter] = useState(true);
  const [isRangeFilterOpen, setIsRangeFilterOpen] = useState(false);
  const [tempRangeState, setTempRangeState] = useState<{
    startDate: Date;
    endDate: Date;
    key: string;
  } | null>(null);
  const [rangeState, setRangeState] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  return (
    <Accordion
      type="single"
      collapsible={!alwaysOpen}
      defaultValue="item-1"
      className={cn("w-[260px] bg-white rounded-md px-4", className)}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger showArrowFunc={alwaysOpen ? "hidden" : ""}>
          <div className="flex flex-row items-center w-full">
            <p className="text-[0.8rem] leading-4 font-bold text-start flex-1">
              {title}
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <RadioGroup className="gap-3 pb-2">
            <div className="flex flex-row items-center space-x-3 border border-gray-300 p-2 rounded-sm relative">
              <RadioGroupItem
                value="1"
                id={title + "1"}
                checked={isSingleFilter}
                onClick={() => {
                  setIsSingleFilter(true);
                  onSingleTimeFilterChanged(singleTime);
                }}
              />
              <Label
                htmlFor={title + "1"}
                className="text-[0.8rem] flex-1 hover:cursor-pointer font-normal"
              >
                {singleTime}
              </Label>
              <Popover>
                <PopoverTrigger>
                  <Maximize2 size={16} />
                </PopoverTrigger>
                <PopoverContent className="flex flex-row gap-6 w-auto -translate-x-4">
                  <div>
                    <p className="text-xs font-semibold">By day</p>
                    <ul className="list-none text-blue-500 text-xs">
                      {filterDay.map((val, idx) => (
                        <li
                          className="mt-5 cursor-pointer"
                          onClick={() => {
                            setSingleTime(val);
                            setIsSingleFilter(true);
                            onSingleTimeFilterChanged(val);
                          }}
                          key={idx}
                        >
                          {val}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold">By week</p>
                    <ul className="list-none text-blue-500 text-xs">
                      {filterWeek.map((val, idx) => (
                        <li
                          className="mt-5 cursor-pointer"
                          onClick={() => {
                            setSingleTime(val);
                            setIsSingleFilter(true);
                            onSingleTimeFilterChanged(val);
                          }}
                          key={idx}
                        >
                          {val}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold">By month</p>
                    <ul className="list-none text-blue-500 text-xs">
                      {filterMonth.map((val, idx) => (
                        <li
                          className="mt-5 cursor-pointer"
                          onClick={() => {
                            setSingleTime(val);
                            setIsSingleFilter(true);
                            onSingleTimeFilterChanged(val);
                          }}
                          key={idx}
                        >
                          {val}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold">By quarter</p>
                    <ul className="list-none text-blue-500 text-xs">
                      {filterQuarter.map((val, idx) => (
                        <li
                          className="mt-5 cursor-pointer"
                          onClick={() => {
                            setSingleTime(val);
                            setIsSingleFilter(true);
                            onSingleTimeFilterChanged(val);
                          }}
                          key={idx}
                        >
                          {val}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold">By year</p>
                    <ul className="list-none text-blue-500 text-xs">
                      {filterYear.map((val, idx) => (
                        <li
                          className="mt-5 cursor-pointer"
                          onClick={() => {
                            setSingleTime(val);
                            setIsSingleFilter(true);
                            onSingleTimeFilterChanged(val);
                          }}
                          key={idx}
                        >
                          {val}
                        </li>
                      ))}
                    </ul>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-row items-center space-x-3 border border-gray-300 p-2 rounded-sm">
              <RadioGroupItem
                value="2"
                id={title + "2"}
                checked={!isSingleFilter}
                onClick={() => {
                  setIsSingleFilter(false);
                  onRangeTimeFilterChanged(rangeState);
                }}
              />
              <Label
                htmlFor={title + "2"}
                className="text-[0.8rem] flex-1 hover:cursor-pointer font-normal"
              >
                {rangeState.startDate.toLocaleDateString() +
                  " - " +
                  rangeState.endDate.toLocaleDateString()}
              </Label>
              <Popover
                open={isRangeFilterOpen}
                onOpenChange={(isOpen) => {
                  setTempRangeState(rangeState);
                  setIsRangeFilterOpen(isOpen);
                }}
              >
                <PopoverTrigger>
                  <CalendarDays size={16} />
                </PopoverTrigger>
                <PopoverContent className="w-auto -translate-x-4 flex flex-col">
                  <DateRangePicker
                    ranges={[tempRangeState!]}
                    onChange={(item) => {
                      if (
                        item.selection.startDate &&
                        item.selection.endDate &&
                        item.selection.key
                      ) {
                        setTempRangeState({
                          startDate: item.selection.startDate,
                          endDate: item.selection.endDate,
                          key: item.selection.key,
                        });
                        setIsSingleFilter(false);
                      }
                    }}
                  />
                  <Button
                    className="bg-blue-400 hover:bg-blue-500 text-white mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (tempRangeState) {
                        setRangeState(tempRangeState);
                        onRangeTimeFilterChanged(tempRangeState);
                      }
                      setIsRangeFilterOpen(false);
                    }}
                  >
                    Done
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          </RadioGroup>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const SearchFilter = ({
  title,
  placeholder,
  alwaysOpen,
  choices,
  className,
  onValuesChanged,
}: {
  title: string;
  placeholder: string;
  alwaysOpen?: boolean;
  choices: string[];
  className?: string;
  onValuesChanged?: (values: string[]) => void;
}) => {
  const [showSearchValue, setShowSearchvalue] = useState(false);
  const [chosenValues, setChosenValues] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (onValuesChanged) onValuesChanged(chosenValues);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenValues])

  return (
    <Accordion
      type="single"
      collapsible={!alwaysOpen}
      defaultValue="item-1"
      className={cn("w-[260px] bg-white rounded-md px-4", className)}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger showArrowFunc={alwaysOpen ? "hidden" : ""}>
          <div className="flex flex-row items-center w-full">
            <p className="text-[0.8rem] leading-4 font-bold text-start flex-1">
              {title}
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="overflow-visible">
          <div className="flex flex-col mb-4 relative">
            <Input
              className="w-full focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
              placeholder={placeholder}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setShowSearchvalue(true)}
              onBlur={() => setShowSearchvalue(false)}
            />
            {showSearchValue ? (
              <div
                className={cn(
                  "absolute top-[100%] overflow-y-auto left-0 max-h-[200px] w-full shadow-sm shadow-gray-600 z-[90000]",
                  scrollbar_style.scrollbar
                )}
              >
                <ul>
                  {choices
                    .filter((value) => value.includes(searchInput.trim()))
                    .map((value, idx) => (
                      <li
                        key={idx}
                        className="p-2 bg-slate-100 hover:cursor-pointer hover:bg-slate-300 flex flex-row items-center"
                        onClick={(e) => {
                          if (chosenValues.includes(value))
                            setChosenValues((prev) =>
                              prev.filter((v) => v !== value)
                            );
                          else setChosenValues((prev) => [...prev, value]);
                          e.stopPropagation();
                        }}

                        onMouseDown={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <p className="flex-1">{value}</p>
                        {chosenValues.includes(value) ? (
                          <Check size={16} />
                        ) : null}
                      </li>
                    ))}
                </ul>
              </div>
            ) : null}
          </div>
          {chosenValues.map((val, idx) => (
            <div key={idx} className="flex flex-row items-center space-x-3 mb-3">
              <p className="text-[0.8rem] flex-1 hover:cursor-pointer font-normal">
                {val}
              </p>
              <XCircle
                size={16}
                color="#FFFFFF"
                fill="rgb(96 165 250)"
                className="w-4 h-4 hover:cursor-pointer p-0"
                onClick={(e) =>
                  setChosenValues((prev) => prev.filter((v) => v !== val))
                }
              />
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export {
  ChoicesFilter,
  TimeFilter,
  SearchFilter,
  FilterDay,
  FilterMonth,
  FilterWeek,
  FilterQuarter,
  FilterYear,
};
