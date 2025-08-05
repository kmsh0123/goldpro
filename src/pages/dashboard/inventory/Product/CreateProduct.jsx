import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ChevronLeftIcon, UploadCloud } from "lucide-react";

const CreateProduct = () => {
  const [productImage, setProductImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setProductImage(file);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
        <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon />
        </span>
        Create Product
      </h1>

      <div className="border-b-2"></div>
      <form className="space-y-6 max-w-7xl">
        {/* First Row: Product Code, Type, Category, Quality */}
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

        {/* Second Row: Image Upload, Name, Description */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Image Upload */}
          <div>
            <label className="block mb-1 font-medium">Product Photo</label>
            <label
              htmlFor="upload"
              className="w-full h-36 flex flex-col items-center justify-center border border-dashed bg-[#ebebeb] text-gray-500 rounded cursor-pointer"
            >
              <UploadCloud size={24} />
              <span>Upload Photo</span>
              <input
                id="upload"
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Name & Description */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block mb-1 font-medium">Product Name</label>
              <Input placeholder="Enter Product Name" className="bg-[#ebebeb] py-5" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <Textarea
                placeholder="Enter Description"
                className="bg-[#ebebeb] w-full h-32"
                rows={3}
                
              />
            </div>
          </div>
        </div>

        {/* Weights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-semibold text-md">
              ရွှေချိန်
            </label>
            <div className="flex gap-2">
              <Input placeholder="ကျပ်" className="bg-[#ebebeb]" />
              <Input placeholder="ပဲ" className="bg-[#ebebeb]" />
              <Input placeholder="ရွေး" className="bg-[#ebebeb]" />
              <Input placeholder="g" className="bg-[#ebebeb]" />
            </div>
             <div className="mt-4">
            <label className="block mb-1 font-semibold text-md">
              အလေးချိန်
            </label>
            <div className="flex gap-2">
              <Input placeholder="ကျပ်" className="bg-[#ebebeb]" />
              <Input placeholder="ပဲ" className="bg-[#ebebeb]" />
              <Input placeholder="ရွေး" className="bg-[#ebebeb]" />
              <Input placeholder="g" className="bg-[#ebebeb]" />
            </div>
          </div>
          </div>
         
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            className="bg-[#ebebeb] text-gray-700"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;