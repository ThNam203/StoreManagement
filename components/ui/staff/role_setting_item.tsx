"use client";

import { Label } from "@/components/ui/label";
import {
  RoleSetting,
  getRoleNameUI,
  getRoleProp,
  getRolePropValue,
  getRoleSettingKeys,
} from "@/entities/RoleSetting";
import { Checkbox } from "../checkbox";
import { nanoid } from "nanoid";

const Role = ({
  roleKey,
  roleDetailList,
  onRoleChange,
}: {
  roleKey: string;
  roleDetailList: { prop: string; value: boolean }[];
  onRoleChange?: (roleKey: string, prop: string, value: boolean) => void;
}) => {
  return (
    <div className="flex flex-col items-start gap-2">
      <p className="text-md font-semibold text-blue-500">
        {getRoleNameUI(roleKey)}
      </p>
      <div className="flex flex-col items-start gap-2">
        {roleDetailList.map((detail, idx) => {
          const key = nanoid();
          return (
            <RoleDetail
              key={key}
              roleDetail={detail.prop}
              value={detail.value}
              htmlFor={key}
              onCheckChange={(value) => {
                if (onRoleChange) onRoleChange(roleKey, detail.prop, value);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

const RoleDetail = ({
  value,
  roleDetail,
  onCheckChange,
  htmlFor,
}: {
  value: boolean;
  roleDetail: string;
  onCheckChange?: (value: boolean) => void;
  htmlFor: string;
}) => {
  return (
    <div className="flex cursor-pointer flex-row items-center gap-2">
      <Checkbox
        id={htmlFor}
        checked={value}
        onCheckedChange={(checked) => {
          if (onCheckChange) onCheckChange(!!checked);
        }}
      />
      <Label htmlFor={htmlFor} className="cursor-pointer text-sm">
        {getRoleNameUI(roleDetail)}
      </Label>
    </div>
  );
};

export const RoleList = ({
  roleSetting,
  onChange,
}: {
  roleSetting: RoleSetting;
  onChange: (value: RoleSetting) => void;
}) => {
  const roleKeys = getRoleSettingKeys(roleSetting);
  const handleRoleChange = (roleKey: string, prop: string, value: boolean) => {
    const newRoleSetting = {
      ...roleSetting,
      [roleKey]: {
        ...roleSetting[roleKey as keyof typeof roleSetting],
        [prop]: value,
      },
    };

    onChange(newRoleSetting);
  };

  return (
    <>
      {roleKeys.map((roleKey, index) => {
        const rawRoleDetailList = Object.keys(
          getRoleProp(roleSetting, roleKey),
        );

        const roleDetailList = rawRoleDetailList.map((option) => {
          return {
            prop: option,
            value: getRolePropValue(roleSetting, roleKey, option),
          };
        });

        return (
          <Role
            key={index}
            roleKey={roleKey}
            roleDetailList={roleDetailList}
            onRoleChange={handleRoleChange}
          />
        );
      })}
    </>
  );
};
