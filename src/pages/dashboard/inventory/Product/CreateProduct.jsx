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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronLeftIcon, UploadCloud } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCreateProductMutation } from "@/feature/api/inventory/productApi";
import { useGetCategoryQuery } from "@/feature/api/inventory/categoryApi";
import { toast } from "react-toastify";


const gramToKyatPaeYway = (gram) => {
  const kyatValue = gram / 16.6;
  const kyat = Math.floor(kyatValue);

  const paeValue = (kyatValue - kyat) * 16;
  const pae = Math.floor(paeValue);

  const ywayValue = (paeValue - pae) * 8;
  const yway = Math.round(ywayValue);

  return { kyat, pae, yway };
};

const kyatPaeYwayToGram = (kyat, pae, yway) => {
  const totalKyat = parseFloat(kyat || 0) + parseFloat(pae || 0) / 16 + parseFloat(yway || 0) / 128;
  return (totalKyat * 16.6).toFixed(2); // 2 decimal places
};

const CreateProduct = () => {
  const [productImage, setProductImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [productCreate] = useCreateProductMutation();
  const nav = useNavigate();

  const [openCategory, setOpenCategory] = useState(false);
  const [searchCategory, setSearchCategory] = useState("");

  const { register, handleSubmit, reset, watch, control, setValue } = useForm({
    defaultValues: {
      categoryId: "",
      name: "",
      productCode: "",
      description: "",
      stock: "",
      image: "",
      shweKyat: "",
      shwePae: "",
      shweYway: "",
      shweGram: "",
      alyautKyat: "",
      alyautPae: "",
      alyautYway: "",
      alyautGram: "",
    },
  });

  const { data: GetCategory } = useGetCategoryQuery();

  const selectedCategoryId = watch("categoryId");

  const selectedCategoryName =
    GetCategory?.data?.find((item) => item.id.toString() === selectedCategoryId)
      ?.name || "";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setValue("image", file);
    }
  };

  const handleCreateProduct = async (formData) => {
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, value);
      });
      if (productImage) {
        fd.append("image", productImage);
      }
      const { data } = await productCreate(fd);
      console.log("Product created successfully:", data);
      toast.success("Product created successfully!");
      reset();
      nav("/inventory/product");
    } catch (error) {
      console.error("Error create product");
    }
  };

  const filteredCategory = GetCategory?.data?.filter((item) =>
    item.name.toLowerCase().includes(searchCategory.toLowerCase())
  );

  const shweGram = watch("shweGram");
  const alyautKyat = watch("alyautKyat");
  const alyautPae = watch("alyautPae");
  const alyautYway = watch("alyautYway");

  // whenever gram changes, update kyat/pae/yway
  React.useEffect(() => {
    if (shweGram && !isNaN(shweGram)) {
      const { kyat, pae, yway } = gramToKyatPaeYway(parseFloat(shweGram));
      setValue("shweKyat", kyat);
      setValue("shwePae", pae);
      setValue("shweYway", yway);
    }
  }, [shweGram, setValue]);

  React.useEffect(() => {
    // whenever kyat/pae/yway changes, update gram
    if (alyautKyat !== "" || alyautPae !== "" || alyautYway !== "") {
      const gram = kyatPaeYwayToGram(alyautKyat, alyautPae, alyautYway);
      setValue("alyautGram", gram);
    }
  }, [alyautKyat, alyautPae, alyautYway, setValue]);

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
      <form
        onSubmit={handleSubmit(handleCreateProduct)}
        className="space-y-6 max-w-7xl"
      >
        {/* First Row: Product Code, Type, Category, Quality */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="w-full">
            <label className="block mb-1 font-medium">Product Code</label>
            <Input
              placeholder="Enter Product Code"
              {...register("productCode")}
              className="bg-[#ebebeb] py-5"
            />
            {/* <Select className>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Code" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="R">R</SelectItem>
                <SelectItem value="G">G</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
          <div className="w-full">
            <label className="block mb-1 font-medium">Product Name</label>
            <Input
              placeholder="Enter Product Name"
              {...register("name")}
              className="bg-[#ebebeb] py-5"
            />
          </div>
          <div className="w-full">
            <label className="block mb-1 font-medium">Quantity</label>
            <Input
              placeholder="Enter Product Quantity"
              {...register("stock")}
              // type="number"
              className="bg-[#ebebeb] py-5"
            />
          </div>
          <div className="w-full">
            <label className="block mb-1 font-medium">Category</label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Popover open={openCategory} onOpenChange={setOpenCategory}>
                  <PopoverTrigger asChild>
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {selectedCategoryName || "Select Category"}
                      </Button>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search type..."
                        value={searchCategory}
                        onValueChange={setSearchCategory}
                      />
                      <CommandList className="max-h-40 overflow-y-auto">
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                          {filteredCategory?.map((item) => (
                            <CommandItem
                              key={item.id}
                              onSelect={() => {
                                field.onChange(item.id.toString());
                                setOpenCategory(false);
                              }}
                            >
                              {item.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            />
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
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Product Preview"
                  className="h-full w-full object-cover bg-white rounded"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <UploadCloud size={24} />
                  <span className="mt-2">Click to upload</span>
                </div>
              )}
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
            {/* <div>
              <label className="block mb-1 font-medium">Product Name</label>
              <Input placeholder="Enter Product Name" className="bg-[#ebebeb] py-5" />
            </div> */}
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <Textarea
                placeholder="Enter Description"
                className="bg-[#ebebeb] w-full h-32"
                rows={3}
                {...register("description")}
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
              <Input
                {...register("shweKyat")}
                placeholder="ကျပ်"
                className="bg-[#ebebeb]"
              />
              <Input
                {...register("shwePae")}
                placeholder="ပဲ"
                className="bg-[#ebebeb]"
              />
              <Input
                {...register("shweYway")}
                placeholder="ရွေး"
                className="bg-[#ebebeb]"
              />
              <Input
                {...register("shweGram")}
                placeholder="G"
                className="bg-[#ebebeb]"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-1 font-semibold text-md">
                အလျော့တွက်
              </label>
              <div className="flex gap-2">
                <Input
                  {...register("alyautKyat")}
                  placeholder="ကျပ်"
                  className="bg-[#ebebeb]"
                />
                <Input
                  {...register("alyautPae")}
                  placeholder="ပဲ"
                  className="bg-[#ebebeb]"
                />
                <Input
                  {...register("alyautYway")}
                  placeholder="ရွေး"
                  className="bg-[#ebebeb]"
                />
                <Input
                  {...register("alyautGram")}
                  placeholder="G"
                  className="bg-[#ebebeb]"
                />
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
            onClick={() => nav(-1)}
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
