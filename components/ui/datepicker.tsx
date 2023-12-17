"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, set } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({
  value = new Date(),
  onChange,
  disabled = false,
}: {
  value?: Date;
  onChange?: (date: Date) => void;
  disabled?: boolean;
}) {
  const [date, setDate] = React.useState<Date | undefined>(value);

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    if (onChange && date) onChange(date);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant={"outline"}
          className={cn(
            "!mt-0 w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            handleDateChange(date);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
