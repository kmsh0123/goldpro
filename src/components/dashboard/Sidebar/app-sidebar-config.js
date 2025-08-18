import { CalendarCogIcon, ChartBar,ClipboardCopyIcon,ClipboardListIcon,FileTextIcon, Home as HomeIcon, Package, ShoppingCartIcon } from "lucide-react";

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
        {
            title: "Sale Report",
            url: "/sale/sale-report",
        },
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
        {
            title: "Purchase Report",
            url: "/purchase/purchase-report",
        },
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
    title: "Charts of Accounts",
    url : "/coa/coa-list",
    icon : FileTextIcon,
    collapsible: false,
},
]

export default SidebarConfig;