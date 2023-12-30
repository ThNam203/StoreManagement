"use client";

import { Label } from "@/components/ui/label";
import {
  RoleSetting,
  getRoleNameUI,
  getRoleProp,
  getRolePropValue,
  getRoleSettingKeys,
  isAllPropTrue,
} from "@/entities/RoleSetting";
import { Checkbox } from "../checkbox";
import { nanoid } from "nanoid";
import { cn } from "@/lib/utils";

const Role = ({
  roleKey,
  roleDetailList,
  onRoleDetailChange,
  onRoleChange,
}: {
  roleKey: string;
  roleDetailList: { prop: string; value: boolean }[];
  onRoleDetailChange?: (roleKey: string, prop: string, value: boolean) => void;
  onRoleChange?: (
    roleKey: string,
    roleDetailList: { prop: string; value: boolean }[],
  ) => void;
}) => {
  const key = nanoid();
  const isAllTrue =
    roleDetailList.find((detail) => !detail.value) === undefined;
  return (
    <div className="flex flex-col items-start gap-2">
      <RoleDetail
        roleDetail={roleKey}
        value={isAllTrue}
        htmlFor={key}
        color="text-blue-500"
        onCheckChange={(value) => {
          const roleChange = roleDetailList.map((detail) => ({
            prop: detail.prop,
            value: value,
          }));
          if (onRoleChange) onRoleChange(roleKey, roleChange);
        }}
      />
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
                if (onRoleDetailChange)
                  onRoleDetailChange(roleKey, detail.prop, value);
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
  color = "",
}: {
  value: boolean;
  roleDetail: string;
  color?: string;
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
      <Label htmlFor={htmlFor} className={cn("cursor-pointer text-sm", color)}>
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
  const handleRoleDetailChange = (
    roleKey: string,
    prop: string,
    value: boolean,
  ) => {
    console.log("roleKey", roleKey, "detail.prop", prop, "value", value);
    const newRoleSetting = {
      ...roleSetting,
      [roleKey]: {
        ...roleSetting[roleKey as keyof typeof roleSetting],
        [prop]: value,
      },
    };
    console.log("newRoleSetting", newRoleSetting);

    onChange(newRoleSetting);
  };
  const handleRoleChange = (
    roleKey: string,
    roleDetailList: { prop: string; value: boolean }[],
  ) => {
    let roleChange: { [key: string]: boolean } = {};
    roleDetailList.forEach((detail) => {
      roleChange = { ...roleChange, [detail.prop]: detail.value };
    });

    const newRoleSetting = {
      ...roleSetting,
      [roleKey]: {
        ...roleChange,
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
            onRoleDetailChange={handleRoleDetailChange}
            onRoleChange={handleRoleChange}
          />
        );
      })}
    </>
  );
};
