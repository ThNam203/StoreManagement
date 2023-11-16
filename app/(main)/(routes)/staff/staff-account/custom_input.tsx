import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BonusUnit } from "@/entities/SalarySetting";
import { cn } from "@/lib/utils";
import { removeCharNotANum } from "@/utils";
import { useEffect, useState } from "react";

export function CustomInput({
  className = "",
  defaultValue = 100,
  defaultUnit = BonusUnit["%"],
  onValueChange,
}: {
  className?: string;
  defaultValue?: number;
  defaultUnit?: BonusUnit;
  onValueChange?: (value: number, unit: BonusUnit) => void;
}) {
  const [value, setValue] = useState<number>(defaultValue);
  const [unit, setUnit] = useState<BonusUnit>(defaultUnit);

  useEffect(() => {
    if (onValueChange) onValueChange(value, unit);
  }, [unit, value]);

  return (
    <div
      className={cn("w-[200px] flex flex-row items-center gap-2", className)}
    >
      <Input
        defaultValue={100}
        value={value}
        className="w-[100px] text-right"
        onChange={(e) => {
          removeCharNotANum(e);
          setValue(
            !Number.isNaN(Number.parseInt(e.target.value))
              ? Number.parseInt(e.target.value)
              : 0
          );
        }}
      />
      <div className="inline-flex gap-2" role="group">
        <Button
          variant={"default"}
          type="button"
          className={cn(
            "w-[40px]",
            unit === BonusUnit.VND
              ? "bg-green-500 hover:bg-green-500"
              : "bg-gray-400 hover:bg-gray-500 hover:opacity-80"
          )}
          onClick={() => setUnit(BonusUnit.VND)}
        >
          VND
        </Button>
        <Button
          variant={"default"}
          type="button"
          className={cn(
            "w-[40px] ",
            unit === BonusUnit["%"]
              ? "bg-green-500 hover:bg-green-500"
              : "bg-gray-400 hover:bg-gray-500 hover:opacity-80"
          )}
          onClick={() => setUnit(BonusUnit["%"])}
        >
          %
        </Button>
      </div>
    </div>
  );
}
