// components/PaginatedTable.jsx
import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import PaginationComponent from "./PaginationComponent";

const PaginatedTable = ({ columns, data, page, totalPages, onPageChange, renderRow }) => {
  return (
    <div className="space-y-4 text-center">
      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, idx) => (
              <TableHead key={idx} className="text-center">{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((row, idx) => renderRow(row, idx))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-5">
          <PaginationComponent
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default PaginatedTable;
