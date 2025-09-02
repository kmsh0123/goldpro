import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeftIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useCreateOrderMutation } from "@/feature/api/posApi/posApi";
import {
  clearCart,
  resetGoldWeight,
  selectCartTotals,
  updateConvert24K,
} from "@/feature/service/cartSlice";
import PurchaseLeft from "./Purchase-left";
import { useCreatePurchaseMutation } from "@/feature/api/purchaseApi/purchaseApi";

const PurchaseSystem = () => {
  const [createPurchase, { isLoading }] = useCreatePurchaseMutation();
  const dispatch = useDispatch();

  const { items, goldWeight, alyut, payments, payment, laathk, cash } =
    useSelector((state) => state.cart);

  console.log(cash);

  const convert24K = useSelector((state) => state.cart.convert24K);
  const convert24KDetail = useSelector((state) => state.cart.convert24KDetail);

  const handleConfirmOrder = async () => {
    if (!items || items.length === 0) {
      alert("No items in cart!");
      return;
    }

    const payload = {
      purchaseCode: "PUR-" + Date.now(),
      voucherCode: items[0]?.voucherCode || "N/A",
      supplierId: items[0]?.supplierId || 1,
      totalQuantity: items.reduce((sum, i) => sum + (Number(i.qty) || 1), 0),
      totalKyat: Number(goldWeight?.kyat) || 0,
      totalPae: Number(goldWeight?.pae) || 0,
      totalYway: Number(goldWeight?.yway) || 0,
      totalGram: Number(goldWeight?.gram) || 0,
      totalPrice: items.reduce((sum, i) => sum + Number(i.price || 0), 0),
      todayRate: Number(items[0]?.todayRate) || 0,
      paymentKyat: Number(payment?.kyat) || 0,
      paymentPae: Number(payment?.pae) || 0,
      paymentYway: Number(payment?.yway) || 0,
      paymentGram: Number(payment?.gram) || 0,
      paymentCash: Number(cash) || 0,
      discountKyat: 0,
      discountPae: 0,
      discountYway: 0,
      discountGram: 0,
      discountCash: 0,
      total24KKyat: Number(convert24KDetail?.kyat) || 0,
      total24KPae: Number(convert24KDetail?.pae) || 0,
      total24KYway: Number(convert24KDetail?.yway) || 0,
      total24KGram: Number(convert24K) || 0,
      items: items.map((i) => ({
        productId: i.productId || 0,
        typeId: i.typeId || 0,
        qualityId: i.qualityId || 0,
        categoryId: i.categoryId || 0,
        quantity: Number(i.qty) || 1,
        yautKyat: Number(i.alyautKyat) || 0,
        yautPae: Number(i.alyautPae) || 0,
        yautYway: Number(i.alyautYway) || 0,
        yautGram: Number(i.alyautGram) || 0,
        shweKyat: Number(i.kyat) || 0,
        shwePae: Number(i.pae) || 0,
        shweYway: Number(i.yway) || 0,
        shweGram: Number(i.gram) || 0,
        paymentKyat: Number(i.paymentKyat) || 0,
        paymentPae: Number(i.payPae) || 0,
        paymentYway: Number(i.payYway) || 0,
        paymentGram: Number(i.payGram) || 0,
        paymentCash: Number(cash) || 0,
        discountKyat: 0,
        discountPae: 0,
        discountYway: 0,
        discountGram: 0,
        discountCash: 0,
        totalKyat: Number(i.kyat) || 0,
        totalPae: Number(i.pae) || 0,
        totalYway: Number(i.yway) || 0,
        totalGram: Number(i.gram) || 0,
        totalPrice: Number(i.price) || 0,
        total24KKyat: 0,
        total24KPae: 0,
        total24KYway: 0,
        total24KGram: 0,
      })),
    };

    try {
      const result = await createPurchase(payload).unwrap();
      console.log("Purchase created successfully:", result);
      alert("Purchase created successfully!");
      dispatch(clearCart());
    } catch (error) {
      console.error("Purchase creation failed:", error);
      alert("Purchase failed: " + (error.message || "Unknown error"));
    }
  };

  useEffect(() => {
    dispatch(updateConvert24K());
  }, [items, dispatch]);

  // Calculate totals for display
  const calculateItemTotals = (item) => {
    const qty = Number(item.qty || 1);
    const alyotKyat = Number(item.alyautKyat || 0);
    const alyotPae = Number(item.alyautPae || 0);
    const alyotYway = Number(item.alyautYway || 0);
    const alyotGram = Number(item.alyautGram || 0);

    const shweKyat = Number(item.kyat || 0);
    const shwePae = Number(item.pae || 0);
    const shweYway = Number(item.yway || 0);
    const shweGram = Number(item.gram || 0);

    // Calculate net weight (shwe - alyot)
    const netKyat = shweKyat + alyotKyat;
    const netPae = shwePae + alyotPae;
    const netYway = shweYway + alyotYway;
    const netGram = shweGram + alyotGram;

    return {
      qty,
      alyotKyat,
      alyotPae,
      alyotYway,
      alyotGram,
      shweKyat,
      shwePae,
      shweYway,
      shweGram,
      netKyat,
      netPae,
      netYway,
      netGram,
    };
  };

  // Calculate total payments
  const calculateTotalPayments = () => {
    if (!payments || payments.length === 0)
      return { kyat: 0, pae: 0, yway: 0, gram: 0 };

    return payments.reduce(
      (total, payment) => ({
        kyat: total.kyat + (Number(payment?.kyat) || 0),
        pae: total.pae + (Number(payment?.pae) || 0),
        yway: total.yway + (Number(payment?.yway) || 0),
        gram: total.gram + (Number(payment?.gram) || 0),
      }),
      { kyat: 0, pae: 0, yway: 0, gram: 0 }
    );
  };

  // Calculate total cash from all items
  const calculateTotalCash = () => {
    if (!items || items.length === 0) return 0;

    const convert24KGram = Number(convert24K) || 0;
    const totalCash = items.reduce((sum, item) => {
      const todayRate = Number(item.todayRate || 0);
      return sum + convert24KGram * todayRate;
    }, 0);

    // Double the total cash
    return totalCash * 2;
  };

  // Calculate ရွှေကျန် (Gold Balance)
  const calculateGoldBalance = () => {
    const totalPaymentGram = calculateTotalPayments().gram || 0;
    const totalNetGram = items.reduce((sum, item) => {
      const totals = calculateItemTotals(item);
      return sum + (totals.netGram || 0);
    }, 0);

    const goldBalance = totalPaymentGram - totalNetGram;
    return goldBalance;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
        <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon />
        </span>
        Purchase System
      </h1>

      <div className="border-b-2"></div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Side - Form */}
        <PurchaseLeft />

        {/* Right Side - Invoice */}
        <Card className="p-4">
          {/* Invoice Info */}
          <div className="text-sm space-y-1 mb-4">
            <p>Voucher Code: {items[0]?.voucherCode || "N/A"}</p>
            <p>Supplier Name: {items[0]?.supplierName || "N/A"}</p>
            <p>Gold Quality: {items[0]?.qualityName || "N/A"}</p>
            <p>Date: {new Date().toLocaleDateString()}</p>
            <p>Time: {new Date().toLocaleTimeString()}</p>
          </div>

          {/* Invoice Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-collapse text-sm text-center">
              <thead>
                <tr>
                  <th className="border p-1" rowSpan={2}>
                    No.
                  </th>
                  <th className="border p-1" rowSpan={2}>
                    Product
                  </th>
                  <th className="border p-1" rowSpan={2}>
                    Qty
                  </th>
                  <th className="border p-1" colSpan={4}>
                    အလျော့တွက်
                  </th>
                  <th className="border p-1" rowSpan={2}>
                    လက်ခ
                  </th>
                  <th className="border p-1" colSpan={4}>
                    ရွှေချိန်
                  </th>
                  <th className="border p-1" colSpan={4}>
                    Total
                  </th>
                  <th className="border p-1" colSpan={3}>
                    ConvertTo24K
                  </th>
                </tr>
                <tr>
                  <th className="border p-1">ကျပ်</th>
                  <th className="border p-1">ပဲ</th>
                  <th className="border p-1">ရွေး</th>
                  <th className="border p-1">G</th>

                  <th className="border p-1">ကျပ်</th>
                  <th className="border p-1">ပဲ</th>
                  <th className="border p-1">ရွေး</th>
                  <th className="border p-1">G</th>

                  <th className="border p-1">ကျပ်</th>
                  <th className="border p-1">ပဲ</th>
                  <th className="border p-1">ရွေး</th>
                  <th className="border p-1">G</th>

                  <th className="border p-1">ကျပ်</th>
                  <th className="border p-1">ပဲ</th>
                  <th className="border p-1">ရွေး</th>
                </tr>
              </thead>

              <tbody>
                {items && items.length === 0 ? (
                  <tr>
                    <td className="border p-1" colSpan={19}>
                      No items added.
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => {
                    const totals = calculateItemTotals(item);
                    const todayRate = Number(item.todayRate || 0);

                    return (
                      <tr key={index}>
                        <td className="border p-1 bg-yellow-100">
                          {index + 1}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {item.productName || "N/A"}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.qty}
                        </td>

                        {/* အလျော့တွက် */}
                        <td className="border p-1 bg-yellow-100">
                          {totals.alyotKyat}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.alyotPae}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.alyotYway}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.alyotGram.toFixed(2)}
                        </td>

                        {/* လက်ခ */}
                        <td className="border p-1 bg-yellow-100">
                          {Number(item.laathk) || 0}
                        </td>

                        {/* ရွှေချိန် */}
                        <td className="border p-1 bg-yellow-100">
                          {totals.shweKyat}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.shwePae}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.shweYway}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.shweGram.toFixed(2)}
                        </td>

                        {/* Total (Net Weight) */}
                        <td className="border p-1 bg-yellow-100">
                          {totals.netKyat}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.netPae}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.netYway}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.netGram}
                        </td>

                        {/* Convert to 24K */}
                        <td className="border p-1 bg-yellow-100">
                          {convert24KDetail?.kyat || 0}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {convert24KDetail?.pae || 0}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {convert24KDetail?.yway || 0}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

              <tfoot>
                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">
                    Gold (24K)
                  </td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1" colSpan={3}></td>
                </tr>

                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">
                    Previous Balance
                  </td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1" colSpan={3}></td>
                </tr>

                {/* Combined Payment and Total Cash Row */}
                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">
                    Payment (22K)
                  </td>
                  <td className="border p-1"></td>

                  {/* Payment 22K Values */}
                  {payments && payments.length > 0 ? (
                    <>
                      {/* <td className="border p-1">
                        {calculateTotalPayments().kyat}
                      </td>
                      <td className="border p-1">
                        {calculateTotalPayments().pae}
                      </td>
                      <td className="border p-1">
                        {calculateTotalPayments().yway}
                      </td>
                      <td className="border p-1">
                        {calculateTotalPayments().gram.toFixed(2)}
                      </td> */}
                      <td className="border p-1" colSpan={4}></td>
                    </>
                  ) : (
                    <td className="border p-1" colSpan={4}></td>
                  )}

                  <td className="border p-1"></td>
                  <td className="border p-1">
                    {calculateTotalPayments().kyat}
                  </td>
                  <td className="border p-1">{calculateTotalPayments().pae}</td>
                  <td className="border p-1">
                    {calculateTotalPayments().yway}
                  </td>
                  <td className="border p-1">
                    {calculateTotalPayments().gram}
                  </td>

                  {/* Total Cash Doubled */}
                </tr>

                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">
                    Payment (Cash)
                  </td>
                  <td className="border p-1" colSpan={17}>
                    <div className="flex justify-center items-center gap-2">
                      <span>ငွေပမာဏ:</span>
                      <span className="font-bold text-green-600">
                        {Number(cash || 0)?.toLocaleString() || 0} Ks
                      </span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">
                    Total (Cash) Doubled
                  </td>
                  <td className="border p-1" colSpan={17}>
                    {calculateTotalCash()
                      ? calculateTotalCash().toLocaleString()
                      : 0}{" "}
                    Ks
                  </td>
                </tr>

                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">Discount</td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1" colSpan={3}></td>
                </tr>
                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">ရွှေကျန်</td>
                  <td className="border p-1" colSpan={17}>
                    <div className="flex justify-center items-center gap-2">
                      <span>
                        {calculateTotalPayments().gram?.toFixed(2) || "0.00"} G
                        -{" "}
                        {items
                          .reduce((sum, item) => {
                            const totals = calculateItemTotals(item);
                            return sum + (totals.netGram || 0);
                          }, 0)
                          .toFixed(2) || "0.00"}{" "}
                        G =
                      </span>
                      <span className="font-bold text-yellow-600">
                        {calculateGoldBalance().toFixed(2)} G
                      </span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <Button
              variant="outline"
              className="bg-gray-100 text-gray-700"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmOrder}
              disabled={isLoading || !items || items.length === 0}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PurchaseSystem;
