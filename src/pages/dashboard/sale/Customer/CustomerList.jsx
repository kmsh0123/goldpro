import React from "react";
import {
  ChevronLeftIcon,
  Pencil,
  SquarePenIcon,
  Trash2Icon,
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
import {
  useDeleteCustomerMutation,
  useGetCustomerQuery,
} from "@/feature/api/saleApi/customerApi";
import { confirmDelete } from "@/lib/confirmDelete";
import { getCSVExportConfig } from "@/lib/exportToCSV";
import { exportToPDF } from "@/lib/exportToPDF";
import ExportButtons from "@/components/dashboard/ResuableComponents/ExportButtons";
import usePaginatedList from "@/hooks/usePaginatedList";

const CustomerList = () => {
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
  } = usePaginatedList({ queryHook: useGetCustomerQuery, limit: 10 });

  const [deleteCustomer, { isLoading: isDeleting }] =
    useDeleteCustomerMutation();

  const handleDelete = async (id, name) => {
    const result = await confirmDelete(name);
    if (result) {
      await deleteCustomer(id).unwrap();
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const csvHeaders = [
    { label: "No.", key: "no" },
    { label: "Date", key: "created_at" },
    { label: "Customer Name	", key: "customer_name" },
    { label: "Remain Gold Weight", key: "remaining_gram" },
  ];

  // Prepare CSV data
  const csvData =
    currentPageData?.map((item, index) => ({
      no: (page - 1) * limit + index + 1,
      created_at: new Date(item.created_at)?.toLocaleString("en-MM"),
      // expense_cat_id: getCategoryName(item.expense_cat_id),
      customer_name: item.customer_name || "-",
      remaining_gram: item.remaining_gram || "-",
      // expense_amount: item.expense_amount || "-",
      // expense_note: item.expense_note || "-",
      // expense_for: item.expense_for || "-",
    })) || [];

  // Build CSV Config (Reusable Utility)
  const csvConfig = getCSVExportConfig(csvData, csvHeaders, "customer-list.csv");

  const handleExportPDF = () => {
    const columns = ["No.", "Date", "Customer Name", "Remain Gold Weight"];
    const rows = csvData.map((d) => [
      d.no,
      d.created_at,
      d.customer_name,
      d.remaining_gram,
      // d.expense_note,
    ]);

    exportToPDF({
      title: "Customer List",
      columns,
      rows,
      fileName: "customer-list.pdf",
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
          <h1 className="text-2xl font-bold text-gray-900">Customer List</h1>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {totalItems} customer list
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg border">
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Search types..."
            className="w-full sm:w-64 rounded-lg border-gray-300"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Button className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg">
            <Link
              to="/sale/customer-list/create"
              className="flex items-center gap-2"
            >
              + Create New Customer
            </Link>
          </Button>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer">
            <ExportButtons
              csvConfig={csvConfig}
              onPdfExport={handleExportPDF}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <PaginatedTable
          columns={[
            "No.",
            "Date",
            "Customer Name",
            "Remain Gold Weight",
            "Actions",
          ]}
          data={currentPageData || []}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          renderRow={(item, index) => (
            <tr key={item.id}>
              <td>{(page - 1) * limit + index + 1}.</td>
              <td>{formatDate(item?.created_at)}</td>
              <td>{item.customer_name}</td>
              <td>{item.remaining_gram}</td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() =>
                      navigate(`/sale/customer-list/update/${item.id}`)
                    }
                    title="Edit customer"
                  >
                    <SquarePenIcon size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(item.id, item.expense_for)}
                    disabled={isDeleting}
                    title="Delete customer"
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

export default CustomerList;
