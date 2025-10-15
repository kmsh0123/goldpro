import React from "react";
import {
  ArrowUpFromDotIcon,
  ArrowUpFromLineIcon,
  ChevronLeftIcon,
  EyeIcon,
  FilePenLineIcon,
  ImageIcon,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import { exportToPDF } from "@/lib/exportToPDF";
import { getCSVExportConfig } from "@/lib/exportToCSV";
import ExportButtons from "@/components/dashboard/ResuableComponents/ExportButtons";
import usePaginatedList from "@/hooks/usePaginatedList";

// const data = [
//   {
//     id: 1,
//     date: "6/6/2025",
//     name: "Gold",
//     quality: "24K",
//     gram: "10g",
//     price: "$500",
//   },
//   {
//     id: 2,
//     date: "6/6/2025",
//     name: "Silver",
//     quality: "24K",
//     gram: "10g",
//     price: "$500",
//   },
//   {
//     id: 3,
//     date: "6/6/2025",
//     name: "Platinum",
//     quality: "24K",
//     gram: "10g",
//     price: "$500",
//   },
//   {
//     id: 4,
//     date: "6/6/2025",
//     name: "Diamond",
//     quality: "24K",
//     gram: "10g",
//     price: "$500",
//   },
// ];

const Stock = () => {
  const navigate = useNavigate();
  const {
    page,
    limit,
    totalPages,
    totalItems,
    isLoading,
    isError,
    error,
    currentPageData,
    handlePageChange,
  } = usePaginatedList({ queryHook: useGetStockQuery, limit: 10 });

    // Calculate totals using reduce
  const totalSale = currentPageData?.reduce((sum, item) => sum + (Number(item.out) || 0), 0) || 0;
  const totalPurchase = currentPageData?.reduce((sum, item) => sum + (Number(item.in) || 0), 0) || 0;
  const totalRemaining = currentPageData?.reduce(
    (sum, item) => sum + (Number(item.remaining) || 0),0) || 0;


  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const csvHeaders = [
    { label: "No.", key: "no" },
    { label: "Code", key: "code" },
    { label: "Product Name", key: "product_name" },
    { label: "Gold Weight", key: "gram" },
    { label: "In Stock", key: "in" },
    { label: "Out Stock", key: "out" },
    { label: "Sale Date", key: "created_at" },
  ];

  // Prepare CSV data
  const csvData =
    currentPageData?.map((item, index) => ({
      no: (page - 1) * limit + index + 1,
      code: item.code || "-",
      product_name: item.product_name || "-",
      gram: item.gram || "-",
      in: item.in || "-",
      out: item.out || "-",
      created_at: new Date(item.created_at)?.toLocaleString("en-MM"),

    })) || [];

  // Build CSV Config (Reusable Utility)
  const csvConfig = getCSVExportConfig(csvData, csvHeaders, "quality.csv");

  const handleExportPDF = () => {
    const columns = [
      "No.",
      "Code",
      "Product Name",
      "Gold Weight",
      "In Stock",
      "Out Stock",
      "Sale Date",
    ];
    const rows = csvData.map((d) => [
      d.no,
      d.code,
      d.product_name,
      d.gram,
      d.in,
      d.out,
      d.created_at,

      // d.expense_amount,
      // d.expense_note,
    ]);

    exportToPDF({
      title: "Stock List",
      columns,
      rows,
      fileName: "Stock.pdf",
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center h-64 items-center">Loading…</div>
    );
  if (isError)
    return (
      <div className="flex justify-center h-64 items-center text-red-600">
        {error?.data?.message || "Error loading types"}
      </div>
    );

  return (
    <div className="space-y-4 p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-8 w-8"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {totalItems} stocks
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="w-full">
            <label className="block mb-1 font-medium">Product Code</label>
            <Select className>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Code" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="R">R</SelectItem>
                <SelectItem value="G">G</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <label className="block mb-1 font-medium">Type</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gold">Gold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <label className="block mb-1 font-medium">Category</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ring">Ring</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <label className="block mb-1 font-medium">Quality</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24k">24K</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* <Button className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-md">
          <Link to="/inventory/product/create" className="flex items-center gap-2">
            + Create
          </Link>
          <ArrowUpFromLineIcon />
          Export
        </Button> */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer">
          <ExportButtons csvConfig={csvConfig} onPdfExport={handleExportPDF} />
        </div>
      </div>

      <div className="border-b-2"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-2">Total Sale</h2>
            <p className="text-3xl font-bold text-orange-500">{totalSale}</p>
            <p className="mt-2 text-sm">
              <span className="font-semibold">{totalSale}</span> Sold in total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-2">Total Purchase</h2>
            <p className="text-3xl font-bold text-green-600">{totalPurchase}</p>
            <p className="mt-2 text-sm">
              <span className="font-semibold">{totalPurchase}</span> Purchased in total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-2">Total Remaining</h2>
            <p className="text-3xl font-bold text-blue-600">{totalRemaining}</p>
            <p className="mt-2 text-sm">
              <span className="font-semibold">{totalRemaining} G</span> Remaining stock
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}

      {/* Table */}
      {/* <Card className="overflow-hidden p-5"> */}
      <div className="bg-white rounded-lg border shadow-sm">
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
      </div>
      {/* </Card> */}
    </div>
  );
};

export default Stock;
