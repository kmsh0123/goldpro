import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format, set } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
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

import { useNavigate, useParams } from "react-router-dom";
import { CalendarIcon, ChevronDownIcon, ChevronLeftIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { useGetPaymentCategoryQuery } from "@/feature/api/paymentCategory/paymentCategory";
import { useEditIncomeMutation, useGetDetailIncomeQuery } from "@/feature/api/incomeApi/incomeApi";
import { useGetIncomeCateoryQuery } from "@/feature/api/incomeCategory/incomeCategory";

const UpdateIncome = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [IncomeUpdate] = useEditIncomeMutation();
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = useState();
  const { data: IncomeData } = useGetDetailIncomeQuery(id);

  console.log("Income:",IncomeData?.data);
  

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const { data: GetIncomeCateogry } = useGetIncomeCateoryQuery();
  const { data: GetPaymentCateogry } = useGetPaymentCategoryQuery();

  // Type select state
  const [openIncomeCategory, setOpenIncomeCategory] = useState(false);
  const [searchIncomeCategory, setSearchIncomeCategory] = useState("");

  // Quality select state
  const [openPaymentCategory, setOpenPaymentCategory] = useState(false);
  const [searchPaymentCategory, setSearchPaymentCategory] = useState("");

  const selectedIncomeCatgoryId = watch("incomeCatId");
  const selectedPaymentCategoryId = watch("paymentCatId");

  const selectedExpenseCategoryName =
    GetIncomeCateogry?.data?.find(
      (item) => item.id.toString() === selectedIncomeCatgoryId
    )?.income_category || "";

  const selectedPaymentCategoryName =
    GetPaymentCateogry?.data?.find(
      (item) => item.id.toString() === selectedPaymentCategoryId
    )?.category_name || "";

  // const selectedQualityName =
  //   GetQuality?.data?.find((item) => item.id.toString() === selectedQualityId)
  //     ?.name || "";

  const filteredExpenseCategory = GetIncomeCateogry?.data?.filter((item) =>
    item.income_category
      .toLowerCase()
      .includes(searchIncomeCategory.toLowerCase())
  );

  const filteredPaymentCategory = GetPaymentCateogry?.data?.filter((item) =>
    item.category_name
      .toLowerCase()
      .includes(searchPaymentCategory.toLowerCase())
  );

  const handleUpdateIncome = async (formData) => {
    try {
      const payload = {
        id,
        ...formData,
        incomeDate: date ? format(date, "yyyy-MM-dd HH:mm:ss") : null,
        incomeAmount: String(formData.incomeAmount),
      };

      const { data } = await IncomeUpdate(payload);
      console.log("Income updated successfully:", data);
      toast.success("Income updated successfully!");
      reset();
      nav("/income/income-list");
    } catch (error) {
      console.error("Error update Income");
    }
  };

   useEffect(() => {
      if (IncomeData?.data) {
        const income = IncomeData?.data;
  
        reset({
          incomeFor: income.income_for || "",
          incomeCatId: income.income_cat_id?.toString() || "",
          paymentCatId: income.payment_cat_id?.toString() || "",
          incomeAmount: income.income_amount || "",
          incomeNote: income.income_note || "",
        });
        if (income.income_date) {
          setDate(new Date(income.income_date));
        }
      }
    }, [IncomeData, reset]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
        <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon />
        </span>
        Expense
      </h1>

      <div className="border-b-2"></div>

      <form
        onSubmit={handleSubmit(handleUpdateIncome)}
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
        <div className="flex flex-col gap-3">
          <Label htmlFor="date" className="px-1">
            incomeDate
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-full justify-between font-normal"
              >
                {date ? date.toLocaleDateString() : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0">
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setDate(date);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        {/* <div>
          <label className="block mb-1 font-medium">Expense Category</label>
          <Input
            placeholder="Enter Expense"
            {...register("incomeCatId")}
            // value={name}
            // onChange={(e) => setName(e.target.value)}
            className="bg-[#ebebeb]"
          />
        </div> */}

        <div>
          <label className="block mb-1 font-medium">Income Category</label>
          <Controller
            name="incomeCatId"
            control={control}
            render={({ field }) => (
              <Popover
                open={openIncomeCategory}
                onOpenChange={setOpenIncomeCategory}
              >
                <PopoverTrigger asChild>
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {selectedExpenseCategoryName || "Select Income Category"}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    {/* Search Box */}
                    <CommandInput
                      placeholder="Search type..."
                      value={searchIncomeCategory}
                      onValueChange={setSearchIncomeCategory}
                    />
                    <CommandList className="max-h-40 overflow-y-auto">
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {filteredExpenseCategory?.map((item) => (
                          <CommandItem
                            key={item.id}
                            onSelect={() => {
                              field.onChange(item.id.toString());
                              setOpenIncomeCategory(false);
                            }}
                          >
                            {item.income_category}
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

        <div>
          <label className="block mb-1 font-medium">Income For</label>
          <Input
            placeholder="Enter Expense"
            {...register("incomeFor")}
            // value={name}
            // onChange={(e) => setName(e.target.value)}
            className="bg-[#ebebeb]"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Payment Category</label>
          <Controller
            name="paymentCatId"
            control={control}
            render={({ field }) => (
              <Popover
                open={openPaymentCategory}
                onOpenChange={setOpenPaymentCategory}
              >
                <PopoverTrigger asChild>
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {selectedPaymentCategoryName || "Select Payment Category"}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    {/* Search Box */}
                    <CommandInput
                      placeholder="Search type..."
                      value={searchPaymentCategory}
                      onValueChange={setSearchPaymentCategory}
                    />
                    <CommandList className="max-h-40 overflow-y-auto">
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {filteredPaymentCategory?.map((item) => (
                          <CommandItem
                            key={item.id}
                            onSelect={() => {
                              field.onChange(item.id.toString());
                              setOpenPaymentCategory(false);
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

        <div>
          <label className="block mb-1 font-medium">Income Amount</label>
          <Input
            placeholder="Enter Expense"
            {...register("incomeAmount")}
            // value={name}
            // onChange={(e) => setName(e.target.value)}
            className="bg-[#ebebeb]"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Income Note</label>
          <Input
            placeholder="Enter Income Note"
            {...register("incomeNote")}
            // value={name}
            // onChange={(e) => setName(e.target.value)}
            className="bg-[#ebebeb]"
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

export default UpdateIncome;
