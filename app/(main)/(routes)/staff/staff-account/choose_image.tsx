"use client";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { nanoid } from "nanoid";
import { Camera, XCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const ChooseImageButton = ({
  fileUrl,
  onImageChanged,
}: {
  fileUrl: string | null;
  onImageChanged: (file: File | null) => void;
}) => {
  const id = nanoid();
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      onImageChanged(e.target.files[0]);
      e.target.files = null;
    }
  }

  return (
    <div
      className={cn(
        "relative h-[200px] w-[150px]",
        !fileUrl || fileUrl.length === 0
          ? "rounded-md border-2 border-dashed hover:cursor-pointer hover:bg-gray-50"
          : "hover:cursor-default",
      )}
    >
      <div
        className={cn(
          !fileUrl || fileUrl.length === 0 ? "visible" : "hidden",
          "relative h-full w-full",
        )}
      >
        <Label
          htmlFor={id}
          className="absolute left-0 top-0 flex h-full w-full items-center justify-center text-gray-600 hover:cursor-pointer"
        >
          <Camera color="grey" size={24} />
        </Label>
        <input
          id={id}
          type="file"
          onChange={handleChange}
          className="hidden"
          accept="image/*"
        />
      </div>
      <div
        className={cn(
          !fileUrl || fileUrl.length === 0 ? "hidden" : "visible",
          "h-full w-full",
        )}
      >
        <Image
          width={0}
          height={0}
          sizes="100vw"
          src={fileUrl || "/default-user-avatar.png"}
          alt="image"
          className="h-full w-full rounded-sm border"
        />
        <XCircle
          size={16}
          fill="red"
          color="white"
          className="absolute right-[-8px] top-[-8px] hover:cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onImageChanged(null);
          }}
        />
      </div>
    </div>
  );
};
