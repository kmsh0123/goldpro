import React from "react";
import { ChevronLeftIcon, Pencil } from "lucide-react";
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
import { useGetSupplierQuery } from "@/feature/api/supplierApi/supplierApi";

const SupplierList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Current page from URL
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  // Fetch products
  const { data: GetSupplier } = useGetSupplierQuery();

  // Total pages
  const totalItems = GetSupplier?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);

  // Change page
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      navigate(`?page=${newPage}`);
    }
  };

  // Render dynamic page numbers


  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
        <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon />
        </span>
        SupplierList
      </h1>

      <div className="border-b-2"></div>

      {/* Search */}
      <div className="flex justify-between items-center mt-5">
        <Input
          placeholder="Search"
          className="max-w-sm rounded-md bg-[#EBEBEB]"
        />
        <Button className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-md">
          <Link
            to="/sale/customer-list/create"
            className="flex items-center gap-2"
          >
            + Create
          </Link>
        </Button>
      </div>

      <div className="border-b-2"></div>

     <PaginatedTable
        columns={["No.", "Date", "Supplier Name", "Actions"]}
        data={GetSupplier?.data || []}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        renderRow={(item, index) => (
          <tr key={item.id}>
            <td>{skip + index + 1}.</td>
            <td>
              {item.created_at
                ? new Date(item.created_at).toISOString().split("T")[0]
                : ""}
            </td>
            <td>{item.supplier_name}</td>
            <td>
              <Button
                variant="ghost"
                size="icon"
                className="text-yellow-600 hover:text-yellow-700"
              >
                <Pencil size={30} />
              </Button>
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default SupplierList;
