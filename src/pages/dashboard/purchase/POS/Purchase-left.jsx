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
} from "@/feature/service/cartSlice";
import { Controller, useForm } from "react-hook-form";
import { useGetProductQuery } from "@/feature/api/inventory/productApi";
import { addToPayment } from "@/feature/service/paymentSlice";
import { useGetTypeQuery } from "@/feature/api/inventory/typeApi";
import { useGetQualityQuery } from "@/feature/api/inventory/qualityApi";
import { useGetCategoryQuery } from "@/feature/api/inventory/categoryApi";
import { useGetSupplierQuery } from "@/feature/api/supplierApi/supplierApi";

const PurchaseLeft = () => {
  const [searchProductName, setSearchProductName] = useState("");
  const [searchCustomerName, setSearchCustomerName] = useState("");
  const [searchTypeName, setSearchTypeName] = useState("");
  const [searchQuality, setSearchQuality] = useState("");
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

  const cash = useSelector((state) => state.cart.cash);

  

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
      supplierId: "", // Add this
      name: "",
    },
  });

  const { data: GetProducts } = useGetProductQuery();
  const { data: GetSupplier } = useGetSupplierQuery();
  const { data: GetType } = useGetTypeQuery();
  const { data: GetQuality } = useGetQualityQuery();
  const { data: GetCategory } = useGetCategoryQuery();

  const selectedProductId = watch("productId");
  const selectedSupplierId = watch("supplierId");
  const selectedTypeId = watch("typeId");
  const selectedQualityId = watch("qualityId");
  const selectedCategoryId = watch("categoryId");

  const selectedProductName =
    GetProducts?.data?.find((item) => item.id.toString() === selectedProductId)
      ?.name || "";

  const selectedSupplierName =
    GetSupplier?.data?.find((item) => item.id.toString() === selectedSupplierId)
      ?.supplier_name || "";

  const selectedTypeName =
    GetType?.data?.find((item) => item.id.toString() === selectedTypeId)
      ?.name || "";

  const selectedQualityName =
    GetQuality?.data?.find((item) => item.id.toString() === selectedQualityId)
      ?.name || "";

  const selectedCategoryName =
    GetCategory?.data?.find((item) => item.id.toString() === selectedCategoryId)
      ?.name || "";

  // useEffect(() => {
  //   if (selectedProductId) {
  //     const stockValue =
  //       GetProducts?.data?.find(
  //         (item) => item.id.toString() === selectedProductId
  //       )?.stock || 0;
  //     setStock(stockValue);
  //   } else {
  //     setStock("");
  //   }
  // }, [selectedProductId, GetProducts]);

  useEffect(() => {
    if (selectedProductId) {
      const product = GetProducts?.data?.find(
        (item) => item.id.toString() === selectedProductId
      );

      setStock(product?.stock || "");

      // Set product gold weight
      if (product) {
        setProductWeight({
          kyat: product.shwe_chain_kyat || "",
          pae: product.shwe_chain_pae || "",
          yway: product.shwe_chain_yway || "",
          gram: product.shwe_chain_gram || "",
        });
      } else {
        setProductWeight({ kyat: "", pae: "", yway: "", gram: "" });
      }
    } else {
      setStock("");
      setProductWeight({ kyat: "", pae: "", yway: "", gram: "" });
    }
  }, [selectedProductId, GetProducts]);

  const filteredProducts = GetProducts?.data?.filter((item) =>
    item.name.toLowerCase().includes(searchProductName.toLowerCase())
  );

  const filteredSuppliers = GetSupplier?.data?.filter((item) =>
    item.supplier_name.toLowerCase().includes(searchCustomerName.toLowerCase())
  );

  const filteredType = GetType?.data?.filter((item) =>
    item.name.toLowerCase().includes(searchTypeName.toLowerCase())
  );

  const filteredQuality = GetQuality?.data?.filter((item) =>
    item.name.toLowerCase().includes(searchQuality.toLowerCase())
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
    const yway = Math.round(ywayValue);

    return { kyat, pae, yway };
  };

  // const handleChange = (field, value) => {
  //   if (field === "gram") {
  //     const { kyat, pae, yway } = gramToKyatPaeYway(parseFloat(value) || 0);
  //     dispatch(setGoldWeight({ kyat, pae, yway, gram: value }));
  //   } else {
  //     const newState = { kyat, pae, yway, gram };
  //     newState[field] = value;
  //     const newGram = kyatPaeYwayToGram(
  //       newState.kyat,
  //       newState.pae,
  //       newState.yway
  //     );
  //     dispatch(setGoldWeight({ ...newState, gram: newGram }));
  //   }
  // };

  const handleChange = (field, value) => {
  let newValue = value;
  
  
  // For numeric fields, ensure we're working with numbers
  if (field !== "gram") {
    newValue = value === "" ? "" : Math.max(0, parseInt(value) || 0);
  } else {
    newValue = value === "" ? "" : Math.max(0, parseFloat(value) || 0);
  }

  if (field === "gram") {
    const { kyat, pae, yway } = gramToKyatPaeYway(parseFloat(newValue) || 0);
    dispatch(setGoldWeight({ kyat, pae, yway, gram: newValue }));
    
    // Check if entered gram exceeds product gram
    if (productWeight.gram && parseFloat(newValue) > parseFloat(productWeight.gram)) {
      alert(`Entered weight (${newValue}G) exceeds product weight (${productWeight.gram}G)!`);
      dispatch(setGoldWeight({ kyat: "", pae: "", yway: "", gram: "" }));
    }
  } else {
    const newState = { kyat, pae, yway, gram };
    newState[field] = newValue;
    const newGram = kyatPaeYwayToGram(
      newState.kyat,
      newState.pae,
      newState.yway
    );
    dispatch(setGoldWeight({ ...newState, gram: newGram }));
    
    // Check if entered weight exceeds product weight (compare in grams)
    if (productWeight.gram && newGram > parseFloat(productWeight.gram)) {
      alert(`Entered weight (${newGram}G) exceeds product weight (${productWeight.gram}G)!`);
      dispatch(setGoldWeight({ kyat: "", pae: "", yway: "", gram: "" }));
    }
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

  const handleCashChange = (value) => {
    dispatch(setCash(value));
    console.log(value);

  };

  const handleLaathkChange = (value) => {
    dispatch(setGoldLaathk(value));
    console.log(value);
  };

  // const handleAdd = () => {
  //   const selectedQuality = GetQuality?.data?.find(
  //     (q) => q.id.toString() === selectedQualityId
  //   );

  //   // const totalAlyutGram =
  //   //   (parseFloat(alyautGram) || 0) * (parseFloat(qty) || 1);

  //   dispatch(
  //     addToCart({
  //       productId: selectedProductId,
  //       typeId: selectedTypeId,
  //       qualityId: selectedQualityId,
  //       qualityName: selectedQuality?.name || "",
  //       karat: selectedQuality?.name?.replace("K", "") || 24,
  //       categoryId: selectedCategoryId,
  //       productName: selectedProductName,
  //       customerName: selectedSupplierName,
  //       voucherCode,
  //       todayRate,
  //       stock,
  //       qty,
  //       kyat,
  //       pae,
  //       yway,
  //       gram,
  //       alyautKyat,
  //       alyautPae,
  //       alyautYway,
  //       alyautGram,
  //       paymentKyat: payKyat,
  //       payGram: payGram,
  //       payPae: payPae,
  //       payYway: payYway,
  //       laathk: parseFloat(laathk) || 0,
  //     })
  //   );
  //   // dispatch(resetGoldWeight());
  //   // dispatch(setAlyut({ kyat: "", pae: "", yway: "", gram: "" }));
  //   // setStock("");
  // };

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
      supplierName: selectedSupplierName,
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
      paymentKyat: payKyat,
      payGram: payGram,
      payPae: payPae,
      payYway: payYway,
      laathk: parseFloat(laathk) || 0,
    };

    dispatch(addToCart(newItem));

    // Reset form fields if needed
    reset();
    dispatch(resetGoldWeight());
    dispatch(resetAlyutWeight());
    // setQty("");
    // setStock("");
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
    // dispatch(resetpayment());
  };

  const handleQtyChange = (e) => {
    const value = Number(e.target.value);
    setQty(value);

    if (value > stock) {
      alert("Not enough stock!");
      setQty("");
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Buttons */}
      <div className="flex gap-4">
        <div>
          <label className="block mb-1 font-medium">Supplier Name</label>
          <Controller
            name="supplierId"
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
                      {selectedSupplierName || "Select Supplier"}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    {/* Search Box */}
                    <CommandInput
                      placeholder="Search type..."
                      value={searchCustomerName}
                      onValueChange={setSearchCustomerName}
                    />
                    <CommandList className="max-h-40 overflow-y-auto">
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {filteredSuppliers?.map((item) => (
                          <CommandItem
                            key={item.id}
                            onSelect={() => {
                              field.onChange(item.id.toString());
                              setOpenCustomer(false);
                            }}
                          >
                            {item.supplier_name}
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

        {/* <Select>
              <SelectTrigger className="w-full border border-blue-400">
                <SelectValue placeholder="Customer Name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Customer A</SelectItem>
              </SelectContent>
            </Select> */}
      </div>
      <div className="flex items-center mt-5 gap-5 w-full">
        {/* <div className="w-1/2">
          <label className="block mb-1 font-medium">Today Gold Rate</label>
          <Input placeholder="Today Gold Rate" className="" />
        </div> */}
        <div className="w-1/2">
          <label className="block mb-1 font-medium">Voucher Code</label>
          <Input
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            placeholder="Voucher Code"
            className=""
          />
        </div>

        <div className="w-1/2">
          <label className="block mb-1 font-medium">Today Gold Rate</label>
          <Input
            value={todayRate}
            onChange={(e) => setTodayRate(e.target.value)}
            placeholder="Today Gold Rate"
            className=""
          />
        </div>

        {/* <div className="w-1/2">
          <label className="block mb-1 font-medium">Type</label>
          <Input 
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value)}
          placeholder="Voucher Code" className="" />
        </div> */}
      </div>

      {/* Product Info */}
      <div className="grid grid-cols-2 gap-4">
        {/* {["Product Code", "Product Name", "Quantity"].map((label) => ( */}
        {/* <div>
            <label className="block mb-1 font-medium">Product Code</label>
            <Controller
            name="productCode"
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
                      {selectedProductCode || "Select Product Code"}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search type..."
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
                              setOpen(false);
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
          </div> */}

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
                      className="w-full justify-between"
                    >
                      {selectedProductName || "Select Product"}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    {/* Search Box */}
                    <CommandInput
                      placeholder="Search type..."
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
                      className="w-full justify-between"
                    >
                      {selectedTypeName || "Select Type"}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
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
                      className="w-full justify-between"
                    >
                      {selectedQualityName || "Select Quality"}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search type..."
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

        {/* {productWeight.kyat || productWeight.pae || productWeight.yway || productWeight.gram ? ( */}

        {/* ) : null} */}
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
                      className="w-full justify-between"
                    >
                      {selectedCategoryName || "Select Category"}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search type..."
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

        <div className="">
          {/* <label className="block mb-1 font-medium">Quantity</label>
          <Input
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Quantity"
            className=""
          /> */}
        </div>
        {/* ))} */}
      </div>

      <div className=" rounded">
        <p className="font-medium text-sm mb-1">Product Gold Weight:</p>
        <div className="grid grid-cols-4 gap-2">
          <div>
            {/* <label className="text-xs text-gray-600">K</label> */}
            <Input
              value={productWeight.kyat || "0"}
              placeholder="K"
              readOnly
              className="text-center"
            />
          </div>
          <div>
            {/* <label className="text-xs text-gray-600">P</label> */}
            <Input
              value={productWeight.pae || "0"}
              placeholder="P"
              readOnly
              className="text-center"
            />
          </div>
          <div>
            {/* <label className="text-xs text-gray-600">Y</label> */}
            <Input
              value={productWeight.yway || "0"}
              placeholder="Y"
              readOnly
              className="text-center"
            />
          </div>
          <div>
            {/* <label className="text-xs text-gray-600">G</label> */}
            <Input
              value={productWeight.gram || "0"}
              placeholder="G"
              readOnly
              className="text-center"
            />
          </div>
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
        <Button variant="outline" className="bg-gray-100 text-gray-700">
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
      <div>
        <h3 className="font-bold text-sm mt-4">Payment</h3>
        <p className="text-sm mb-1">ရွေချိန်</p>
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
          onChange={(e) => dispatch(setCash(e.target.value))}
          className="w-64 bg-gray-100"
        />
      </div>

      <div className="flex gap-4 mt-4">
        <Button
          variant="outline"
          className="bg-gray-100 text-gray-700"
          onClick={() => nav(-1)}
        >
          Cancel
        </Button>
        <Button
          onClick={handlePayment}
          className="bg-yellow-600 hover:bg-yellow-700 text-white"
        >
          Add
        </Button>
      </div>

      <div>
        <h3 className="font-bold text-sm mt-4">Discount</h3>
        <p className="text-sm mb-1">ရွေချိန်</p>
        <div className="flex gap-2 mb-2">
          <Input placeholder="K" className="w-16 bg-gray-100" />
          <Input placeholder="P" className="w-16 bg-gray-100" />
          <Input placeholder="Y" className="w-16 bg-gray-100" />
          <Input placeholder="G" className="w-16 bg-gray-100" />
        </div>
        <p className="text-sm mb-1">Cash</p>
        <Input placeholder="ငွေပမာဏ" className="w-64 bg-gray-100" />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-4">
        <Button
          variant="outline"
          className="bg-gray-100 text-gray-700"
          onClick={() => nav(-1)}
        >
          Cancel
        </Button>
        <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
          Add
        </Button>
      </div>
    </div>
  );
};

export default PurchaseLeft;
