"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "./checkbox";
import { useState } from "react";

const Filter = ({
  title,
  isSingleChoice,
  choices,
  defaultPosition,
  defaultPositions,
  onSingleChoiceChanged,
  onMultiChoicesChanged,
}: {
  title: string;
  isSingleChoice: boolean;
  choices: string[];
  defaultPosition?: number;
  defaultPositions?: number[];
  onSingleChoiceChanged?: (position: number) => void;
  onMultiChoicesChanged?: (positions: number[]) => void;
}) => {
  if (defaultPosition == undefined) defaultPosition = -1;
  if (defaultPositions == undefined) defaultPositions = [];

  const multiChoicesHandler = (
    checkedState: boolean | "indeterminate",
    position: number
  ) => {
    if (checkedState === true) {
      if (!defaultPositions!.includes(position))
        defaultPositions!.push(position);
    } else {
      const removePos = defaultPositions!.indexOf(position);
      if (removePos != -1) defaultPositions!.splice(removePos, 1);
    }

    console.log(defaultPositions!);

    if (onMultiChoicesChanged) onMultiChoicesChanged(defaultPositions!);
  };

  return (
    <Accordion
      type="single"
      collapsible={true}
      className="w-[200px] bg-white rounded-md mx-2 my-2 px-4"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <p className="text-[0.8rem] leading-4 font-bold">{title}</p>
        </AccordionTrigger>
        <AccordionContent>
          {isSingleChoice ? (
            <RadioGroup
              defaultValue={defaultPosition.toString()}
              onValueChange={(position) => {
                console.log(position);
                if (onSingleChoiceChanged)
                  onSingleChoiceChanged(parseInt(position));
              }}
            >
              {choices.map((choice, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <RadioGroupItem value={index.toString()} id={"r" + index} />
                  <Label
                    htmlFor={"r" + index}
                    className="text-[0.8rem] hover:cursor-pointer font-normal"
                  >
                    {choice}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="flex flex-col gap-2">
              {choices.map((choice, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Checkbox
                    value={index}
                    id={"r" + index}
                    onCheckedChange={(checkedState) =>
                      multiChoicesHandler(checkedState, index)
                    }
                  />
                  <Label
                    htmlFor={"r" + index}
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

export default Filter;
