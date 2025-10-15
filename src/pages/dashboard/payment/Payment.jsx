import React, { useState } from "react";
import { ChevronLeftIcon, SquarePenIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PaginatedTable from "@/components/dashboard/ResuableComponents/PaginatedTable";
import {
  useGetTypeQuery,
  useDeleteTypeMutation,
} from "@/feature/api/inventory/typeApi";
import usePaginatedList from "@/hooks/usePaginatedList";
import { confirmDelete } from "@/lib/confirmDelete";
import {
  useDeletePaymentMutation,
  useGetPaymentQuery,
} from "@/feature/api/paymentApi/paymentApi";
import { getCSVExportConfig } from "@/lib/exportToCSV";
import { exportToPDF } from "@/lib/exportToPDF";
import ExportButtons from "@/components/dashboard/ResuableComponents/ExportButtons";
import DateRangePicker from "@/components/dashboard/ResuableComponents/DateRangePicker";

export default function Payment() {
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
  } = usePaginatedList({ queryHook: useGetPaymentQuery, limit: 10 });

  // Delete mutation
  // const [deletePayment, { isLoading: isDeleting }] = useDeletePaymentMutation();

  // // Handle delete with SweetAlert2
  // const handleDelete = async (id, name) => {
  //   const result = await confirmDelete(name);
  //   if (result) {
  //     await deletePayment(id).unwrap();
  //   }
  // };

  const displayData = isFiltered ? filteredData : currentPageData;

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const csvHeaders = [
    { label: "No.", key: "no" },
    { label: "Created Date", key: "created_at" },
    { label: "Payment Category Name", key: "category" },
    { label: "Payment Amount", key: "amount" },
    { label: "Payment Type", key: "type" },
  ];

  // Prepare CSV data
  const csvData =
    currentPageData?.map((item, index) => ({
      no: (page - 1) * limit + index + 1,
      created_at: new Date(item.created_at)?.toLocaleString("en-MM"),
      // expense_cat_id: getCategoryName(item.expense_cat_id),
      category: item.category || "-",
      amount: item.amount || "-",
      expense_amount: item.expense_amount || "-",
      type: item.type || "-",
      // expense_for: item.expense_for || "-",
    })) || [];

  // Build CSV Config (Reusable Utility)
  const csvConfig = getCSVExportConfig(csvData, csvHeaders, "payment-list.csv");

  const handleExportPDF = () => {
    const columns = ["No.", "Created Date", "Category Name", "Amount", "Type"];
    const rows = csvData.map((d) => [
      d.no,
      d.created_at,
      d.category,
      d.amount,
      d.type,
    ]);

    exportToPDF({
      title: "Payment List",
      columns,
      rows,
      fileName: "payment-list.pdf",
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
        item.category.toLowerCase().includes(searchText.toLowerCase())
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
      item.category.toLowerCase().includes(value.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900">
            Payment Management
          </h1>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {totalItems} types
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

        {/* <Button className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg">
          <Link
            to="/payment/payment-list/create"
            className="flex items-center gap-2"
          >
            + Create New Payment
          </Link>
        </Button> */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer">
          <ExportButtons csvConfig={csvConfig} onPdfExport={handleExportPDF} />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg border shadow-sm">
        <PaginatedTable
          columns={["No.", "Created Date", "Category Name", "Amount", "Type"]}
          data={currentPageData || []}
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
                {item.category}
              </td>
              <td
                className={`py-3 px-4 text-center font-medium ${
                  item.amount > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {item.amount.toLocaleString()} {/* optional formatting */}
              </td>
              <td className="py-3 px-4 text-center font-medium">
                {item.type || "N/A"}
              </td>
              <td className="py-3 px-4">
                {/* <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() =>
                      navigate(`/payment/payment-list/update/${item.id}`)
                    }
                    title="Edit type"
                  >
                    <SquarePenIcon size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(item.id, item.amount)}
                    disabled={isDeleting}
                    title="Delete type"
                  >
                    <Trash2Icon size={18} />
                  </Button>
                </div> */}
              </td>
            </tr>
          )}
        />
      </div>
    </div>
  );
}
