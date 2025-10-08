import NotFound from "@/pages/dashboard/NotFound.jsx";
import Layout from "../components/dashboard/Layout.jsx";
import Home from "@/pages/dashboard/Home.jsx";
import { Home as HomeIcon, Calendar } from "lucide-react";
import Inventory from "@/pages/dashboard/Category.jsx";
import Type from "@/pages/dashboard/inventory/Type/Type.jsx";
import Quality from "@/pages/dashboard/inventory/Quality/Quality.jsx";
import Category from "@/pages/dashboard/inventory/Category/Category.jsx";
import Product from "@/pages/dashboard/inventory/Product/Product.jsx";
import POS from "@/pages/dashboard/sale/Customer/POS/POS.jsx";
import SaleList from "@/pages/dashboard/sale/SaleList.jsx";
import SaleReport from "@/pages/dashboard/sale/SaleReport.jsx";
import CustomerList from "@/pages/dashboard/sale/Customer/CustomerList.jsx";
import PurchaseSystem from "@/pages/dashboard/purchase/POS/PurchaseSystem.jsx";
import PurchaseList from "@/pages/dashboard/purchase/PurchaseList.jsx";
import PurchaseReport from "@/pages/dashboard/purchase/PurchaseReport.jsx";
import DailyPurchaseReport  from "@/pages/dashboard/reports/DailyPurchaseReport.jsx";
import SupplierList from "@/pages/dashboard/purchase/SupplierList.jsx";
import DailyReport from "@/pages/dashboard/reports/DailyReport.jsx";
import ProfitLossReport from "@/pages/dashboard/reports/ProfitLossReport.jsx";
import ExpenseReport from "@/pages/dashboard/reports/ExpenseReport.jsx";
import CreateType from "@/pages/dashboard/inventory/Type/CreateType.jsx";
import CreateQuality from "@/pages/dashboard/inventory/Quality/CreateQuality.jsx";
import CreateCategory from "@/pages/dashboard/inventory/Category/CreateCategory.jsx";
import CreateProduct from "@/pages/dashboard/inventory/Product/CreateProduct.jsx";
import Stock from "@/pages/dashboard/stock/Stock.jsx";
import CreateCustomer from "@/pages/dashboard/sale/Customer/CreateCustomer.jsx";
import UpdateType from "@/pages/dashboard/inventory/Type/UpdateType.jsx";
import UpdateQuality from "@/pages/dashboard/inventory/Quality/UpdateQuality.jsx";
import UpdateCategory from "@/pages/dashboard/inventory/Category/UpdateCategory.jsx";
import path from "path";
import ProductDetailPage from "@/pages/dashboard/inventory/Product/ProductDetail.jsx";
import SaleListDetail from "@/pages/dashboard/sale/Customer/SaleListDetail.jsx";
import UpdateProduct from "@/pages/dashboard/inventory/Product/UpdateProduct.jsx";
import Expense from "@/pages/dashboard/expense/Expense.jsx";
import CreateExpense from "@/pages/dashboard/expense/CreateExpense.jsx";
import CreateExpenseCategory from "@/pages/dashboard/expenseCategory/CreateExpenseCategory.jsx";
import ExpenseCategory from "@/pages/dashboard/expenseCategory/ExpenseCategory.jsx";
import Income from "@/pages/dashboard/income/Income.jsx";
import IncomeCategory from "@/pages/dashboard/incomeCategory/IncomeCategory.jsx";
import Payment from "@/pages/dashboard/payment/Payment.jsx";
import CreateIncomeCategory from "@/pages/dashboard/incomeCategory/CreateIncomeCategory.jsx";
import PaymentCategory from "@/pages/dashboard/paymentCategory/PaymentCategory.jsx";
import CreatePaymentCategory from "@/pages/dashboard/paymentCategory/CreatePaymentCategory.jsx";
import UpdatePaymentCategory from "@/pages/dashboard/paymentCategory/UpdatePaymentCategory.jsx";
import CreatePayment from "@/pages/dashboard/payment/CreatePayment.jsx";
import UpdatePayment from "@/pages/dashboard/payment/UpdatePayment.jsx";
import UpdateExpenseCategory from "@/pages/dashboard/expenseCategory/UpdateExpenseCategory.jsx";
import UpdateIncomeCategory from "@/pages/dashboard/incomeCategory/UpdateIncomeCategory.jsx";
import UpdateExpense from "@/pages/dashboard/expense/UpdateExpense.jsx";
import CreateIncome from "@/pages/dashboard/income/CreateIncome.jsx";
import UpdateIncome from "@/pages/dashboard/income/UpdateIncome.jsx";

const dashboardRoute = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
       {
        index: true,
        element: <Home />,
      },
      // {
      //   path: "/dashboard",
      //   element: <Home />,
      // },
       // Expense
      {
        path: "/expense/expense-list",
        element: <Expense/>,
      },
      {
        path: "/expense/expense-list/create",
        element: <CreateExpense/>,
      },
      {
        path: "/expense/expense-list/update/:id",
        element: <UpdateExpense/>,
      },
      // {
      //   path: "/expense/quality",
      //   element: <Quality />,
      // },
      // {
      //   path: "/expense/quality/create",
      //   element: <CreateQuality/>,
      // },
      // {
      //   path: "/expense/quality/update/:id",
      //   element: <UpdateQuality/>,
      // },
      {
        path: "/expense/expense-category-list",
        element: <ExpenseCategory />,
      },
      {
        path: "/expense/expense-category-list/create",
        element: <CreateExpenseCategory/>,
      },
      {
        path: "/expense/expense-category-list/update/:id",
        element: <UpdateExpenseCategory/>,
      },
      {
        path: "/expense/category/update/:id",
        element: <UpdateCategory/>,
      },
      {
        path: "/expense/product",
        element: <Product />,
      },
      {
        path: "/expense/product/create",
        element: <CreateProduct/>,
      },
      {
        path: "/expense/product/detail/:id",
        element: <ProductDetailPage/>,
      },
      {
        path: "/expense/product/update/:id",
        element: <UpdateProduct/>,
      },
      // Expense

      //Payment

       {
        path: "/payment/payment-list",
        element: <Payment/>,
      },
      {
        path: "/payment/payment-list/create",
        element: <CreatePayment/>,
      },
      {
        path: "/payment/payment-list/update/:id",
        element: <UpdatePayment/>,
      },
      // {
      //   path: "/expense/quality",
      //   element: <Quality />,
      // },
      // {
      //   path: "/expense/quality/create",
      //   element: <CreateQuality/>,
      // },
      // {
      //   path: "/expense/quality/update/:id",
      //   element: <UpdateQuality/>,
      // },
      {
        path: "/payment/payment-category-list",
        element: <PaymentCategory/>,
      },
      {
        path: "/payment/payment-category-list/create",
        element: <CreatePaymentCategory/>,
      },
      {
        path: "/payment/payment-category-list/update/:id",
        element: <UpdatePaymentCategory/>,
      },
      {
        path: "/expense/product",
        element: <Product />,
      },
      {
        path: "/expense/product/create",
        element: <CreateProduct/>,
      },
      {
        path: "/expense/product/detail/:id",
        element: <ProductDetailPage/>,
      },
      {
        path: "/expense/product/update/:id",
        element: <UpdateProduct/>,
      },

      //Payment


        // Income
      {
        path: "/income/income-list",
        element: <Income/>,
      },
      {
        path: "/income/income-list/create",
        element: <CreateIncome/>,
      },
      {
        path: "/income/income-list/update/:id",
        element: <UpdateIncome/>,
      },
      // {
      //   path: "/expense/type/update/:id",
      //   element: <UpdateType/>,
      // },
      // {
      //   path: "/expense/quality",
      //   element: <Quality />,
      // },
      // {
      //   path: "/expense/quality/create",
      //   element: <CreateQuality/>,
      // },
      // {
      //   path: "/expense/quality/update/:id",
      //   element: <UpdateQuality/>,
      // },
      {
        path: "/income/income-category-list",
        element: <IncomeCategory/>,
      },
      {
        path: "/income/income-category-list/create",
        element: <CreateIncomeCategory/>,
      },
      {
        path: "/income/income-category-list/update/:id",
        element: <UpdateIncomeCategory/>,
      },
      {
        path: "/expense/product",
        element: <Product />,
      },
      {
        path: "/expense/product/create",
        element: <CreateProduct/>,
      },
      {
        path: "/expense/product/detail/:id",
        element: <ProductDetailPage/>,
      },
      {
        path: "/expense/product/update/:id",
        element: <UpdateProduct/>,
      },
      // Income
      // Inventory
      {
        path: "/inventory/type",
        element: <Type />,
      },
      {
        path: "/inventory/type/create",
        element: <CreateType/>,
      },
      {
        path: "/inventory/type/update/:id",
        element: <UpdateType/>,
      },
      {
        path: "/inventory/quality",
        element: <Quality />,
      },
      {
        path: "/inventory/quality/create",
        element: <CreateQuality/>,
      },
      {
        path: "/inventory/quality/update/:id",
        element: <UpdateQuality/>,
      },
      {
        path: "/inventory/category",
        element: <Category />,
      },
      {
        path: "/inventory/category/create",
        element: <CreateCategory/>,
      },
      {
        path: "/inventory/category/update/:id",
        element: <UpdateCategory/>,
      },
      {
        path: "/inventory/product",
        element: <Product />,
      },
      {
        path: "/inventory/product/create",
        element: <CreateProduct/>,
      },
      {
        path: "/inventory/product/detail/:id",
        element: <ProductDetailPage/>,
      },
      {
        path: "/inventory/product/update/:id",
        element: <UpdateProduct/>,
      },
      // Inventory

      // SaleList
      {
        path: "/sale/sale-list",
        element: <SaleList />,
      },
      // {
      //   path: "/sale/sale-report",
      //   element: <SaleReport />,
      // },
      {
        path: "/sale/sale-list/detail/:id",
        element: <SaleListDetail />,
      },
      {
        path: "/sale/customer-list",
        element: <CustomerList />,
      },
       {
        path: "/sale/customer-list/create",
        element: <CreateCustomer/>,
      },
      // SaleList

      // PurchaseList
      {
        path: "/purchase/purchase-list",
        element: <PurchaseList />,
      },
      {
        path: "/purchase/purchase-report",
        element: <PurchaseReport />,
      },
      {
        path: "/purchase/supplier-list",
        element: <SupplierList />,
      },
      {
        path: "/purchase/supplier-list/create",
        element: <SupplierList />,
      },
      // PurchaseList

      //StockList
      {
        path: "/stocks/stock-list",
        element: <Stock />,
      },
      //StockList

      //ReportList
      {
        path: "/reports/report-sale",
        element: <DailyReport />,
      },
      {
        path: "/reports/report-purchase",
        element: <DailyPurchaseReport />,
      },
      {
        path: "/reports/profit-loss-report",
        element: <ProfitLossReport />,
      },
      {
        path: "/reports/expense-report",
        element: <ExpenseReport />,
      },
      //ReportList

      //COA
      // {
      //   path : "/payment/payment-list",
      //   element: <Payment />,
      // },
      // {
      //   path : "/coa/coa-create",
      //   element: <CreateCOA />,
      // },
      // {
      //   path : "/coa/coa-edit/:id",
      //   element: <EditCOA />,
      // },
      // {
      //   path : "/coa/coa-detail/:id",
      //   element: <COADetail />,
      // },
      // {
      //   path : "/coa/coa-detail-create",
      //   element: <CreateCOADetail />,
      // },

      //COA


    ],
  },
  //SaleList
  {
        path: "/sale/pos",
        element: <POS />,
  },
  //SaleList

  //PurchaseList

  {
        path: "/purchase/purchase-system",
        element: <PurchaseSystem />,
  }

  //PurchaseList


];

export default dashboardRoute;
