"use client";
import { PageWithFilters } from "@/components/ui/filter";
import React, { useState } from "react";
import { DiscountDatatable } from "./datatable";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { cn } from "@/lib/utils";
import scrollbar_style from "@/styles/scrollbar.module.css";
import NewDiscountForm from "@/components/ui/discount/new_discount_form";
import UpdateDiscountForm from "@/components/ui/discount/update_discount_form";

export default function DiscountPage() {
  const discounts = useAppSelector((state) => state.discounts.value);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updatePosition, setUpdatePosition] = useState(0);

  const onUpdateButtonClick = (position: number) => {
    setUpdatePosition(position);
    setUpdateOpen(true);
  };

  return (
    <PageWithFilters
      title="Discounts"
      filters={[]}
      headerButtons={[<NewDiscountButton key={1} />]}
    >
      <DiscountDatatable data={discounts} onUpdateButtonClick={onUpdateButtonClick} />
      {updateOpen ? <UpdateDiscountForm discount={discounts[updatePosition]} setOpen={setUpdateOpen}/> : null}
    </PageWithFilters>
  );
}

const NewDiscountButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant={"green"} onClick={() => setOpen(true)}>
        <Plus size={16} className="mr-2" />
        Create a new discount
      </Button>
      {open ? <NewDiscountForm setOpen={setOpen} /> : null}
    </>
  );
};
