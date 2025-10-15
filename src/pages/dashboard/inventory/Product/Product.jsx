import React, { useState } from "react";
import {
  ChevronLeftIcon,
  DeleteIcon,
  EyeIcon,
  FilePenLineIcon,
  ImageIcon,
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
import PaginatedTable from "@/components/dashboard/ResuableComponents/PaginatedTable";
import {
  useDeleteProductMutation,
  useGetProductQuery,
} from "@/feature/api/inventory/productApi";
import Swal from "sweetalert2";
import usePaginatedList from "@/hooks/usePaginatedList";
import { confirmDelete } from "@/lib/confirmDelete";
import { exportToPDF } from "@/lib/exportToPDF";
import { getCSVExportConfig } from "@/lib/exportToCSV";
import ExportButtons from "@/components/dashboard/ResuableComponents/ExportButtons";
import DateRangePicker from "@/components/dashboard/ResuableComponents/DateRangePicker";

const Product = () => {
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
  } = usePaginatedList({ queryHook: useGetProductQuery, limit: 10 });

  // Fetch products
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const displayData = isFiltered ? filteredData : currentPageData;


  // Total pages

  const handleDelete = async (id, name) => {
    const result = await confirmDelete(name);
    if (result) {
      await deleteProduct(id).unwrap();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const csvHeaders = [
    { label: "No.", key: "no" },
    { label: "Date", key: "created_at" },
    { label: "Product Code", key: "product_code" },
    { label: "Product Name", key: "name" },
    { label: "Stock", key: "stock" },
    { label: "Quality", key: "quality_name" },
    { label: "Weight", key: "shwe_chain_gram" },
  ];

  // Prepare CSV data
  const csvData =
    displayData?.map((item, index) => ({
      no: (page - 1) * limit + index + 1,
      created_at: new Date(item.created_at)?.toLocaleString("en-MM"),
      product_code: item.product_code || "N/A",
      name: item.name || "-",
      stock: item.stock || "-",
      quality_name: item.quality_name || "-",
      shwe_chain_gram: item.shwe_chain_gram || "-",
      // payment_cat_id: item.payment_cat_id || "-",
      // expense_amount: item.expense_amount || "-",
      // expense_note: item.expense_note || "-",
      // expense_for: item.expense_for || "-",
    })) || [];

  // Build CSV Config (Reusable Utility)
  const csvConfig = getCSVExportConfig(csvData, csvHeaders, "Product.csv");

  const handleExportPDF = () => {
    const columns = [
      "No.",
      "Date",
      "Product Code",
      "Product Name",
      "Stock",
      "Quality",
      "Weight(g)",
    ];
    const rows = csvData.map((d) => [
      d.no,
      d.created_at,
      d.product_code,
      d.name,
      d.stock,
      d.quality_name,
      d.shwe_chain_gram,
      // d.expense_amount,
      // d.expense_note,
    ]);

    exportToPDF({
      title: "Product List",
      columns,
      rows,
      fileName: "Product.pdf",
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
          <h1 className="text-2xl font-bold text-gray-900">
            Product Management
          </h1>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {totalItems} products
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center gap-5">
          <div className="w-full sm:w-auto">
            <Input
              placeholder="Search products..."
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
              to="/inventory/product/create"
              className="flex items-center gap-2"
            >
              + Create New Product
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
      {/* <Card className="overflow-hidden p-5"> */}
      <div className="bg-white rounded-lg border shadow-sm">
        <PaginatedTable
          columns={[
            "No.",
            "Date",
            "Product Code",
            "Product Name",
            "Stock",
            "Quality",
            "Weight(g)",
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
              <td>{formatDate(item.created_at)}</td>
              <td className="py-3 px-4 text-center font-medium">
                {item.product_code}
              </td>
              <td className="py-3 px-4 text-center font-medium">{item.name}</td>
              <td className="py-3 px-4 text-center font-medium">
                {item.stock}
              </td>
              <td className="py-3 px-4 text-center font-medium">
                {item.quality_name}
              </td>
              <td className="py-3 px-4 text-center font-medium">
                {item.shwe_chain_gram}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() =>
                      navigate(`/inventory/product/update/${item.id}`)
                    }
                    title="Edit Product"
                  >
                    <SquarePenIcon size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(item.id, item.name)}
                    disabled={isDeleting}
                    title="Delete Product"
                  >
                    <Trash2Icon size={30} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#00C02A] hover:text-[#00C02A]"
                    onClick={() =>
                      navigate(`/inventory/product/detail/${item.id}`)
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

export default Product;
