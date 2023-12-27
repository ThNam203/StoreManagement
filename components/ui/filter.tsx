"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { TimeFilterType, formatNumberInput } from "@/utils";
import format from "date-fns/format";
import { CalendarDays, Check, Filter, Maximize2, XCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import scrollbar_style from "../../styles/scrollbar.module.css";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea } from "./scroll-area";

const SingleChoiceFilter = <T extends string | number>({
  title,
  alwaysOpen,
  choices,
  className,
  value,
  onValueChanged,
}: {
  title: string;
  alwaysOpen?: boolean;
  choices: T[];
  className?: string;
  value?: T;
  onValueChanged?: (value: T) => void;
}) => {
  return (
    <Accordion
      type="single"
      collapsible={!alwaysOpen}
      defaultValue="item-1"
      className={cn("w-full rounded-md bg-white px-4", className)}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger showArrowFunc={alwaysOpen ? "hidden" : ""}>
          <p className="flex-1 text-start text-[0.8rem] font-bold leading-4">
            {title}
          </p>
        </AccordionTrigger>
        <AccordionContent>
          <RadioGroup
            className="gap-3 pb-2"
            value={value ? value.toString() : undefined}
            onValueChange={(val) => {
              if (!onValueChanged) return;
              if (typeof val === "string") onValueChanged(val as T);
              else onValueChanged(Number(val) as T);
            }}
          >
            {choices.map((choice, index) => (
              <div key={index} className="flex items-center space-x-3">
                <RadioGroupItem value={choice.toString()} id={title + index} />
                <Label
                  htmlFor={title + index}
                  className="text-[0.8rem] font-normal hover:cursor-pointer"
                >
                  {choice}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const MultiChoicesFilter = <T extends string | number>({
  title,
  alwaysOpen,
  choices,
  className,
  values = [],
  onValueChanged,
}: {
  title: string;
  alwaysOpen?: boolean;
  choices: T[];
  className?: string;
  values?: T[];
  onValueChanged?: (values: T[]) => void;
}) => {
  const multiChoicesHandler = (
    checkedState: boolean | "indeterminate",
    checkedValue: T,
  ) => {
    if (checkedState === true) {
      if (!values.includes(checkedValue)) values.push(checkedValue);
    } else {
      const removePos = values.indexOf(checkedValue);
      if (removePos != -1) values.splice(removePos, 1);
    }

    if (onValueChanged) onValueChanged(values);
  };

  return (
    <Accordion
      type="single"
      collapsible={!alwaysOpen}
      defaultValue="item-1"
      className={cn("w-full rounded-md bg-white px-4", className)}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger showArrowFunc={alwaysOpen ? "hidden" : ""}>
          <p className="flex-1 text-start text-[0.8rem] font-bold leading-4">
            {title}
          </p>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-3 pb-2">
            {choices.map((choice, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Checkbox
                  value={index}
                  id={title + index}
                  checked={values!.includes(choice)}
                  onCheckedChange={(checkedState) =>
                    multiChoicesHandler(checkedState, choice)
                  }
                />
                <Label
                  htmlFor={title + index}
                  className="text-[0.8rem] font-normal hover:cursor-pointer"
                >
                  {choice}
                </Label>
              </div>
            ))}
          </div>
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

export type FilterTime =
  | FilterDay
  | FilterWeek
  | FilterMonth
  | FilterQuarter
  | FilterYear;

const TimerFilterRangePicker = ({
  defaultValue,
  onValueChange,
  setIsRangeFilterOpen,
}: {
  defaultValue: { startDate: Date; endDate: Date };
  onValueChange?: (val: { startDate: Date; endDate: Date }) => void;
  setIsRangeFilterOpen: (val: boolean) => void;
}) => {
  const [tempRange, setTempRange] = useState(defaultValue);

  return (
    <>
      <DateRangePicker
        ranges={[{ ...tempRange, key: "selection" }]}
        onChange={(item) => {
          if (
            item.selection.startDate &&
            item.selection.endDate &&
            item.selection.key
          ) {
            setTempRange({
              startDate: item.selection.startDate,
              endDate: item.selection.endDate,
            });
          }
        }}
      />
      <Button
        className="mt-2 bg-blue-400 text-white hover:bg-blue-500"
        onClick={(e) => {
          e.stopPropagation();
          if (onValueChange) onValueChange(tempRange);
          setIsRangeFilterOpen(false);
        }}
      >
        Done
      </Button>
    </>
  );
};

const TimeFilter = ({
  title,
  className,
  alwaysOpen = false,
  timeFilterControl = TimeFilterType.StaticRange,
  singleTimeValue = FilterYear.AllTime,
  singleTimeString,
  rangeTimeValue = { startDate: new Date(), endDate: new Date() },
  onTimeFilterControlChanged,
  onSingleTimeFilterChanged,
  onRangeTimeFilterChanged,
  filterDay = [FilterDay.Today, FilterDay.LastDay],
  filterWeek = [FilterWeek.ThisWeek, FilterWeek.LastWeek, FilterWeek.Last7Days],
  filterMonth = [
    FilterMonth.ThisMonth,
    FilterMonth.LastMonth,
    FilterMonth.Last30Days,
  ],
  filterQuarter = [FilterQuarter.ThisQuarter, FilterQuarter.LastQuarter],
  filterYear = [FilterYear.ThisYear, FilterYear.LastYear, FilterYear.AllTime],
}: {
  title: string;
  className?: string;
  alwaysOpen?: boolean;
  timeFilterControl: TimeFilterType;
  singleTimeValue?: FilterTime;
  singleTimeString?: string;
  rangeTimeValue?: { startDate: Date; endDate: Date };
  onTimeFilterControlChanged: (timeFilterControl: TimeFilterType) => void;
  onSingleTimeFilterChanged?: (filterTime: FilterTime) => void;
  onRangeTimeFilterChanged?: (range: {
    startDate: Date;
    endDate: Date;
  }) => void;
  filterDay?: FilterDay[];
  filterWeek?: FilterWeek[];
  filterMonth?: FilterMonth[];
  filterQuarter?: FilterQuarter[];
  filterYear?: FilterYear[];
}) => {
  const [isSingleFilter, setIsSingleFilter] = useState(
    timeFilterControl === TimeFilterType.StaticRange,
  );
  const [isRangeFilterOpen, setIsRangeFilterOpen] = useState(false);

  useEffect(() => {
    onTimeFilterControlChanged(
      isSingleFilter ? TimeFilterType.StaticRange : TimeFilterType.RangeTime,
    );
  }, [isSingleFilter]);

  return (
    <Accordion
      type="single"
      collapsible={!alwaysOpen}
      defaultValue="item-1"
      className={cn("w-full rounded-md bg-white px-4", className)}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger showArrowFunc={alwaysOpen ? "hidden" : ""}>
          <div className="flex w-full flex-row items-center">
            <p className="flex-1 text-start text-[0.8rem] font-bold leading-4">
              {title}
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <RadioGroup className="gap-3 pb-2">
            <div className="relative flex flex-row items-center space-x-3 rounded-sm border border-gray-300 p-2">
              <RadioGroupItem
                value="1"
                id={title + "1"}
                checked={isSingleFilter}
                onClick={() => {
                  if (isSingleFilter) return;
                  setIsSingleFilter(true);
                  if (onSingleTimeFilterChanged)
                    onSingleTimeFilterChanged(singleTimeValue);
                }}
              />
              <Label
                htmlFor={title + "1"}
                className="flex-1 text-[0.8rem] font-normal hover:cursor-pointer"
              >
                {singleTimeString ? singleTimeString : singleTimeValue}
              </Label>
              <Popover>
                <PopoverTrigger>
                  <Maximize2 size={16} />
                </PopoverTrigger>
                <PopoverContent className="flex w-auto -translate-x-4 flex-row gap-6">
                  <div>
                    <p className="text-xs font-semibold">By day</p>
                    <ul className="list-none text-xs text-blue-500">
                      {filterDay.map((val, idx) => (
                        <li
                          className="mt-5 cursor-pointer"
                          onClick={() => {
                            setIsSingleFilter(true);
                            if (onSingleTimeFilterChanged)
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
                    <ul className="list-none text-xs text-blue-500">
                      {filterWeek.map((val, idx) => (
                        <li
                          className="mt-5 cursor-pointer"
                          onClick={() => {
                            setIsSingleFilter(true);
                            if (onSingleTimeFilterChanged)
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
                    <ul className="list-none text-xs text-blue-500">
                      {filterMonth.map((val, idx) => (
                        <li
                          className="mt-5 cursor-pointer"
                          onClick={() => {
                            setIsSingleFilter(true);
                            if (onSingleTimeFilterChanged)
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
                    <ul className="list-none text-xs text-blue-500">
                      {filterQuarter.map((val, idx) => (
                        <li
                          className="mt-5 cursor-pointer"
                          onClick={() => {
                            setIsSingleFilter(true);
                            if (onSingleTimeFilterChanged)
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
                    <ul className="list-none text-xs text-blue-500">
                      {filterYear.map((val, idx) => (
                        <li
                          className="mt-5 cursor-pointer"
                          onClick={() => {
                            setIsSingleFilter(true);
                            if (onSingleTimeFilterChanged)
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
            <div className="flex flex-row items-center space-x-3 rounded-sm border border-gray-300 p-2">
              <RadioGroupItem
                value="2"
                id={title + "2"}
                checked={!isSingleFilter}
                onClick={() => {
                  setIsSingleFilter(false);
                  if (onRangeTimeFilterChanged)
                    onRangeTimeFilterChanged(rangeTimeValue);
                }}
              />
              <Label
                htmlFor={title + "2"}
                className="flex-1 text-[0.8rem] font-normal hover:cursor-pointer"
              >
                {format(rangeTimeValue.startDate, "MM/dd/yyyy") +
                  " - " +
                  format(rangeTimeValue.endDate, "MM/dd/yyyy")}
              </Label>
              <Popover
                open={isRangeFilterOpen}
                onOpenChange={setIsRangeFilterOpen}
              >
                <PopoverTrigger>
                  <CalendarDays size={16} />
                </PopoverTrigger>
                <PopoverContent className="flex w-auto -translate-x-4 flex-col">
                  <TimerFilterRangePicker
                    defaultValue={rangeTimeValue}
                    onValueChange={onRangeTimeFilterChanged}
                    setIsRangeFilterOpen={setIsRangeFilterOpen}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </RadioGroup>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export enum FilterGroup {
  ByYear = "By year",
  ByQuarter = "By quarter",
  ByMonth = "By month",
}
const SecondaryTimeFilter = ({
  title,
  className,
  alwaysOpen = false,
  timeFilterControl = TimeFilterType.StaticRange,
  singleTimeValue = FilterGroup.ByMonth,
  singleTimeString,
  rangeTimeValue = { startDate: new Date(), endDate: new Date() },
  filterGroup = [
    FilterGroup.ByYear,
    FilterGroup.ByQuarter,
    FilterGroup.ByMonth,
  ],
  onTimeFilterControlChanged,
  onSingleTimeFilterChanged,
  onRangeTimeFilterChanged,
}: {
  title: string;
  className?: string;
  alwaysOpen?: boolean;
  timeFilterControl: TimeFilterType;
  singleTimeValue?: FilterGroup;
  singleTimeString?: string;
  rangeTimeValue?: { startDate: Date; endDate: Date };
  filterGroup?: FilterGroup[];
  onTimeFilterControlChanged: (timeFilterControl: TimeFilterType) => void;
  onSingleTimeFilterChanged?: (filterGroup: FilterGroup) => void;
  onRangeTimeFilterChanged?: (range: {
    startDate: Date;
    endDate: Date;
  }) => void;
}) => {
  const [isSingleFilter, setIsSingleFilter] = useState(
    timeFilterControl === TimeFilterType.StaticRange,
  );
  const [isRangeFilterOpen, setIsRangeFilterOpen] = useState(false);

  useEffect(() => {
    onTimeFilterControlChanged(
      isSingleFilter ? TimeFilterType.StaticRange : TimeFilterType.RangeTime,
    );
  }, [isSingleFilter]);

  return (
    <Accordion
      type="single"
      collapsible={!alwaysOpen}
      defaultValue="item-1"
      className={cn("w-full rounded-md bg-white px-4", className)}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger showArrowFunc={alwaysOpen ? "hidden" : ""}>
          <div className="flex w-full flex-row items-center">
            <p className="flex-1 text-start text-[0.8rem] font-bold leading-4">
              {title}
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <RadioGroup className="gap-3 pb-2">
            <div className="relative flex flex-row items-center space-x-3 rounded-sm border border-gray-300 p-2">
              <RadioGroupItem
                value="1"
                id={title + "1"}
                checked={isSingleFilter}
                onClick={() => {
                  if (isSingleFilter) return;
                  setIsSingleFilter(true);
                  if (onSingleTimeFilterChanged)
                    onSingleTimeFilterChanged(singleTimeValue);
                }}
              />
              <Label
                htmlFor={title + "1"}
                className="flex-1 text-[0.8rem] font-normal hover:cursor-pointer"
              >
                {singleTimeString ? singleTimeString : singleTimeValue}
              </Label>
              <Popover>
                <PopoverTrigger>
                  <Maximize2 size={16} />
                </PopoverTrigger>
                <PopoverContent className="flex w-auto -translate-x-4 flex-row gap-6">
                  <div>
                    <p className="text-xs font-semibold">By day</p>
                    <ul className="list-none text-xs text-blue-500">
                      {filterGroup.map((val, idx) => (
                        <li
                          className="mt-5 cursor-pointer"
                          onClick={() => {
                            setIsSingleFilter(true);
                            if (onSingleTimeFilterChanged)
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
            <div className="flex flex-row items-center space-x-3 rounded-sm border border-gray-300 p-2">
              <RadioGroupItem
                value="2"
                id={title + "2"}
                checked={!isSingleFilter}
                onClick={() => {
                  setIsSingleFilter(false);
                  if (onRangeTimeFilterChanged)
                    onRangeTimeFilterChanged(rangeTimeValue);
                }}
              />
              <Label
                htmlFor={title + "2"}
                className="flex-1 text-[0.8rem] font-normal hover:cursor-pointer"
              >
                {format(rangeTimeValue.startDate, "dd/MM/yyyy") +
                  " - " +
                  format(rangeTimeValue.endDate, "dd/MM/yyyy")}
              </Label>
              <Popover
                open={isRangeFilterOpen}
                onOpenChange={setIsRangeFilterOpen}
              >
                <PopoverTrigger>
                  <CalendarDays size={16} />
                </PopoverTrigger>
                <PopoverContent className="flex w-auto -translate-x-4 flex-col">
                  <TimerFilterRangePicker
                    defaultValue={rangeTimeValue}
                    onValueChange={onRangeTimeFilterChanged}
                    setIsRangeFilterOpen={setIsRangeFilterOpen}
                  />
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
  chosenValues,
  choices,
  className,
  onValuesChanged,
}: {
  title: string;
  placeholder: string;
  alwaysOpen?: boolean;
  chosenValues: string[];
  choices: string[];
  className?: string;
  onValuesChanged?: (values: string[]) => void;
}) => {
  const [showSearchValue, setShowSearchvalue] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (onValuesChanged) onValuesChanged(chosenValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenValues]);

  return (
    <Accordion
      type="single"
      collapsible={!alwaysOpen}
      defaultValue="item-1"
      className={cn("w-full rounded-md bg-white px-4", className)}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger showArrowFunc={alwaysOpen ? "hidden" : ""}>
          <div className="flex w-full flex-row items-center">
            <p className="flex-1 text-start text-[0.8rem] font-bold leading-4">
              {title}
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="overflow-hidden data-[state=open]:overflow-visible">
          <div className="relative mb-4 flex flex-col">
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
                  "absolute left-0 top-[100%] z-[9] max-h-[200px] w-full overflow-y-auto shadow-sm shadow-gray-600",
                  scrollbar_style.scrollbar,
                )}
              >
                <ul>
                  {choices
                    .filter(
                      (value) =>
                        value !== null && value.includes(searchInput.trim()),
                    )
                    .map((value, idx) => (
                      <li
                        key={idx}
                        className="flex flex-row items-center bg-slate-100 p-2 hover:cursor-pointer hover:bg-slate-300"
                        onClick={(e) => {
                          if (!onValuesChanged) return;
                          if (chosenValues.includes(value))
                            onValuesChanged(
                              chosenValues.filter((v) => v !== value),
                            );
                          else onValuesChanged([...chosenValues, value]);
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
            <div
              key={idx}
              className="mb-3 flex flex-row items-center space-x-3"
            >
              <p className="flex-1 text-[0.8rem] font-normal hover:cursor-pointer">
                {val}
              </p>
              <XCircle
                size={16}
                color="#FFFFFF"
                fill="rgb(96 165 250)"
                className="h-4 w-4 p-0 hover:cursor-pointer"
                onClick={(e) => {
                  if (onValuesChanged)
                    onValuesChanged(chosenValues.filter((v) => v !== val));
                }}
              />
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

type FilterObject = object & {
  id: number;
  displayString: string;
};

const SearchFilterObject = ({
  title,
  placeholder,
  alwaysOpen,
  values,
  choices,
  filter,
  className,
  onValuesChanged,
}: {
  title: string;
  placeholder: string;
  alwaysOpen?: boolean;
  values: FilterObject[];
  choices: FilterObject[];
  filter: (value: FilterObject, searchInput: string) => boolean;
  className?: string;
  onValuesChanged?: (values: FilterObject[]) => void;
}) => {
  const [showSearchValue, setShowSearchvalue] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  return (
    <Accordion
      type="single"
      collapsible={!alwaysOpen}
      defaultValue="item-1"
      className={cn("w-full rounded-md bg-white px-4", className)}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger showArrowFunc={alwaysOpen ? "hidden" : ""}>
          <div className="flex w-full flex-row items-center">
            <p className="flex-1 text-start text-[0.8rem] font-bold leading-4">
              {title}
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="overflow-hidden data-[state=open]:overflow-visible">
          <div className="relative mb-4 flex flex-col">
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
                  "absolute left-0 top-[100%] z-[9] max-h-[200px] w-full overflow-y-auto shadow-sm shadow-gray-600",
                  scrollbar_style.scrollbar,
                )}
              >
                <ul>
                  {choices
                    .filter((value) => filter(value, searchInput.trim()))
                    .map((value, idx) => {
                      const isChosen =
                        values.find((v) => v.id === value.id) !== undefined;
                      return (
                        <li
                          key={idx}
                          className="flex flex-row items-center bg-slate-100 p-2 hover:cursor-pointer hover:bg-slate-300"
                          onClick={(e) => {
                            if (!onValuesChanged) return;
                            if (isChosen)
                              onValuesChanged(
                                values.filter((v) => v.id !== value.id),
                              );
                            else onValuesChanged([...values, value]);
                            e.stopPropagation();
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <p className="flex-1">{value.displayString}</p>
                          {isChosen ? <Check size={16} /> : null}
                        </li>
                      );
                    })}
                </ul>
              </div>
            ) : null}
          </div>
          {values.map((val, idx) => (
            <div
              key={idx}
              className="mb-3 flex flex-row items-center space-x-3"
            >
              <p className="flex-1 text-[0.8rem] font-normal hover:cursor-pointer">
                {val.displayString}
              </p>
              <XCircle
                size={16}
                color="#FFFFFF"
                fill="rgb(96 165 250)"
                className="h-4 w-4 p-0 hover:cursor-pointer"
                onClick={(e) => {
                  if (onValuesChanged)
                    onValuesChanged(values.filter((v) => v.id !== val.id));
                }}
              />
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const RangeFilter = ({
  title,
  firstLabel = "From",
  firstPlaceholder = "Value",
  secondLabel = "To",
  secondPlaceholder = "Value",
  alwaysOpen = false,
  range = { startValue: 0, endValue: 0 },
  className,
  onValuesChanged,
}: {
  title: string;
  firstPlaceholder?: string;
  firstLabel?: string;
  secondPlaceholder?: string;
  secondLabel?: string;
  alwaysOpen?: boolean;
  range: { startValue: number; endValue: number };
  className?: string;
  onValuesChanged?: (range: { startValue: number; endValue: number }) => void;
}) => {
  const [showReset, setShowReset] = useState(false);
  const startValueRef = useRef<HTMLInputElement>(null);
  const endValueRef = useRef<HTMLInputElement>(null);
  return (
    <Accordion
      type="single"
      collapsible={!alwaysOpen}
      defaultValue="item-1"
      className={cn("w-full rounded-md bg-white px-4", className)}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger showArrowFunc={alwaysOpen ? "hidden" : ""}>
          <div className="flex w-full flex-row items-center">
            <p className="flex-1 text-start text-[0.8rem] font-bold leading-4">
              {title}
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="overflow-hidden">
          <div className="relative flex flex-col space-y-2">
            <div className="flex flex-row items-center justify-between space-x-2">
              <Label className="w-[50px]">{firstLabel}</Label>
              <Input
                ref={startValueRef}
                className="w-full focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
                placeholder={firstPlaceholder}
                onChange={(e) => {
                  setShowReset(true);
                  if (onValuesChanged)
                    onValuesChanged({
                      startValue: formatNumberInput(e),
                      endValue: range.endValue,
                    });
                }}
              />
            </div>
            <div className="flex flex-row items-center justify-between space-x-2">
              <Label className="w-[50px]">{secondLabel}</Label>
              <Input
                ref={endValueRef}
                className="w-full focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
                placeholder={secondPlaceholder}
                onChange={(e) => {
                  setShowReset(true);
                  if (onValuesChanged)
                    onValuesChanged({
                      startValue: range.startValue,
                      endValue: formatNumberInput(e),
                    });
                }}
              />
            </div>
            <p
              className={cn(
                "w-full cursor-pointer text-center text-sm text-blue-400 underline-offset-1 hover:underline",
                showReset ? "" : "hidden",
              )}
              onClick={() => {
                if (startValueRef.current) startValueRef.current.value = "";
                if (endValueRef.current) endValueRef.current.value = "";
                if (onValuesChanged)
                  onValuesChanged({ startValue: NaN, endValue: NaN });
                setShowReset(false);
              }}
            >
              Reset
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const PageWithFilters = ({
  title,
  filters,
  headerButtons,
  children,
}: {
  title: string;
  filters: React.JSX.Element[];
  headerButtons?: React.JSX.Element[];
  children: React.ReactNode;
}) => {
  const [openFilter, setOpenFilter] = useState(false);

  useEffect(() => {
    const screenObserver = (e: MediaQueryListEvent) => {
      if (e.matches) setOpenFilter(false);
    };

    const mql = window.matchMedia("(min-width: 768px)");
    mql.addEventListener("change", screenObserver);
    return () => {
      mql.removeEventListener("change", screenObserver);
    };
  }, []);

  return (
    <>
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col rounded-sm bg-white px-4 py-2 md:mr-[200px] lg:mr-[260px]",
        )}
      >
        <div className="flex flex-row items-center">
          <h2 className="my-4 flex-1 text-start text-2xl font-bold">{title}</h2>
          <div className="min-w-[8px] flex-1" />
          {headerButtons}
          <Filter
            size={20}
            className="ml-2 hover:cursor-pointer md:hidden"
            onClick={(e) => setOpenFilter((prev) => !prev)}
          />
        </div>
        {openFilter ? null : children}
      </div>
      <div
        className={cn(
          "fixed top-2 h-full overflow-hidden",
          openFilter
            ? "left-0 top-0 z-[50] w-full bg-slate-400 p-3"
            : "max-md:hidden md:right-2 md:w-[200px] lg:w-[260px]",
        )}
      >
        <div className="flex flex-col">
          <ScrollArea
            className={cn("rounded-md", openFilter ? "pr-[1px]" : "")}
          >
            <div className={openFilter ? "h-[calc(96vh-40px)]" : "h-[96vh]"}>
              {...filters}
            </div>
          </ScrollArea>
          {openFilter ? (
            <Button
              className="mt-2"
              onClick={(e) => {
                e.stopPropagation();
                setOpenFilter(false);
              }}
            >
              Close Filters
            </Button>
          ) : null}
        </div>
      </div>
    </>
  );
};

export {
  SingleChoiceFilter,
  MultiChoicesFilter,
  FilterDay,
  FilterMonth,
  FilterQuarter,
  FilterWeek,
  FilterYear,
  PageWithFilters,
  RangeFilter,
  SearchFilter,
  SecondaryTimeFilter,
  TimeFilter,
  TimerFilterRangePicker,
  SearchFilterObject,
};
