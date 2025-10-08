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
import { useCreatePaymentMutation, useEditPaymentMutation, useGetDetailPaymentQuery } from "@/feature/api/paymentApi/paymentApi";
import { useGetPaymentCategoryQuery } from "@/feature/api/paymentCategory/paymentCategory";
import { use } from "react";

const UpdatePayment = () => {
  const nav = useNavigate();
  const {id} = useParams();
  const [paymentUpdate] = useEditPaymentMutation();
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
      paymentCatId: "", // Add this
      amount: "",
    },
  });

  const {data} = useGetDetailPaymentQuery(id);


  const { data: GetPayments } = useGetPaymentCategoryQuery();  

  const selectedPaymentId = watch("paymentCatId");

  // Find the selected type name for display
  const selectedPaymentName =
    GetPayments?.data?.find((item) => item.id.toString() === selectedPaymentId)
      ?.category_name || "";

  const filteredPayments = GetPayments?.data?.filter((item) =>
    item.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

   useEffect(() => {
      if (data?.data) {
        reset({
          paymentCatId: data?.data?.payment_cat_id?.toString() || "",
          amount: data?.data?.amount,
        });
      }
    }, [data, reset]);

  const handleUpdatePayment = async (formData) => {
    try {
      const { data } = await paymentUpdate({formData,id});
      console.log("Payment created successfully:", data);
      toast.success("Payment created successfully!");
      reset();
      nav("/payment/payment-list");
    } catch (error) {
      console.error("Error create Payment");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
        <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon />
        </span>
        Create Payment
      </h1>

      <div className="border-b-2"></div>

      <form
        onSubmit={handleSubmit(handleUpdatePayment)}
        className="space-y-6 max-w-xs"
      >
        {/* Type Select */}
        <div>
          <label className="block mb-1 font-medium">Payment Category</label>
          <Controller
            name="paymentCatId"
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
                      {selectedPaymentName || "Select Payment Category"}
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
                        {filteredPayments?.map((item) => (
                          <CommandItem
                            key={item.id}
                            onSelect={() => {
                              field.onChange(item.id.toString());
                              setOpen(false);
                            }}
                          >
                            {item.category_name}
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
          <label className="block mb-1 font-medium">Amount</label>
          <Input
            placeholder="Enter Amount"
            {...register("amount")}
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

export default UpdatePayment;
