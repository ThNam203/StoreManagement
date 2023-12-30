"use client";

import { CustomDatatable } from "@/components/component/custom_datatable";
import { Button } from "@/components/ui/button";
import { MakeExpenseDialog } from "@/components/ui/fund-ledger/make_expense_dialog";
import { MakeReceiptDialog } from "@/components/ui/fund-ledger/make_receipt_dialog";
import { useToast } from "@/components/ui/use-toast";
import { FormType, TargetType, Transaction } from "@/entities/Transaction";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { cn } from "@/lib/utils";
import { exportExcel, formatDate, formatPrice, revertID } from "@/utils";
import { Row, Table } from "@tanstack/react-table";
import { format } from "date-fns";
import { FolderOpen, Trash } from "lucide-react";
import * as React from "react";
import { ImportDailog } from "../../../../components/ui/my_import_dialog";
import {
  fundledgerColumnTitles,
  fundledgerDefaultVisibilityState,
  fundledgerTableColumns,
} from "./table_columns";
import {
  ConfirmDialogType,
  MyConfirmDialog,
} from "@/components/ui/my_confirm_dialog";
import LoadingCircle from "@/components/ui/loading_circle";
import TransactionService from "@/services/transaction_service";
import { deleteTransaction } from "@/reducers/transactionReducer";
import { axiosUIErrorHandler } from "@/services/axiosUtils";

type Props = {
  data: Transaction[];
  onSubmit: (values: Transaction) => any;
};

export function DataTable({ data, onSubmit }: Props) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [selectedForm, setSelectedForm] = React.useState<Transaction | null>(
    null,
  );
  const [openExpense, setOpenExpense] = React.useState(false);
  const [openReceipt, setOpenReceipt] = React.useState(false);
  const staffList = useAppSelector((state) => state.staffs.value);
  const staffNameList = staffList.map((staff) => staff.name);

  //get header through id of column to export excel
  const handleExportExcel = (table: Table<Transaction>) => {
    //get id of visible column in datatable
    const visibleColumnIds = table
      .getVisibleFlatColumns()
      .map((column) => column.id);

    //take list of header and value to export excel
    let toExport = data.map((dataRow, index) => {
      var row: object = {};
      visibleColumnIds.map((header) => {
        const headerTitle =
          fundledgerColumnTitles[header as keyof typeof fundledgerColumnTitles];

        if (headerTitle === "#") {
          row = {
            ...row,
            [headerTitle]: index + 1,
          };
        } else if (header === "description") {
          const typePrefix =
            dataRow.formType === FormType.EXPENSE ? "Pay for" : "Receive from";
          const typeSubfix = dataRow.targetType;
          const type = `${typePrefix} ${typeSubfix}`;
          row = {
            ...row,
            [headerTitle]: type,
          };
        } else if (header === "value") {
          const value = dataRow[header as keyof typeof dataRow];
          const isExpense = dataRow["formType"] === FormType.EXPENSE;
          const expenseValue = "-" + value;
          const receiveValue = "+" + value;

          row = {
            ...row,
            [headerTitle]: isExpense ? expenseValue : receiveValue,
          };
        } else if (header === "createdDate") {
          const date = dataRow[header as keyof typeof dataRow];
          const dateStr = format(date, "dd/MM/yyyy HH:mm");
          row = {
            ...row,
            [headerTitle]: dateStr,
          };
        } else if (headerTitle !== undefined) {
          row = {
            ...row,
            [headerTitle]: dataRow[header as keyof typeof dataRow],
          };
        } else {
          console.log("header of undefined", header);
        }
      });
      console.log("Temp: ", row);
      return row;
    });

    exportExcel(toExport, "Fund Ledger", "Fund Ledger");
  };

  const handleImportFile = (sheets: any[]) => {
    const keys = Object.keys(fundledgerColumnTitles);
    const newData = sheets.map((sheet: any[]) => {
      const convertedSheet = sheet.map((row) => {
        console.log("row", row);
        let convertedRow: any = {};
        for (let key of keys) {
          const value =
            row[
              fundledgerColumnTitles[
                key as keyof typeof fundledgerColumnTitles
              ] as keyof typeof row
            ];
          console.log("value", value);
          if (value === undefined) {
            convertedRow = { ...convertedRow, [key]: "" };
          } else {
            convertedRow = { ...convertedRow, [key]: value };
          }
        }
        return convertedRow;
      });
      console.log("convertedSheet", convertedSheet);
      return convertedSheet;
    });
  };

  const handleOpenExpenseForm = (transaction: Transaction | null) => {
    setSelectedForm(transaction);
    setOpenExpense(true);
  };

  const handleOpenReceiptForm = (transaction: Transaction | null) => {
    setSelectedForm(transaction);
    setOpenReceipt(true);
  };

  const removeForm = async (id: any, type: FormType) => {
    try {
      if (type === FormType.RECEIPT)
        await TransactionService.deleteReceiptForm(id);
      else if (type === FormType.EXPENSE)
        await TransactionService.deleteExpenseForm(id);
      console.log(id);
      dispatch(deleteTransaction({ id: id, type: type }));
      return Promise.resolve();
    } catch (e) {
      axiosUIErrorHandler(e, toast);
      return Promise.reject(e);
    }
  };

  const handleRemoveForm = (transaction: Transaction) => {
    const prefix = transaction.formType === FormType.EXPENSE ? "EF" : "RF";
    return removeForm(revertID(transaction.id, prefix), transaction.formType);
  };

  const [openImportDialog, setOpenImportDialog] = React.useState(false);

  const beginningFund = 200000000;
  const totalExpense = 1500000;
  const totalReceipt = 1000000;

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-end gap-2 py-2">
        <Button
          variant="blue"
          className="whitespace-nowrap"
          onClick={() => handleOpenReceiptForm(null)}
        >
          Make Receipt
        </Button>
        <Button
          variant="blue"
          className="whitespace-nowrap"
          onClick={() => handleOpenExpenseForm(null)}
        >
          Make Expense
        </Button>
      </div>
      <CustomDatatable
        data={data}
        columns={fundledgerTableColumns()}
        columnTitles={fundledgerColumnTitles}
        infoTabs={[
          {
            render(row, setShowTabs) {
              return (
                <DetailFundledgerTab
                  row={row}
                  setShowTabs={setShowTabs}
                  onOpenExpenseForm={handleOpenExpenseForm}
                  onOpenReceiptForm={handleOpenReceiptForm}
                  onRemoveForm={handleRemoveForm}
                />
              );
            },
            tabName: "Infomation",
          },
        ]}
        config={{
          defaultVisibilityState: fundledgerDefaultVisibilityState,
          onExportExcelBtnClick: handleExportExcel,
          onImportExcelBtnClick: () => setOpenImportDialog(true),
        }}
      />
      <ImportDailog
        open={openImportDialog}
        setOpen={setOpenImportDialog}
        onImport={handleImportFile}
      />
      <MakeExpenseDialog
        data={selectedForm}
        open={openExpense}
        setOpen={setOpenExpense}
        submit={onSubmit}
      />
      <MakeReceiptDialog
        data={selectedForm}
        open={openReceipt}
        setOpen={setOpenReceipt}
        submit={onSubmit}
      />
    </div>
  );
}

const DetailFundledgerTab = ({
  row,
  setShowTabs,
  onOpenExpenseForm,
  onOpenReceiptForm,
  onRemoveForm,
}: {
  row: Row<Transaction>;
  setShowTabs: (value: boolean) => any;
  onOpenExpenseForm?: (transaction: Transaction) => any;
  onOpenReceiptForm?: (transaction: Transaction) => any;
  onRemoveForm?: (transaction: Transaction) => any;
}) => {
  const transaction = row.original;
  //find the target of transaction
  const strangerList = useAppSelector(
    (state) => state.transactionStranger.value,
  );
  const staffList = useAppSelector((state) => state.staffs.value);
  let target: {
    phonenumber: string;
    address: string;
  } = { phonenumber: "", address: "" };
  if (transaction.targetType === TargetType.STAFF) {
    const staff = staffList.find((staff) => staff.id === transaction.targetId);
    if (staff)
      target = {
        phonenumber: staff.phoneNumber,
        address: staff.address,
      };
  } else if (transaction.targetType === TargetType.OTHER) {
    const stranger = strangerList.find(
      (stranger) => stranger.id === transaction.targetId,
    );
    if (stranger)
      target = {
        phonenumber: stranger.phoneNumber,
        address: stranger.address,
      };
  }
  const { toast } = useToast();
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const [isRemoving, setIsRemoving] = React.useState(false);
  const [contentConfirmDialog, setContentConfirmDialog] = React.useState({
    title: "",
    content: "",
    type: "warning" as ConfirmDialogType,
  });

  return (
    <div className="flex h-[300px] flex-col gap-4 px-4 py-2">
      <div className="flex flex-row">
        <div className="flex shrink-[5] grow-[5] flex-row gap-2 text-[0.8rem]">
          <div className="flex flex-1 flex-col">
            <RowInfo label="Form ID:" value={transaction.id} />
            <RowInfo
              label="Time:"
              value={formatDate(transaction.time, "datetime")}
            />
            <RowInfo label="Value:" value={formatPrice(transaction.value)} />
            <RowInfo
              label={
                transaction.formType === FormType.RECEIPT
                  ? "Payer:"
                  : "Receiver:"
              }
              value={transaction.targetName}
            />
            <RowInfo label="Phone number:" value={target.phonenumber} />
            <RowInfo label="Address:" value={target.address} />
          </div>
          <div className="flex flex-1 flex-col">
            <RowInfo label="Description:" value={transaction.description} />
            <RowInfo label="Status:" value={transaction.status} />
            <RowInfo label="Creator:" value={transaction.creator} />
            <RowInfo
              label={
                transaction.formType === FormType.RECEIPT
                  ? "Receiver type:"
                  : "Expense type:"
              }
              value={transaction.targetType}
            />
            <RowInfo
              label="Note:"
              value={transaction.note}
              showTextArea={true}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <div className="flex-1" />
        <Button
          variant={"green"}
          onClick={(e) => {
            if (transaction.formType === FormType.RECEIPT) {
              if (onOpenReceiptForm) onOpenReceiptForm(transaction);
            } else if (transaction.formType === FormType.EXPENSE) {
              if (onOpenExpenseForm) onOpenExpenseForm(transaction);
            }
          }}
        >
          <FolderOpen size={16} className="mr-2" />
          Open form
        </Button>
        <Button
          variant={"red"}
          onClick={() => {
            setContentConfirmDialog({
              title:
                transaction.formType === FormType.RECEIPT
                  ? "Remove receipt form"
                  : "Remove expense form",
              content: `Are you sure you want to remove this form ?`,
              type: "warning",
            });
            setOpenConfirmDialog(true);
          }}
          className={cn(transaction.linkFormId === -1 ? "visible" : "hidden")}
        >
          <Trash size={16} className="mr-2" />
          Remove
          {isRemoving && <LoadingCircle></LoadingCircle>}
        </Button>
      </div>
      <MyConfirmDialog
        open={openConfirmDialog}
        setOpen={setOpenConfirmDialog}
        title={contentConfirmDialog.title}
        content={contentConfirmDialog.content}
        type={contentConfirmDialog.type}
        onAccept={async () => {
          setOpenConfirmDialog(false);
          setShowTabs(false);

          if (onRemoveForm) {
            setIsRemoving(true);
            try {
              await onRemoveForm(transaction).then(() => {
                setIsRemoving(false);
              });
            } catch (e) {
              axiosUIErrorHandler(e, toast);
            } finally {
              setIsRemoving(false);
            }
          }
        }}
        onCancel={() => setOpenConfirmDialog(false)}
      />
    </div>
  );
};

const RowInfo = ({
  label,
  value,
  showTextArea = false,
}: {
  label: string;
  value: string;
  showTextArea?: boolean;
}) => {
  return (
    <div
      className={cn(
        "mb-2 font-medium",
        showTextArea ? "" : "flex flex-row border-b",
      )}
    >
      <p className="w-[100px] font-normal">{label}</p>
      {showTextArea ? (
        <textarea
          readOnly
          disabled
          className={cn("h-[80px] w-full resize-none border-2 p-1")}
          defaultValue={value}
        ></textarea>
      ) : (
        <p>{value}</p>
      )}
    </div>
  );
};
