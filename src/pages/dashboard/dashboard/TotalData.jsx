import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useGetStockQuery } from "@/feature/api/stockApi/stockApi";
import PaginatedTable from "@/components/dashboard/ResuableComponents/PaginatedTable";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useGetOrderQuery } from "@/feature/api/posApi/posApi";
import { useGetPurchaseQuery } from "@/feature/api/purchaseApi/purchaseApi";
import { useGetIncomeQuery } from "@/feature/api/incomeApi/incomeApi";
import { useGetExpenseQuery } from "@/feature/api/expenseApi/expenseApi";

const TotalData = () => {
     const { data: orderList, isLoading } = useGetOrderQuery();
      const { data: PurchaseList } = useGetPurchaseQuery();
      const { data: IncomeList } = useGetIncomeQuery();
      const { data: ExpenseList } = useGetExpenseQuery();
    
       const totalSaleAmount =
        orderList?.data?.length > 0
          ? orderList?.data?.reduce(
              (acc, item) => acc + Number(item.payment_amount || 0),
              0
            )
          : 0;
    
      const formattedSaleAmount = totalSaleAmount.toLocaleString();
    
       const totalPurchseAmount =
        PurchaseList?.data?.length > 0
          ? PurchaseList?.data?.reduce(
              (acc, item) => acc + Number(item.payment_amount || 0),
              0
            )
          : 0;
    
      const formattedPurchaseAmount = totalPurchseAmount.toLocaleString();

      const totalExpenseAmount =
        ExpenseList?.data?.length > 0
          ? ExpenseList?.data?.reduce(
              (acc, item) => acc + Number(item.expense_amount || 0),
              0
            )
          : 0;
    
      const formattedExpenseAmount = totalExpenseAmount.toLocaleString();

      const totalIncomeAmount =
        IncomeList?.data?.length > 0
          ? IncomeList?.data?.reduce(
              (acc, item) => acc + Number(item.income_amount || 0),
              0
            )
          : 0;
    
      const formattedIncomeAmount = totalIncomeAmount.toLocaleString();
    
  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold ">Total Sale</h2>
            <p className=" text-sm">
              <div className="font-semibold my-1 text-3xl text-orange-500">
                {formattedSaleAmount}{" "}Ks
              </div>
              <span>Sold in Total</span>
            </p>
          </CardContent>
        </Card>

        <Card>
           <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold ">Total Purchase</h2>
            <p className=" text-sm">
              <div className="font-semibold my-1 text-3xl text-orange-500">
                {formattedPurchaseAmount}{" "}Ks
              </div>
              <span>Purchase in Total</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold ">Total Income</h2>
            <p className=" text-sm">
              <div className="font-semibold my-1 text-3xl text-orange-500">
               {formattedIncomeAmount}{" "}Ks
              </div>
              <span>Incomed in Total</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold ">Total Expense</h2>
            <p className=" text-sm">
              <div className="font-semibold my-1 text-3xl text-orange-500">
                 {formattedExpenseAmount}{" "}Ks
              </div>
              <span>Expensed in Total</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}

      {/* Table */}
      {/* <Card className="overflow-hidden p-5"> */}
      {/* <div className="bg-white rounded-lg border shadow-sm">
        <PaginatedTable
          // columns={["No.", "Voucher Code", "Name", "Quantity","Type", "Quality", "Categories", "Weight","Sale Date", "Actions"]}
          columns={[
            "No.",
            "Code",
            "Product Name",
            "Gold Weight",
            "In Stock",
            "Out Stock",
            "Sale Date",
          ]}
          data={currentPageData || []}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          renderRow={(item, index) => (
            <tr key={item.id}>
              <td className="px-4 py-2 text-center">
                {(page - 1) * limit + index + 1}
              </td>
              <td className="px-4 py-2 text-center font-medium">{item.code}</td>
              <td className="px-4 py-2 text-center font-medium">
                {item.product_name}
              </td>
              <td className="px-4 py-2 text-center font-medium">
                {item.gram || 0} g
              </td>
              <td className="px-4 py-2 text-center font-medium">
                {item.in || 0}
              </td>
              <td className="px-4 py-2 text-center font-medium">
                {item.out || 0}
              </td>
              <td className="px-4 py-2 text-center">
                {formatDate(item.created_at)}
              </td>
            </tr>
          )}
        />
      </div> */}
      {/* </Card> */}
    </div>
  );
};

export default TotalData;
