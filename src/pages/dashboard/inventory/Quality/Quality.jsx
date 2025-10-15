import React, { useState } from "react";
import {
  ChevronLeftIcon,
  EyeIcon,
  SquarePenIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PaginatedTable from "@/components/dashboard/ResuableComponents/PaginatedTable";
import {
  useGetQualityQuery,
  useDeleteQualityMutation,
} from "@/feature/api/inventory/qualityApi";
import { useGetTypeQuery } from "@/feature/api/inventory/typeApi";
import Swal from "sweetalert2";
import { confirmDelete } from "@/lib/confirmDelete";
import usePaginatedList from "@/hooks/usePaginatedList";
import { getCSVExportConfig } from "@/lib/exportToCSV";
import { exportToPDF } from "@/lib/exportToPDF";
import ExportButtons from "@/components/dashboard/ResuableComponents/ExportButtons";
import DateRangePicker from "@/components/dashboard/ResuableComponents/DateRangePicker";

export default function Quality() {
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
  } = usePaginatedList({ queryHook: useGetQualityQuery, limit: 10 });

  const { data: typesData } = useGetTypeQuery();

  // Delete mutation
  const [deleteQuality, { isLoading: isDeleting }] = useDeleteQualityMutation();

  const displayData = isFiltered ? filteredData : currentPageData;

  const handleDelete = async (id, name) => {
    const result = await confirmDelete(name);
    if (result) {
      await deleteQuality(id).unwrap();
    }
  };

  // Map type_id -> type name
  const typeMap = React.useMemo(() => {
    const map = {};
    typesData?.data?.forEach((type) => {
      map[type.id] = type.name;
    });
    return map;
  }, [typesData]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const csvHeaders = [
    { label: "No.", key: "no" },
    { label: "Created Date", key: "created_at" },
    { label: "Type Name", key: "type_id" },
    { label: "Quality Name", key: "name" },
  ];

  // Prepare CSV data
  const csvData =
    displayData?.map((item, index) => ({
      no: (page - 1) * limit + index + 1,
      created_at: new Date(item.created_at)?.toLocaleString("en-MM"),
      type_id: typeMap[item.type_id] || "N/A",
      name: item.name || "-",
      // payment_cat_id: item.payment_cat_id || "-",
      // expense_amount: item.expense_amount || "-",
      // expense_note: item.expense_note || "-",
      // expense_for: item.expense_for || "-",
    })) || [];

  // Build CSV Config (Reusable Utility)
  const csvConfig = getCSVExportConfig(csvData, csvHeaders, "quality.csv");

  const handleExportPDF = () => {
    const columns = ["No.", "Created Date", "Type Name", "Quality Name"];
    const rows = csvData.map((d) => [
      d.no,
      d.created_at,
      d.type_id,
      d.name,
      // d.expense_amount,
      // d.expense_note,
    ]);

    exportToPDF({
      title: "Quality List",
      columns,
      rows,
      fileName: "Quality.pdf",
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
        item.name.toLowerCase().includes(searchText.toLowerCase())
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
      item.name.toLowerCase().includes(value.toLowerCase())
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
    <div className="space-y-6 p-6">
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
          <h1 className="text-2xl font-bold text-gray-900">
            Quality Management
          </h1>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {totalItems} types
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center gap-5">
          <div className="w-full sm:w-auto">
            <Input
              placeholder="Search qualities..."
              className="w-full sm:w-64 rounded-lg border-gray-300"
              value={searchText}
              onChange={handleSearchChange}
            />
          </div>
          <DateRangePicker label="Filter by Date" onChange={handleDateChange} />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Button className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg">
            <Link
              to="/inventory/quality/create"
              className="flex items-center gap-2"
            >
              + Create New Quality
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

      {/* Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <PaginatedTable
          columns={[
            "No.",
            "Created Date",
            "Type Name",
            "Quality Name",
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
                {typeMap[item.type_id] || "N/A"}
              </td>
              <td className="py-3 px-4 text-center font-medium">{item.name}</td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() =>
                      navigate(`/inventory/quality/update/${item.id}`)
                    }
                    title="Edit Quality"
                  >
                    <SquarePenIcon size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(item.id, item.name)}
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
