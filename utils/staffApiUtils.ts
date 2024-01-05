import { SalaryType } from "@/entities/SalarySetting";
import { Staff } from "@/entities/Staff";

const convertStaffToSent = (
  value: Staff,
  type: "staff" | "owner" = "staff",
) => {
  const convertedStaff = {
    id: value.id,
    avatar: value.avatar,
    name: value.name,
    email: value.email,
    password: value.password,
    address: value.address,
    phoneNumber: value.phoneNumber,
    cccd: value.cccd,
    salaryDebt: value.salaryDebt,
    note: value.note,
    birthday: value.birthday.toISOString(),
    sex: value.sex,
    position: value.position,
    role: value.role,
    staffSalary: {
      salary: value.salarySetting.salary,
      salaryType: value.salarySetting.salaryType,
    },
  };

  const convertedOwner = {
    id: value.id,
    avatar: value.avatar,
    name: value.name,
    email: value.email,
    password: value.password,
    address: value.address,
    phoneNumber: value.phoneNumber,
    cccd: value.cccd,
    salaryDebt: value.salaryDebt,
    note: value.note,
    birthday: value.birthday.toISOString(),
    sex: value.sex,
    position: value.position,
    role: "OWNER",
    staffSalary: {
      salary: value.salarySetting.salary,
      salaryType: value.salarySetting.salaryType,
    },
  };
  console.log("sent", convertedStaff);
  if (type === "staff") return convertedStaff;
  return convertedOwner;
};

const convertStaffReceived = (value: any) => {
  const tempSalarySetting = {
    salary: 0,
    salaryType: SalaryType.ByShift,
  };

  const staff: Staff = {
    id: value.id,
    avatar: value.avatar,
    name: value.name,
    email: value.email,
    password: value.password,
    address: value.address,
    phoneNumber: value.phoneNumber,
    cccd: value.cccd,
    salaryDebt: value.salaryDebt,
    note: value.note,
    birthday: new Date(value.birthday),
    sex: value.sex,
    position: value.position,
    role: value.role,
    createAt: new Date(value.createdAt),
    salarySetting: value.staffSalary
      ? {
          salary: value.staffSalary.salary,
          salaryType: value.staffSalary.salaryType,
        }
      : tempSalarySetting,
  };
  console.log("received", staff);
  return staff;
};

export { convertStaffReceived, convertStaffToSent };
