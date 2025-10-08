import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeftIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Textarea } from "@/components/ui/textarea";
import { useEditPaymentCategoryMutation, useGetDetailPaymentCategoryQuery, useGetPaymentCategoryQuery } from "@/feature/api/paymentCategory/paymentCategory";


const UpdatePaymentCategory = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const [PaymentCategoryEdit] = useEditPaymentCategoryMutation();
  const { data } = useGetDetailPaymentCategoryQuery(id);  

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

    useEffect(() => {
      if (data?.data) {
        reset({
          categoryName: data?.data?.category_name,
        });
      }
    }, [data, reset]);

  const handleEditPaymentCategory = async (formData) => {
    try {
      const { data } = await PaymentCategoryEdit({formData, id});
      console.log("Payment Category Updated successfully:", data);
      toast.success("Payment Category Updated successfully!");
      reset();
      nav("/payment/payment-category-list");
    } catch (error) {
      console.error("Error update Payment Category");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
        <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon />
        </span>
        Payment Category
      </h1>

      <div className="border-b-2"></div>

      <form
        onSubmit={handleSubmit(handleEditPaymentCategory)}
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
          <label className="block mb-1 font-medium">Payment Category</label>
          <Input
            placeholder="Enter Payment Category"
            {...register("categoryName")}
            // value={name}
            // onChange={(e) => setName(e.target.value)}
            className="bg-[#ebebeb]"
          />
        </div>

        {/* <div>
          <label className="block mb-1 font-medium">Payment Category Note</label>
          <Textarea
            placeholder="Enter Description"
            className="bg-[#ebebeb] w-full h-32"
            rows={3}
            {...register("expenseNote")}
          />
        </div> */}

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

export default UpdatePaymentCategory;
