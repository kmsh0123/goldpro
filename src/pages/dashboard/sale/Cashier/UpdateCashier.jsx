import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeftIcon } from "lucide-react";
import { useCreateCustomerMutation } from "@/feature/api/saleApi/customerApi";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {useEditCashierMutation, useGetDetailCashierQuery} from "@/feature/api/saleApi/cashierApi";

const UpdateCashier = () => {
  const {id} = useParams();
  const [UpdateCashier] = useEditCashierMutation();
  const {data} = useGetDetailCashierQuery(id);
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cashierCode: "",
      cashierName: "",
      cashierAddress: "",
      cashierPhone: "",
    },
  });

  useEffect(() => {
      if (data?.data) {
        reset({
          cashierCode: data?.data?.cashier_code,
          cashierName: data?.data?.cashier_name,
          cashierAddress: data?.data?.cashier_address,
          cashierPhone: data?.data?.cashier_phone,
        });
      }
    }, [data, reset]);



  // ✅ Create Customer Submit
  const handleUpdateCashier = async (formData) => {
    try {
      const { data } = await UpdateCashier({formData,id});
      console.log("Cashier updated successfully:", data);
      toast.success("Cashier updated successfully!");
      reset();
      nav("/sale/cashier-list");
    } catch (error) {
      console.error("Error update Cashier", error);
      toast.error("Error updating Cashier");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
        <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon />
        </span>
        Update Cashier
      </h1>

      <div className="border-b-2"></div>

      <form
        onSubmit={handleSubmit(handleUpdateCashier)}
        className="space-y-6 max-w-md"
      >
        {/* Code Input */}
        <div>
          <label className="block mb-1 font-medium">Code</label>
          <Input
            placeholder="Enter Code"
            {...register("cashierCode")}
            className="bg-gray-100 cursor-not-allowed"
            readOnly
          />
        </div>

        {/* Name Input */}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <Input
            placeholder="Enter Name"
            {...register("cashierName")}
            className="bg-gray-100"
          />
        </div>

        {/* Phone Input */}
        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <Input
            placeholder="Enter Phone"
            {...register("cashierAddress")}
            className="bg-gray-100"
          />
        </div>

        {/* Address Input */}
        <div>
          <label className="block mb-1 font-medium">Address</label>
          <Input
            placeholder="Enter Address"
            {...register("cashierPhone")}
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

export default UpdateCashier;
