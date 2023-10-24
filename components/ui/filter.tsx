"use client";

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
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CalendarDays, Maximize2, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";

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
      collapsible={true}
      defaultValue="item-1"
      className={cn("w-[260px] bg-white rounded-md px-4", className)}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>
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

export { ChoicesFilter, TimeFilter };
