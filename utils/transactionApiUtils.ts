import {
  FormType,
  Status,
  Stranger,
  Transaction,
} from "@/entities/Transaction";

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

const convertExpenseFormToSent = (
  value: Transaction,
  linkedFormId: number = -1,
) => {
  const converted = {
    receiverType: value.targetType,
    expenseType: value.transactionType,
    value: value.value,
    idReceiver: value.targetId,
    note: value.note,
    date: value.time.toISOString(),
    description: value.description,
    linkedFormId: linkedFormId,
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
  };

  console.log("received", converted);
  return converted;
};

const convertReceiptFormToSent = (value: Transaction) => {};

export {
  convertStrangerReceived,
  convertStrangerToSent,
  convertExpenseFormToSent,
  convertExpenseFormReceived,
};
