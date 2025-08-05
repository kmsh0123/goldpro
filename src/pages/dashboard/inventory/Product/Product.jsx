import React from 'react'
import { ChevronLeftIcon, FilePenLineIcon, ImageIcon, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { Link } from 'react-router-dom';

const data = [
  { id: 1, date: "6/6/2025", name: "Gold" },
  { id: 2, date: "6/6/2025", name: "Silver" },
  { id: 3, date: "6/6/2025", name: "Platinum" },
  { id: 4, date: "6/6/2025", name: "Diamond" },
];

const Product = () => {
  return (
      <div className="space-y-4">
      {/* Top Bar */}
         <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
          <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon/>
         </span>
         Product
         </h1>

         <div className="border-b-2"></div>
        

      {/* Search */}
      <div className='flex justify-between items-center mt-5'>
      <Input placeholder="Search" className="max-w-sm rounded-md" />
        <Button className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-md">
          <Link to="/inventory/product/create" className="flex items-center gap-2">
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
              <TableHead>Product Image</TableHead> {/* New Column Header */}
              <TableHead>Created Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}.</TableCell>
                <TableCell>
                {/* Display icon/link based on whether an image exists */}
                {item.hasImage ? (
                  // If image exists, you might link to a detail view or lightbox
                  <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-700 p-1">
                    <ImageIcon size={16} /> {/* Show image icon if image exists */}
                  </Button>
                ) : (
                  // If no image, show a disabled icon or nothing
                  <span className="text-gray-400">-</span> // Or <ImageIcon size={16} className="text-gray-300 opacity-50" />
                )}
              </TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="text-yellow-600 hover:text-yellow-700">
                    <Pencil size={30} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      {/* </Card> */}
    </div>
  )
}

export default Product