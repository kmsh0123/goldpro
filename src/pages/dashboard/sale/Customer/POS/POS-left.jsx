import React, { useState } from "react";
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
  setGoldAlyaut,
  setGoldLaathk,
  setGoldWeight,
} from "@/feature/service/cartSlice";
import { useGetCustomerQuery } from "@/feature/api/saleApi/customerApi";
import { Controller, useForm } from "react-hook-form";
import { useGetProductQuery } from "@/feature/api/inventory/productApi";

const POSLeft = () => {
  const [searchProductName, setSearchProductName] = useState("");
  const [searchCustomerName, setSearchCustomerName] = useState("");
  const [openProduct, setOpenProduct] = useState(false);
  const [openCustomer, setOpenCustomer] = useState(false);

  const dispatch = useDispatch();
  const { kyat, pae, yway, gram } = useSelector(
    (state) => state.cart.goldWeight
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      customerId: "", // Add this
      name: "",
    },
  });

  const { data: GetProducts } = useGetProductQuery();
  const { data: GetCustomer } = useGetCustomerQuery();

  const selectedProductId = watch("productId");
  const selectedCustomerId = watch("customerId");

  const selectedProductName =
    GetProducts?.data?.find((item) => item.id.toString() === selectedProductId)
      ?.name || "";

  const selectedCustomerName =
    GetCustomer?.data?.find((item) => item.id.toString() === selectedCustomerId)
      ?.customer_name || "";

  const filteredProducts = GetProducts?.data?.filter((item) =>
    item.name.toLowerCase().includes(searchProductName.toLowerCase())
  );

  const filteredCustomers = GetCustomer?.data?.filter((item) =>
    item.customer_name.toLowerCase().includes(searchCustomerName.toLowerCase())
  );
  const {
    kyat: alyautKyat,
    pae: alyautPae,
    yway: alyautYway,
    gram: alyautGram,
  } = useSelector((state) => state.cart.alyaut);

  const { laathk } = useSelector((state) => state.cart);

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

  const handleChange = (field, value) => {
    if (field === "gram") {
      const { kyat, pae, yway } = gramToKyatPaeYway(parseFloat(value) || 0);
      dispatch(setGoldWeight({ kyat, pae, yway, gram: value }));
    } else {
      const newState = { kyat, pae, yway, gram };
      newState[field] = value;
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
      dispatch(setGoldAlyaut({ kyat, pae, yway, gram: value }));
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
      dispatch(setGoldAlyaut({ ...newState, gram: newGram }));
    }
  };

  const handleLaathkChange = (value) => {
    dispatch(setGoldLaathk(value));
    console.log(value);
  };

  const handleAdd = () => {
    dispatch(
      addToCart({
        productId: selectedProductId,
        productName: selectedProductName,
        customerNme: selectedCustomerName,
        kyat,
        pae,
        yway,
        gram,
        alyautKyat,
        alyautPae,
        alyautYway,
        alyautGram,
        laathk,
      })
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Buttons */}
      <div className="flex gap-4">
        <div>
          <label className="block mb-1 font-medium">Cutomer Name</label>
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
          <Input placeholder="Voucher Code" className="" />
        </div>
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

        {/* <div>
            <label className="block mb-1 font-medium">Product Name</label>
            <Controller
            name="productId"
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
                      {selectedProductName || "Select Product"}
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
        {/* <div>
            <label className="block mb-1 font-medium">Product Name</label>
            <Controller
            name="productId"
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
                      {selectedProductName || "Select Product"}
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
        {/* ))} */}
      </div>

      {/* Weight */}
      <div>
        <h3 className="font-bold text-sm">Gold Weight</h3>
        {["ရွှေချိန်"].map((label, index) => (
          <div key={index} className="mt-2">
            <p className="text-sm mb-1">{label}</p>
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
        ))}
      </div>

      <div>
        {["အလျော့တွက်"].map((label, index) => (
          <div key={index} className="mt-2">
            <p className="text-sm mb-1">{label}</p>
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
            </div>
          </div>
        ))}
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
        <p className="text-sm mb-1">ရွေးချယ်မှု</p>
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

export default POSLeft;
