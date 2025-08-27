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
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeftIcon } from "lucide-react";
import { useCreateTypeMutation, useUpdateTypeMutation } from "@/feature/api/inventory/typeApi";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const UpdateType = () => {
  const nav = useNavigate();
  const [typeUpdate] = useUpdateTypeMutation();
  const {id} = useParams();

  const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
      } = useForm();

const handleCreateType = async (formData) => {
  try {
    const {data} = await typeUpdate({formData,id});
    console.log("Type created successfully:", data);
    toast.success("Type created successfully!");
    reset();
    nav("/inventory/type");
  } catch (error) {
    console.error("Error create type");
  } 
}

  return (
    <div className="space-y-4">
      {/* Header */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
        <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon />
        </span>
        Edit Type
      </h1>

      <div className="border-b-2"></div>

      <form onSubmit={handleSubmit(handleCreateType)} className="space-y-6 max-w-xs">

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
            onClick={() => window.history.back()}
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

export default UpdateType;
