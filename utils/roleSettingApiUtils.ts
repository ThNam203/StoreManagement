import { RoleSetting } from "@/entities/RoleSetting";

export const convertRoleSettingToSent = (value: RoleSetting) => {
  const converted = {
    overview: {
      create: value.overview.create,
      read: value.overview.read,
      update: value.overview.update,
      delete: value.overview.delete,
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
      update: value.stockCheck.update,
      delete: value.stockCheck.delete,
      export: false,
    },
    invoice: {
      create: value.invoice.create,
      read: value.invoice.read,
      update: value.invoice.update,
      delete: value.invoice.delete,
      export: false,
    },

    return: {
      create: value.return.create,
      read: value.return.read,
      update: value.return.update,
      delete: value.return.delete,
      export: false,
    },
    purchaseOrder: {
      create: value.purchaseOrder.create,
      read: value.purchaseOrder.read,
      update: value.purchaseOrder.update,
      delete: value.purchaseOrder.delete,
      export: false,
    },
    purchaseReturn: {
      create: value.purchaseReturn.create,
      read: value.purchaseReturn.read,
      update: value.purchaseReturn.update,
      delete: value.purchaseReturn.delete,
      export: false,
    },
    damageItems: {
      create: value.damageItems.create,
      read: value.damageItems.read,
      update: value.damageItems.update,
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
      create: value.report.create,
      read: value.report.read,
      update: value.report.update,
      delete: value.report.delete,
      export: value.report.export,
    },
    staff: {
      create: value.staff.create,
      read: value.staff.read,
      update: value.staff.update,
      delete: value.staff.delete,
      export: value.staff.export,
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
