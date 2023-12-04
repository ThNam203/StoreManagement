import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
export const ConfirmOverwritingDialog = ({
  open,
  setOpen,
  title = "Warning",
  content = "The shift you're attempting to set has already existed. Would you like to overwrite it?",
  onAccept,
  onCancel,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  content?: string;
  onAccept?: () => void;
  onCancel?: () => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>{content}</DialogContent>
        </DialogHeader>

        <div className="flex flex-row justify-end">
          <Button
            type="submit"
            onClick={() => {
              if (onAccept) onAccept();
            }}
            variant={"default"}
            className="mr-3"
          >
            Yes
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
