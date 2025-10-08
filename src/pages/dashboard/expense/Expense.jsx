import React from "react";
import { ChevronLeftIcon, SquarePenIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PaginatedTable from "@/components/dashboard/ResuableComponents/PaginatedTable";
import {
  useDeleteTypeMutation,
} from "@/feature/api/inventory/typeApi";
import usePaginatedList from "@/hooks/usePaginatedList";
import { confirmDelete } from "@/lib/confirmDelete";
import { useDeleteExpenseMutation, useGetExpenseQuery } from "@/feature/api/expenseApi/expenseApi";

export default function Expense() {
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
  } = usePaginatedList({ queryHook: useGetExpenseQuery, limit: 10 });

  // Delete mutation
  const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseMutation();

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
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Search types..."
            className="w-full sm:w-64 rounded-lg border-gray-300"
          />
        </div>
        <Button className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg">
          <Link to="/expense/expense-list/create" className="flex items-center gap-2">
            + Create New Expense List
          </Link>
        </Button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg border shadow-sm">
        <PaginatedTable
          columns={["No.", "Expense Date", "Expense Category Name","Expense Amount","Expense Category Note", "Actions"]}
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
                {formatDate(item.expense_date)}
              </td>
              <td className="py-3 px-4 text-center font-medium">{item?.expense_for}</td>
              <td className="py-3 px-4 text-center font-medium">{Number(item?.expense_amount)?.toLocaleString()}</td>
              <td className="py-3 px-4 text-center font-medium">{item?.expense_note}</td>
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
