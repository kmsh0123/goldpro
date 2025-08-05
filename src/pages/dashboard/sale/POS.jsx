import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ChevronLeftIcon } from "lucide-react";

const POS = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
          <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon/>
         </span>
          Point of Sale
         </h1>

         <div className="border-b-2"></div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Side - Form */}
        <div className="space-y-4">
          {/* Top Buttons */}
          <div className="flex gap-4">
            <Select>
              <SelectTrigger className="w-full border border-blue-400">
                <SelectValue placeholder="Customer Name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Customer A</SelectItem>
              </SelectContent>
            </Select>

              <Select>
              <SelectTrigger className="w-full border border-blue-400">
                <SelectValue placeholder="Customer Name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Customer A</SelectItem>
              </SelectContent>
            </Select>
           
          </div>

          {/* Product Info */}
          <div className="grid grid-cols-2 gap-4">
            {["Product Name", "Type", "Gold Quality", "Quantity"].map((label) => (
              <div key={label}>
                <label className="block mb-1 font-medium">{label}</label>
                <Select>
                  <SelectTrigger className="w-full bg-gray-100">
                    <SelectValue placeholder={label} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sample">{label} Option</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          {/* Weight */}
          <div>
            <h3 className="font-bold text-sm">Gold Weight</h3>
            {["အလေးချိန်တွင်", "ရွှေချိန်", "လက်ဝတ်"].map((label, index) => (
              <div key={index} className="mt-2">
                <p className="text-sm mb-1">{label}</p>
                <div className="flex gap-2">
                  <Input placeholder="K" className="w-16 bg-gray-100" />
                  <Input placeholder="P" className="w-16 bg-gray-100" />
                  <Input placeholder="Y" className="w-16 bg-gray-100" />
                  <Input placeholder="G" className="w-16 bg-gray-100" />
                </div>
              </div>
            ))}
          </div>

          {/* Payment */}
          <div>
            <h3 className="font-bold text-sm mt-4">Payment</h3>
            <p className="text-sm mb-1">ရွေးချယ်မှု</p>
            <div className="flex gap-2 mb-2">
              <Input placeholder="K" className="w-16 bg-gray-100" />
              <Input placeholder="P" className="w-16 bg-gray-100" />
              <Input placeholder="Y" className="w-16 bg-gray-100" />
              <Input placeholder="G" className="w-16 bg-gray-100" />
            </div>
            <p className="text-sm mb-1">Cash</p>
            <Input placeholder="ငွေပမာဏ" className="w-64 bg-gray-100" />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-4">
            <Button variant="outline" className="bg-gray-100 text-gray-700">Cancel</Button>
            <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">Add</Button>
          </div>
        </div>

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
            <table className="w-full border text-sm text-center">
              <thead>
                <tr>
                  <th className="border p-1">No.</th>
                  <th className="border p-1">Product</th>
                  <th className="border p-1">Qty</th>
                  <th className="border p-1">အလေးချိန်</th>
                  <th className="border p-1">လက်ဝတ်</th>
                  <th className="border p-1">ရွှေချိန်</th>
                  <th className="border p-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {/* Example row */}
                <tr>
                  <td className="border p-1">1</td>
                  <td className="border p-1">Ring</td>
                  <td className="border p-1">2</td>
                  <td className="border p-1">K P Y G</td>
                  <td className="border p-1">ကျပ်</td>
                  <td className="border p-1">ရွှေ</td>
                  <td className="border p-1">500</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="text-sm text-right mt-4 space-y-1">
            <p>Total</p>
            <p>Discount</p>
            <p className="font-semibold">Net Amount</p>
            <p>24 K</p>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" className="bg-gray-100 text-gray-700">Cancel</Button>
            <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">Print</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default POS;
