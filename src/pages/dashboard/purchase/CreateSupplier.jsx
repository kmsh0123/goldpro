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
import { useCreateSupplierMutation } from "@/feature/api/supplierApi/supplierApi";

// Helper function to convert KPY to grams
const kpyToGram = (kyat, pae, yway) => {
  // Convert everything to kyat first, then to grams
  const totalKyat = kyat + (pae / 16) + (yway / 128);
  return totalKyat * 16.6;
};

// Helper function to convert grams to KPY
const gramToKPY = (gramValue) => {
  // Convert grams to kyat
  const totalKyat = gramValue / 16.6;
  
  const kyat = Math.floor(totalKyat);
  const paeValue = (totalKyat - kyat) * 16;
  const pae = Math.floor(paeValue);
  const yway = Math.round((paeValue - pae) * 8);
  
  return { kyat, pae, yway };
};

const CreateSupplier = () => {
  const [createSupplier] = useCreateSupplierMutation();
  const nav = useNavigate();
  const [remainingGold, setRemainingGold] = useState({
    kyat: "",
    pae: "",
    yway: "",
    gram: ""
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
      remainingGram: ""
    },
  });

  // Handle remaining gold input changes
  const handleRemainingGoldChange = (field, value) => {
    const numValue = value === "" ? "" : Number(value);
    const newRemainingGold = { ...remainingGold, [field]: numValue };
    setRemainingGold(newRemainingGold);
    
    // Auto-calculate gram when KPY changes
    if (field !== 'gram' && numValue !== "" && 
        newRemainingGold.kyat !== "" && 
        newRemainingGold.pae !== "" && 
        newRemainingGold.yway !== "") {
      const gramValue = kpyToGram(
        Number(newRemainingGold.kyat) || 0,
        Number(newRemainingGold.pae) || 0,
        Number(newRemainingGold.yway) || 0
      );
      setRemainingGold(prev => ({ ...prev, gram: gramValue.toFixed(2) }));
    }
    
    // Auto-calculate KPY when gram changes
    if (field === 'gram' && numValue !== "") {
      const kpyValues = gramToKPY(Number(numValue) || 0);
      setRemainingGold(prev => ({
        ...prev,
        kyat: kpyValues.kyat,
        pae: kpyValues.pae,
        yway: kpyValues.yway
      }));
    }
  };

  const handleCreateCustomer = async (formData) => {
    try {
      // Add remaining gold data to form data
      const formDataWithGold = {
        ...formData,
        remainingKyat: Number(remainingGold.kyat) || 0,
        remainingPae: Number(remainingGold.pae) || 0,
        remainingYway: Number(remainingGold.yway) || 0,
        remainingGram: Number(remainingGold.gram) || 0
      };
      
      const {data} = await createSupplier(formDataWithGold);
      console.log("Supplier created successfully:", data);
      toast.success("Supplier created successfully!");
      reset();
      nav("/purchase/supplier-list");
    } catch (error) {
      console.error("Error create supplier", error);
      toast.error("Error creating supplier");
    } 
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
        <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon />
        </span>
        Create Supplier
      </h1>

      <div className="border-b-2"></div>

      <form onSubmit={handleSubmit(handleCreateCustomer)} className="space-y-6 max-w-md">
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
            {...register("supplierCode")}
            className="bg-gray-100"
          />
        </div>

        {/* Name Input */}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <Input
            placeholder="Enter Name"
            {...register("supplierName")}
            className="bg-gray-100"
          />
        </div>

        {/* Phone Input */}
        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <Input
            placeholder="Enter Phone"
            {...register("supplierPhone")}
            className="bg-gray-100"
          />
        </div>

        {/* Address Input */}
        <div>
          <label className="block mb-1 font-medium">Address</label>
          <Input
            placeholder="Enter Address"
            {...register("supplierAddress")}
            className="bg-gray-100"
          />
        </div>

        {/* Remaining Gold Section */}
        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-3 text-yellow-600">Remaining Gold Balance</h2>
          
          <div className="grid grid-cols-4 gap-3">
            {/* Kyat Input */}
            <div>
              <label className="block mb-1 font-medium">ကျပ်</label>
              <Input
                type="number"
                placeholder="0"
                value={remainingGold.kyat}
                onChange={(e) => handleRemainingGoldChange('kyat', e.target.value)}
                className="bg-gray-100"
                min="0"
              />
            </div>

            {/* Pae Input */}
            <div>
              <label className="block mb-1 font-medium">ပဲ</label>
              <Input
                type="number"
                placeholder="0"
                value={remainingGold.pae}
                onChange={(e) => handleRemainingGoldChange('pae', e.target.value)}
                className="bg-gray-100"
                min="0"
                max="15"
              />
            </div>

            {/* Yway Input */}
            <div>
              <label className="block mb-1 font-medium">ရွေး</label>
              <Input
                type="number"
                placeholder="0"
                value={remainingGold.yway}
                onChange={(e) => handleRemainingGoldChange('yway', e.target.value)}
                className="bg-gray-100"
                min="0"
                max="7"
              />
            </div>

            {/* Gram Input */}
            <div>
              <label className="block mb-1 font-medium">Gram</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={remainingGold.gram}
                onChange={(e) => handleRemainingGoldChange('gram', e.target.value)}
                className="bg-gray-100"
                min="0"
              />
            </div>
          </div>

          {/* Conversion Info */}
          {/* <div className="mt-3 text-sm text-gray-600">
            <p>
              Conversion: 1 ကျပ် = 16 ပဲ = 128 ရွေး = 16.6 ဂရမ်
            </p>
          </div> */}
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

export default CreateSupplier;