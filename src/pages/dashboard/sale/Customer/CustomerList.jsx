import React from "react";
import { ChevronLeftIcon, FilePenLineIcon, Pencil } from "lucide-react";
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
import { Link } from "react-router-dom";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const data = [
  { id: 1, date: "6/6/2025", name: "Gold" },
  { id: 2, date: "6/6/2025", name: "Silver" },
  { id: 3, date: "6/6/2025", name: "Platinum" },
  { id: 4, date: "6/6/2025", name: "Diamond" },
  { id: 5, date: "6/6/2025", name: "Diamond" },
  { id: 6, date: "6/6/2025", name: "Diamond" },
  { id: 7, date: "6/6/2025", name: "Diamond" },
  { id: 8, date: "6/6/2025", name: "Diamond" },
  { id: 9, date: "6/6/2025", name: "Diamond" },
  { id: 10, date: "6/6/2025", name: "Diamond" },
];

const CustomerList = () => {
  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
        <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon />
        </span>
        CustomerList
      </h1>

      <div className="border-b-2"></div>

      {/* Search */}
      <div className="flex justify-between items-center mt-5">
        <Input
          placeholder="Search"
          className="max-w-sm rounded-md bg-[#EBEBEB]"
        />
        <Button className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-md">
          <Link to="/sale/customer-list/create" className="flex items-center gap-2">
            + Create
          </Link>
        </Button>
      </div>

      <div className="border-b-2"></div>

      {/* Table */}
      {/* <Card className="overflow-hidden p-5"> */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Ph:Number</TableHead>
            <TableHead>Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}.</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-yellow-600 hover:text-yellow-700"
                >
                  <Pencil size={30} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* </Card> */}
      <div className="flex justify-end mt-5">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious>Previous</PaginationPrevious>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>1</PaginationLink>
              <PaginationLink>2</PaginationLink>
              <PaginationLink>3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext>Next</PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default CustomerList;
