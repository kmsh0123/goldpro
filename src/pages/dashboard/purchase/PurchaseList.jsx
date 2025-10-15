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
import { useGetPurchaseQuery } from "@/feature/api/purchaseApi/purchaseApi";
import { getCSVExportConfig } from "@/lib/exportToCSV";
import ExportButtons from "@/components/dashboard/ResuableComponents/ExportButtons";
import usePaginatedList from "@/hooks/usePaginatedList";
import { exportToPDF } from "@/lib/exportToPDF";

// const data = [
//   { id: 1, date: "6/6/2025", name: "Gold", quality : "24K", gram: "10g", price: "$500" },
//   { id: 2, date: "6/6/2025", name: "Silver" ,quality : "24K", gram: "10g", price: "$500"},
//   { id: 3, date: "6/6/2025", name: "Platinum" ,quality : "24K", gram: "10g", price: "$500"},
//   { id: 4, date: "6/6/2025", name: "Diamond" , quality : "24K", gram: "10g", price: "$500"},
// ];

const PurchaseList = () => {
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
  } = usePaginatedList({ queryHook: useGetPurchaseQuery, limit: 10 });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const csvHeaders = [
    { label: "No.", key: "no" },
    { label: "Supplier", key: "supplier" },
    { label: "Voucher Code", key: "voucher_no" },
    { label: "Purchase Code", key: "purchase_code" },
    { label: "Quantity", key: "total_quantity" },
    { label: "Sale Date", key: "purchase_date" },
  ];

  // Prepare CSV data
  const csvData =
    currentPageData?.map((item, index) => ({
      no: (page - 1) * limit + index + 1,
      purchase_date: new Date(item.purchase_date)?.toLocaleString("en-MM"),
      // expense_cat_id: getCategoryName(item.expense_cat_id),
      supplier: item.supplier || "-",
      voucher_no: item.voucher_no || "-",
      purchase_code: item.purchase_code || "-",
      total_quantity: item.total_quantity || "-",
      // purchase_date: item.purchase_date || "-",
      // expense_for: item.expense_for || "-",
    })) || [];

  // Build CSV Config (Reusable Utility)
  const csvConfig = getCSVExportConfig(csvData, csvHeaders, "saleList.csv");

  const handleExportPDF = () => {
    const columns = [
      "No.",
      "supplier",
      "Voucher Code",
      "Purchase Code",
      "Quantity",
      "Sale Date",
    ];
    const rows = csvData.map((d) => [
      d.no,
      d.supplier,
      d.voucher_no,
      d.purchase_code,
      d.total_quantity,
      d.purchase_date,
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
    <div className="space-y-4 p-6">
      {/* Top Bar */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
        <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon />
        </span>
        Sale List
      </h1>

      <div className="border-b-2"></div>

      {/* Search */}
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

      <div className="border-b-2"></div>

      {/* Table */}
      {/* <Card className="overflow-hidden p-5"> */}
      <div className="bg-white rounded-lg border">
        <PaginatedTable
          columns={[
            "No.",
            "supplier",
            "Voucher Code",
            "purchase Code",
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
                {item.supplier}
              </td>
              <td className="py-3 px-4 text-center font-medium">
                {item.voucher_no}
              </td>
              <td className="py-3 px-4 text-center font-medium">
                {item.purchase_code}
              </td>
              <td className="py-3 px-4 text-center font-medium">
                {item.total_quantity}
              </td>
              <td className="py-3 px-4 text-center font-medium">
                {formatDate(item.purchase_date)}
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

export default PurchaseList;
