import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setGoldWeight, setShweChain } from "@/feature/service/cartSlice";

const POSLeft = () => {
  const dispatch = useDispatch();
  const { kyat, pae, yway, gram } = useSelector((state) => state.cart.goldWeight);
  const shweChain = useSelector((state) => state.cart.shweChain);

  const [lakha, setLakha] = useState("");
  const [payment, setPayment] = useState({ kyat: "", pae: "", yway: "", gram: "", cash: "" });

  const kyatPaeYwayToGram = (kyat, pae, yway) => {
    const totalKyat = (parseFloat(kyat) || 0) + (parseFloat(pae) || 0) / 16 + (parseFloat(yway) || 0) / 128;
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
      const newGram = kyatPaeYwayToGram(newState.kyat, newState.pae, newState.yway);
      dispatch(setGoldWeight({ ...newState, gram: newGram }));
    }
  };

  const handleShweChainChange = (field, value) => {
    if (field === "gram") {
      const { kyat, pae, yway } = gramToKyatPaeYway(parseFloat(value) || 0);
      dispatch(setShweChain({ kyat, pae, yway, gram: value }));
    } else {
      const newState = { ...shweChain };
      newState[field] = value;
      const newGram = kyatPaeYwayToGram(newState.kyat, newState.pae, newState.yway);
      dispatch(setShweChain({ ...newState, gram: newGram }));
    }
  };

  const handleAdd = () => {
    dispatch(
      addToCart({
        kyat,
        pae,
        yway,
        gram,
        shweChain,
        lakha: Number(lakha),
        payment,
      })
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Buttons */}
      <div className="flex gap-4">
        <Select>
          <SelectTrigger className="max-w-80 border border-blue-400">
            <SelectValue placeholder="Customer Name" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">Customer A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Today Rate / Voucher */}
      <div className="flex items-center mt-5 gap-5 w-full">
        <div className="w-1/2">
          <label className="block mb-1 font-medium">Today Gold Rate</label>
          <Input placeholder="Today Gold Rate" />
        </div>
        <div className="w-1/2">
          <label className="block mb-1 font-medium">Voucher Code</label>
          <Input placeholder="Voucher Code" />
        </div>
      </div>

      {/* Product Info */}
      <div className="grid grid-cols-2 gap-4">
        {["Product Code", "Product Name", "Quantity"].map((label) => (
          <div key={label}>
            <label className="block mb-1 font-medium">{label}</label>
            <Select>
              <SelectTrigger className="w-full bg-gray-100">
                <SelectValue placeholder={label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sample">{label} Option</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      {/* Gold Weight */}
      <div>
        <h3 className="font-bold text-sm my-2">Gold Weight</h3>
        <p className="text-sm mb-1">အလျော့တွက်</p>
        <div className="flex gap-2">
          <Input placeholder="K" value={kyat} onChange={(e) => handleChange("kyat", e.target.value)} className="w-16 bg-gray-100" />
          <Input placeholder="P" value={pae} onChange={(e) => handleChange("pae", e.target.value)} className="w-16 bg-gray-100" />
          <Input placeholder="Y" value={yway} onChange={(e) => handleChange("yway", e.target.value)} className="w-16 bg-gray-100" />
          <Input placeholder="G" value={gram} onChange={(e) => handleChange("gram", e.target.value)} className="w-16 bg-gray-100" />
        </div>
      </div>

      {/* Shwe Chain */}
      <div>
        <h3 className="font-bold text-sm my-2">ရွှေချိန်</h3>
        <div className="flex gap-2">
          <Input placeholder="K" value={shweChain.kyat} onChange={(e) => handleShweChainChange("kyat", e.target.value)} className="w-16 bg-gray-100" />
          <Input placeholder="P" value={shweChain.pae} onChange={(e) => handleShweChainChange("pae", e.target.value)} className="w-16 bg-gray-100" />
          <Input placeholder="Y" value={shweChain.yway} onChange={(e) => handleShweChainChange("yway", e.target.value)} className="w-16 bg-gray-100" />
          <Input placeholder="G" value={shweChain.gram} onChange={(e) => handleShweChainChange("gram", e.target.value)} className="w-16 bg-gray-100" />
        </div>
      </div>

      {/* လက်ခ */}
      <div className="w-1/2">
        <label className="block mb-1 font-medium">လက်ခ</label>
        <Input placeholder="လက်ခ" value={lakha} onChange={(e) => setLakha(e.target.value)} className="bg-gray-100" />
      </div>

      {/* First Action Buttons (after lakha) */}
      <div className="flex gap-4 mt-4">
        <Button variant="outline" className="bg-gray-100 text-gray-700">
          Cancel
        </Button>
        <Button onClick={handleAdd} className="bg-yellow-600 hover:bg-yellow-700 text-white">
          Add
        </Button>
      </div>

      {/* Payment */}
      <div>
        <h3 className="font-bold text-sm mt-4">Payment</h3>
        <p className="text-sm mb-1">ရွေးချယ်မှု</p>
        <div className="flex gap-2 mb-2">
          <Input placeholder="K" value={payment.kyat} onChange={(e) => setPayment({ ...payment, kyat: e.target.value })} className="w-16 bg-gray-100" />
          <Input placeholder="P" value={payment.pae} onChange={(e) => setPayment({ ...payment, pae: e.target.value })} className="w-16 bg-gray-100" />
          <Input placeholder="Y" value={payment.yway} onChange={(e) => setPayment({ ...payment, yway: e.target.value })} className="w-16 bg-gray-100" />
          <Input placeholder="G" value={payment.gram} onChange={(e) => setPayment({ ...payment, gram: e.target.value })} className="w-16 bg-gray-100" />
        </div>
        <p className="text-sm mb-1">Cash</p>
        <Input placeholder="ငွေပမာဏ" value={payment.cash} onChange={(e) => setPayment({ ...payment, cash: e.target.value })} className="w-64 bg-gray-100" />
      </div>

      {/* Second Action Buttons (after payment) */}
      <div className="flex gap-4 mt-4">
        <Button variant="outline" className="bg-gray-100 text-gray-700">
          Cancel
        </Button>
        <Button onClick={handleAdd} className="bg-yellow-600 hover:bg-yellow-700 text-white">
          Add
        </Button>
      </div>
    </div>
  );
};

export default POSLeft;
