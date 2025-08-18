import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeftIcon } from "lucide-react";
import POSLeft from "./POS-left";
import { useSelector } from "react-redux";

const POS = () => {
  const items = useSelector((state) => state.cart.items) || [];
  const shweChain = useSelector((state) => state.cart.shweChain) || {
    kyat: 0,
    pae: 0,
    yway: 0,
    gram: 0,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
        <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon />
        </span>
        Point of Sale
      </h1>

      <div className="border-b-2"></div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Side - Form */}
        <POSLeft />

        {/* Right Side - Invoice */}
        <Card className="p-4">
          {/* Invoice Info */}
          <div className="text-sm space-y-1 mb-4">
            <p>Voucher Code: 12345</p>
            <p>Customer Name: ABCD</p>
            <p>Gold Quality: 22K</p>
            <p>Date: 6/6/2025</p>
            <p>Time: 11:11 AM</p>
          </div>

          {/* Invoice Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-collapse text-sm text-center">
              <thead>
                <tr>
                  <th className="border p-1" rowSpan={2}>No.</th>
                  <th className="border p-1" rowSpan={2}>Product</th>
                  <th className="border p-1" rowSpan={2}>Qty</th>
                  <th className="border p-1" colSpan={4}>အလျော့တွက်</th>
                  <th className="border p-1" rowSpan={2}>လက်ခ</th>
                  <th className="border p-1" colSpan={4}>ရွှေချိန်</th>
                  <th className="border p-1" colSpan={4}>Total</th>
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
                </tr>
              </thead>

              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td className="border p-1" colSpan={16}>
                      No items added.
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => {
                    const qty = Number(item.qty || 1);

                    const alyotKyat = Number(item.kyat || 0);
                    const alyotPae = Number(item.pae || 0);
                    const alyotYway = Number(item.yway || 0);
                    const alyotGram = Number(item.gram || 0);
                    const lakha = Number(item.lakha || 0);

                    const shweKyat = Number(shweChain.kyat || 0);
                    const shwePae = Number(shweChain.pae || 0);
                    const shweYway = Number(shweChain.yway || 0);
                    const shweGram = Number(shweChain.gram || 0);

                    const totalKyat = (alyotKyat + shweKyat) * qty;
                    const totalPae = (alyotPae + shwePae) * qty;
                    const totalYway = (alyotYway + shweYway) * qty;
                    const totalGram = (alyotGram + shweGram) * qty;

                    return (
                      <tr key={index}>
                        <td className="border p-1 bg-yellow-100">{index + 1}</td>
                        <td className="border p-1 bg-yellow-100">{item.name || "Product"}</td>
                        <td className="border p-1 bg-yellow-100">{qty}</td>

                        {/* အလျော့တွက် */}
                        <td className="border p-1 bg-yellow-100">{alyotKyat}</td>
                        <td className="border p-1 bg-yellow-100">{alyotPae}</td>
                        <td className="border p-1 bg-yellow-100">{alyotYway}</td>
                        <td className="border p-1 bg-yellow-100">{alyotGram}</td>

                        {/* လက်ခ */}
                        <td className="border p-1 bg-yellow-100">{lakha}</td>

                        {/* ရွှေချိန် */}
                        <td className="border p-1 bg-yellow-100">{shweKyat}</td>
                        <td className="border p-1 bg-yellow-100">{shwePae}</td>
                        <td className="border p-1 bg-yellow-100">{shweYway}</td>
                        <td className="border p-1 bg-yellow-100">{shweGram}</td>

                        {/* Total */}
                        <td className="border p-1 bg-yellow-100">{totalKyat}</td>
                        <td className="border p-1 bg-yellow-100">{totalPae}</td>
                        <td className="border p-1 bg-yellow-100">{totalYway}</td>
                        <td className="border p-1 bg-yellow-100">{totalGram.toFixed(2)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>

              <tfoot>
                {/* Footer Rows */}
                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">Total</td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1" colSpan={4}></td>
                </tr>
                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">Gold (24K)</td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1" colSpan={4}></td>
                </tr>
                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">Previous Balance</td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1" colSpan={4}></td>
                </tr>
                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">Payment (22K)</td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}>san pa pa</td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}>san tar</td>
                  <td className="border p-1" colSpan={4}></td>
                </tr>
                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">Payment (Cash)</td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1" colSpan={4}></td>
                </tr>
                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">Discount</td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1" colSpan={4}></td>
                </tr>
                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">Net Balance</td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1" colSpan={4}></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" className="bg-gray-100 text-gray-700">
              Cancel
            </Button>
            <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
              Print
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default POS;
