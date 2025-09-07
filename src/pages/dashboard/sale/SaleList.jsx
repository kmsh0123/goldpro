import React from 'react'
import { ArrowUpFromDotIcon, ArrowUpFromLineIcon, ChevronLeftIcon, EyeIcon, FilePenLineIcon, ImageIcon, Pencil, SquarePenIcon, Trash2Icon, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PaginatedTable from '@/components/dashboard/ResuableComponents/PaginatedTable';
import { useGetOrderQuery } from '@/feature/api/posApi/posApi';

// const data = [
//   { id: 1, date: "6/6/2025", name: "Gold", quality : "24K", gram: "10g", price: "$500" },
//   { id: 2, date: "6/6/2025", name: "Silver" ,quality : "24K", gram: "10g", price: "$500"},
//   { id: 3, date: "6/6/2025", name: "Platinum" ,quality : "24K", gram: "10g", price: "$500"},
//   { id: 4, date: "6/6/2025", name: "Diamond" , quality : "24K", gram: "10g", price: "$500"},
// ];

const SaleList = () => {
  const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
      // Current page from URL
      const page = parseInt(searchParams.get("page")) || 1;
      const limit = 10;
      const skip = (page - 1) * limit;
    
      // Fetch products
      const { data: GetProducts } = useGetOrderQuery();
  
      console.log("GetProducts", GetProducts);

      
      
    
      // Total pages
      const totalItems = GetProducts?.data?.total || 0;
      const totalPages = Math.ceil(totalItems / limit);
    
      // Change page
      const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
          navigate(`?page=${newPage}`);
        }
      };
    
  return (
      <div className="space-y-4">
      {/* Top Bar */}
         <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
          <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon/>
         </span>
         Sale List
         </h1>

         <div className="border-b-2"></div>
        

      {/* Search */}
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


      {/* Table */}
      {/* <Card className="overflow-hidden p-5"> */}
        <PaginatedTable
        // columns={["No.", "Voucher Code", "Name", "Quantity","Type", "Quality", "Categories", "Weight","Sale Date", "Actions"]}
        columns={["No.","Customer", "Voucher Code", "Quantity","Sale Date", "Actions"]}
        data={GetProducts?.data || []}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        renderRow={(item, index) => (
          <tr key={item.id}>
            <td>{skip + index + 1}.</td>
             <td>
              {item.customer}
            </td>
            <td>
              {item.order_code}
            </td>
            <td>{item.total_quantity}</td>
            {/* <td>{item.created_at}</td> */}
            <td>{new Date(item.created_at).toLocaleString()}</td>
            {/* <td>{item.type}</td>
            <td>{item.type}</td>
            <td>{item.type}</td>
            <td>{item.type}</td>
            <td>{item.type}</td> */}
            <td>
              <Button
                variant="ghost"
                size="icon"
                className="text-yellow-600 hover:text-yellow-700"
                onClick={() => navigate(`/coa/coa-edit/${item.id}`)}
              >
                <SquarePenIcon size={30} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#EA0000] hover:text-[#EA0000]"
              >
                <Trash2Icon size={30} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#00C02A] hover:text-[#00C02A]"
                onClick={() => navigate(`/sale/sale-list/detail/${item.id}`)}
              >
                <EyeIcon size={30} />
              </Button>
            </td>
          </tr>
        )}
      />
      {/* </Card> */}
    </div>
  )
}

export default SaleList