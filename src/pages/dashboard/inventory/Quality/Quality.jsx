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
import { confirmDelete } from "@/lib/confirmDelete";
import usePaginatedList from "@/hooks/usePaginatedList";

export default function Quality() {
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
  } = usePaginatedList({ queryHook: useGetQualityQuery, limit: 10 });

  const { data: typesData } = useGetTypeQuery();

  // Delete mutation
  const [deleteQuality, { isLoading: isDeleting }] = useDeleteQualityMutation();

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
          <h1 className="text-2xl font-bold text-gray-900">Quality Management</h1>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {totalItems} types
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg border">
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Search qualities..."
            className="w-full sm:w-64 rounded-lg border-gray-300"
          />
        </div>
        <Button className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg">
          <Link
            to="/inventory/quality/create"
            className="flex items-center gap-2"
          >
            + Create New Quality
          </Link>
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <PaginatedTable
          columns={["No.", "Created Date", "Type Name", "Name", "Actions"]}
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
