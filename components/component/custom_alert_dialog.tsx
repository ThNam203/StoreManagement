import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import LoadingCircle from "../ui/loading_circle";

export default function CustomAlertDialog({
  title,
  description,
  trigger,
  onCancleClick,
  onContinueClick,
}: {
  title: string;
  description: string;
  trigger: JSX.Element;
  onCancleClick?: () => Promise<any>;
  onContinueClick?: () => Promise<any>;
}) {
  const [isCancelBtnLoading, setIsCancelBtnLoading] = useState(false);
  const [isContinueBtnLoading, setIsContinueBtnLoading] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant={"green"}
            disabled={isContinueBtnLoading || isCancelBtnLoading}
            onClick={async () => {
              setIsContinueBtnLoading(true);
              if (onContinueClick) await onContinueClick();
              setIsContinueBtnLoading(false);
              setOpen(false);
            }}
          >
            Continue{isContinueBtnLoading ? <LoadingCircle /> : null}
          </Button>
          <Button
            variant={"red"}
            disabled={isCancelBtnLoading || isContinueBtnLoading}
            onClick={async () => {
              setIsCancelBtnLoading(true);
              if (onCancleClick) await onCancleClick();
              setIsCancelBtnLoading(false);
              setOpen(false);
            }}
          >
            Cancle{isCancelBtnLoading ? <LoadingCircle /> : null}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
