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
    if (e.target.files && e.target.files.length > 0)
      onImageChanged(e.target.files[0]);
  }

  return (
    <div
      className={cn(
        "w-[150px] h-[200px] relative",
        !fileUrl || fileUrl.length === 0
          ? "hover:cursor-pointer hover:bg-gray-50 border-2 border-dashed rounded-md"
          : "hover:cursor-default"
      )}
    >
      <div
        className={cn(
          !fileUrl || fileUrl.length === 0 ? "visible" : "hidden",
          "w-full h-full relative"
        )}
      >
        <Label
          htmlFor={id}
          className="absolute top-0 left-0 flex items-center justify-center w-full h-full hover:cursor-pointer text-gray-600"
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
          "w-full h-full"
        )}
      >
        <Image
          width={0}
          height={0}
          sizes="100vw"
          src={fileUrl || "/default-user-avatar.png"}
          alt="image"
          className="w-full h-full border rounded-sm"
        />
        <XCircle
          size={16}
          fill="red"
          color="white"
          className="absolute top-[-8px] right-[-8px] hover:cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onImageChanged(null);
          }}
        />
      </div>
    </div>
  );
};
