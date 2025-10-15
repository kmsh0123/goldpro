import PaginatedTable from "@/components/dashboard/ResuableComponents/PaginatedTable";
import { Badge } from "@/components/ui/badge";
import { useGetProductQuery } from "@/feature/api/inventory/productApi";
import { useGetStockQuery } from "@/feature/api/stockApi/stockApi";
import usePaginatedList from "@/hooks/usePaginatedList";
import { AlertTriangle } from "lucide-react";
import React from "react";

const StockAlert = () => {
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
    } = usePaginatedList({ queryHook: useGetStockQuery, limit: 5 });


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
   <div className="bg-white rounded-lg border shadow-sm p-5">
    <h1>Stock Alert</h1>
        <PaginatedTable
          // columns={["No.", "Voucher Code", "Name", "Quantity","Type", "Quality", "Categories", "Weight","Sale Date", "Actions"]}
          columns={[
            "No.",
            "Product Name",
            "In Stock",
          ]}
          data={currentPageData || []}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          renderRow={(item, index) => {
          const isLowStock = Number(item.in) <= 10;
          return (
            <tr
              key={item.id}
              className={`transition ${
                isLowStock
                  ? "bg-red-50 hover:bg-red-100"
                  : "hover:bg-gray-50"
              }`}
            >
              <td className="px-4 py-2 text-center">
                {(page - 1) * limit + index + 1}
              </td>

              <td className="px-4 py-2 text-center font-medium">
                {item.product_name}
              </td>

              <td
                className={`px-4 py-2 text-center font-semibold ${
                  isLowStock ? "text-red-600" : "text-gray-700"
                }`}
              >
                {item.in || 0}
              </td>

              <td className="px-4 py-2 text-center">
                {isLowStock ? (
                  <Badge
                    variant="destructive"
                    className="flex items-center gap-1 justify-center"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Low Stock
                  </Badge>
                ) : (
                  <Badge variant="secondary">OK</Badge>
                )}
              </td>
            </tr>
          );
        }}
      />
      </div>
  );
};

export default StockAlert;
