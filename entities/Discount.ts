export type Discount = {
    id: number,
    name: string,
    description: string,
    status: boolean,
    value: number,
    maxValue: number | null,
    minSubTotal: number,
    type: "VOUCHER" | "COUPON",
    amount: number,
    discountCodes: DiscountCode[] | null,
    creatorId: number,
    productIds: number[] | null,
    productGroups: string[] | null,
    startDate: string,
    endDate: string,
    createdAt: string,
}

export type DiscountCode = {
    id: number,
    value: string,
    issuedDate: string,
    usedDate: string | null,
}