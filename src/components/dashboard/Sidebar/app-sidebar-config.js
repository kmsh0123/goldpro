import { BanknoteArrowDownIcon, BanknoteArrowUpIcon, CalendarCogIcon, ChartBar,CircleMinusIcon,CirclePlusIcon,ClipboardCopyIcon,ClipboardListIcon,CoinsIcon,FileTextIcon, Home as HomeIcon, Package, ShoppingCartIcon } from "lucide-react";

const SidebarConfig = [
{
    title: "Dashboard",
    url : "/",
    icon : HomeIcon,
    collapsible: false,
},
{
    title: "Inventory",
    icon : Package,
    collapsible: true,
    items: [
        {
            title: "Type",
            url: "/inventory/type",
        },
        {
            title: "Quality",
            url: "/inventory/quality",
        },
        {
            title: "Category",
            url: "/inventory/category",
        },
        {
            title: "Product",
            url: "/inventory/product",
        },
    ],
},
{
    title: "Sale",
    icon : ChartBar,
    collapsible: true,
    items: [
        {
            title: "Point of Sale",
            url: "/sale/pos",
        },
        {
            title: "Sale List",
            url: "/sale/sale-list",
        },
        // {
        //     title: "Sale Report",
        //     url: "/sale/sale-report",
        // }, 
        // {
        //     title: "Sale Detail List",
        //     url: "/sale/sale-detail/",
        // },
        {
            title: "Customer List",
            url: "/sale/customer-list",
        },
    ],
},
{
    title: "Purchase",
    icon : ShoppingCartIcon,
    collapsible: true,
    items: [
        {
            title: "Purchse System",
            url: "/purchase/purchase-system",
        },
        {
            title: "Purchase List",
            url: "/purchase/purchase-list",
        },
        // {
        //     title: "Purchase Report",
        //     url: "/purchase/purchase-report",
        // },
        {
            title: "Supplier List",
            url: "/purchase/supplier-list",
        },
    ],
},
{
    title: "Stocks",
    url : "/stocks/stock-list",
    icon : CalendarCogIcon,
    collapsible: false,
},
{
    title: "Reports",
    icon : ClipboardListIcon,
    collapsible: true,
    items: [
        {
            title: "Sale Report",
            url: "/reports/report-sale",
        },
        {
            title: "Purchase Report",
            url: "/reports/report-purchase",
        },
        {
            title: "Profit & Loss Report",
            url: "/reports/profit-loss-report",
        },
        {
            title: "Expense Report",
            url: "/reports/expense-report",
        },
    ],
},
{
    title: "Payments",
    icon : CoinsIcon,
    collapsible: true,
    items: [
         {
            title: "Payment Category",
            url: "/payment/payment-category-list",
        },
        {
            title: "Payment List",
            url: "/payment/payment-list",
        },
        // {
        //     title: "Profit & Loss Report",
        //     url: "/Expenses/profit-loss-report",
        // },
        // {
        //     title: "Expense Report",
        //     url: "/Expenses/expense-report",
        // },
    ],
},
{
    title: "Expenses",
    icon : BanknoteArrowDownIcon,
    collapsible: true,
    items: [
         {
            title: "Expense Category",
            url: "/expense/expense-category-list",
        },
        {
            title: "Expense List",
            url: "/expense/expense-list",
        },
        // {
        //     title: "Profit & Loss Report",
        //     url: "/Expenses/profit-loss-report",
        // },
        // {
        //     title: "Expense Report",
        //     url: "/Expenses/expense-report",
        // },
    ],
},

{
    title: "Incomes",
    icon : BanknoteArrowUpIcon,
    collapsible: true,
    items: [
         {
            title: "Income Category",
            url: "/income/income-category-list",
        },
        {
            title: "Income List",
            url: "/income/income-list",
        },
        // {
        //     title: "Profit & Loss Report",
        //     url: "/Expenses/profit-loss-report",
        // },
        // {
        //     title: "Expense Report",
        //     url: "/Expenses/expense-report",
        // },
    ],
},
]

export default SidebarConfig;