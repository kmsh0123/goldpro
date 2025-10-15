import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "lucide-react";
import { useCreateCustomerMutation } from "@/feature/api/saleApi/customerApi";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useCreateCashierMutation } from "@/feature/api/saleApi/cashierApi";

// ✅ Helper: truncate only (no rounding)
function toFixedDown(num, digits) {
  const factor = Math.pow(10, digits);
  return Math.floor(num * factor) / factor;
}

// ✅ KPY → Gram
const kpyToGram = (kyat, pae, yway) => {
  const totalKyat = kyat + pae / 16 + yway / 128;
  const gramValue = totalKyat * 16.6;
  return Math.floor(gramValue * 100) / 100; // => number truncate 2 decimals
};

// ✅ Gram → KPY
const gramToKPY = (gramValue) => {
  const totalKyat = gramValue / 16.6;

  const kyat = Math.floor(totalKyat);
  const paeValue = (totalKyat - kyat) * 16;
  const pae = Math.floor(paeValue);
  const yway = toFixedDown((paeValue - pae) * 8, 2); // ✅ allow decimal, number

  return { kyat, pae, yway };
};

const CreateCashier = () => {
  const [CreateCashier] = useCreateCashierMutation();
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



  // ✅ Create Customer Submit
  const handleCreateCashier = async (formData) => {
    try {
      const { data } = await CreateCashier(formData);
      console.log("Cashier created successfully:", data);
      toast.success("Cashier created successfully!");
      reset();
      nav("/sale/cashier-list");
    } catch (error) {
      console.error("Error create Cashier", error);
      toast.error("Error creating Cashier");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
        <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon />
        </span>
        Create Cashier
      </h1>

      <div className="border-b-2"></div>

      <form
        onSubmit={handleSubmit(handleCreateCashier)}
        className="space-y-6 max-w-md"
      >
        {/* Code Input */}
        <div>
          <label className="block mb-1 font-medium">Code</label>
          <Input
            placeholder="Enter Code"
            {...register("cashierCode")}
            className="bg-gray-100"
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

export default CreateCashier;
