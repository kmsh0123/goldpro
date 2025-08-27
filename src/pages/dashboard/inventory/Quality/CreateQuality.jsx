import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "lucide-react";
import { useCreateQualityMutation } from "@/feature/api/inventory/qualityApi";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useGetTypeQuery } from "@/feature/api/inventory/typeApi";
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

const CreateQuality = () => {
  const nav = useNavigate();
  const [qualityCreate] = useCreateQualityMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      typeId: "", // Add this
      name: "",
    },
  });

  const { data: GetProducts } = useGetTypeQuery();

  const selectedTypeId = watch("typeId");

  // Find the selected type name for display
  const selectedTypeName =
    GetProducts?.data?.find((item) => item.id.toString() === selectedTypeId)
      ?.name || "";

  const filteredProducts = GetProducts?.data?.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateQuality = async (formData) => {
    try {
      const { data } = await qualityCreate(formData);
      console.log("Type created successfully:", data);
      toast.success("Type created successfully!");
      reset();
      nav("/inventory/quality");
    } catch (error) {
      console.error("Error create type");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
        <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon />
        </span>
        Quality
      </h1>

      <div className="border-b-2"></div>

      <form
        onSubmit={handleSubmit(handleCreateQuality)}
        className="space-y-6 max-w-xs"
      >
        {/* Type Select */}
        <div>
          <label className="block mb-1 font-medium">Type</label>
          <Controller
            name="typeId"
            control={control}
            render={({ field }) => (
              <Popover open={open} onOpenChange={setOpen}>
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
                    {/* Search Box */}
                    <CommandInput
                      placeholder="Search type..."
                      value={searchTerm}
                      onValueChange={setSearchTerm}
                    />
                    <CommandList className="max-h-40 overflow-y-auto">
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {filteredProducts?.map((item) => (
                          <CommandItem
                            key={item.id}
                            onSelect={() => {
                              field.onChange(item.id.toString());
                              setOpen(false);
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

        {/* Name Input */}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <Input
            placeholder="Enter Name"
            {...register("name")}
            // value={name}
            // onChange={(e) => setName(e.target.value)}
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

export default CreateQuality;
