"use client";

import { Button } from "@/components/ui/button";
import { PageWithFilters, SearchFilter } from "@/components/ui/filter";
import { Sex, Staff } from "@/entities/Staff";
import { formatID, handleMultipleFilter } from "@/utils";
import { useEffect, useState } from "react";
import { DataTable } from "./datatable";
import { BonusUnit, SalaryType } from "@/entities/SalarySetting";
import { getAllStaffs } from "@/services/staff_service";

const originalStaffList: Staff[] = [
  {
    avatar: "",
    id: 1,
    name: "Henry",
    email: "henry@gmail.com",
    address: "address",
    phoneNumber: "0123456789",
    note: "",
    sex: Sex.MALE,
    CCCD: "012301923012",
    birthday: new Date("2003-8-4"),
    createAt: new Date(),
    position: "Safe guard",
    salaryDebt: 0,
    salarySetting: {
      baseSalary: {
        value: 100000,
        salaryType: SalaryType.ByDay,
      },
      baseBonus: {
        saturday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        sunday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        dayOff: {
          value: 0,
          unit: BonusUnit["%"],
        },
        holiday: {
          value: 0,
          unit: BonusUnit["%"],
        },
      },
      overtimeBonus: {
        saturday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        sunday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        dayOff: {
          value: 0,
          unit: BonusUnit["%"],
        },
        holiday: {
          value: 0,
          unit: BonusUnit["%"],
        },
      },
    },
  },
  {
    avatar: "",
    id: 2,
    name: "Mary",
    email: "mary@gmail.com",
    address: "address Mary",
    phoneNumber: "0123456769",
    note: "",
    sex: Sex.FEMALE,
    CCCD: "012301923011",
    birthday: new Date("2003-4-4"),
    createAt: new Date(),
    position: "Cashier",
    salaryDebt: 0,
    salarySetting: {
      baseSalary: {
        value: 100000,
        salaryType: SalaryType.ByDay,
      },
      baseBonus: {
        saturday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        sunday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        dayOff: {
          value: 0,
          unit: BonusUnit["%"],
        },
        holiday: {
          value: 0,
          unit: BonusUnit["%"],
        },
      },
      overtimeBonus: {
        saturday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        sunday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        dayOff: {
          value: 0,
          unit: BonusUnit["%"],
        },
        holiday: {
          value: 0,
          unit: BonusUnit["%"],
        },
      },
    },
  },
  {
    avatar: "",
    id: 3,
    name: "David",
    email: "david@gmail.com",
    address: "address David",
    phoneNumber: "0124456789",
    note: "",
    sex: Sex.MALE,
    CCCD: "012301943012",
    birthday: new Date("2003-8-8"),
    createAt: new Date(),
    position: "Store Manager",
    salaryDebt: 0,
    salarySetting: {
      baseSalary: {
        value: 100000,
        salaryType: SalaryType.ByDay,
      },
      baseBonus: {
        saturday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        sunday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        dayOff: {
          value: 0,
          unit: BonusUnit["%"],
        },
        holiday: {
          value: 0,
          unit: BonusUnit["%"],
        },
      },
      overtimeBonus: {
        saturday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        sunday: {
          value: 0,
          unit: BonusUnit["%"],
        },
        dayOff: {
          value: 0,
          unit: BonusUnit["%"],
        },
        holiday: {
          value: 0,
          unit: BonusUnit["%"],
        },
      },
    },
  },
];

export default function StaffInfoPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [filterdStaffList, setFilteredStaffList] = useState<Staff[]>([]);
  const [multiFilter, setMultiFilter] = useState({
    position: [] as string[],
  });
  useEffect(() => {
    const fetchStaffs = async () => {
      const res = await getAllStaffs();
      console.log(res);
    };
    fetchStaffs();
    const res = originalStaffList;
    const formatedData: Staff[] = res.map((row) => {
      const newRow = { ...row };
      newRow.id = formatID(newRow.id, "NV");
      return newRow;
    });
    setStaffList(formatedData);
  }, []);

  useEffect(() => {
    var filteredList = [...staffList];
    filteredList = handleMultipleFilter(multiFilter, filteredList);

    setFilteredStaffList([...filteredList]);
  }, [multiFilter, staffList]);

  function handleFormSubmit(values: Staff) {
    setStaffList((prev) => [...prev, values]);
  }
  const updatePositionMultiFilter = (values: string[]) => {
    setMultiFilter((prev) => ({ ...prev, position: values }));
  };

  const filters = [
    <div key={1} className="flex flex-col space-y-2">
      <SearchFilter
        key={1}
        title="Position"
        placeholder="Search position"
        chosenValues={multiFilter.position}
        choices={Array.from(new Set(staffList.map((staff) => staff.position)))}
        onValuesChanged={updatePositionMultiFilter}
      />
    </div>,
  ];
  const headerButtons = [<Button key={1}>More+</Button>];

  return (
    <PageWithFilters
      title="Staff"
      filters={filters}
      headerButtons={headerButtons}
    >
      <DataTable data={filterdStaffList} onSubmit={handleFormSubmit} />
    </PageWithFilters>
  );
}
