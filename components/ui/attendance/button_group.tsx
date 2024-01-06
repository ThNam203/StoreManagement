import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function ButtonGroup({
  choices = ["Option 1", "Option 2"],
  defaultValue = choices.length > 0 ? choices[0] : "Option 1",
  onValueChange,
}: {
  defaultValue?: string;
  choices: string[];
  onValueChange?: (value: string) => void;
}) {
  const [value, setValue] = useState<string>(defaultValue);
  useEffect(() => {
    if (onValueChange) onValueChange(value);
  }, [value]);
  return (
    <div
      className="flex h-10 shrink-0 flex-row items-center overflow-hidden rounded-md border bg-white"
      role="group"
    >
      {choices.map((choice, i) => {
        return (
          <div key={choice + i} className="flex flex-row items-center">
            <Button
              variant={"default"}
              className={cn(
                "w-[80px] rounded-md",
                value === choice
                  ? "bg-blue-500 text-white hover:bg-blue-500"
                  : "bg-white text-black hover:bg-gray-200",
              )}
              onClick={() => setValue(choice)}
            >
              {choice}
            </Button>
            <Separator
              orientation="vertical"
              className={cn(
                "h-5",
                i !== choices.length - 1 ? "visible" : "hidden",
              )}
            />
          </div>
        );
      })}
    </div>
  );
}
