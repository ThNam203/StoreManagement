"use client";

import { Check, ChevronDown, X } from "lucide-react";
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
import Image from "next/image";
import { ca, de } from "date-fns/locale";
import LoadingCircle from "./loading_circle";

export function MyCombobox({
  placeholder,
  choices,
  className,
  defaultValue = "",
  endIcon,
  canRemoveOption = true,
  onValueChange,
  onRemoveChoice,
}: {
  placeholder?: string;
  choices: string[];
  className?: string;
  defaultValue?: string;
  canRemoveOption?: boolean;
  onValueChange?: (value: string) => void;
  onRemoveChoice?: (value: string) => any;
  endIcon?: React.JSX.Element;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);
  const [isRemovingOption, setIsRemovingOption] = React.useState(false);

  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
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
          className="flex w-full flex-row items-center justify-between p-0"
        >
          <PopoverTrigger asChild>
            <div
              className={cn(
                "flex w-full flex-row items-center justify-between p-2",
                value ? "text-black" : "text-muted-foreground",
              )}
            >
              {value ? value : placeholder}

              <ChevronDown className="h-4 w-4 text-muted-foreground duration-200 ease-linear" />
            </div>
          </PopoverTrigger>
          <div className="mr-2">{endIcon}</div>
        </Button>

        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandEmpty>No result found.</CommandEmpty>
            <CommandGroup>
              {choices.map((option, index) => {
                return (
                  <CommandItem
                    key={option}
                    onSelect={(currentValue) => {
                      setValue(
                        currentValue.toLowerCase() === value.toLowerCase()
                          ? ""
                          : option,
                      );
                      setOpen(false);
                    }}
                    className="group/option"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <div className="flex flex-1 flex-row items-center justify-between">
                      <span>{option}</span>
                      <X
                        size={16}
                        className={cn(
                          "invisible cursor-pointer text-red-500 group-hover/option:visible",
                          canRemoveOption ? "visible" : "hidden",
                          isRemovingOption ? "hidden" : "",
                        )}
                        onClick={async () => {
                          if (onRemoveChoice) {
                            setIsRemovingOption(true);

                            try {
                              await onRemoveChoice(option);
                            } catch (e) {
                              console.log(e);
                            } finally {
                              setIsRemovingOption(false);
                              setValue("");
                            }
                          }
                        }}
                      ></X>
                      {isRemovingOption && <LoadingCircle></LoadingCircle>}
                    </div>
                  </CommandItem>
                );
              })}
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
    setValues(defaultValues);
  }, [defaultValues]);
  React.useEffect(() => {
    if (onValuesChange && values !== defaultValues) onValuesChange(values);
  }, [values]);

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          className="flex w-full flex-row items-center justify-between gap-2"
        >
          <PopoverTrigger asChild>
            <div
              className={cn(
                "flex w-full flex-row items-center justify-between text-muted-foreground",
              )}
            >
              {placeholder}

              <ChevronDown className="h-4 w-4 text-muted-foreground duration-200 ease-linear" />
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
                    } else {
                      setValues(values.filter((v) => v !== choice));
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      values.includes(choice) ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div
                    key={index}
                    className="flex flex-row items-center justify-between gap-1"
                  >
                    <Image
                      width={0}
                      height={0}
                      sizes="100vw"
                      src={
                        choice["avatar" as keyof object] ||
                        "/default-user-avatar.png"
                      }
                      alt="image"
                      className="h-[40px] w-[30px] rounded-sm border"
                    />
                    <div key={index} className="flex flex-col gap-1">
                      {propToShow.map((prop, i) => {
                        if (prop === "avatar") return null;
                        return (
                          <span
                            key={i}
                            className={cn(
                              "text-xs",
                              prop === "name" ? "font-semibold" : "",
                            )}
                          >
                            {prop !== "name"
                              ? `${(prop as string).toUpperCase()}:`
                              : null}{" "}
                            {choice[prop as keyof object]}
                          </span>
                        );
                      })}
                    </div>
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

const StaffItem = ({}: { data: object }) => {};
