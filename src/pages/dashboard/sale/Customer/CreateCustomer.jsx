import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "lucide-react";
import { useCreateCustomerMutation } from "@/feature/api/saleApi/customerApi";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

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

const CreateCustomer = () => {
  const [coaCustomer] = useCreateCustomerMutation();
  const nav = useNavigate();
  const [remainingGold, setRemainingGold] = useState({
    kyat: "",
    pae: "",
    yway: "",
    gram: "",
  });

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
      remainingKyat: "",
      remainingPae: "",
      remainingYway: "",
      remainingGram: "",
    },
  });

  // ✅ Handle Remaining Gold Input Changes
  const handleRemainingGoldChange = (field, value) => {
    const numValue = value === "" ? "" : Number(value);
    const newRemainingGold = { ...remainingGold, [field]: numValue };
    setRemainingGold(newRemainingGold);

    // Auto-calc gram when KPY changes
    if (
      field !== "gram" &&
      numValue !== "" &&
      newRemainingGold.kyat !== "" &&
      newRemainingGold.pae !== "" &&
      newRemainingGold.yway !== ""
    ) {
      const gramValue = kpyToGram(
        Number(newRemainingGold.kyat) || 0,
        Number(newRemainingGold.pae) || 0,
        Number(newRemainingGold.yway) || 0
      );
      setRemainingGold((prev) => ({
        ...prev,
        gram: gramValue, // ✅ keep number
      }));
    }

    // Auto-calc KPY when gram changes
    if (field === "gram" && numValue !== "") {
      const kpyValues = gramToKPY(Number(numValue) || 0);
      setRemainingGold((prev) => ({
        ...prev,
        kyat: kpyValues.kyat,
        pae: kpyValues.pae,
        yway: kpyValues.yway,
      }));
    }
  };

  // ✅ Create Customer Submit
  const handleCreateCustomer = async (formData) => {
    try {
      const formDataWithGold = {
        ...formData,
        remainingKyat: Number(remainingGold.kyat) || 0,
        remainingPae: Number(remainingGold.pae) || 0,
        remainingYway: Number(remainingGold.yway) || 0,
        remainingGram: Number(remainingGold.gram) || 0,
      };

      const { data } = await coaCustomer(formDataWithGold);
      console.log("Customer created successfully:", data);
      toast.success("Customer created successfully!");
      reset();
      nav("/sale/customer-list");
    } catch (error) {
      console.error("Error create customer", error);
      toast.error("Error creating customer");
    }
  };

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

      <form
        onSubmit={handleSubmit(handleCreateCustomer)}
        className="space-y-6 max-w-md"
      >
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
            placeholder="Enter Phone"
            {...register("customerPhone")}
            className="bg-gray-100"
          />
        </div>

        {/* Address Input */}
        <div>
          <label className="block mb-1 font-medium">Address</label>
          <Input
            placeholder="Enter Address"
            {...register("customerAddress")}
            className="bg-gray-100"
          />
        </div>

        {/* Remaining Gold Section */}
        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-3 text-yellow-600">
            Remaining Gold Balance
          </h2>

          <div className="grid grid-cols-4 gap-3">
            {/* Kyat */}
            <div>
              <label className="block mb-1 font-medium">ကျပ်</label>
              <Input
                type="number"
                placeholder="0"
                value={remainingGold.kyat}
                onChange={(e) =>
                  handleRemainingGoldChange("kyat", e.target.value)
                }
                className="bg-gray-100"
                min="0"
              />
            </div>

            {/* Pae */}
            <div>
              <label className="block mb-1 font-medium">ပဲ</label>
              <Input
                type="number"
                placeholder="0"
                value={remainingGold.pae}
                onChange={(e) =>
                  handleRemainingGoldChange("pae", e.target.value)
                }
                className="bg-gray-100"
                min="0"
                max="15"
              />
            </div>

            {/* Yway (decimal allowed) */}
            <div>
              <label className="block mb-1 font-medium">ရွေး</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0"
                value={remainingGold.yway}
                onChange={(e) =>
                  handleRemainingGoldChange("yway", e.target.value)
                }
                className="bg-gray-100"
                min="0"
              />
            </div>

            {/* Gram */}
            <div>
              <label className="block mb-1 font-medium">Gram</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={remainingGold.gram}
                onChange={(e) =>
                  handleRemainingGoldChange("gram", e.target.value)
                }
                className="bg-gray-100"
                min="0"
              />
            </div>
          </div>
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
