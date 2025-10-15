import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Share2, Pencil, Trash2, ChevronLeftIcon } from "lucide-react";
import { useProductDetailQuery } from "@/feature/api/inventory/productApi";
import { useParams } from "react-router-dom";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";

const ProductDetailPage = () => {
  const { id } = useParams();

  const { data, error, isLoading } = useProductDetailQuery(id);

  console.log("Product Detail Data :", data?.data);

  return (
    <div className="space-y-4 p-6">
      {/* Back */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
              <span onClick={() => window.history.back()} className="cursor-pointer">
                <ChevronLeftIcon />
              </span>
              Back To Product
            </h1>

      <div className="border-b-2"></div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Image */}
        <Card className="overflow-hidden">
          <img
            src={data?.data?.image ? `http://localhost:8000/image/${data.data.image}` : "Not Found Image"}
            alt="headphones"
            className="w-full h-[350px] object-cover"
          />
        </Card>

        {/* Product Info */}
        <Card className="p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-semibold">
                {data?.data?.name || "Product Name"}
              </h1>
              <p className="text-sm text-gray-500">
                Product Code: {data?.data?.product_code}
              </p>
            </div>
            <span
              className={`px-2 py-1 rounded-md text-xs font-medium 
    ${
      data?.data?.stock > 0
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
            >
              {data?.data?.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* <p className="text-2xl font-bold text-gray-800">$299.99</p> */}

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Type</p>
              <p className="font-medium">{data?.data?.type_name}</p>
            </div>
            <div>
              <p className="text-gray-500">Quality</p>
              <p className="font-medium">{data?.data?.quality_name}</p>
            </div>
            <div>
              <p className="text-gray-500">Category</p>
              <p className="font-medium">{data?.data?.cat_name}</p>
            </div>
            <div>
              <p className="text-gray-500">Quantity</p>
              <p className="font-medium">{data?.data?.stock}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-gray-500 text-sm mb-1">Description</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {data?.data?.description || "No description available."}
            </p>
          </div>

          <Separator />

          {/* Product Details */}
          <div>
            <p className="font-medium mb-2">Product Details</p>
            <Label className="text-sm text-gray-600">ရွေချိန်</Label>
            <div className="grid grid-cols-4 gap-4 my-3">
              {/* ကျပ် */}
              <div className="flex flex-col space-y-1">
                <Label htmlFor="kyat" className="text-sm font-medium">
                  ကျပ်
                </Label>
                 <p className="bg-gray-100 text-center p-1.5 rounded-md">
                  {data?.data?.shwe_chain_kyat || "0.00"}
                </p>
              </div>

              {/* ပဲ */}
              <div className="flex flex-col space-y-1">
                <Label htmlFor="pae" className="text-sm font-medium">
                  ပဲ
                </Label>
                <p className="bg-gray-100 text-center p-1.5 rounded-md">
                  {data?.data?.shwe_chain_pae || "0.00"}
                </p>
              </div>

              {/* ရွေး */}
              <div className="flex flex-col space-y-1">
                <Label htmlFor="yway" className="text-sm font-medium">
                  ရွေး
                </Label>
                 <p className="bg-gray-100 text-center p-1.5 rounded-md">
                  {data?.data?.shwe_chain_yway || "0.00"}
                </p>
              </div>

              {/* Gram */}
              <div className="flex flex-col space-y-1">
                <Label htmlFor="gram" className="text-sm font-medium">
                  Gram
                </Label>
                <p className="bg-gray-100 text-center p-1.5 rounded-md">
                  {data?.data?.shwe_chain_gram || "0.00"}
                </p>
              </div>
            </div>

            <Label className="text-sm text-gray-600">အလျော့တွက်</Label>
            <div className="grid grid-cols-4 gap-4 my-3">
              {/* ကျပ် */}
              <div className="flex flex-col space-y-1">
                <Label htmlFor="kyat" className="text-sm font-medium">
                  ကျပ်
                </Label>
                 <p className="bg-gray-100 text-center p-1.5 rounded-md">
                  {data?.data?.alyaut_twat_kyat || "0.00"}
                </p>
              </div>

              {/* ပဲ */}
              <div className="flex flex-col space-y-1">
                <Label htmlFor="pae" className="text-sm font-medium">
                  ပဲ
                </Label>
                <p className="bg-gray-100 text-center p-1.5 rounded-md">
                  {data?.data?.alyaut_twat_pae || "0.00"}
                </p>
              </div>

              {/* ရွေး */}
              <div className="flex flex-col space-y-1">
                <Label htmlFor="yway" className="text-sm font-medium">
                  ရွေး
                </Label>
                 <p className="bg-gray-100 text-center p-1.5 rounded-md">
                  {data?.data?.alyaut_twat_yway || "0.00"}
                </p>
              </div>

              {/* Gram */}
              <div className="flex flex-col space-y-1">
                <Label htmlFor="gram" className="text-sm font-medium">
                  Gram
                </Label>
                <p className="bg-gray-100 text-center p-1.5 rounded-md">
                  {data?.data?.alyaut_twat_gram || "0.00"}
                </p>
              </div>
            </div>

            
          </div>

          {/* Myanmar Extra Info */}
          {/* <Card className="bg-gray-50 p-3">
            <p className="text-sm font-medium">မြန်မာစာအချက်အလက်များ</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              ကျွန်တော်တို့ရဲ့အသုံးချမှုများ၊ စျေးနှုန်းများ စသည်တို့ကို
              မြန်မာဘာသာဖြင့် ပြထားနိုင်ပါတယ်။
            </p>
          </Card> */}

          {/* Actions */}
          {/* <div className="flex gap-3 justify-end">
            <Button variant="outline" size="sm" className="flex gap-2">
              <Share2 className="w-4 h-4" /> Share
            </Button>
            <Button variant="outline" size="sm" className="flex gap-2">
              <Pencil className="w-4 h-4" /> Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex gap-2 text-white"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
          </div> */}
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailPage;
