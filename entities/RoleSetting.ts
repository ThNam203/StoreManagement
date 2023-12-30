export type Role = {
  positionId: number;
  positionName: string;
  roleSetting: RoleSetting;
};

export type RoleSetting = {
  overview: DefaultSetting;
  catalog: AllSetting;
  discount: DefaultSetting;
  stockCheck: DefaultSetting;
  invoice: DefaultSetting;
  returnInvoice: DefaultSetting;
  purchaseOrder: DefaultSetting;
  purchaseReturn: DefaultSetting;
  damageItems: DefaultSetting;
  fundLedger: AllSetting;
  customer: DefaultSetting;
  supplier: DefaultSetting;
  report: AllSetting;
  staff: AllSetting;
  attendance: DefaultSetting;
};

export type DefaultSetting = {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};
export type FileSetting = {
  export: boolean;
};

export type AllSetting = DefaultSetting & FileSetting;

export const RoleSettingName = {
  overview: "Overview",
  catalog: "Catalog",
  discount: "Discount",
  stockCheck: "Stock Check",
  invoice: "Invoice",
  returnInvoice: "Return Invoice",
  purchaseOrder: "Purchase Order",
  purchaseReturn: "Purchase Return",
  damageItems: "Damage Items",
  fundLedger: "Fund Ledger",
  customer: "Customer",
  supplier: "Supplier",
  report: "Report",
  staff: "Staff",
  attendance: "Attendance",
  create: "Create",
  read: "Read",
  update: "Update",
  delete: "Delete",
  export: "Export",
};

export const getRoleNameUI = (roleName: string) => {
  return RoleSettingName[roleName as keyof typeof RoleSettingName];
};
export const getRoleProp = (roleSetting: RoleSetting, roleKey: string) => {
  const value = roleSetting[roleKey as keyof typeof roleSetting];
  return value;
};

export const getRolePropValue = (
  roleSetting: RoleSetting,
  roleKey: string,
  prop: string,
) => {
  const role = getRoleProp(roleSetting, roleKey);
  const value = role[prop as keyof typeof role];
  return value;
};

export const isAllPropTrue = (roleSetting: RoleSetting, roleKey: string) => {
  const role = getRoleProp(roleSetting, roleKey);
  const keys = Object.keys(role);
  for (const key of keys) {
    const value = role[key as keyof typeof role];
    if (value === false) {
      return false;
    }
  }
  return true;
};

export const getRoleSettingKeys = (roleSetting: RoleSetting) => {
  return Object.keys(roleSetting);
};

export const defaultRoleSetting: RoleSetting = {
  overview: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  catalog: {
    create: false,
    read: false,
    update: false,
    delete: false,
    export: false,
  },
  discount: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  stockCheck: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  invoice: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  returnInvoice: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  purchaseOrder: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  purchaseReturn: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  damageItems: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  fundLedger: {
    create: false,
    read: false,
    update: false,
    delete: false,
    export: false,
  },
  customer: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  supplier: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  report: {
    create: false,
    read: false,
    update: false,
    delete: false,
    export: false,
  },
  staff: {
    create: false,
    read: false,
    update: false,
    delete: false,
    export: false,
  },
  attendance: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
};
export const defaultRole: Role = {
  positionId: -1,
  positionName: "",
  roleSetting: defaultRoleSetting,
};
