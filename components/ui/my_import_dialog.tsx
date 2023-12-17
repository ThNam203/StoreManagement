import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MyLabelButton } from "@/components/ui/my_label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Transaction } from "@/entities/Transaction";
import { importExcel } from "@/utils";
import { FileUp } from "lucide-react";
import React from "react";

const templateAskAndAns: Array<{ question: string; options: Array<string> }> = [
  {
    question: "Handling duplicate product codes or different product names ?",
    options: ["Throw error and abort", "Replace old name by new one"],
  },
  {
    question: "Update invetory ?",
    options: ["No", "Yes"],
  },
  {
    question: "Update original price ?",
    options: ["No", "Yes"],
  },
];

export function ImportDailog({
  askAndAns = templateAskAndAns,
  onImport,
  onChange,
}: {
  askAndAns?: Array<{ question: string; options: Array<string> }>;
  onImport?: (data: any[]) => any;
  onChange?: (ans: Array<{ question: string; ans: string }>) => void;
}) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImportExcel = async (event: any) => {
    const file = event.target.files[0];
    if (!file) {
      toast({
        title: "Please choose a file",
        duration: 3000,
      });
      return;
    }
    try {
      await importExcel(file).then((sheets) => {
        if (onImport) onImport(sheets);
        toast({
          title: "File uploaded",
          duration: 3000,
        });
        fileInputRef.current!.value = "";
      });
    } catch (error) {
      toast({
        title: error as string,
        duration: 3000,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"green"}>
          <FileUp className="mr-2 h-4 w-4" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="w-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import from excel file</DialogTitle>
          <div className="text-sm">
            Download template file:{" "}
            <a
              href="/template.xlsx"
              download="template.xlsx"
              className="select-none whitespace-nowrap text-teal-600 hover:cursor-pointer hover:underline hover:underline-offset-2"
            >
              Excel file
            </a>
          </div>
        </DialogHeader>

        <div className="flex flex-col space-y-4 divide-y-[1px]">
          {askAndAns.map((item, index) => {
            return (
              <div key={index} className="pt-4">
                <div className="text-base font-semibold">{item.question}</div>
                <RadioGroup
                  defaultValue={item.options[0]}
                  className="mt-4 flex flex-col space-y-2"
                >
                  {item.options.map((option) => {
                    return (
                      <div
                        key={index + option}
                        className="flex items-center space-x-2 "
                      >
                        <RadioGroupItem value={option} id={index + option} />
                        <Label
                          htmlFor={index + option}
                          className="hover:cursor-pointer"
                        >
                          {option}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            );
          })}
          <form className="self-end">
            <MyLabelButton className="bg-green-500 hover:cursor-pointer hover:bg-green-600">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xls,.xlsx"
                className="hidden"
                onChange={(e) => handleImportExcel(e)}
              />
              Choose file
            </MyLabelButton>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
