import React from "react";
import { ChevronLeftIcon, Pencil, SquarePenIcon, Trash2Icon } from "lucide-react";
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetProductQuery } from "@/feature/api/inventory/productApi";
import PaginatedTable from "@/components/dashboard/ResuableComponents/PaginatedTable";
import { useGetCustomerQuery } from "@/feature/api/saleApi/customerApi";
import usePaginatedList from "@/hooks/usePaginatedList";
import { useDeleteCashierMutation, useGetCashierQuery } from "@/feature/api/saleApi/cashierApi";
import { exportToPDF } from "@/lib/exportToPDF";
import { getCSVExportConfig } from "@/lib/exportToCSV";
import { confirmDelete } from "@/lib/confirmDelete";

const CashierList = () => {
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
  } = usePaginatedList({ queryHook: useGetCashierQuery, limit: 10 });

  const [deleteCashier, { isLoading: isDeleting }] = useDeleteCashierMutation();
  
    // Handle delete with SweetAlert2
    const handleDelete = async (id, name) => {
      const result = await confirmDelete(name);
      if (result) {
        await deleteCashier(id).unwrap();
      }
    };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
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

  const csvHeaders = [
    { label: "No.", key: "no" },
    { label: "Created Date", key: "created_at" },
    { label: "Type Name", key: "name" },
  ];

  // Prepare CSV data
  const csvData =
    currentPageData?.map((item, index) => ({
      no: (page - 1) * limit + index + 1,
      created_at: new Date(item.created_at)?.toLocaleString("en-MM"),
      // expense_cat_id: getCategoryName(item.expense_cat_id),
      name: item.name || "-",
      // payment_cat_id: item.payment_cat_id || "-",
      // expense_amount: item.expense_amount || "-",
      // expense_note: item.expense_note || "-",
      // expense_for: item.expense_for || "-",
    })) || [];

  // Build CSV Config (Reusable Utility)
  const csvConfig = getCSVExportConfig(csvData, csvHeaders, "expense.csv");

  const handleExportPDF = () => {
    const columns = ["No.", "Created Date", "Type Name"];
    const rows = csvData.map((d) => [
      d.no,
      d.created_at,
      d.name,
      // d.expense_amount,
      // d.expense_note,
    ]);

    exportToPDF({
      title: "Type List",
      columns,
      rows,
      fileName: "type.pdf",
    });
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Cashier List</h1>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {totalItems} cashiers
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg border">
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Search cashier..."
            className="w-full sm:w-64 rounded-lg border-gray-300"
          />
        </div>
        <Button className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg">
          <Link
            to="/sale/cashier-list/create"
            className="flex items-center gap-2"
          >
            + Create New Cashier
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <PaginatedTable
          columns={["No.", "Date", "Cashier Name", "Actions"]}
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
                {formatDate(item?.created_at)}
              </td>
              <td className="py-3 px-4 text-center font-medium">
                {item.cashier_name}
              </td>
              {/* <td className="py-3 px-4 text-center font-medium">{item.remaining_gram}</td> */}
              <td className="py-3 px-4">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() =>
                      navigate(`/sale/cashier-list/update/${item.id}`)
                    }
                    title="Edit Cashier"
                  >
                    <SquarePenIcon size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(item.id, item.cashier_name)}
                    disabled={isDeleting}
                    title="Delete Cashier"
                  >
                    <Trash2Icon size={18} />
                  </Button>
                </div>
              </td>
            </tr>
          )}
        />
      </div>
    </div>
  );
};

export default CashierList;
