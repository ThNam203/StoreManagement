export type SalarySetting = {
  salary: number;
  salaryType: SalaryType;
};

export enum BonusUnit {
  "VND",
  "%",
}

export enum SalaryType {
  ByShift = "Shift-based pay",
  Internship = "Internship salary",
  Fixed = "Fixed salary",
}

export const SalaryUnitTable: Record<SalaryType, string> = {
  "Shift-based pay": "shift",
  "Internship salary": "period",
  "Fixed salary": "period",
};
