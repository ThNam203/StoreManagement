import { PlusCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import { useState } from "react";
import { Button } from "./button";
import LoadingCircle from "./loading_circle";

const AddNewThing = ({
  title,
  placeholder,
  open,
  onOpenChange,
  onAddClick,
}: {
  title: string;
  placeholder: string;
  open: boolean;
  onOpenChange: (value: boolean) => any;
  onAddClick: (value: string) => Promise<any>;
}) => {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger>
        <PlusCircle size={16} className="mx-2" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <div className="flex flex-row items-center text-sm gap-3 !my-4">
            <label htmlFor="alert_input" className="font-semibold w-36">
              {placeholder}
            </label>
            <input
              id="alert_input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 rounded-sm border p-1"
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant={"green"}
            onClick={async (e) => {
              setIsLoading(true);
              try {
                await onAddClick(value);
                onOpenChange(false);
              } catch (e) {}

              setIsLoading(false);
            }}
            className="!h-[35px]"
            disabled={isLoading}
          >
            Done
            {isLoading ? <LoadingCircle /> : null}
          </Button>
          <AlertDialogCancel
            className={
              "bg-red-400 hover:bg-red-500 border-none text-white hover:text-white !h-[35px]"
            }
            disabled={isLoading}
          >
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddNewThing;
