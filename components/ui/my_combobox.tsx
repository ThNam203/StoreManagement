"use client";

import { Check, ChevronDown, PlusCircle } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function MyCombobox({
  placeholder,
  choices,
  className,
  defaultValue = "",
  endIcon,
  onValueChange,
}: {
  placeholder?: string;
  choices: string[];
  className?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  endIcon?: React.JSX.Element;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    if (onValueChange) onValueChange(value);
  }, [value]);

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          className="w-full flex flex-row items-center justify-between gap-2"
        >
          <PopoverTrigger asChild>
            <div
              className={cn(
                "w-full flex flex-row items-center justify-between",
                value ? "text-black" : "text-muted-foreground"
              )}
            >
              {value ? value : placeholder}

              <ChevronDown className="w-4 h-4 text-muted-foreground ease-linear duration-200" />
            </div>
          </PopoverTrigger>
          {endIcon}
        </Button>

        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandEmpty>No result found.</CommandEmpty>
            <CommandGroup>
              {choices.map((option, index) => (
                <CommandItem
                  key={option}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : option);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col gap-1">
                    <span>{option}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function MyObjectCombobox({
  placeholder,
  choices,
  className,
  defaultValues = [],
  propToShow = [],
  endIcon,
  onValuesChange,
}: {
  placeholder?: string;
  choices: Array<object>;
  className?: string;
  defaultValues?: Array<object>;
  propToShow: Array<any>;
  onValuesChange?: (values: Array<object>) => void;
  endIcon?: React.JSX.Element;
}) {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState<Array<object>>(defaultValues);

  React.useEffect(() => {
    if (onValuesChange) onValuesChange(values);
  }, [values]);

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          className="w-full flex flex-row items-center justify-between gap-2"
        >
          <PopoverTrigger asChild>
            <div
              className={cn(
                "w-full flex flex-row items-center justify-between text-muted-foreground"
              )}
            >
              {placeholder}

              <ChevronDown className="w-4 h-4 text-muted-foreground ease-linear duration-200" />
            </div>
          </PopoverTrigger>
          {endIcon}
        </Button>

        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandEmpty>No result found.</CommandEmpty>
            <CommandGroup>
              {choices.map((choice, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => {
                    if (!values.includes(choice)) {
                      setValues([...values, choice]);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      values.includes(choice) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div key={index} className="flex flex-col gap-1">
                    {propToShow.map((prop, i) => {
                      return (
                        <span
                          key={i}
                          className={cn(
                            "text-xs",
                            prop === "name" ? "font-semibold" : ""
                          )}
                        >
                          {choice[prop as keyof object]}
                        </span>
                      );
                    })}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
