import React from 'react'
import { ChevronLeftIcon, FilePenLineIcon, ImageIcon, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PaginatedTable from '@/components/dashboard/ResuableComponents/PaginatedTable';
import { useGetProductQuery } from '@/feature/api/inventory/productApi';


const Product = () => {
 const [searchParams] = useSearchParams();
   const navigate = useNavigate();
 
   // Current page from URL
   const page = parseInt(searchParams.get("page")) || 1;
   const limit = 10;
   const skip = (page - 1) * limit;
 
   // Fetch products
   const { data: GetProducts } = useGetProductQuery();
 
   // Total pages
   const totalItems = GetProducts?.total || 0;
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
        <PaginatedTable
        columns={["No.", "Date","Product Code", "Product Name", "Stock", "Weight(g)", "Actions"]}
        data={GetProducts?.data || []}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        renderRow={(item, index) => (
          <tr key={item.id}>
            <td>{skip + index + 1}.</td>
            <td>
              {item.created_at
                ? new Date(item.created_at).toISOString().split("T")[0]
                : ""}
            </td>
            <td>{item.product_code}</td>
            <td>{item.name}</td>
            <td>{item.stock}</td>
            <td>{item.alyaut_twat_gram * item.stock}</td>
            <td>
              <Button
                variant="ghost"
                size="icon"
                className="text-yellow-600 hover:text-yellow-700"
              >
                <Pencil size={30} />
              </Button>
            </td>
          </tr>
        )}
      />
      {/* </Card> */}
    </div>
  )
}

export default Product