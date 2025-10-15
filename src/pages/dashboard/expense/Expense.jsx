import React, { useState } from "react";
import { ChevronLeftIcon, SquarePenIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PaginatedTable from "@/components/dashboard/ResuableComponents/PaginatedTable";
import { useDeleteTypeMutation } from "@/feature/api/inventory/typeApi";
import usePaginatedList from "@/hooks/usePaginatedList";
import { confirmDelete } from "@/lib/confirmDelete";
import {
  useDeleteExpenseMutation,
  useGetExpenseQuery,
} from "@/feature/api/expenseApi/expenseApi";
import { getCSVExportConfig } from "@/lib/exportToCSV";
import { exportToPDF } from "@/lib/exportToPDF";
import ExportButtons from "@/components/dashboard/ResuableComponents/ExportButtons";
import { useGetExpenseCategoryQuery } from "@/feature/api/expenseCategory/expenseCategory";
import DateRangePicker from "@/components/dashboard/ResuableComponents/DateRangePicker";

export default function Expense() {
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [searchText, setSearchText] = useState("");
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
  } = usePaginatedList({ queryHook: useGetExpenseQuery, limit: 10 });

  // Delete mutation
  const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseMutation();

  const displayData = isFiltered ? filteredData : currentPageData;

  // Handle delete with SweetAlert2
  const handleDelete = async (id, name) => {
    const result = await confirmDelete(name);
    if (result) {
      await deleteExpense(id).unwrap();
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const csvHeaders = [
    { label: "No.", key: "no" },
    { label: "Expense Date", key: "expense_date" },
    { label: "Expense Category Name", key: "expense_for" },
    { label: "Expense Amount", key: "expense_amount" },
    { label: "Expense Category Note", key: "expense_note" },
  ];

  // Prepare CSV data
  const csvData =
    currentPageData?.map((item, index) => ({
      no: (page - 1) * limit + index + 1,
      expense_date: new Date(item.expense_date)?.toLocaleString("en-MM"),
      // expense_cat_id: getCategoryName(item.expense_cat_id),
      expense_for: item.expense_for || "-",
      payment_cat_id: item.payment_cat_id || "-",
      expense_amount: item.expense_amount || "-",
      expense_note: item.expense_note || "-",
      // expense_for: item.expense_for || "-",
    })) || [];

  // Build CSV Config (Reusable Utility)
  const csvConfig = getCSVExportConfig(csvData, csvHeaders, "expense.csv");

  const handleExportPDF = () => {
    const columns = [
      "No.",
      "Expense Date",
      "Expense Category Name",
      "Expense Amount",
      "Expense Category Note",
    ];
    const rows = csvData.map((d) => [
      d.no,
      d.expense_date,
      d.expense_for,
      d.expense_amount,
      d.expense_note,
    ]);

    exportToPDF({
      title: "Expense List",
      columns,
      rows,
      fileName: "expense.pdf",
    });
  };

   const handleDateChange = (range) => {
    if (!range) {
      setFilteredData([]);
      setIsFiltered(false);
      return;
    }

    const from = new Date(range.from);
    const to = new Date(range.to);
    to.setHours(23, 59, 59, 999);

    let filtered = displayData?.filter((item) => {
      const createdAt = new Date(item.created_at);
      return createdAt >= from && createdAt <= to;
    });

     if (searchText.trim() !== "") {
    filtered = filtered.filter((item) =>
      item.expense_for.toLowerCase().includes(searchText.toLowerCase())
    );
  }

    setFilteredData(filtered);
    setIsFiltered(true);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    // Apply filtering
    const filtered = currentPageData.filter((item) =>
      item.expense_for.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
    setIsFiltered(value.trim() !== "" || isFiltered); // keep filter active if search or date filter applied
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
      {/* Header Section */}
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
          <h1 className="text-2xl font-bold text-gray-900">Expense List</h1>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {totalItems} expense list
          </span>
        </div>
      </div>

      {/* Search and Create Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center gap-5">
                  <div className="w-full sm:w-auto">
                    <Input
                      placeholder="Search types..."
                      className="w-full sm:w-64 rounded-lg border-gray-300"
                      value={searchText}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <div>
                    <DateRangePicker
                      label="Filter by Date"
                      onChange={handleDateChange}
                    />
                  </div>
                </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Button className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg">
            <Link
              to="/expense/expense-list/create"
              className="flex items-center gap-2"
            >
              + Create New Expense List
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

      {/* Table Section */}
      <div className="bg-white rounded-lg border shadow-sm">
        <PaginatedTable
          columns={[
            "No.",
            "Expense Date",
            "Expense Category Name",
            "Expense Amount",
            "Expense Category Note",
            "Actions",
          ]}
          data={isFiltered ? filteredData : currentPageData || []}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          renderRow={(item, index) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="py-3 px-4 text-center">
                {(page - 1) * limit + index + 1}
              </td>
              <td className="py-3 px-4 text-center">
                {formatDate(item.expense_date)}
              </td>
              <td className="py-3 px-4 text-center font-medium">
                {item?.expense_for}
              </td>
              <td className="py-3 px-4 text-center font-medium">
                {Number(item?.expense_amount)?.toLocaleString()}
              </td>
              <td className="py-3 px-4 text-center font-medium">
                {item?.expense_note}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() =>
                      navigate(`/expense/expense-list/update/${item.id}`)
                    }
                    title="Edit type"
                  >
                    <SquarePenIcon size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(item.id, item.expense_for)}
                    disabled={isDeleting}
                    title="Delete type"
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
}
