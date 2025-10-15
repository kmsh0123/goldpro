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
import { ChevronLeftIcon, Table } from "lucide-react";
import TotalData from "./TotalData";
import Invoice from "./Invoice";
import Chart from "./Chart";
import TableChart from "./TableChart";
import ChartPercentage from "./ChartPercentage";
import { useGetOrderQuery } from "@/feature/api/posApi/posApi";
import { useGetPurchaseQuery } from "@/feature/api/purchaseApi/purchaseApi";
import { useGetExpenseQuery } from "@/feature/api/expenseApi/expenseApi";
import { useGetIncomeQuery } from "@/feature/api/incomeApi/incomeApi";

const Home = () => {
  const { data: orderList, isLoading } = useGetOrderQuery();
  const { data: PurchaseList } = useGetPurchaseQuery();
  const { data: GetExpense } = useGetExpenseQuery();
  const { data: GetIncome } = useGetIncomeQuery();

   const today = new Date().toISOString().split("T")[0];

  // Today Sale
  const todaySalesBySaleRole = orderList?.data?.filter(
    (order) => 
      order.created_at.split("T")[0] === today
  );
  
  const todayTotalSalesBySaleRole =
    todaySalesBySaleRole?.reduce((acc, item) => acc + Number(item.payment_amount || 0), 0) ||
    0;
  
  const formattedTodaySalesBySaleRole = todayTotalSalesBySaleRole.toLocaleString();

  // Today Purchase

   const todayPurchase = PurchaseList?.data?.filter(
    (order) => order.created_at.split("T")[0] === today
  );

  const todayTotalPurchase =
    todayPurchase?.reduce(
      (acc, item) => acc + Number(item.purchase_pay_amount || 0),
      0
    ) || 0;

  const formattedTodayPurchase = todayTotalPurchase.toLocaleString();

  // Today Purchase

  // Today Expense


  const todayExpense = GetExpense?.data?.filter(
    (order) => order.created_at.split("T")[0] === today
  );

  const todayTotalExpense =
    todayExpense?.reduce(
      (acc, item) => acc + Number(item.expense_amount || 0),
      0
    ) || 0;

  const formattedTodayExpense = todayTotalExpense.toLocaleString();

  // Today Expense
  // Today Income

   const todayIncome = GetIncome?.data?.filter(
    (order) => order.created_at.split("T")[0] === today
  );

  const todayTotalIncome =
    todayIncome?.reduce(
      (acc, item) => acc + Number(item.income_amount || 0),
      0
    ) || 0;

  const formattedTodayIncome = todayTotalIncome.toLocaleString();

  // Today Income


  if (isLoading) return <p>Loading...</p>;
  return (
    <div className="space-y-4 bg-[#F3F4F6] p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900">Overview</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold ">Daily Sale</h2>
            <p className=" text-sm">
              <div className="font-semibold my-1 text-3xl text-orange-500">
                {formattedTodaySalesBySaleRole}{" "}Ks
              </div>
              <span>Sold in Daily</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold ">Daily Purchase</h2>
            <p className=" text-sm">
              <div className="font-semibold my-1 text-3xl text-orange-500">
                {formattedTodayPurchase}{" "}Ks
              </div>
              <span>Purchased in Daily</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold ">Daily Income</h2>
            <p className=" text-sm">
              <div className="font-semibold my-1 text-3xl text-orange-500">
                {formattedTodayIncome}{" "}Ks
              </div>
              <span>Incomed in Daily</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold ">Daily Expense</h2>
            <p className=" text-sm">
              <div className="font-semibold my-1 text-3xl text-orange-500">
                {formattedTodayExpense}{" "}Ks
              </div>
              <span>Expensed in Daily</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* TotalData */}
      <TotalData />
      <TableChart/>
      <Invoice/>
       {orderList?.data?.map((order) => (
        <ChartPercentage key={order.id} id={`chart-${order.id}`} orderId={order.id} />
      ))}
    </div>
  );
};

export default Home;
