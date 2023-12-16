import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export type ConfirmDialogType = "warning" | "error" | "success" | "info";

export const MyConfirmDialog = ({
  open,
  setOpen,
  title = "Warning",
  content = "The shift you're attempting to set has already existed. Would you like to overwrite it?",
  type = "warning",
  onAccept,
  onCancel,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  content?: string;
  type?: ConfirmDialogType;
  onAccept?: () => void;
  onCancel?: () => void;
}) => {
  const answerButton = type === "warning" ? "Yes" : "Ok";
  const buttonType = type === "warning" ? "red" : "default";
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogTitle className="flex flex-row items-center gap-2">
          {type === "warning" && (
            <AlertTriangle className="text-yellow-500" size={16} />
          )}
          {type === "error" && <XCircle className="text-red-500" size={16} />}
          {type === "success" && (
            <CheckCircle className="text-green-500" size={16} />
          )}
          {type === "info" && (
            <AlertCircle className="text-blue-500" size={16} />
          )}

          {title}
        </DialogTitle>
        {content}

        <div className="flex flex-row justify-end">
          <Button
            type="submit"
            onClick={() => {
              if (onAccept) onAccept();
            }}
            variant={buttonType}
            className="mr-3"
          >
            {answerButton}
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (onCancel) onCancel();
            }}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
