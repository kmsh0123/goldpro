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
  useGetQualityQuery,
  useDeleteQualityMutation,
} from "@/feature/api/inventory/qualityApi";
import { useGetTypeQuery } from "@/feature/api/inventory/typeApi";
import Swal from "sweetalert2";

const Quality = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Current page from URL
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  // Fetch qualities and types
  const { data: qualitiesData, refetch } = useGetQualityQuery({ limit, skip });
  const { data: typesData } = useGetTypeQuery();

  // Delete mutation
  const [deleteQuality] = useDeleteQualityMutation();

  // Map type_id -> type name
  const typeMap = React.useMemo(() => {
    const map = {};
    typesData?.data?.forEach((type) => {
      map[type.id] = type.name;
    });
    return map;
  }, [typesData]);

  // Total pages
  const totalItems = qualitiesData?.data?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);

  // Change page
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      navigate(`?page=${newPage}`);
    }
  };

  // Delete handler with SweetAlert
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteQuality(id).unwrap();
          refetch();

          Swal.fire({
            title: "Deleted!",
            text: "Quality has been deleted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Failed to delete quality.",
            icon: "error",
          });
          console.error("Failed to delete quality:", error);
        }
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
        <span onClick={() => navigate(-1)} className="cursor-pointer">
          <ChevronLeftIcon />
        </span>
        Quality
      </h1>

      <div className="border-b-2"></div>

      {/* Search */}
      <div className="flex justify-between items-center mt-5">
        <Input placeholder="Search" className="max-w-sm rounded-md" />
        <Button className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-md">
          <Link to="/inventory/quality/create" className="flex items-center gap-2">
            + Create
          </Link>
        </Button>
      </div>

      <div className="border-b-2"></div>

      {/* Table */}
      <PaginatedTable
        columns={["No.", "Created Date", "Type Name", "Name", "Actions"]}
        data={qualitiesData?.data || []}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        renderRow={(item, index) => (
          <tr key={item.id}>
            <td>{skip + index + 1}.</td>
            <td>{item.created_at?.split("T")[0]}</td>
            <td>{typeMap[item.type_id] || "N/A"}</td>
            <td>{item.name}</td>
            <td>
              {/* Edit */}
              <Button
                variant="ghost"
                size="icon"
                className="text-yellow-600 hover:text-yellow-700"
                onClick={() => navigate(`/inventory/quality/update/${item.id}`)}
              >
                <SquarePenIcon size={30} />
              </Button>

              {/* Delete */}
              <Button
                variant="ghost"
                size="icon"
                className="text-[#EA0000] hover:text-[#EA0000]"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2Icon size={30} />
              </Button>
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default Quality;
