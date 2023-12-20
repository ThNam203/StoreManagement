"use client";
import { CustomDatatable } from "@/components/component/custom_datatable";
import PropertiesString from "@/components/ui/properties_string_view";
import SearchView from "@/components/component/SearchView";
import { Product } from "@/entities/Product";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  NewPurchaseOrderDetail,
  purchaseOrderDetailColumnTitles,
  purchaseOrderDetailTableColumns,
} from "./table_columns";
import StaffService from "@/services/staff_service";
import { setStaffs } from "@/reducers/staffReducer";
import { axiosUIErrorHandler } from "@/services/axios_utils";
import { disablePreloader, showPreloader } from "@/reducers/preloaderReducer";
import { Staff } from "@/entities/Staff";
import { Check, CheckCircle, User, UserCircle } from "lucide-react";
import CustomCombobox from "@/components/component/CustomCombobox";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const ProductSearchItemView: (product: Product) => React.ReactNode = (
  product: Product,
) => {
  return (
    <div className="m-1 flex flex-row items-center gap-2 rounded-sm p-1 px-4 hover:cursor-pointer hover:bg-blue-200">
      <img
        className="h-10 w-10 border object-contain object-center"
        src={
          product.images && product.images.length > 0
            ? product.images[0]
            : "/default-product-img.jpg"
        }
      />
      <div className="flex flex-1 flex-col text-sm">
        <p className="font-semibold">
          {product.name}
          <PropertiesString
            propertiesString={product.propertiesString}
            className="ml-1"
          />
        </p>
        <p>ID: {product.id}</p>
        <p>In stock: {product.stock}</p>
      </div>
      <p className="text-base text-blue-400">
        {product.productPrice}/{product.salesUnits.name}
      </p>
    </div>
  );
};

export default function NewPurchaseOrderPage() {
  const products = useAppSelector((state) => state.products.value);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [details, setDetails] = useState<NewPurchaseOrderDetail[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [note, setNote] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);
  const { toast } = useToast();

  const staffs = useAppSelector((state) => state.staffs.value);
  // TODO: not nullable
  const [staff, setStaff] = useState<Staff | null>(null);
  const [createdDate, setCreatedDate] = useState<Date>(new Date());
  const [staffSearch, setStaffSearch] = useState<string>("");

  console.log(format(createdDate, "yyyy/MM/dd'T'HH:mm"));

  useEffect(() => {
    dispatch(showPreloader());
    const fetchData = async () => {
      const staffs = await StaffService.getAllStaffs();
      dispatch(setStaffs(staffs.data));
    };

    fetchData()
      .catch((e) => axiosUIErrorHandler(e, toast))
      .finally(() => dispatch(disablePreloader()));
  }, []);

  const onSearchViewProductClicked = (product: Product) => {
    const foundProduct = details.find(
      (detail) => detail.productId === product.id,
    );
    if (!foundProduct)
      setDetails((prev) => [
        ...prev,
        {
          quantity: 1,
          price: product.originalPrice,
          discount: 0,
          productId: product.id,
          productName: product.name,
          unit: product.salesUnits.name,
        },
      ]);
    else onDetailQuantityChanged(product.id, foundProduct.quantity + 1);
  };

  const onDetailQuantityChanged = (productId: number, newQuantity: number) => {
    if (isNaN(newQuantity) || newQuantity < 0) newQuantity = 0;
    setDetails((prev) =>
      prev.map((detail) => {
        return detail.productId === productId
          ? {
              ...detail,
              quantity: newQuantity,
            }
          : detail;
      }),
    );
  };

  const deleteRows = async (data: NewPurchaseOrderDetail[]) => {
    const productIds = data.map((d) => d.productId);
    setDetails((prev) =>
      prev.filter((detail) => productIds.includes(detail.productId)),
    );
    return Promise.resolve();
  };

  const onCompleteButtonClick = async () => {
    // await PurchaseOrderService.uploadPurchaseOrder({
    //   purchaseOrderDetail: details.map(v => ({...v})),
    //   subtotal: number,
    //   discount: number;
    //   total: number;
    //   note: string;
    //   createdDate: string;
    //   purchaseOrderDetail: PurchaseOrderDetail[];
    //   staffId: number;
    //   supplierId: number;
    // })
    //   .then((result) => {
    //     router.push("/purchase-order");
    //   })
    //   .catch((e) => axiosUIErrorHandler(e, toast))
    //   .finally(() => setIsCompleting(false));
  };

  const MSearchView = (
    <SearchView
      placeholder="Find products by id or name"
      className="max-w-[400px] flex-1"
      triggerClassname="border"
      choices={products}
      onSearchChange={(value) => setProductSearch(value)}
      itemView={ProductSearchItemView}
      onItemClick={onSearchViewProductClicked}
      filter={(product) =>
        product.id.toString().includes(productSearch) ||
        product.name.includes(productSearch)
      }
      zIndex={8}
    />
  );

  return (
    <div className="flex flex-row gap-2">
      <div className="flex flex-1 flex-col gap-2 bg-white p-4">
        <h2 className="my-4 flex-1 text-start text-2xl font-bold">
          Create new stock check
        </h2>
        <CustomDatatable
          data={details}
          columns={purchaseOrderDetailTableColumns(onDetailQuantityChanged)}
          columnTitles={purchaseOrderDetailColumnTitles}
          config={{
            alternativeSearchInput: MSearchView,
            onDeleteRowsBtnClick: deleteRows,
          }}
        />
      </div>
      <div className="flex w-[300px] flex-col gap-4 bg-white p-2">
        <div className="flex">
          <CustomCombobox<Staff>
            searchPlaceholder={"Find staff..."}
            value={staff}
            choices={staffs}
            valueView={CreatorView}
            itemSearchView={(choice) => StaffSearchView(choice, staff)}
            onSearchChange={setStaffSearch}
            filter={(st) =>
              st.id.toString().includes(staffSearch) ||
              st.name.includes(staffSearch)
            }
            onItemClick={setStaff}
            startIcon={<UserCircle size={16} />}
          />
          <input
            type="datetime-local"
            value={format(createdDate, "yyyy-MM-dd'T'HH:mm")}
            className="ml-1 border px-1 text-[0.7rem]"
          ></input>
        </div>
        <Input
          showBorderOnFocus={false}
          placeholder="Note..."
          className="w-full md:max-w-[500px]"
          value={note}
          onChange={(e) => setNote(e.currentTarget.value)}
        />
      </div>
    </div>
  );
}

const CreatorView = (staff: Staff): React.ReactNode => {
  return <p className="whitespace-nowrap text-xs">{staff.name}</p>;
};

const StaffSearchView = (
  staff: Staff,
  chosenStaff: Staff | null,
): React.ReactNode => {
  const chosen = chosenStaff && staff.id === chosenStaff.id;
  return (
    <div
      className={cn(
        "flex cursor-pointer items-center justify-between px-1",
        chosen ? "bg-green-200" : "",
      )}
    >
      <div>
        <p className="text-sm">{staff.name}</p>
        <p className="text-xs">Id: {staff.id}</p>
      </div>
      {chosen ? <Check size={16} color="green" /> : null}
    </div>
  );
};
