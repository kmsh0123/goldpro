import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeftIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGetOrderListDetailQuery } from "@/feature/api/posApi/posApi";

const SaleListDetail = () => {
  const {id} = useParams();
  const {data : GetOrderListDetail} = useGetOrderListDetailQuery(id);
  const orderList = GetOrderListDetail?.data || [];
  console.log("orderList:", orderList);
 return (
    <div className="p-6">
      {/* Header */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
        <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon />
        </span>
        Sale Invoice
      </h1>

      {orderList.length > 0 && (
        <Card className="shadow-lg">
          <CardContent className="p-6">
            {/* Header Info */}
            <div className="flex justify-between">
              <div className="text-sm space-y-1 text-right">
                <p>
                  <span className="font-semibold">Customer Name:</span>{" "}
                  {orderList[0].customer_name}
                </p>
                <p>
                  <span className="font-semibold">Invoice:</span> #{orderList[0].order_code}
                </p>
                <p>
                  <span className="font-semibold">Date:</span> {orderList[0].order_date}
                </p>
                {/* <p>
                  <span className="font-semibold">Sale By:</span> {orderList[0].cashier_name}
                </p> */}
              </div>
            </div>

            {/* Table */}
            <div className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead className="w-[30%]">Product Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quality</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Total Kyat</TableHead>
                    <TableHead>Total Pae</TableHead>
                    <TableHead>Total Yway</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderList.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell>{item.type_name}</TableCell>
                      <TableCell>{item.category_name}</TableCell>
                      <TableCell>{item.quality_name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.total_kyat}</TableCell>
                      <TableCell>{item.total_pae}</TableCell>
                      <TableCell>{item.total_yway}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Total Info */}
            <div className="mt-6 space-y-1 text-right text-sm">
              <p>
                <span className="font-semibold">Total Quantity:</span>{" "}
                {orderList.reduce((acc, cur) => acc + (cur.quantity || 0), 0)}
              </p>
              <p>
                <span className="font-semibold">Total Kyat:</span>{" "}
                {orderList.reduce((acc, cur) => acc + Number(cur.total_kyat || 0), 0)}
              </p>
              <p>
                <span className="font-semibold">Total Pae:</span>{" "}
                {orderList.reduce((acc, cur) => acc + Number(cur.total_pae || 0), 0)}
              </p>
              <p>
                <span className="font-semibold">Total Yway:</span>{" "}
                {orderList.reduce((acc, cur) => acc + Number(cur.total_yway || 0), 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SaleListDetail;
