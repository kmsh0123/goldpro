import React from "react";
import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/card";
import { ChevronLeftIcon } from "lucide-react";
import POSLeft from "./POS-left";
import { useSelector } from "react-redux";

const POS = () => {
  const items = useSelector((state) => state.cart.items);
  console.log(items);

  return (
    <div className="p-6 space-y-6">
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
          <div className="text-sm space-y-1 mb-4">
            <p>Voucher Code: 12345</p>
            <p>Customer Name: ABCD</p>
            <p>Gold Quality: 22K</p>
            <p>Date: 6/6/2025</p>
            <p>Time: 11:11 AM</p>
          </div>

          {/* Table */}
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
                {/* Example row */}
                <tr>
                   {items?.map((item, index) => (
                    <React.Fragment key={index}>
                      <td className="border p-1">{item.productId || ""}</td>
                      <td className="border p-1">{item.productName || ""}</td>
                    </React.Fragment>
                  ))}
                  <td className="border p-1">2</td>
                  {items?.map((item, index) => (
                    <React.Fragment key={index}>
                      <td className="border p-1">{item.kyat || 0}</td>
                      <td className="border p-1">{item.pae || 0}</td>
                      <td className="border p-1">{item.yway || 0}</td>
                      <td className="border p-1">{item.gram || 0}</td>
                    </React.Fragment>
                  ))}
                   {items?.map((item, index) => (
                    <React.Fragment key={index}>
                      <td className="border p-1">{item.laathk || 0}</td>
                    </React.Fragment>
                  ))}
                   {items?.map((item, index) => (
                    <React.Fragment key={index}>
                      <td className="border p-1">{item.alyautKyat || 0}</td>
                      <td className="border p-1">{item.alyautPae || 0}</td>
                      <td className="border p-1">{item.alyautYway || 0}</td>
                      <td className="border p-1">{item.alyautGram || 0}</td>
                    </React.Fragment>
                  ))}
                  {/* <td className="border p-1">500</td>
                  <td className="border p-1">500</td>
                  <td className="border p-1">500</td>
                  <td className="border p-1">500</td> */}
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">Total</td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  {/* <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td> */}
                </tr>
                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">
                    Gold (24K)
                  </td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
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
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                </tr>
                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">
                    Payment (22K)
                  </td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}>
                    san pa pa
                  </td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}>
                    san tar
                  </td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  {/* <td className="border p-1"></td> */}
                  {/* <td className="border p-1"></td> */}
                  {/* <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td> */}
                </tr>
                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">
                    Payment (Cash)
                  </td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1" colSpan={4}></td>
                  {/* <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td> */}
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
                  <td className="border p-1 text-center font-bold">
                    Net Balance
                  </td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1" colSpan={4}></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Summary */}
          {/* <div className="text-sm text-right mt-4 space-y-1">
            <p>Total</p>
            <p>Discount</p>
            <p className="font-semibold">Net Amount</p>
            <p>24 K</p>
          </div> */}

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
