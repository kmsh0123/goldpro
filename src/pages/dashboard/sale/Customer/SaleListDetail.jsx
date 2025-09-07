import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeftIcon } from "lucide-react";

const SaleListDetail = () => {
  return (
    <div className="">
      {/* Header */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
          <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon/>
         </span>
         Sale Invoice
         </h1>

         {/* <div className="border-b-2"></div> */}

      <Card className="shadow-lg">
        <CardContent className="p-6">
          {/* Company Info */}
          <div className="flex justify-between">
            <div className="text-sm space-y-1">
              <p className="font-semibold">From</p>
              <p>လက်မူစိမ်းမောင်</p>
              <p>အမှတ်(၃၄)၊ ဗဟိုလမ်းမကြီး၊ ပင်လုံစျေးအနီး၊ City: ကမ္ဘာဦးမြို့နယ်</p>
              <p>Phone: 09799405010</p>
              <p>Email: khine25@gmail.com</p>
            </div>
            <div className="text-sm space-y-1 text-right">
              <p><span className="font-semibold">Customer Name:</span> walk-in customer</p>
              <p><span className="font-semibold">Invoice:</span> #SL0027</p>
              <p><span className="font-semibold">Date:</span> 2025-04-04 11:36:20 AM</p>
              <p><span className="font-semibold">Sale By:</span> Cashier3</p>
            </div>
          </div>

          {/* Table */}
          <div className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Item Name</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>ကိုကိုလေးမုန့်သွား (300ml)</TableCell>
                  <TableCell>1,000 Ks</TableCell>
                  <TableCell>3</TableCell>
                  <TableCell>3,000 Ks</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Totals */}
          <div className="mt-6 space-y-1 text-right text-sm">
            <p>Subtotal: <span className="font-bold">3,000 Ks</span></p>
            <p>Discount: <span className="font-bold">0 Ks</span></p>
            <p>Service Charges: <span className="font-bold">0 Ks</span></p>
            <p>Tax 10%: <span className="font-bold">300 Ks</span></p>
            <p className="text-lg">Grand Total: <span className="font-bold">3,300 Ks</span></p>
            <p className="text-lg">Pay Amount: <span className="font-bold">3,300 Ks</span></p>
            <p>Change Return: <span className="font-bold">0 Ks</span></p>
          </div>

          {/* Print Button */}
          <div className="mt-6">
            <Button>Print</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaleListDetail;
