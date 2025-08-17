import React from 'react'
import { ChevronLeftIcon, EyeIcon, FilePenLineIcon, Pencil, SquarePen, SquarePenIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PaginatedTable from '@/components/dashboard/ResuableComponents/PaginatedTable';
import { useGetProductQuery } from '@/feature/api/inventory/productApi';
import { useGetCoaQuery } from '@/feature/api/coaApi/coaApi';


const COA = () => {
  const [searchParams] = useSearchParams();
    const navigate = useNavigate();
  
    // Current page from URL
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
  
    // Fetch products
    const { data: GetProducts } = useGetCoaQuery({ limit, skip });

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
         Chart of Accounts
         </h1>

         <div className="border-b-2"></div>
        

      {/* Search */}
      <div className='flex justify-between items-center mt-5'>
      <Input placeholder="Search" className="max-w-sm rounded-md" />
        <Button className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-md">
          <Link to="/coa/coa-create" className="flex items-center gap-2">
            + Create
          </Link>
        </Button>
      </div>

         <div className="border-b-2"></div>


      {/* Table */}
      {/* <Card className="overflow-hidden p-5"> */}
      <PaginatedTable
        columns={["No.", "Code", "Type", "Actions"]}
        data={GetProducts?.data || []}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        renderRow={(item, index) => (
          <tr key={item.id}>
            <td>{skip + index + 1}.</td>
            <td>
              {item.code}
            </td>
            <td>{item.type}</td>
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
                onClick={() => navigate(`/coa/coa-detail/${item.id}`)}
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

export default COA