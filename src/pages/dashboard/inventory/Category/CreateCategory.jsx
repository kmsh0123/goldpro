import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useGetTypeQuery } from "@/feature/api/inventory/typeApi";
import { useGetQualityQuery } from "@/feature/api/inventory/qualityApi";
import { useCreateCategoryMutation } from "@/feature/api/inventory/categoryApi";
import { toast } from "react-toastify";

const CreateCategory = () => {
  const [categoryCreate] = useCreateCategoryMutation();

  // Type select state
  const [openType, setOpenType] = useState(false);
  const [searchType, setSearchType] = useState("");

  // Quality select state
  const [openQuality, setOpenQuality] = useState(false);
  const [searchQuality, setSearchQuality] = useState("");

  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
  } = useForm({
    defaultValues: {
      typeId: "",
      qualityId: "",
      name: "",
      code: "",
    },
  });

  const { data: GetType } = useGetTypeQuery();
  const { data: GetQuality } = useGetQualityQuery();

  const selectedTypeId = watch("typeId");
  const selectedQualityId = watch("qualityId");

  const selectedTypeName =
    GetType?.data?.find((item) => item.id.toString() === selectedTypeId)?.name ||
    "";

  const selectedQualityName =
    GetQuality?.data?.find((item) => item.id.toString() === selectedQualityId)
      ?.name || "";

  const handleCreateCategory = async (formData) => {
    try {
      const { data } = await categoryCreate(formData);
      console.log("Category created successfully:", data);
      toast.success("Category created successfully!");
      reset();
      nav("/inventory/category");
    } catch (error) {
      console.error("Error create category");
    }
  };

  const filteredType = GetType?.data?.filter((item) =>
    item.name.toLowerCase().includes(searchType.toLowerCase())
  );

  const filteredQuality = GetQuality?.data?.filter((item) =>
    item.name.toLowerCase().includes(searchQuality.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
        <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon />
        </span>
        Create Category
      </h1>

      <div className="border-b-2"></div>

      <form
        onSubmit={handleSubmit(handleCreateCategory)}
        className="space-y-6 max-w-xs"
      >
        {/* Type Select */}
        <div>
          <label className="block mb-1 font-medium">Type</label>
          <Controller
            name="typeId"
            control={control}
            render={({ field }) => (
              <Popover open={openType} onOpenChange={setOpenType}>
                <PopoverTrigger asChild>
                 <div>
                   <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedTypeName || "Select Type"}
                  </Button>
                 </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search type..."
                      value={searchType}
                      onValueChange={setSearchType}
                    />
                    <CommandList className="max-h-40 overflow-y-auto">
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {filteredType?.map((item) => (
                          <CommandItem
                            key={item.id}
                            onSelect={() => {
                              field.onChange(item.id.toString());
                              setOpenType(false);
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

        {/* Quality Select */}
        <div>
          <label className="block mb-1 font-medium">Quality</label>
          <Controller
            name="qualityId"
            control={control}
            render={({ field }) => (
              <Popover open={openQuality} onOpenChange={setOpenQuality}>
                <PopoverTrigger asChild>
                  <div>
                    <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedQualityName || "Select Quality"}
                  </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search quality..."
                      value={searchQuality}
                      onValueChange={setSearchQuality}
                    />
                    <CommandList className="max-h-40 overflow-y-auto">
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {filteredQuality?.map((item) => (
                          <CommandItem
                            key={item.id}
                            onSelect={() => {
                              field.onChange(item.id.toString());
                              setOpenQuality(false);
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

        {/* Code Input */}
        <div>
          <label className="block mb-1 font-medium">Code</label>
          <Input
            placeholder="Enter Code"
            {...register("code")}
            className="bg-gray-100"
          />
        </div>

        {/* Name Input */}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <Input
            placeholder="Enter Name"
            {...register("name")}
            className="bg-gray-100"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-2">
          <Button
            type="button"
            variant="outline"
            className="bg-gray-100 text-gray-700"
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

export default CreateCategory;
