import React from "react";
import {
  ArrowUpFromDotIcon,
  ArrowUpFromLineIcon,
  ChevronLeftIcon,
  EyeIcon,
  FilePenLineIcon,
  ImageIcon,
  Pencil,
  SquarePenIcon,
  Trash2Icon,
  Type,
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
import PaginatedTable from "@/components/dashboard/ResuableComponents/PaginatedTable";
import { useGetOrderQuery } from "@/feature/api/posApi/posApi";
import usePaginatedList from "@/hooks/usePaginatedList";
import { exportToPDF } from "@/lib/exportToPDF";
import { getCSVExportConfig } from "@/lib/exportToCSV";
import ExportButtons from "@/components/dashboard/ResuableComponents/ExportButtons";

const SaleReport = () => {
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
  } = usePaginatedList({ queryHook: useGetOrderQuery, limit: 10 });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const csvHeaders = [
    { label: "No.", key: "no" },
    { label: "Customer", key: "customer" },
    { label: "Voucher Code", key: "voucher_no" },
    { label: "Order Code", key: "order_code" },
    { label: "Quantity", key: "total_quantity" },
    { label: "Sale Date", key: "order_date" },
  ];

  // Prepare CSV data
  const csvData =
    currentPageData?.map((item, index) => ({
      no: (page - 1) * limit + index + 1,
      order_date: new Date(item.order_date)?.toLocaleString("en-MM"),
      // expense_cat_id: getCategoryName(item.expense_cat_id),
      customer: item.customer || "-",
      voucher_no: item.voucher_no || "-",
      order_code: item.order_code || "-",
      total_quantity: item.total_quantity || "-",
      // order_date: item.order_date || "-",
      // expense_for: item.expense_for || "-",
    })) || [];

  // Build CSV Config (Reusable Utility)
  const csvConfig = getCSVExportConfig(csvData, csvHeaders, "saleList.csv");

  const handleExportPDF = () => {
    const columns = [
      "No.",
      "Customer",
      "Voucher Code",
      "Order Code",
      "Quantity",
      "Sale Date",
    ];
    const rows = csvData.map((d) => [
      d.no,
      d.customer,
      d.voucher_no,
      d.order_code,
      d.total_quantity,
      d.order_date,
    ]);

    exportToPDF({
      title: "Sale List",
      columns,
      rows,
      fileName: "sale-list.pdf",
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
    <div className="space-y-4">
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
          <h1 className="text-2xl font-bold text-gray-900">Sale List</h1>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {totalItems} sales
          </span>
        </div>
      </div>

      {/* Search */}
      {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg border">
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Search qualities..."
            className="w-full sm:w-64 rounded-lg border-gray-300"
          />
        </div>
        <Button className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg">
          <Link
            to="/inventory/category/create"
            className="flex items-center gap-2"
          >
            + Create New Category
          </Link>
        </Button>
      </div> */}

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer">
          <ExportButtons csvConfig={csvConfig} onPdfExport={handleExportPDF} />
        </div>
      </div>

      {/* Table */}
      {/* <Card className="overflow-hidden p-5"> */}
      <div className="bg-white rounded-lg border">
        <PaginatedTable
          columns={[
            "No.",
            "Customer",
            "Voucher Code",
            "Order Code",
            "Quantity",
            "Sale Date",
            "Actions",
          ]}
          data={currentPageData || []}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          renderRow={(item, index) => (
            <tr key={item.id}>
              <td className="py-3 px-4 text-center">
                {(page - 1) * limit + index + 1}
              </td>
              <td className="py-3 px-4 text-center font-medium">
                {item.customer}
              </td>
              <td className="py-3 px-4 text-center font-medium">
                {item.voucher_no}
              </td>
              <td className="py-3 px-4 text-center font-medium">
                {item.order_code}
              </td>
              <td className="py-3 px-4 text-center font-medium">
                {item.total_quantity}
              </td>
              <td className="py-3 px-4 text-center font-medium">
                {formatDate(item.order_date)}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#00C02A] hover:text-[#00C02A]"
                    onClick={() =>
                      navigate(`/sale/sale-list/detail/${item.id}`)
                    }
                  >
                    <EyeIcon size={30} />
                  </Button>
                </div>
              </td>
            </tr>
          )}
        />
      </div>
      {/* </Card> */}
    </div>
  );
};

export default SaleReport;
