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
import {
  useCreateExpenseMutation,
  useEditExpenseMutation,
  useGetDetailExpenseQuery,
  useGetExpenseQuery,
} from "@/feature/api/expenseApi/expenseApi";
import { Label } from "@/components/ui/label";
import { useGetExpenseCategoryQuery } from "@/feature/api/expenseCategory/expenseCategory";
import { useGetPaymentCategoryQuery } from "@/feature/api/paymentCategory/paymentCategory";

const UpdateExpense = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [ExpenseUpdate] = useEditExpenseMutation();
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = useState();
  const { data: ExpenseData } = useGetDetailExpenseQuery(id);

  console.log("ExpenseData", ExpenseData?.data);
  

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const { data: GetExpenseCateogry } = useGetExpenseCategoryQuery();
  const { data: GetPaymentCateogry } = useGetPaymentCategoryQuery();

  // Type select state
  const [openExpenseCategory, setOpenExpenseCategory] = useState(false);
  const [searchExpenseCategory, setSearchExpenseCategory] = useState("");

  // Quality select state
  const [openPaymentCategory, setOpenPaymentCategory] = useState(false);
  const [searchPaymentCategory, setSearchPaymentCategory] = useState("");

  const selectedExpenseCatgoryId = watch("expenseCatId");
  const selectedPaymentCategoryId = watch("paymentCatId");

  const selectedExpenseCategoryName =
    GetExpenseCateogry?.data?.find(
      (item) => item.id.toString() === selectedExpenseCatgoryId
    )?.expense_category || "";

  const selectedPaymentCategoryName =
    GetPaymentCateogry?.data?.find(
      (item) => item.id.toString() === selectedPaymentCategoryId
    )?.category_name || "";

  // const selectedQualityName =
  //   GetQuality?.data?.find((item) => item.id.toString() === selectedQualityId)
  //     ?.name || "";

  const filteredExpenseCategory = GetExpenseCateogry?.data?.filter((item) =>
    item.expense_category
      .toLowerCase()
      .includes(searchExpenseCategory.toLowerCase())
  );

  const filteredPaymentCategory = GetPaymentCateogry?.data?.filter((item) =>
    item.category_name
      .toLowerCase()
      .includes(searchPaymentCategory.toLowerCase())
  );

  useEffect(() => {
    if (ExpenseData?.data) {
      const expense = ExpenseData?.data;

      reset({
        expenseFor: expense.expense_for || "",
        expenseCatId: expense.expense_cat_id?.toString() || "",
        paymentCatId: expense.payment_cat_id?.toString() || "",
        expenseAmount: expense.expense_amount || "",
        expenseNote: expense.expense_note || "",
      });
      if (expense.expense_date) {
        setDate(new Date(expense.expense_date));
      }
    }
  }, [ExpenseData, reset]);

  const handleUpdateExpense = async (formData) => {
    try {
      const payload = {
        id,
        ...formData,
        expenseDate: date ? format(date, "yyyy-MM-dd HH:mm:ss") : null,
        expenseAmount: String(formData.expenseAmount),
      };

      const { data } = await ExpenseUpdate(payload);
      console.log("Expense updated successfully:", data);
      toast.success("Expense updated successfully!");
      reset();
      nav("/expense/expense-list");
    } catch (error) {
      console.error("Error update Expense");
    }
  };

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
        <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon />
        </span>
        Expense
      </h1>

      <div className="border-b-2"></div>

      <form
        onSubmit={handleSubmit(handleUpdateExpense)}
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
            expenseDate
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-full justify-between font-normal"
              >
                {date ? format(date, "yyyy-MM-dd") : "Select date"}
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
            {...register("expenseCatId")}
            // value={name}
            // onChange={(e) => setName(e.target.value)}
            className="bg-[#ebebeb]"
          />
        </div> */}

        <div>
          <label className="block mb-1 font-medium">Expense Category</label>
          <Controller
            name="expenseCatId"
            control={control}
            render={({ field }) => (
              <Popover
                open={openExpenseCategory}
                onOpenChange={setOpenExpenseCategory}
              >
                <PopoverTrigger asChild>
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {selectedExpenseCategoryName || "Select Expense Category"}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    {/* Search Box */}
                    <CommandInput
                      placeholder="Search type..."
                      value={searchExpenseCategory}
                      onValueChange={setSearchExpenseCategory}
                    />
                    <CommandList className="max-h-40 overflow-y-auto">
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {filteredExpenseCategory?.map((item) => (
                          <CommandItem
                            key={item.id}
                            onSelect={() => {
                              field.onChange(item.id.toString());
                              setOpenExpenseCategory(false);
                            }}
                          >
                            {item.expense_category}
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
          <label className="block mb-1 font-medium">Expense For</label>
          <Input
            placeholder="Enter Expense"
            {...register("expenseFor")}
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
          <label className="block mb-1 font-medium">Expense Amount</label>
          <Input
            placeholder="Enter Expense"
            {...register("expenseAmount")}
            // value={name}
            // onChange={(e) => setName(e.target.value)}
            className="bg-[#ebebeb]"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Expense Note</label>
          <Input
            placeholder="Enter Expense Note"
            {...register("expenseNote")}
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

export default UpdateExpense;
