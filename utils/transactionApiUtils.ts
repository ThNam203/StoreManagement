import {
  FormType,
  Status,
  Stranger,
  Transaction,
} from "@/entities/Transaction";
import { formatID } from ".";

const convertStrangerToSent = (value: Stranger) => {
  const converted = {
    id: value.id,
    name: value.name,
    phoneNumber: value.phoneNumber,
    address: value.address,
    note: value.note,
  };
  console.log("sent", converted);
  return converted;
};

const convertStrangerReceived = (value: any) => {
  const stranger: Stranger = {
    id: value.id,
    name: value.name,
    phoneNumber: value.phoneNumber,
    address: value.address,
    note: value.note,
  };
  console.log("received", stranger);
  return stranger;
};

const convertExpenseFormToSent = (value: Transaction) => {
  const converted = {
    receiverType: value.targetType,
    expenseType: value.transactionType,
    value: value.value,
    idReceiver: value.targetId,
    note: value.note,
    date: value.time.toISOString(),
    description: value.description,
    linkedFormId: value.linkFormId,
  };
  console.log("sent", converted);
  return converted;
};

const convertExpenseFormReceived = (value: any) => {
  const converted: Transaction = {
    id: value.id,
    targetType: value.receiverType,
    time: new Date(value.date),
    transactionType: value.expenseType,
    value: value.value,
    creator: value.creatorName,
    targetId: value.idReceiver,
    targetName: value.receiverName,
    note: value.note,
    description: value.description,
    formType: FormType.EXPENSE,
    status: Status.PAID,
    linkFormId: value.linkedFormId,
  };

  console.log("received", converted);
  return converted;
};

const convertReceiptFormToSent = (value: Transaction) => {
  const converted = {
    payerType: value.targetType,
    incomeType: value.transactionType,
    value: value.value,
    idPayer: value.targetId,
    note: value.note,
    date: value.time.toISOString(),
    description: value.description,
    linkedFormId: value.linkFormId,
  };
  console.log("sent", converted);
  return converted;
};
const convertReceiptFormReceived = (value: any) => {
  const converted: Transaction = {
    id: value.id,
    targetType: value.payerType,
    time: new Date(value.date),
    transactionType: value.incomeType,
    value: value.value,
    creator: value.creatorName,
    targetId: value.idPayer,
    targetName: value.payerName,
    note: value.note,
    description: value.description,
    formType: FormType.RECEIPT,
    status: Status.PAID,
    linkFormId: value.linkedFormId,
  };

  console.log("received", converted);
  return converted;
};
export {
  convertStrangerReceived,
  convertStrangerToSent,
  convertExpenseFormToSent,
  convertExpenseFormReceived,
  convertReceiptFormToSent,
  convertReceiptFormReceived,
};
