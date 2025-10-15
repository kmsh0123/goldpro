import React, { useState } from "react";
import { ChevronLeftIcon, SquarePenIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import PaginatedTable from "@/components/dashboard/ResuableComponents/PaginatedTable";
import { useDeleteTypeMutation } from "@/feature/api/inventory/typeApi";
import usePaginatedList from "@/hooks/usePaginatedList";
import { confirmDelete } from "@/lib/confirmDelete";
import {
  useDeleteIncomeCateoryMutation,
  useGetIncomeCateoryQuery,
} from "@/feature/api/incomeCategory/incomeCategory";
import ExportButtons from "@/components/dashboard/ResuableComponents/ExportButtons";
import { exportToPDF } from "@/lib/exportToPDF";
import { getCSVExportConfig } from "@/lib/exportToCSV";
import DateRangePicker from "@/components/dashboard/ResuableComponents/DateRangePicker";

export default function IncomeCategory() {
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
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
  } = usePaginatedList({ queryHook: useGetIncomeCateoryQuery, limit: 10 });

  // Delete mutation
  const [deleteIncomeCategory, { isLoading: isDeleting }] =
    useDeleteIncomeCateoryMutation();

   const displayData = isFiltered ? filteredData : currentPageData;

  // Handle delete with SweetAlert2
  const handleDelete = async (id, name) => {
    const result = await confirmDelete(name);
    if (result) {
      await deleteIncomeCategory(id).unwrap();
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const csvHeaders = [
    { label: "No.", key: "no" },
    { label: "Created Date", key: "created_at" },
    { label: "Income Category", key: "income_category" },
    { label: "Income Note", key: "income_note" },
  ];

  // Prepare CSV data
  const csvData =
    displayData?.map((item, index) => ({
      no: (page - 1) * limit + index + 1,
      created_at: new Date(item.created_at)?.toLocaleString("en-MM"),
      income_category: item.income_category,
      income_note: item.income_note || "-",
    })) || [];

  // Build CSV Config (Reusable Utility)
  const csvConfig = getCSVExportConfig(
    csvData,
    csvHeaders,
    "income-category.csv"
  );

  const handleExportPDF = () => {
    const columns = ["No.", "Created Date", "income Category", "income Note"];
    const rows = csvData.map((d) => [
      d.no,
      d.created_at,
      d.income_category,
      d.income_note,
    ]);

    exportToPDF({
      title: "income Category List",
      columns,
      rows,
      fileName: "income-category.pdf",
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

    const filtered = displayData?.filter((item) => {
      const createdAt = new Date(item.created_at);
      return createdAt >= from && createdAt <= to;
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
          <h1 className="text-2xl font-bold text-gray-900">Income Category</h1>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {totalItems} income categories
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
            <DateRangePicker
              label="Filter by Date"
              onChange={handleDateChange}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Button className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg">
            <Link
              to="/income/income-category-list/create"
              className="flex items-center gap-2"
            >
              + Create New Income Category
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
            "Created Date",
            "Income Category Name",
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
                {formatDate(item.created_at)}
              </td>
              <td className="py-3 px-4 text-center font-medium">
                {item?.income_category}
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
                      navigate(`/income/income-category-list/update/${item.id}`)
                    }
                    title="Edit type"
                  >
                    <SquarePenIcon size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(item.id, item.income_category)}
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
