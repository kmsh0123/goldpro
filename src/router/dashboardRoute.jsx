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
import COA from "@/pages/dashboard/coa/COA.jsx";
import CreateType from "@/pages/dashboard/inventory/Type/CreateType.jsx";
import CreateQuality from "@/pages/dashboard/inventory/Quality/CreateQuality.jsx";
import CreateCategory from "@/pages/dashboard/inventory/Category/CreateCategory.jsx";
import CreateProduct from "@/pages/dashboard/inventory/Product/CreateProduct.jsx";
import Stock from "@/pages/dashboard/stock/Stock.jsx";
import CreateCustomer from "@/pages/dashboard/sale/Customer/CreateCustomer.jsx";
import CreateCOA from "@/pages/dashboard/coa/CreateCOA.jsx";
import COADetail from "@/pages/dashboard/coa/coa_detail/COA-detail.jsx";
import CreateCOADetail from "@/pages/dashboard/coa/coa_detail/CreateCOA-detail.jsx";
import EditCOA from "@/pages/dashboard/coa/EditCOA.jsx";
import UpdateType from "@/pages/dashboard/inventory/Type/UpdateType.jsx";
import UpdateQuality from "@/pages/dashboard/inventory/Quality/UpdateQuality.jsx";
import UpdateCategory from "@/pages/dashboard/inventory/Category/UpdateCategory.jsx";
import path from "path";
import ProductDetailPage from "@/pages/dashboard/inventory/Product/ProductDetail.jsx";
import SaleListDetail from "@/pages/dashboard/sale/Customer/SaleListDetail.jsx";
import UpdateProduct from "@/pages/dashboard/inventory/Product/UpdateProduct.jsx";

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
      {
        path : "/coa/coa-list",
        element: <COA />,
      },
      {
        path : "/coa/coa-create",
        element: <CreateCOA />,
      },
      {
        path : "/coa/coa-edit/:id",
        element: <EditCOA />,
      },
      {
        path : "/coa/coa-detail/:id",
        element: <COADetail />,
      },
      {
        path : "/coa/coa-detail-create",
        element: <CreateCOADetail />,
      },

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
