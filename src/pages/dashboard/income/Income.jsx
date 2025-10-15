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
  useDeleteIncomeMutation,
  useGetDetailIncomeQuery,
  useGetIncomeQuery,
} from "@/feature/api/incomeApi/incomeApi";
import { getCSVExportConfig } from "@/lib/exportToCSV";
import { exportToPDF } from "@/lib/exportToPDF";
import ExportButtons from "@/components/dashboard/ResuableComponents/ExportButtons";
import DateRangePicker from "@/components/dashboard/ResuableComponents/DateRangePicker";

export default function Income() {
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
  } = usePaginatedList({ queryHook: useGetIncomeQuery, limit: 10 });

  // Delete mutation
  const [deleteIncome, { isLoading: isDeleting }] = useDeleteIncomeMutation();

  const displayData = isFiltered ? filteredData : currentPageData;

  // Handle delete with SweetAlert2
  const handleDelete = async (id, name) => {
    const result = await confirmDelete(name);
    if (result) {
      await deleteIncome(id).unwrap();
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const csvHeaders = [
    { label: "No.", key: "no" },
    { label: "Income Date", key: "income_date" },
    { label: "Income Category Name", key: "income_for" },
    { label: "Income Amount", key: "income_amount" },
    { label: "Income Category Note", key: "income_note" },
  ];

  // Prepare CSV data
  const csvData =
    currentPageData?.map((item, index) => ({
      no: (page - 1) * limit + index + 1,
      income_date: new Date(item.income_date)?.toLocaleString("en-MM"),
      // income_cat_id: getCategoryName(item.income_cat_id),
      income_for: item.income_for || "-",
      payment_cat_id: item.payment_cat_id || "-",
      income_amount: item.income_amount || "-",
      income_note: item.income_note || "-",
      // income_for: item.income_for || "-",
    })) || [];

  // Build CSV Config (Reusable Utility)
  const csvConfig = getCSVExportConfig(csvData, csvHeaders, "income.csv");

  const handleExportPDF = () => {
    const columns = [
      "No.",
      "Income Date",
      "Income Category Name",
      "Income Amount",
      "Income Category Note",
    ];
    const rows = csvData.map((d) => [
      d.no,
      d.income_date,
      d.income_for,
      d.income_amount,
      d.income_note,
    ]);

    exportToPDF({
      title: "Income List",
      columns,
      rows,
      fileName: "income.pdf",
    });
  };

  const handleDateChange = (range) => {
    if (!range) {
      setFilteredData([]);
      setIsFiltered(false);
      return;
    }

    const from = new Date(range.from);
    from.setHours(0, 0, 0, 0);

    const to = new Date(range.to);
    to.setHours(23, 59, 59, 999);

    const baseData = displayData?.length ? displayData : currentPageData || [];

   const filtered = baseData?.filter((item) => {
    const rawDate = item.income_date || item.created_at;
    if (!rawDate) return false;

   const date = new Date(rawDate);
    if (isNaN(date)) return false;
    return date >= from && date <= to;
  });

    setFilteredData(filtered);
    setIsFiltered(true);
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
          <h1 className="text-2xl font-bold text-gray-900">Income List</h1>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {totalItems} income list
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
          />
        </div>
        <div>
          <DateRangePicker label="Filter by Date" onChange={handleDateChange} />
        </div>
          </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Button className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg">
            <Link
              to="/income/income-list/create"
              className="flex items-center gap-2"
            >
              + Create New Icome List
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
            "Income Date",
            "Income Category Name",
            "Income Amount",
            "Income Category Note",
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
                {formatDate(item.income_date)}
              </td>
              <td className="py-3 px-4 text-center font-medium">
                {item?.income_for}
              </td>
              <td className="py-3 px-4 text-center font-medium">
                {Number(item?.income_amount)?.toLocaleString()}
              </td>
              <td className="py-3 px-4 text-center font-medium">
                {item?.income_note}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() =>
                      navigate(`/income/income-list/update/${item.id}`)
                    }
                    title="Edit type"
                  >
                    <SquarePenIcon size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(item.id, item.income_for)}
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
