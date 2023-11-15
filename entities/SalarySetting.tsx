export type SalarySetting = {
  baseSalary: {
    value: number;
    salaryType: SalaryType;
  };
  baseBonus: {
    saturday: {
      value: number;
      unit: BonusUnit;
    };
    sunday: {
      value: number;
      unit: BonusUnit;
    };
    dayOff: {
      value: number;
      unit: BonusUnit;
    };
    holiday: {
      value: number;
      unit: BonusUnit;
    };
  };
  overtimeBonus: {
    saturday: {
      value: number;
      unit: BonusUnit;
    };
    sunday: {
      value: number;
      unit: BonusUnit;
    };
    dayOff: {
      value: number;
      unit: BonusUnit;
    };
    holiday: {
      value: number;
      unit: BonusUnit;
    };
  };
};

export enum BonusUnit {
  "VND",
  "%",
}

export enum SalaryType {
  ByShift = "Shift-based pay",
  ByHour = "Hourly wage",
  ByDay = "Salary based on standard working days",
  Fixed = "Fixed salary",
}

export const SalaryUnitTable: Record<SalaryType, string> = {
  "Shift-based pay": "shift",
  "Hourly wage": "hour",
  "Salary based on standard working days": "day",
  "Fixed salary": "period",
};
