import React from "react";
import {
  ChevronLeftIcon,
  DeleteIcon,
  EyeIcon,
  FilePenLineIcon,
  ImageIcon,
  Pencil,
  Trash2Icon,
} from "lucide-react";
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
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PaginatedTable from "@/components/dashboard/ResuableComponents/PaginatedTable";
import { useDeleteProductMutation, useGetProductQuery } from "@/feature/api/inventory/productApi";
import Swal from "sweetalert2";

const Product = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Current page from URL
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  // Fetch products
  const { data: GetProducts } = useGetProductQuery({ limit, skip });
  const [deleteProduct] = useDeleteProductMutation();
  console.log("GetProduct :",GetProducts);
  

  // Total pages
  const totalItems = GetProducts?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);

  // Change page
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      navigate(`?page=${newPage}`);
    }
  };

  const handleDelete = async (id) => {
          Swal.fire({
            title: "Are you sure?",
            text: "You won’t be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!",
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                await deleteProduct(id).unwrap();
                // refetch();
                Swal.fire({
                  title: "Deleted!",
                  text: "Product has been deleted.",
                  icon: "success",
                  timer: 1500,
                  showConfirmButton: false,
                });
              } catch (error) {
                Swal.fire({
                  title: "Error!",
                  text: "Failed to delete Product.",
                  icon: "error",
                });
                console.error("Failed to delete Product:", error);
              }
            }
          });
        };
  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
        <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon />
        </span>
        Product
      </h1>


      {/* Search */}
      <div className="flex justify-between items-center mt-5">
        <Input placeholder="Search" className="max-w-sm rounded-md" />
        <Button className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-md">
          <Link
            to="/inventory/product/create"
            className="flex items-center gap-2"
          >
            + Create
          </Link>
        </Button>
      </div>

      <div className="border-b-2"></div>

      {/* Table */}
      {/* <Card className="overflow-hidden p-5"> */}
      <PaginatedTable
        columns={[
          "No.",
          "Date",
          "Product Code",
          "Product Name",
          "Stock",
          "Weight(g)",
          "Actions",
        ]}
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
            {/* {(item.shwe_chain_gram * item.stock).toFixed()} */}
            <td>{item.shwe_chain_gram}</td>
            <td>
              <Button
                variant="ghost"
                size="icon"
                className="text-yellow-600 hover:text-yellow-700"
              >
                <Pencil size={30} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-600 hover:text-red-700"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2Icon size={30} />
              </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#00C02A] hover:text-[#00C02A]"
              onClick={() => navigate(`/inventory/product/detail/${item.id}`)}
            >
              <EyeIcon size={30} />
            </Button>
            </td>
          </tr>
        )}
      />
      {/* </Card> */}
    </div>
  );
};

export default Product;
