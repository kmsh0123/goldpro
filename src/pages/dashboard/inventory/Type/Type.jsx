import React from "react";
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
  useGetTypeQuery,
  useDeleteTypeMutation,
} from "@/feature/api/inventory/typeApi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const Type = () => {
  const [searchParams] = useSearchParams();
  const nav = useNavigate();

  // RTK mutations
  const [deleteType] = useDeleteTypeMutation();

  // Current page from URL
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  // Fetch types
  const { data: GetProducts } = useGetTypeQuery({ limit, skip });

  // Total pages
  const totalItems = GetProducts?.data?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);

  // Change page
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      nav(`?page=${newPage}`);
    }
  };

  // Handle delete with SweetAlert2
  const handleDelete = (id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteType(id).unwrap();
          MySwal.fire("Deleted!", "Type has been deleted.", "success");
        } catch (error) {
          MySwal.fire("Error!", "Failed to delete type.", "error");
        }
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
        <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon />
        </span>
        Type
      </h1>

      <div className="border-b-2"></div>

      {/* Search */}
      <div className="flex justify-between items-center mt-5">
        <Input placeholder="Search" className="max-w-sm rounded-md" />
        <Button className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-md">
          <Link to="/inventory/type/create" className="flex items-center gap-2">
            + Create
          </Link>
        </Button>
      </div>

      <div className="border-b-2"></div>

      {/* Table */}
      <PaginatedTable
        columns={["No.", "Created Date", "Name", "Actions"]}
        data={GetProducts?.data || []}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        renderRow={(item, index) => (
          <tr key={item.id}>
            <td>{skip + index + 1}.</td>
            <td>{item.created_at?.split("T")[0]}</td>
            <td>{item.name}</td>
            <td>
              <Button
                variant="ghost"
                size="icon"
                className="text-yellow-600 hover:text-yellow-700"
                onClick={() => nav(`/inventory/type/update/${item.id}`)}
              >
                <SquarePenIcon size={30} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#EA0000] hover:text-[#EA0000]"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2Icon size={30} />
              </Button>
              {/* <Button
                variant="ghost"
                size="icon"
                className="text-[#00C02A] hover:text-[#00C02A]"
                onClick={() => nav(`/inventory/type/${item.id}`)}
              >
                <EyeIcon size={30} />
              </Button> */}
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default Type;
