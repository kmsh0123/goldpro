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
import { useCreateCustomerMutation } from "@/feature/api/saleApi/customerApi";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const CreateCustomer = () => {
  const [coaCustomer] = useCreateCustomerMutation();
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      customerCode: "",
      customerName: "",
      customerPhone: "",
      customerAddress: "",
    },
  });


  const handleCreateCustomer = async (formData) => {
    try {
      const {data} = await coaCustomer(formData);
      console.log("Customer created successfully:", data);
      toast.success("Customer created successfully!");
      reset();
      nav("/sale/customer-list");
    } catch (error) {
      console.error("Error create customer");
    } 
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
        <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon />
        </span>
        Create Customer
      </h1>

      <div className="border-b-2"></div>

      <form onSubmit={handleSubmit(handleCreateCustomer)} className="space-y-6 max-w-xs">
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

        {/* Code Input */}
        <div>
          <label className="block mb-1 font-medium">Code</label>
          <Input
            placeholder="Enter Code"
            {...register("customerCode")}
            className="bg-gray-100"
          />
        </div>

        {/* Name Input */}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <Input
            placeholder="Enter Name"
            {...register("customerName")}
            className="bg-gray-100"
          />
        </div>

        {/* Phone Input */}
        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <Input
            placeholder="Enter Name"
            {...register("customerPhone")}
            className="bg-gray-100"
          />
        </div>

         {/* Phone Input */}
        <div>
          <label className="block mb-1 font-medium">Address</label>
          <Input
            placeholder="Enter Address"
            {...register("customerAddress")}
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

export default CreateCustomer;
