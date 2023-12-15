"use client";
import { PageWithFilters } from "@/components/ui/filter";
import React, { useEffect, useState } from "react";
import { DiscountDatatable } from "./datatable";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import NewDiscountForm from "@/components/ui/discount/new_discount_form";
import UpdateDiscountForm from "@/components/ui/discount/update_discount_form";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import DiscountService from "@/services/discount_service";
import { setDiscounts } from "@/reducers/discountsReducer";
import { da } from "date-fns/locale";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import { useToast } from "@/components/ui/use-toast";
import ProductService from "@/services/product_service";
import { setProducts } from "@/reducers/productsReducer";
import { setGroups } from "@/reducers/productGroupsReducer";

export default function DiscountPage() {
  const discounts = useAppSelector((state) => state.discounts.value);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updatePosition, setUpdatePosition] = useState(0);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  useEffect(() => {
    dispatch(showPreloader())
    const getData = async () => {
      try {
        const discounts = await DiscountService.getAllDiscounts();
        dispatch(setDiscounts(discounts.data))

        const products = await ProductService.getAllProducts();
        dispatch(setProducts(products.data))     

        const productGroups = await ProductService.getAllGroups();
        dispatch(setGroups(productGroups.data))
      } catch (e) {
        axiosUIErrorHandler(e, toast)
      } finally {
        dispatch(disablePreloader())
      }
    }

    getData()
  }, [])

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
