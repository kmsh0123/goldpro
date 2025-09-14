import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  setGoldLaathk,
  setGoldWeight,
  setpayment,
  setCash,
  setAlyut,
  resetGoldWeight,
  resetpayment,
  addPayment,
  resetAlyutWeight,
  setDiscount,
  addDiscountPayment,
  setDiscountCash,
} from "@/feature/service/cartSlice";
import { useGetCustomerQuery } from "@/feature/api/saleApi/customerApi";
import { Controller, useForm } from "react-hook-form";
import { useGetProductQuery } from "@/feature/api/inventory/productApi";
import { addToPayment } from "@/feature/service/paymentSlice";
import { useGetTypeQuery } from "@/feature/api/inventory/typeApi";
import { useGetQualityQuery } from "@/feature/api/inventory/qualityApi";
import { useGetCategoryQuery } from "@/feature/api/inventory/categoryApi";

const POSLeft = () => {
  const [searchProductName, setSearchProductName] = useState("");
  const [searchCustomerName, setSearchCustomerName] = useState("");
  const [searchTypeName, setSearchTypeName] = useState("");
  const [searchQuality, setSearchQuality] = useState("");
  const [searchQualityTwo, setSearchQualityTwo] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [productWeight, setProductWeight] = useState({
    kyat: "",
    pae: "",
    yway: "",
    gram: "",
  });

  const [voucherCode, setVoucherCode] = useState("");
  const [todayRate, setTodayRate] = useState("");
  const [stock, setStock] = useState("");
  const [qty, setQty] = useState("");
  const [openProduct, setOpenProduct] = useState(false);
  const [openCustomer, setOpenCustomer] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [openQuality, setOpenQuality] = useState(false);
  const [openQualityTwo, setOpenQualityTwo] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  const dispatch = useDispatch();
  const { kyat, pae, yway, gram } = useSelector(
    (state) => state.cart.goldWeight
  );

  const {
    kyat: alyautKyat,
    pae: alyautPae,
    yway: alyautYway,
    gram: alyautGram,
  } = useSelector((state) => state.cart.alyut);

  const {
    kyat: payKyat,
    pae: payPae,
    yway: payYway,
    gram: payGram,
  } = useSelector((state) => state.cart.payment);

  const {
    kyat: discountKyat,
    pae: discountPae,
    yway: discountYway,
    gram: discountGram,
  } = useSelector((state) => state.cart.discount);

  const cash = useSelector((state) => state.cart.cash);
  const discountcash = useSelector((state) => state.cart.discountcash);

  const { laathk } = useSelector((state) => state.cart);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      customerId: "",
      name: "",
    },
  });

  const { data: GetProducts } = useGetProductQuery();
  const { data: GetCustomer } = useGetCustomerQuery();
  const { data: GetType } = useGetTypeQuery();
  const { data: GetQuality } = useGetQualityQuery();
  const { data: GetCategory } = useGetCategoryQuery();

  const selectedProductId = watch("productId");
  const selectedCustomerId = watch("customerId");
  const selectedTypeId = watch("typeId");
  const selectedQualityId = watch("qualityId");
  const selectedCategoryId = watch("categoryId");

  const selectedProductName =
    GetProducts?.data?.find((item) => item.id.toString() === selectedProductId)
      ?.name || "";

  const selectedCustomer = GetCustomer?.data?.find(
    (item) => item.id.toString() === selectedCustomerId
  );

  const selectedCustomerName = selectedCustomer?.customer_name || "";
  const customerCode = selectedCustomer?.customer_code || "";
  const remainingKyat = selectedCustomer?.remaining_kyat || 0;
  const remainingPae = selectedCustomer?.remaining_pae || 0;
  const remainingYway = selectedCustomer?.remaining_yway || 0;
  const remainingGram = selectedCustomer?.remaining_gram || 0;

  const selectedTypeName =
    GetType?.data?.find((item) => item.id.toString() === selectedTypeId)
      ?.name || "";

  const selectedQualityName =
    GetQuality?.data?.find((item) => item.id.toString() === selectedQualityId)
      ?.name || "";

  const selectedQualityNameTwo =
    GetQuality?.data?.find((item) => item.id.toString() === selectedQualityId)
      ?.name || "";

  const selectedCategoryName =
    GetCategory?.data?.find((item) => item.id.toString() === selectedCategoryId)
      ?.name || "";

  useEffect(() => {
    if (selectedProductId) {
      const product = GetProducts?.data?.find(
        (item) => item.id.toString() === selectedProductId
      );

      setStock(product?.stock || "");
      setProductWeight({ kyat: "", pae: "", yway: "", gram: "" });
    } else {
      setStock("");
      setProductWeight({ kyat: "", pae: "", yway: "", gram: "" });
    }
  }, [selectedProductId, GetProducts]);

  const filteredProducts = GetProducts?.data?.filter((item) =>
    item.name.toLowerCase().includes(searchProductName.toLowerCase())
  );

  const filteredCustomers = GetCustomer?.data?.filter((item) =>
    item.customer_name.toLowerCase().includes(searchCustomerName.toLowerCase())
  );

  const filteredType = GetType?.data?.filter((item) =>
    item.name.toLowerCase().includes(searchTypeName.toLowerCase())
  );

  const filteredQuality = GetQuality?.data?.filter((item) =>
    item.name.toLowerCase().includes(searchQuality.toLowerCase())
  );

  const filteredQualityTwo = GetQuality?.data?.filter((item) =>
    item.name.toLowerCase().includes(searchQualityTwo.toLowerCase())
  );

  const filteredCategory = GetCategory?.data?.filter((item) =>
    item.name.toLowerCase().includes(searchCategory.toLowerCase())
  );

  const kyatPaeYwayToGram = (kyat, pae, yway) => {
    const totalKyat =
      (parseFloat(kyat) || 0) +
      (parseFloat(pae) || 0) / 16 +
      (parseFloat(yway) || 0) / 128;
    return (totalKyat * 16.6).toFixed(2);
  };

  const gramToKyatPaeYway = (gram) => {
    const kyatValue = gram / 16.6;
    const kyat = Math.floor(kyatValue);

    const paeValue = (kyatValue - kyat) * 16;
    const pae = Math.floor(paeValue);

    const ywayValue = (paeValue - pae) * 8;
    const yway = Math.floor(ywayValue);

    return { kyat, pae, yway };
  };

  const handleChange = (field, value) => {
    let newValue = value;

    if (field === "gram") {
      const { kyat, pae, yway } = gramToKyatPaeYway(parseFloat(newValue) || 0);
      dispatch(setGoldWeight({ kyat, pae, yway, gram: newValue }));
    } else {
      const newState = { kyat, pae, yway, gram };
      newState[field] = newValue;
      const newGram = kyatPaeYwayToGram(
        newState.kyat,
        newState.pae,
        newState.yway
      );
      dispatch(setGoldWeight({ ...newState, gram: newGram }));
    }
  };

  const handleAlyautChange = (field, value) => {
    if (field === "gram") {
      const { kyat, pae, yway } = gramToKyatPaeYway(parseFloat(value) || 0);
      dispatch(setAlyut({ kyat, pae, yway, gram: value }));
    } else {
      const newState = {
        kyat: alyautKyat,
        pae: alyautPae,
        yway: alyautYway,
        gram: alyautGram,
      };
      newState[field] = value;
      const newGram = kyatPaeYwayToGram(
        newState.kyat,
        newState.pae,
        newState.yway
      );
      dispatch(setAlyut({ ...newState, gram: newGram }));
    }
  };

  const handlePaymentChange = (field, value) => {
    if (field === "gram") {
      const { kyat, pae, yway } = gramToKyatPaeYway(parseFloat(value) || 0);
      dispatch(setpayment({ kyat, pae, yway, gram: value }));
    } else {
      const newState = {
        kyat: payKyat,
        pae: payPae,
        yway: payYway,
        gram: payGram,
      };
      newState[field] = value;
      const newGram = kyatPaeYwayToGram(
        newState.kyat,
        newState.pae,
        newState.yway
      );
      dispatch(setpayment({ ...newState, gram: newGram }));
    }
  };

  const handleDiscountChange = (field, value) => {
    if (field === "gram") {
      const { kyat, pae, yway } = gramToKyatPaeYway(parseFloat(value) || 0);
      dispatch(setDiscount({ kyat, pae, yway, gram: value }));
    } else {
      const newState = {
        kyat: discountKyat,
        pae: discountPae,
        yway: discountYway,
        gram: discountGram,
      };
      newState[field] = value;
      const newGram = kyatPaeYwayToGram(
        newState.kyat,
        newState.pae,
        newState.yway
      );
      dispatch(setDiscount({ ...newState, gram: newGram }));
    }
  };

  const handleCashChange = (value) => {
    dispatch(setCash(value));
  };

  const handleDiscountCashChange = (value) => {
    dispatch(setDiscountCash(value));
  };

  const handleLaathkChange = (value) => {
    dispatch(setGoldLaathk(value));
  };

  const handleAdd = () => {
    const selectedQuality = GetQuality?.data?.find(
      (q) => q.id.toString() === selectedQualityId
    );

    const newItem = {
      productId: selectedProductId,
      typeId: selectedTypeId,
      qualityId: selectedQualityId,
      qualityName: selectedQuality?.name || "",
      karat: selectedQuality?.name?.replace("K", "") || 24,
      categoryId: selectedCategoryId,
      productName: selectedProductName,
      customerName: selectedCustomerName,
      customerId: selectedCustomerId,
      customerCode: customerCode,
      // Add remaining balance data
      remainingKyat: Number(remainingKyat) || 0,
      remainingPae: Number(remainingPae) || 0,
      remainingYway: Number(remainingYway) || 0,
      remainingGram: Number(remainingGram) || 0,
      voucherCode,
      todayRate,
      stock,
      qty,
      kyat,
      pae,
      yway,
      gram,
      alyautKyat,
      alyautPae,
      alyautYway,
      alyautGram,

      paymentKyat: Number(payKyat) || 0,
      paymentPae: Number(payPae) || 0,
      paymentYway: Number(payYway) || 0,
      paymentGram: Number(payGram) || 0,
      paymentCash: Number(cash) || 0,

      discountKyat: Number(discountKyat) || 0,
      discountPae: Number(discountPae) || 0,
      discountYway: Number(discountYway) || 0,
      discountGram: Number(discountGram) || 0,
      discountCash: Number(discountcash) || 0,
      
      laathk: parseFloat(laathk) || 0,
    };

    dispatch(addToCart(newItem));

    // Reset form fields
    // reset();
    dispatch(resetGoldWeight());
    dispatch(resetAlyutWeight());
    setQty("");
    console.log(newItem);
    
  };

  const handlePayment = () => {
    dispatch(
      addPayment({
        kyat: payKyat,
        pae: payPae,
        yway: payYway,
        gram: payGram,
        cash,
      })
    );
    // Reset payment fields
    dispatch(resetpayment());
  };

  const handleDiscountPayment = () => {
    dispatch(
      addDiscountPayment({
        kyat: discountKyat,
        pae: discountPae,
        yway: discountYway,
        gram: discountGram,
        discountCash: discountcash, // Fixed field name
      })
    );
    // Reset discount fields
    dispatch(setDiscount({ kyat: "", pae: "", yway: "", gram: "" }));
    dispatch(setDiscountCash(""));
  };

  const handleQtyChange = (e) => {
    const value = Number(e.target.value);
    setQty(value);

    if (value > stock) {
      alert("Not enough stock!");
      setQty("");
    }
  };

  // Reset functions for better UX
  const resetPaymentFields = () => {
    dispatch(resetpayment());
  };

  const resetDiscountFields = () => {
    dispatch(setDiscount({ kyat: "", pae: "", yway: "", gram: "" }));
    dispatch(setDiscountCash(""));
  };

  return (
    <div className="space-y-4">
      {/* Top Buttons */}
      <div className="flex gap-4">
        <div>
          <label className="block mb-1 font-medium">Customer Name</label>
          <Controller
            name="customerId"
            control={control}
            render={({ field }) => (
              <Popover open={openCustomer} onOpenChange={setOpenCustomer}>
                <PopoverTrigger asChild>
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {selectedCustomerName || "Select Customer"}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-32 p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search customer..."
                      value={searchCustomerName}
                      onValueChange={setSearchCustomerName}
                    />
                    <CommandList className="max-h-40 overflow-y-auto">
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {filteredCustomers?.map((item) => (
                          <CommandItem
                            key={item.id}
                            onSelect={() => {
                              field.onChange(item.id.toString());
                              setOpenCustomer(false);
                            }}
                          >
                            {item.customer_name}
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
      </div>

      <div className="flex items-center gap-5 mt-5 w-full">
          <div className="">
            <label className="block mb-1 font-medium">Voucher Code</label>
          <Input
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            placeholder="Voucher Code"
            className="w-32 bg-gray-200"
          />
          </div>

         <div className="">
           <label className="block mb-1 font-medium">Today Gold Rate</label>
          <Input
            value={todayRate}
            onChange={(e) => setTodayRate(e.target.value)}
            placeholder="Today Gold Rate"
            className="w-32 bg-gray-200"
          />
         </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-row items-center gap-5">
        <div>
          <label className="block mb-1 font-medium">Product Name</label>
          <Controller
            name="productId"
            control={control}
            render={({ field }) => (
              <Popover open={openProduct} onOpenChange={setOpenProduct}>
                <PopoverTrigger asChild>
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      className="w-32 justify-between"
                    >
                      {selectedProductName || "Select Product"}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-32 p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search product..."
                      value={searchProductName}
                      onValueChange={setSearchProductName}
                    />
                    <CommandList className="max-h-40 overflow-y-auto">
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {filteredProducts?.map((item) => (
                          <CommandItem
                            key={item.id}
                            onSelect={() => {
                              field.onChange(item.id.toString());
                              setOpenProduct(false);
                            }}
                          >
                            {item.name}
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
          <label className="block mb-1 font-medium">Type</label>
          <Controller
            name="typeId"
            control={control}
            render={({ field }) => (
              <Popover open={openType} onOpenChange={setOpenType}>
                <PopoverTrigger asChild>
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      className="w-32 justify-between"
                    >
                      {selectedTypeName || "Select Type"}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-32 p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search type..."
                      value={searchTypeName}
                      onValueChange={setSearchTypeName}
                      
                    />
                    <CommandList className="max-h-40 overflow-y-auto">
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {filteredType?.map((item) => (
                          <CommandItem
                            key={item.id}
                            onSelect={() => {
                              field.onChange(item.id.toString());
                              setOpenType(false);
                            }}
                          >
                            {item.name}
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

       

        <div className="w-full">
          <label className="block mb-1 font-medium">Category</label>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Popover open={openCategory} onOpenChange={setOpenCategory}>
                <PopoverTrigger asChild>
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      className="w-32 justify-between"
                    >
                      {selectedCategoryName || "Select Category"}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-32 p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search category..."
                      value={searchCategory}
                      onValueChange={setSearchCategory}
                    />
                    <CommandList className="max-h-40 overflow-y-auto">
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {filteredCategory?.map((item) => (
                          <CommandItem
                            key={item.id}
                            onSelect={() => {
                              field.onChange(item.id.toString());
                              setOpenCategory(false);
                            }}
                          >
                            {item.name}
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
      </div>

      <div className="flex items-center gap-5">
         <div>
          <label className="block mb-1 font-medium">Gold Quality</label>
          <Controller
            name="qualityId"
            control={control}
            render={({ field }) => (
              <Popover open={openQuality} onOpenChange={setOpenQuality}>
                <PopoverTrigger asChild>
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      className="w-32 justify-between"
                    >
                      {selectedQualityName || "Select Quality"}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-32 p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search quality..."
                      value={searchQuality}
                      onValueChange={setSearchQuality}
                    />
                    <CommandList className="max-h-40 overflow-y-auto">
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {filteredQuality?.map((item) => (
                          <CommandItem
                            key={item.id}
                            onSelect={() => {
                              field.onChange(item.id.toString());
                              setOpenQuality(false);
                            }}
                          >
                            {item.name}
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
          <label className="block mb-1 font-medium">Stock</label>
          <Input
            value={stock}
            readOnly
            placeholder="Stock"
            className="w-32 bg-gray-200 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Weight */}
      <div>
        <h3 className="font-bold text-sm">Gold Weight</h3>
        <div className="mt-2">
          <p className="text-sm mb-1">အလျော့တွက်</p>
          <div className="flex gap-2">
            <Input
              placeholder="K"
              value={alyautKyat}
              onChange={(e) => handleAlyautChange("kyat", e.target.value)}
              className="w-16 bg-gray-100"
            />
            <Input
              placeholder="P"
              value={alyautPae}
              onChange={(e) => handleAlyautChange("pae", e.target.value)}
              className="w-16 bg-gray-100"
            />
            <Input
              placeholder="Y"
              value={alyautYway}
              onChange={(e) => handleAlyautChange("yway", e.target.value)}
              className="w-16 bg-gray-100"
            />
            <Input
              placeholder="G"
              value={alyautGram}
              onChange={(e) => handleAlyautChange("gram", e.target.value)}
              className="w-16 bg-gray-100"
            />
            <Input
              placeholder="Qty"
              value={qty}
              onChange={handleQtyChange}
              className="w-16 bg-gray-100"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="mt-2">
          <p className="text-sm mb-1">ရွှေချိန်</p>
          <div className="flex gap-2">
            <Input
              placeholder="K"
              value={kyat}
              onChange={(e) => handleChange("kyat", e.target.value)}
              className="w-16 bg-gray-100"
            />
            <Input
              placeholder="P"
              value={pae}
              onChange={(e) => handleChange("pae", e.target.value)}
              className="w-16 bg-gray-100"
            />
            <Input
              placeholder="Y"
              value={yway}
              onChange={(e) => handleChange("yway", e.target.value)}
              className="w-16 bg-gray-100"
            />
            <Input
              placeholder="G"
              value={gram}
              onChange={(e) => handleChange("gram", e.target.value)}
              className="w-16 bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* လက်ခ */}
      <div className="w-1/2">
        <label className="block mb-1 font-medium">လက်ခ</label>
        <Input
          placeholder="လက်ခ"
          value={laathk}
          onChange={(e) => handleLaathkChange(e.target.value)}
          className="bg-gray-100"
        />
      </div>

      <div className="flex gap-4 mt-4">
        <Button
          variant="outline"
          className="bg-gray-100 text-gray-700"
          onClick={() => {
            reset();
            dispatch(resetGoldWeight());
            dispatch(resetAlyutWeight());
            setQty("");
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAdd}
          className="bg-yellow-600 hover:bg-yellow-700 text-white"
        >
          Add
        </Button>
      </div>

      {/* Payment */}
      <div className="mt-6">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-sm w-96">Payment</h3>
          {/* <Controller
            name="qualityId"
            control={control}
            render={({ field }) => (
              <Popover open={openQualityTwo} onOpenChange={setOpenQualityTwo}>
                <PopoverTrigger asChild>
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {selectedQualityNameTwo || "Select Quality"}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search quality..."
                      value={searchQualityTwo}
                      onValueChange={setSearchQualityTwo}
                    />
                    <CommandList className="max-h-40 overflow-y-auto">
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {filteredQualityTwo?.map((item) => (
                          <CommandItem
                            key={item.id}
                            onSelect={() => {
                              field.onChange(item.id.toString());
                              setOpenQualityTwo(false);
                            }}
                          >
                            {item.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          /> */}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <p className="text-sm mb-1">ရွှေချိန်</p>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="K"
                value={payKyat}
                onChange={(e) => handlePaymentChange("kyat", e.target.value)}
                className="w-16 bg-gray-100"
              />
              <Input
                placeholder="P"
                value={payPae}
                onChange={(e) => handlePaymentChange("pae", e.target.value)}
                className="w-16 bg-gray-100"
              />
              <Input
                placeholder="Y"
                value={payYway}
                onChange={(e) => handlePaymentChange("yway", e.target.value)}
                className="w-16 bg-gray-100"
              />
              <Input
                placeholder="G"
                value={payGram}
                onChange={(e) => handlePaymentChange("gram", e.target.value)}
                className="w-16 bg-gray-100"
              />
            </div>
            <p className="text-sm mb-1">Cash</p>
            <Input
              placeholder="ငွေပမာဏ"
              value={cash}
              onChange={(e) => handleCashChange(e.target.value)}
              className="w-full bg-gray-100"
            />
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                className="bg-gray-100 text-gray-700"
                onClick={resetPaymentFields}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Add Payment
              </Button>
            </div>
          </div>
        </div>
        {/* Discount Section */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="mt-6">
            <h3 className="font-bold text-sm">Discount</h3>
            <p className="text-sm mb-1">ရွှေချိန်</p>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="K"
                value={discountKyat}
                onChange={(e) => handleDiscountChange("kyat", e.target.value)}
                className="w-16 bg-gray-100"
              />
              <Input
                placeholder="P"
                value={discountPae}
                onChange={(e) => handleDiscountChange("pae", e.target.value)}
                className="w-16 bg-gray-100"
              />
              <Input
                placeholder="Y"
                value={discountYway}
                onChange={(e) => handleDiscountChange("yway", e.target.value)}
                className="w-16 bg-gray-100"
              />
              <Input
                placeholder="G"
                value={discountGram}
                onChange={(e) => handleDiscountChange("gram", e.target.value)}
                className="w-16 bg-gray-100"
              />
            </div>
            <p className="text-sm mb-1">Cash</p>
            {/* <Input
              placeholder="ငွေပမာဏ (Negative for discount, Positive for charge)"
              value={discountcash}
              onChange={(e) => handleDiscountCashChange(e.target.value)}
              className="w-full bg-gray-100"
            /> */}
            <Input
              placeholder="ငွေပမာဏ (Negative for discount, Positive for charge)"
              value={discountcash}
              onChange={(e) => handleDiscountCashChange(e.target.value)}
              className="w-full bg-gray-100"
            />
            <div className="text-xs text-gray-500 mt-1 mb-2">
              Note: Negative values add to balance (discount), Positive values
              subtract (charge)
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-gray-100 text-gray-700"
                onClick={resetDiscountFields}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDiscountPayment}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Add Discount
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSLeft;
