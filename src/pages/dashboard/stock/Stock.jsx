import React from 'react'
import { ArrowUpFromDotIcon, ArrowUpFromLineIcon, ChevronLeftIcon, FilePenLineIcon, ImageIcon, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

const data = [
  { id: 1, date: "6/6/2025", name: "Gold", quality : "24K", gram: "10g", price: "$500" },
  { id: 2, date: "6/6/2025", name: "Silver" ,quality : "24K", gram: "10g", price: "$500"},
  { id: 3, date: "6/6/2025", name: "Platinum" ,quality : "24K", gram: "10g", price: "$500"},
  { id: 4, date: "6/6/2025", name: "Diamond" , quality : "24K", gram: "10g", price: "$500"},
];

const Stock = () => {
  return (
      <div className="space-y-4">
      {/* Top Bar */}
         <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
          <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon/>
         </span>
         Stock List
         </h1>

         <div className="border-b-2"></div>

         <div className='flex justify-between items-center mt-5'>
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="w-full">
            <label className="block mb-1 font-medium">Product Code</label>
            <Select className>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Code" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="R">R</SelectItem>
                <SelectItem value="G">G</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <label className="block mb-1 font-medium">Type</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gold">Gold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <label className="block mb-1 font-medium">Category</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ring">Ring</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <label className="block mb-1 font-medium">Quality</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24k">24K</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-md">
          {/* <Link to="/inventory/product/create" className="flex items-center gap-2">
            + Create
          </Link> */}
          <ArrowUpFromLineIcon/>
          Export
        </Button>
      </div>

         <div className="border-b-2"></div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
  <Card>
    <CardContent className="p-6 text-center">
      <h2 className="text-lg font-semibold mb-2">Total Sale</h2>
      <p className="text-3xl font-bold text-orange-500">123</p>
      <p className="mt-2 text-sm">
        <span className="font-semibold">123 G</span> For this month
      </p>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-6 text-center">
      <h2 className="text-lg font-semibold mb-2">Total Purchase</h2>
      <p className="text-3xl font-bold text-green-600">123</p>
      <p className="mt-2 text-sm">
        <span className="font-semibold">123 G</span> For this month
      </p>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-6 text-center">
      <h2 className="text-lg font-semibold mb-2">Total Remaining</h2>
      <p className="text-3xl font-bold text-blue-600">123</p>
      <p className="mt-2 text-sm">
        <span className="font-semibold">123 G</span> For this month
      </p>
    </CardContent>
  </Card>
</div>


      {/* Search */}

      {/* Table */}
      {/* <Card className="overflow-hidden p-5"> */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Quality</TableHead>
              <TableHead>Gram</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Sale Date</TableHead>
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
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quality}</TableCell>
                <TableCell>{item.gram}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>
                  {/* <Button variant="ghost" size="icon" className="text-yellow-600 hover:text-yellow-700">
                    <Pencil size={30} />
                  </Button> */}
                  {item.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      {/* </Card> */}
    </div>
  )
}

export default Stock