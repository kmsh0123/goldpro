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
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useCreateExpenseCategoryMutation } from "@/feature/api/expenseCategory/expenseCategory";
import { Textarea } from "@/components/ui/textarea";
import { useCreateIncomeCategoryMutation } from "@/feature/api/incomeCategory/incomeCategory";

const CreateIncomeCategory = () => {
  const nav = useNavigate();
  const [IncomeCategoryCreate] = useCreateIncomeCategoryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleCreateIncomeCategory = async (formData) => {
    try {
      const { data } = await IncomeCategoryCreate(formData);
      console.log("Income Category created successfully:", data);
      toast.success("Income Category created successfully!");
      reset();
      nav("/income/income-category-list");
    } catch (error) {
      console.error("Error create Income Category");
    }
  };

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
        <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon />
        </span>
        Income Category
      </h1>

      <div className="border-b-2"></div>

      <form
        onSubmit={handleSubmit(handleCreateIncomeCategory)}
        className="space-y-6 max-w-xs"
      >
        {/* Code Select */}
        {/* <div>
          <label className="block mb-1 font-medium">Code</label>
          <Select value={code} onValueChange={(value) => setCode(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Code" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="R">R</SelectItem>
              <SelectItem value="G">G</SelectItem>
              <SelectItem value="D">D</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        {/* Name Input */}
        <div>
          <label className="block mb-1 font-medium">Income Category</label>
          <Input
            placeholder="Enter Income Category"
            {...register("incomeCategory")}
            // value={name}
            // onChange={(e) => setName(e.target.value)}
            className="bg-[#ebebeb]"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Income Category Note</label>
          <Textarea
            placeholder="Enter Description"
            className="bg-[#ebebeb] w-full h-32"
            rows={3}
            {...register("incomeNote")}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-2">
          <Button
            type="button"
            variant="outline"
            className="bg-gray-100 text-gray-700"
            onClick={() => navigate(-1)}
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

export default CreateIncomeCategory;
