import { Role, RoleSetting } from "@/entities/RoleSetting";

export const convertRoleSettingToSent = (value: RoleSetting) => {
  const converted = {
    overview: {
      create: false,
      read: value.overview.read,
      update: false,
      delete: false,
      export: false,
    },
    catalog: {
      create: value.catalog.create,
      read: value.catalog.read,
      update: value.catalog.update,
      delete: value.catalog.delete,
      export: value.catalog.export,
    },
    discount: {
      create: value.discount.create,
      read: value.discount.read,
      update: value.discount.update,
      delete: value.discount.delete,
      export: false,
    },
    stockCheck: {
      create: value.stockCheck.create,
      read: value.stockCheck.read,
      update: false,
      delete: false,
      export: false,
    },
    invoice: {
      create: value.invoice.create,
      read: value.invoice.read,
      update: false,
      delete: false,
      export: false,
    },
    returnInvoice: {
      create: value.returnInvoice.create,
      read: value.returnInvoice.read,
      update: false,
      delete: false,
      export: false,
    },
    purchaseOrder: {
      create: value.purchaseOrder.create,
      read: value.purchaseOrder.read,
      update: false,
      delete: false,
      export: false,
    },
    purchaseReturn: {
      create: value.purchaseReturn.create,
      read: value.purchaseReturn.read,
      update: false,
      delete: value.purchaseReturn.delete,
      export: false,
    },
    damageItems: {
      create: value.damageItems.create,
      read: value.damageItems.read,
      update: false,
      delete: value.damageItems.delete,
      export: false,
    },
    fundLedger: {
      create: value.fundLedger.create,
      read: value.fundLedger.read,
      update: value.fundLedger.update,
      delete: value.fundLedger.delete,
      export: value.fundLedger.export,
    },
    customer: {
      create: value.customer.create,
      read: value.customer.read,
      update: value.customer.update,
      delete: value.customer.delete,
      export: false,
    },
    supplier: {
      create: value.supplier.create,
      read: value.supplier.read,
      update: value.supplier.update,
      delete: value.supplier.delete,
      export: false,
    },
    report: {
      create: false,
      read: value.report.read,
      update: false,
      delete: false,
      export: value.report.export,
    },
    staff: {
      create: value.staff.create,
      read: value.staff.read,
      update: value.staff.update,
      delete: value.staff.delete,
      export: false,
    },
    attendance: {
      create: value.attendance.create,
      read: value.attendance.read,
      update: value.attendance.update,
      delete: value.attendance.delete,
      export: false,
    },
  };
  console.log("sent", converted);
  return converted;
};

export const convertRoleReceived = (value: any) => {
  const roleSetting: RoleSetting = {
    overview: {
      read: value.overview.read,
    },
    catalog: {
      create: value.catalog.create,
      read: value.catalog.read,
      update: value.catalog.update,
      delete: value.catalog.delete,
      export: value.catalog.export,
    },
    discount: {
      create: value.discount.create,
      read: value.discount.read,
      update: value.discount.update,
      delete: value.discount.delete,
    },
    stockCheck: {
      create: value.stockCheck.create,
      read: value.stockCheck.read,
    },
    invoice: {
      create: value.invoice.create,
      read: value.invoice.read,
    },
    returnInvoice: {
      create: value.returnInvoice.create,
      read: value.returnInvoice.read,
    },
    purchaseOrder: {
      create: value.purchaseOrder.create,
      read: value.purchaseOrder.read,
      delete: value.purchaseOrder.delete,
    },
    purchaseReturn: {
      create: value.purchaseReturn.create,
      read: value.purchaseReturn.read,
      delete: value.purchaseReturn.delete,
    },
    damageItems: {
      create: value.damageItems.create,
      read: value.damageItems.read,
      delete: value.damageItems.delete,
    },
    fundLedger: {
      create: value.fundLedger.create,
      read: value.fundLedger.read,
      update: value.fundLedger.update,
      delete: value.fundLedger.delete,
      export: value.fundLedger.export,
    },
    customer: {
      create: value.customer.create,
      read: value.customer.read,
      update: value.customer.update,
      delete: value.customer.delete,
    },
    supplier: {
      create: value.supplier.create,
      read: value.supplier.read,
      update: value.supplier.update,
      delete: value.supplier.delete,
    },
    report: {
      read: value.report.read,
      export: value.report.export,
    },
    staff: {
      create: value.staff.create,
      read: value.staff.read,
      update: value.staff.update,
      delete: value.staff.delete,
    },
    attendance: {
      create: value.attendance.create,
      read: value.attendance.read,
      update: value.attendance.update,
      delete: value.attendance.delete,
    },
  };
  const converted: Role = {
    positionId: value.staffPositionId,
    positionName: value.staffPositionName,
    roleSetting: roleSetting,
  };
  return converted;
};

export const convertRoleToSent = (value: Role) => {
  const converted = {
    staffPositionName: value.positionName,
    overview: {
      create: false,
      read: value.roleSetting.overview.read,
      update: false,
      delete: false,
      export: false,
    },
    catalog: {
      create: value.roleSetting.catalog.create,
      read: value.roleSetting.catalog.read,
      update: value.roleSetting.catalog.update,
      delete: value.roleSetting.catalog.delete,
      export: value.roleSetting.catalog.export,
    },
    discount: {
      create: value.roleSetting.discount.create,
      read: value.roleSetting.discount.read,
      update: value.roleSetting.discount.update,
      delete: value.roleSetting.discount.delete,
      export: false,
    },
    stockCheck: {
      create: value.roleSetting.stockCheck.create,
      read: value.roleSetting.stockCheck.read,
      update: false,
      delete: false,
      export: false,
    },
    invoice: {
      create: value.roleSetting.invoice.create,
      read: value.roleSetting.invoice.read,
      update: false,
      delete: false,
      export: false,
    },
    returnInvoice: {
      create: value.roleSetting.returnInvoice.create,
      read: value.roleSetting.returnInvoice.read,
      update: false,
      delete: false,
      export: false,
    },
    purchaseOrder: {
      create: value.roleSetting.purchaseOrder.create,
      read: value.roleSetting.purchaseOrder.read,
      update: false,
      delete: value.roleSetting.purchaseOrder.delete,
      export: false,
    },
    purchaseReturn: {
      create: value.roleSetting.purchaseReturn.create,
      read: value.roleSetting.purchaseReturn.read,
      update: false,
      delete: value.roleSetting.purchaseReturn.delete,
      export: false,
    },
    damageItems: {
      create: value.roleSetting.damageItems.create,
      read: value.roleSetting.damageItems.read,
      update: false,
      delete: value.roleSetting.damageItems.delete,
      export: false,
    },
    fundLedger: {
      create: value.roleSetting.fundLedger.create,
      read: value.roleSetting.fundLedger.read,
      update: value.roleSetting.fundLedger.update,
      delete: value.roleSetting.fundLedger.delete,
      export: value.roleSetting.fundLedger.export,
    },
    customer: {
      create: value.roleSetting.customer.create,
      read: value.roleSetting.customer.read,
      update: value.roleSetting.customer.update,
      delete: value.roleSetting.customer.delete,
      export: false,
    },
    supplier: {
      create: value.roleSetting.supplier.create,
      read: value.roleSetting.supplier.read,
      update: value.roleSetting.supplier.update,
      delete: value.roleSetting.supplier.delete,
      export: false,
    },
    report: {
      create: false,
      read: value.roleSetting.report.read,
      update: false,
      delete: false,
      export: value.roleSetting.report.export,
    },
    staff: {
      create: value.roleSetting.staff.create,
      read: value.roleSetting.staff.read,
      update: value.roleSetting.staff.update,
      delete: value.roleSetting.staff.delete,
      export: false,
    },
    attendance: {
      create: value.roleSetting.attendance.create,
      read: value.roleSetting.attendance.read,
      update: value.roleSetting.attendance.update,
      delete: value.roleSetting.attendance.delete,
      export: false,
    },
  };

  console.log("sent", converted);
  return converted;
};
