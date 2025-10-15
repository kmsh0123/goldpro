import React, { Fragment, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeftIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  clearCart,
  removeCart,
  removePayment,
  resetconvert24,
  resetconvert24K,
  resetDiscountPayments,
  resetGoldWeight,
  resetpayment,
  resetPayments,
  selectCartTotals,
  updateConvert24K,
} from "@/feature/service/cartSlice";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import PurchaseLeft from "./Purchase-left";
import { useCreatePurchaseMutation } from "@/feature/api/purchaseApi/purchaseApi";

// Helper function to normalize KPY values (handle carry-over)
const normalizeKPY = (kyat, pae, yway) => {
  let totalYway = kyat * 16 * 8 + pae * 8 + yway;

  // Convert back to KPY format
  const newKyat = Math.floor(totalYway / (16 * 8));
  totalYway = totalYway % (16 * 8);

  const newPae = Math.floor(totalYway / 8);
  const newYway = totalYway % 8;

  const result = { kyat: newKyat, pae: newPae, yway: newYway };
  console.log("normalizeKPY output:", result);
  return result;
};

// Helper function to convert KPY to grams
const kpyToGram = (kyat, pae, yway) => {
  const totalKyat = kyat + pae / 16 + yway / 128;
  const result = totalKyat * 16.6;
  console.log("kpyToGram output:", result);
  return result;
};

// Helper function to convert to 24K
const convertTo24K = (kyat, pae, yway, quality) => {
  const totalKyat = kyat + pae / 16 + yway / 128;

  // Convert to 24K based on quality
  let converted24K = totalKyat;
  if (quality === 18) converted24K = (totalKyat / 16) * 12;
  else if (quality === 22) converted24K = (totalKyat / 17.5) * 16;
  else if (quality === 23) converted24K = (totalKyat / 17) * 16;
  else if (quality === 24) converted24K = totalKyat * 1;

  console.log("Quality :", quality);
  console.log("totalKyat :", totalKyat);

  return converted24K;
};

const convertToKPY = (kyatValue) => {
  // kyatValue = Kyat (can be decimal)
  const totalYway = kyatValue * 128; // full precision

  const kyat = Math.floor(totalYway / 128);
  const remYway = totalYway - kyat * 128;

  const pae = Math.floor(remYway / 8);
  const yway = remYway - pae * 8; // e.g. 6.25

  const gram = kyatValue * 16.6; // gram full precision

  return { kyat, pae, yway, gram };
};

const gramToKPY = (gramValue) => {
  // convert grams -> fractional kyat
  const totalKyat = gramValue / 16.6;
  // convert to yway then round to nearest yway to avoid float truncation
  const totalYway = Math.round(totalKyat * 128);

  const kyat = Math.floor(totalYway / 128);
  const remYway = totalYway % 128;
  const pae = Math.floor(remYway / 8);
  const yway = remYway % 8;

  return { kyat, pae, yway, gram: parseFloat(gramValue.toFixed(2)) };
};

// Helper function to add two KPY values correctly
const addKPY = (kpy1, kpy2) => {
  const grams1 = kpyToGram(kpy1.kyat, kpy1.pae, kpy1.yway);
  const grams2 = kpyToGram(kpy2.kyat, kpy2.pae, kpy2.yway);

  // Add grams
  const totalGrams = grams1 + grams2;

  // Convert back to KPY
  const totalKyatValue = totalGrams / 16.6;
  const kyat = Math.floor(totalKyatValue);
  const paeValue = (totalKyatValue - kyat) * 16;
  const pae = Math.floor(paeValue);
  const yway = Math.floor((paeValue - pae) * 8);

  const result = { kyat, pae, yway, gram: parseFloat(totalGrams.toFixed(2)) };
  // console.log("addKPY output:", result);
  return result;
};

const roundYwayAndCarry = (ywayFloat) => {
  const intY = Math.floor(ywayFloat);
  // fractional part with small precision guard
  const frac = Math.round((ywayFloat - intY) * 1000) / 1000;

  let fracRounded = 0;
  if (frac >= 0.8) {
    // 0.8 and above -> add 1 full yway (which may cause carry to pae)
    fracRounded = 1;
  } else if (frac >= 0.7 && frac <= 0.79) {
    fracRounded = 0.75;
  } else if (frac >= 0.4 && frac <= 0.69) {
    fracRounded = 0.5;
  } else if (frac >= 0.2 && frac <= 0.39) {
    fracRounded = 0.25;
  } else {
    fracRounded = 0;
  }

  const newTotalYway = intY + fracRounded;

  // carry to pae (8 yway = 1 pae)
  const carryPae = Math.floor(newTotalYway / 8);
  const finalYway = parseFloat((newTotalYway - carryPae * 8).toFixed(2)); // expected .00/.25/.5/.75

  return { carryPae, yway: finalYway };
};

function toFixedDown(num, digits) {
  const factor = Math.pow(10, digits);
  return (Math.floor(num * factor) / factor).toFixed(digits);
}

const PurchaseSystem = () => {
  const printRef = useRef(null);
  const [createSupplier, { isLoading }] = useCreatePurchaseMutation();
  const dispatch = useDispatch();
  const nav = useNavigate();

  const {
    items,
    goldWeight,
    alyut,
    payments,
    convert24s,
    payment,
    laathk,
    cash,
    cashies,
    discount,
    convert24,
    discountPayments,
  } = useSelector((state) => state.cart);

  console.log(items, "items:");

  console.log(payments, "payments:");

  // console.log("Cart state:", {
  //   items,
  //   goldWeight,
  //   alyut,
  //   payments,
  //   payment,
  //   laathk,
  //   cash,
  //   discount,
  //   discountPayments,
  // });

  console.log("Convert 24K :", convert24s);

  const convert24K = useSelector((state) => state.cart.convert24K);
  console.log("convert24K:", convert24K);
  // console.log("convert24KDetail:", convert24KDetail);

  // Get customer remaining balance from the first item
  const customerRemainingBalance =
    items && items.length > 0
      ? {
          kyat: Number(items[0]?.remainingKyat) || 0,
          pae: Number(items[0]?.remainingPae) || 0,
          yway: Number(items[0]?.remainingYway) || 0,
          gram: Number(items[0]?.remainingGram) || 0,
        }
      : { kyat: 0, pae: 0, yway: 0, gram: 0 };
  // console.log("customerRemainingBalance:", customerRemainingBalance);

  // Calculate sum of all convertTo24K detail results
  const calculateTotalConvert24K = () => {
    // console.log("calculateTotalConvert24K called");
    if (!items || items.length === 0) {
      // console.log("No items, returning zero");
      return { kyat: 0, pae: 0, yway: 0, gram: 0 };
    }

    // Sum all individual convert24K values
    const total24KValue = items.reduce((sum, item) => {
      console.log("Processing item:", item);
      const qty = Number(item.qty || 1);
      // Multiply alyot values by quantity
      const rawAlyotKyat = Number(item.alyautKyat || 0) * qty;
      const rawAlyotPae = Number(item.alyautPae || 0) * qty;
      const rawAlyotYway = Number(item.alyautYway || 0) * qty;
      // const alyotGram = Number(item.alyautGram || 0) * qty;
      const alyotKPY = normalizeKPY(rawAlyotKyat, rawAlyotPae, rawAlyotYway);

      const shweKyat = Number(item.kyat || 0);
      const shwePae = Number(item.pae || 0);
      const shweYway = Number(item.yway || 0);
      // const shweGram = Number(item.gram || 0);
      console.log("shweKyat", shweYway);
      const roundedShweYway = roundYwayAndCarry(shweYway);

      const shweKPY = normalizeKPY(
        shweKyat,
        shwePae + (roundedShweYway?.carryPae || 0),
        roundedShweYway?.yway || 0
      );

      // Calculate net weight (shwe + alyot) and normalize
      const netKPY = normalizeKPY(
        shweKPY.kyat + alyotKPY.kyat,
        shweKPY.pae + alyotKPY.pae,
        shweKPY.yway + alyotKPY.yway
      );

      console.log("netKPY", netKPY);

      // Convert to 24K
      const convert24KValue = convertTo24K(
        netKPY.kyat,
        netKPY.pae,
        netKPY.yway,
        Number(item.karat || 24)
      );

      console.log("Item 24K value:", convert24KValue);
      const convert24KDetail = convert24KValue;
      console.log("convert24KDetail", convert24KDetail);

      // return sum + convert24KDetail.kyat + convert24KDetail.pae/16 + convert24KDetail.yway/128;
      return sum + convert24KValue;
    }, 0);

    // console.log("Total 24K value (kyat):", total24KValue);
    // Convert total 24K value to KPY format
    let result = convertToKPY(total24KValue);
    const rounded24KYway = roundYwayAndCarry(result.yway);

    result = normalizeKPY(
      result.kyat,
      result.pae + (rounded24KYway?.carryPae || 0),
      rounded24KYway?.yway || 0
    );
    console.log("Calculate24K", result);

    const convert24KGram = toFixedDown(
      kpyToGram(result.kyat, result.pae, result.yway),
      2
    );

    result.gram = convert24KGram;

    return result;
  };

  // Replace your existing calculateTotalGoldDirectAdd with this implementation
  const calculateTotalGoldDirectAdd = () => {
    // If no items, return zeros
    if (!items || items.length === 0) {
      return { kyat: 0, pae: 0, yway: 0, gram: 0 };
    }

    // Sum kyat/pae/yway/gram directly from each item's convert24KDetail
    let sumKyat = 0;
    let sumPae = 0;
    let sumYway = 0;
    let sumGram = 0;

    items.forEach((item, index) => {
      const totals = calculateItemTotals(item); // returns convert24KDetail
      const d = totals.convert24KDetail || {};

      sumKyat += Number(d.kyat || 0);
      sumPae += Number(d.pae || 0);
      sumYway += Number(d.yway || 0);
      sumGram += Number(d.gram || 0);
    });

    // Normalize kyat/pae/yway (carry-over: 8 yway = 1 pae, 16 pae = 1 kyat)
    const normalized = normalizeKPY(sumKyat, sumPae, sumYway);

    // Keep gram as the direct summed grams (rounded to 2 decimals for display)
    return {
      kyat: normalized.kyat,
      pae: normalized.pae,
      yway: normalized.yway,
      gram: parseFloat(sumGram),
    };
  };

  // Calculate sum of all convertTo24K detail results

  // Calculate total payments in grams
  // const calculateTotalPaymentsInGrams = () => {
  //   // console.log("calculateTotalPaymentsInGrams called");
  //   if (!payments || payments.length === 0) {
  //     // console.log("No payments, returning 0");
  //     return 0;
  //   }

  //   const totalPayments = payments.reduce(
  //     (total, payment) => ({
  //       kyat: total.kyat + (Number(payment?.kyat) || 0),
  //       pae: total.pae + (Number(payment?.pae) || 0),
  //       yway: total.yway + (Number(payment?.yway) || 0),
  //       gram: total.gram + (Number(payment?.gram) || 0),
  //     }),
  //     { kyat: 0, pae: 0, yway: 0, gram: 0 }
  //   );
  //   // console.log("Total payments KPY:", totalPayments);

  //   // Convert to grams
  //   const result = kpyToGram(
  //     totalPayments.kyat,
  //     totalPayments.pae,
  //     totalPayments.yway
  //   );
  //   // console.log("calculateTotalPaymentsInGrams result:", result);
  //   return result;
  // };

  // Replace your existing calculateTotalPaymentsInGrams with this version
  const calculateTotalPaymentsInGrams = () => {
    // no payments and no cashies
    if (
      (!payments || payments.length === 0) &&
      (!cashies || cashies.length === 0)
    ) {
      return 0;
    }

    // 1) payments array (K/P/Y -> grams)
    const totalPayments = (payments || []).reduce(
      (total, payment) => ({
        kyat: total.kyat + (Number(payment?.kyat) || 0),
        pae: total.pae + (Number(payment?.pae) || 0),
        yway: total.yway + (Number(payment?.yway) || 0),
        gram: total.gram + (Number(payment?.gram) || 0),
      }),
      { kyat: 0, pae: 0, yway: 0, gram: 0 }
    );

    const paymentsGramsFromKPY = kpyToGram(
      totalPayments.kyat,
      totalPayments.pae,
      totalPayments.yway
    );

    // 2) cashies (Ks) -> convert to grams:
    //    gram = (Ks / todayRate) * 16.6   (only if todayRate > 0)
    const todayRateLocal = Number(items?.[0]?.todayRate) || 0;

    let cashiesGrams = 0;
    if (todayRateLocal > 0) {
      cashiesGrams = (cashies || []).reduce((s, c) => {
        const ks = Number(c?.cash) || 0;
        // convert Ks -> kyatOfGold -> grams
        const kyatValue = ks / todayRateLocal; // kyat fractional
        return s + kyatValue * 16.6;
      }, 0);
    } else {
      // if rate not available, we cannot convert Ks -> grams reliably
      // treat cashiesGrams as 0 (or handle differently based on your UX)
      cashiesGrams = 0;
    }

    // 3) sum everything (payments (grams) + cashies (grams))
    const total = paymentsGramsFromKPY + cashiesGrams;

    return total;
  };

  //   const calculateTotalPaymentsInGrams = () => {
  //   if ((!payments || payments.length === 0) && (!cash || Number(cash) <= 0)) {
  //     return { kyat: 0, pae: 0, yway: 0 };
  //   }

  //   // Step 1: Sum all payments (K/P/Y)
  //   const totalPayments = (payments || []).reduce(
  //     (total, payment) => ({
  //       kyat: total.kyat + (Number(payment?.kyat) || 0),
  //       pae: total.pae + (Number(payment?.pae) || 0),
  //       yway: total.yway + (Number(payment?.yway) || 0),
  //     }),
  //     { kyat: 0, pae: 0, yway: 0 }
  //   );

  //   // Step 2: cash ကို Kyat/Pae/Yway ပြောင်းမယ် (gram မသုံးတော့)
  //   const todayRateLocal = Number(items?.[0]?.todayRate) || 0;
  //   let cashKPY = { kyat: 0, pae: 0, yway: 0 };

  //   if (Number(cash) && Number(cash) > 0 && todayRateLocal > 0) {
  //     const converted = convertCashToKPY(Number(cash), todayRateLocal);
  //     // convertCashToKPY မှာ Kyat/Pae/Yway ပြန်ပေးအောင် ပြင်ထားရမယ်
  //     cashKPY = {
  //       kyat: Number(converted.kyat) || 0,
  //       pae: Number(converted.pae) || 0,
  //       yway: Number(converted.yway) || 0,
  //     };
  //   }

  //   // Step 3: payments + cash ကိုပေါင်းမယ်
  //   const total = {
  //     kyat: totalPayments.kyat + cashKPY.kyat,
  //     pae: totalPayments.pae + cashKPY.pae,
  //     yway: totalPayments.yway + cashKPY.yway,
  //   };

  //   // Step 4: overflow handle (e.g. 16 pae = 1 kyat, 8 yway = 1 pae)
  //   let final = normalizeKPY(total);

  //   return final;
  // };

  // Calculate total discount payments in grams (negative values add, positive values subtract)
  const calculateTotalDiscountPaymentsInGrams = () => {
    if (!discountPayments || discountPayments.length === 0) {
      return 0;
    }

    const result = discountPayments.reduce((total, discount) => {
      const kyat = Number(discount?.kyat) || 0;
      const pae = Number(discount?.pae) || 0;
      const yway = Number(discount?.yway) || 0;
      const gram = Number(discount?.gram) || 0;

      // Convert to grams
      const discountInGrams = kpyToGram(kyat, pae, yway);
      const discountCash = Number(discount?.discountCash) || 0;

      // Convert cash discount to grams using today's rate
      const todayRate = Number(items[0]?.todayRate) || 1;
      const cashDiscountInGrams =
        todayRate > 0 ? Math.abs(discountCash) / todayRate : 0;

      // Apply sign based on discountCash value
      const signedDiscount =
        discountCash < 0
          ? -discountInGrams - cashDiscountInGrams
          : discountInGrams + cashDiscountInGrams;

      return total + signedDiscount;
    }, 0);

    // console.log("calculateTotalDiscountPaymentsInGrams result:", result);
    return result;
  };

  const calculateRemainingGold = () => {
    if (!items || items.length === 0) {
      return { kyat: 0, pae: 0, yway: 0, gram: 0 };
    }

    // get previous balance converted to 24K fractional kyat value
    const prev24K = convertPreviousBalanceTo24K?.() || {
      kyat: 0,
      pae: 0,
      yway: 0,
      gram: 0,
    };
    // IMPORTANT: ensure convertPreviousBalanceTo24K returns full-precision gram (not rounded)
    // If it returns kyat/pae/yway, compute full gram from those:
    const prevKyatValue =
      (prev24K.kyat || 0) + (prev24K.pae || 0) / 16 + (prev24K.yway || 0) / 128;
    const prevGram =
      typeof prev24K.gram === "number" && prev24K.gram > 0
        ? prev24K.gram // if convertPreviousBalanceTo24K provided full gram, use it
        : prevKyatValue * 16.6;

    // gold 24K from items -> get kyat fractional then to grams
    const gold24K = calculateTotalConvert24K?.() || {
      kyat: 0,
      pae: 0,
      yway: 0,
      gram: 0,
    };
    const goldKyatValue =
      (gold24K.kyat || 0) + (gold24K.pae || 0) / 16 + (gold24K.yway || 0) / 128;
    const goldGram =
      typeof gold24K.gram === "number" && gold24K.gram > 0
        ? gold24K.gram
        : goldKyatValue * 16.6;

    const totalPaymentsGrams = calculateTotalPaymentsInGrams() || 0;

    console.log("totalPaymentsGrams:", totalPaymentsGrams);

    const totalDiscountPaymentsGrams =
      calculateTotalDiscountPaymentsInGrams() || 0;

    // formula: (previous + gold) - (payments - discounts)
    let totalRemainingGrams =
      prevGram + goldGram - totalPaymentsGrams - totalDiscountPaymentsGrams;
    // if (totalRemainingGrams < 0) totalRemainingGrams = 0;

    console.log("totalRemainingGrams:", totalRemainingGrams);

    const totalKyatValue = totalRemainingGrams / 16.6; // fractional kyat
    const totalYway = totalKyatValue * 128; // fractional yway (can be decimal)

    let kyat = Math.floor(totalYway / 128);
    let remYwayAfterKyat = totalYway - kyat * 128; // still in yway units
    let pae = Math.floor(remYwayAfterKyat / 8);
    let ywayDecimal = remYwayAfterKyat - pae * 8; // decimal yway (0 <= ywayDecimal < 8)

    // round yway decimal to desired precision (e.g., 2 decimals)
    const roundedYway = roundYwayAndCarry(ywayDecimal);

    const normalized = normalizeKPY(
      kyat,
      pae + (roundedYway?.carryPae || 0),
      roundedYway?.yway || 0
    );
    normalized.yway = parseFloat(toFixedDown(normalized.yway, 2));
    normalized.gram = parseFloat(
      toFixedDown(
        kpyToGram(normalized.kyat, normalized.pae, normalized.yway),
        2
      )
    );
    console.log("Normalized remaining KPY:", normalized.gram);

    // convert to K/P/Y using the precise gramToKPY (which rounds to nearest yway)
    const result = {
      kyat: normalized.kyat,
      pae: normalized.pae,
      yway: normalized.yway,
      // gram: parseFloat(toFixedDown(totalRemainingGrams, 2)),
      normalizedGram: normalized.gram,
    };

    console.log("result:", result?.gram);

    // show grams rounded only for display
    // result.gram = parseFloat(totalRemainingGrams.toFixed(2));

    console.log("calculateRemainingGold debug:", {
      prevGram,
      goldGram,
      totalPaymentsGrams,
      totalDiscountPaymentsGrams,
      totalRemainingGrams,
      result,
    });

    return result;
  };

  // Convert Previous Balance to 24K
  // New helper: accept fractional totalKyat value directly
  const convertKyatValueTo24K = (totalKyat, quality) => {
    let converted = totalKyat;
    if (quality === 18) converted = (totalKyat / 16) * 12;
    else if (quality === 22) converted = (totalKyat / 17.5) * 16;
    else if (quality === 23) converted = (totalKyat / 17) * 16;
    // 24K is identity
    return converted;
  };

  const convertPreviousBalanceTo24K = () => {
    // console.log("convertPreviousBalanceTo24K called");
    if (!items || items.length === 0) {
      // console.log("No items, returning zero");
      return { kyat: 0, pae: 0, yway: 0, gram: 0 };
    }

    // Get the quality of the previous balance (assuming it's from the first item)
    const previousBalanceQuality = Number(items[0]?.remainingQuality) || 24;
    // console.log("Previous balance quality:", previousBalanceQuality);

    // Convert Previous Balance to 24K
    const convert24KValue = convertTo24K(
      customerRemainingBalance.kyat,
      customerRemainingBalance.pae,
      customerRemainingBalance.yway,
      previousBalanceQuality
    );

    console.log("convert24KValue (fractional kyat):", (convert24KValue, 2));
    let result = convertToKPY(convert24KValue);
    const roundedYway = roundYwayAndCarry(result.yway);

    console.log("roundedYway:", roundedYway);

    result = normalizeKPY(
      result.kyat,
      result.pae + (roundedYway?.carryPae || 0),
      roundedYway?.yway || 0
    );

    result.yway = parseFloat(toFixedDown(result.yway, 2));

    result.gram = parseFloat(
      toFixedDown(kpyToGram(result.kyat, result.pae, result.yway), 2)
    );

    console.log("convertPreviousBalanceTo24K result:", result);
    return result;
  };

  // Calculate combined total (Previous Balance + Gold 24K) using proper addition
  // Calculate combined total (Previous Balance + Gold 24K) using proper addition
  const calculateCombinedTotal = () => {
    // console.log("calculateCombinedTotal called");

    // Convert Previous Balance to 24K first
    const previousBalance24K = convertPreviousBalanceTo24K();

    const previousBalance = {
      kyat: previousBalance24K.kyat || 0,
      pae: previousBalance24K.pae || 0,
      yway: previousBalance24K.yway || 0,
      gram: previousBalance24K.gram || 0,
    };

    const gold24K = {
      kyat: calculateTotalConvert24K().kyat || 0,
      pae: calculateTotalConvert24K().pae || 0,
      yway: calculateTotalConvert24K().yway || 0,
      gram: calculateTotalConvert24K().gram || 0,
    };

    console.log("Adding previous balance (24K) and gold 24K:", {
      previousBalance,
      gold24K,
    });
    // Add them properly using the addKPY function
    const result = addKPY(previousBalance, gold24K);
    // console.log("calculateCombinedTotal result:", result);
    return result;
  };

  const handleConfirmOrder = async () => {
    if (!items || items.length === 0) {
      alert("No items in cart!");
      return;
    }

    const newRemainingBalance = calculateRemainingGold();

    const payload = {
      purchaseCode: "ORD-" + Date.now(),
      voucherCode: items[0]?.voucherCode || "N/A",
      supplierId: items[0]?.supplierId || 1,
      totalQuantity: items.reduce((sum, i) => sum + (Number(i.qty) || 1), 0),

      // Totals
      totalKyat: Number(calculateCombinedTotal()?.kyat) || 0,
      totalPae: Number(calculateCombinedTotal()?.pae) || 0,
      totalYway: Number(calculateCombinedTotal()?.yway) || 0,
      totalGram: Number(calculateCombinedTotal()?.gram) || 0,
      totalPrice: items.reduce((sum, i) => sum + Number(i.price || 0), 0),
      // Sale date
      purchaseDate: items[0]?.purchaseDate,

      todayRate: Number(todayRate) || 0,
      cashierId: items[0]?.cashierId || 1,

      // Discounts
      discountKyat: Number(calculateTotalDiscount()?.kyat) || 0,
      discountPae: Number(calculateTotalDiscount()?.pae) || 0,
      discountYway: Number(calculateTotalDiscount()?.yway) || 0,
      discountGram: Number(calculateTotalDiscount()?.gram) || 0,
      discountCash: Number(calculateTotalDiscount()?.cash) || 0,

      // 24K conversion total
      total24KKyat: Number(calculateTotalConvert24K()?.kyat) || 0,
      total24KPae: Number(calculateTotalConvert24K()?.pae) || 0,
      total24KYway: Number(calculateTotalConvert24K()?.yway) || 0,
      total24KGram: Number(calculateTotalConvert24K()?.gram) || 0,

      // Remaining balance
      remainingKyat: Number(newRemainingBalance?.kyat) || 0,
      remainingPae: Number(newRemainingBalance?.pae) || 0,
      remainingYway: Number(newRemainingBalance?.yway) || 0,
      remainingGram: Number(newRemainingBalance?.gram) || 0,

      // Payment array
      paymentGold: payments.map((p) => ({
        qualityId: Number(p.qualityId) || 0,
        paymentKyat: Number(p.paymentKyat) || 0,
        paymentPae: Number(p.paymentPae) || 0,
        paymentYway: Number(p.paymentYway) || 0,
        paymentGram: Number(p.paymentGram) || 0,
      })),

       paymentMoney: cashies.map((c) => ({
        paymentCatId: Number(c.paymentCatId) || 0,
        paymentAmount: Number(c.cash) || 0,
      })),

      // cash: cashies.map((c) => ({
      //   paymentCatId: cashies.map((c) => c.paymentCatName),
      //   paymentAmount: cashies.reduce(
      //     (sum, c) => sum + (Number(c.cash) || 0),
      //     0
      //   ),
      // })),

      // Items array
      items: items.map((i) => ({
        productId: Number(i.productId) || 0,
        typeId: Number(i.typeId) || 0,
        qualityId: Number(i.qualityId) || 0,
        categoryId: Number(i.categoryId) || 0,
        quantity: Number(i.qty) || 0,

        // Alyaut (Yaut)
        yautKyat: Number(i.yautKyat) || 0,
        yautPae: Number(i.yautPae) || 0,
        yautYway: Number(i.yautYway) || 0,
        yautGram: Number(i.yautGram) || 0,

        // Shwe (Gold)
        shweKyat: Number(i.shweKyat) || 0,
        shwePae: Number(i.shwePae) || 0,
        shweYway: Number(i.shweYway) || 0,
        shweGram: Number(i.shweGram) || 0,

        totalKyat: Number(i.totalKyat) || 0,
        totalPae: Number(i.totalPae) || 0,
        totalYway: Number(i.totalYway) || 0,
        totalGram: Number(i.totalGram) || 0,
        totalPrice: Number(i.totalPrice) || 0,
      })),
    };

    try {
      const result = await createSupplier(payload).unwrap();
      alert("✅ Purchase created successfully!");
      nav("/purchase/purchase-list")
      dispatch(clearCart());
    } catch (error) {
      console.error("Purchase creation failed:", error);
      alert("❌ Purchase failed: " + (error.message || "Unknown error"));
    }
  };

  //h
  const handleDelete = (index) => {
    dispatch(removeCart(index));
  };

  const handleDeletePayment = (idx) => {
    // Clear the list of added payments
    dispatch(resetPayments(idx));
    dispatch(resetconvert24());
  };

  const handleDeleteDiscount = () => {
    // Clear the list of added payments
    dispatch(resetDiscountPayments());
  };

  useEffect(() => {
    // console.log("useEffect - dispatching updateConvert24K");
    dispatch(updateConvert24K());
  }, [items, dispatch]);

  const calculateItemTotals = (item) => {
    // console.log("calculateItemTotals called for item:", item);
    const qty = Number(item.qty || 1);
    const qualityName =
      item.qualityName || (item.karat ? `${item.karat}K` : "24K");
    const karat =
      Number(item.karat) ||
      (typeof item.qualityName === "string"
        ? Number(item.qualityName.replace(/K/i, ""))
        : 24);

    // Multiply alyot values by quantity
    const rawAlyotKyat = Number(item.alyautKyat || 0) * qty;
    const rawAlyotPae = Number(item.alyautPae || 0) * qty;
    const rawAlyotYway = Number(item.alyautYway || 0) * qty;
    const alyotGram = Number(item.alyautGram || 0) * qty;

    const alyotKPY = normalizeKPY(rawAlyotKyat, rawAlyotPae, rawAlyotYway);

    const shweKyat = Number(item.kyat || 0);
    const shwePae = Number(item.pae || 0);
    const shweYway = Number(item.yway || 0);
    const shweGram = Number(item.gram || 0);

    console.log("shweKyat", shweYway);
    const roundedShweYway = roundYwayAndCarry(shweYway);

    const shweKPY = normalizeKPY(
      shweKyat,
      shwePae + (roundedShweYway?.carryPae || 0),
      roundedShweYway?.yway || 0
    );

    console.log(shweKPY, "shweKPY ");

    // Calculate net weight (shwe + alyot) and normalize
    const netKPY = normalizeKPY(
      shweKPY.kyat + alyotKPY.kyat,
      shweKPY.pae + alyotKPY.pae,
      shweKPY.yway + alyotKPY.yway
    );

    // ✅ round yway and carry for netKPY
    const roundedNetYway = roundYwayAndCarry(netKPY.yway);

    const finalNetKPY = normalizeKPY(
      netKPY.kyat,
      netKPY.pae + (roundedNetYway?.carryPae || 0),
      roundedNetYway?.yway || 0
    );

    const netKyat = finalNetKPY.kyat;
    const netPae = finalNetKPY.pae;
    const netYway = finalNetKPY.yway;

    // const netKyat = netKPY.kyat;
    // const netPae = netKPY.pae;
    // const netYway = netKPY.yway;

    // Calculate net grams
    const netGram = toFixedDown(kpyToGram(netKyat, netPae, netYway), 2);

    // const netGram = Number(shweGram || 0) + Number(alyotGram || 0);

    // Calculate 24K conversion for this item
    const convert24KValue = convertTo24K(
      netKyat,
      netPae,
      netYway,
      parseFloat(item.karat || 24)
    );
    let convert24KDetail = convertToKPY(convert24KValue);

    const rounded24KYway = roundYwayAndCarry(convert24KDetail.yway);

    convert24KDetail = normalizeKPY(
      convert24KDetail.kyat,
      convert24KDetail.pae + (rounded24KYway?.carryPae || 0),
      rounded24KYway?.yway || 0
    );

    const convert24KGram = toFixedDown(
      kpyToGram(
        convert24KDetail.kyat,
        convert24KDetail.pae,
        convert24KDetail.yway
      ),
      2
    );

    convert24KDetail.gram = convert24KGram;

    console.log("convert24KValue :", convert24KValue);
    console.log("convertTo24K :", convertTo24K);

    const result = {
      qty,
      alyotKyat: alyotKPY.kyat,
      alyotPae: alyotKPY.pae,
      alyotYway: alyotKPY.yway,
      alyotGram,
      shweKyat: shweKPY.kyat,
      shwePae: shweKPY.pae,
      shweYway: shweKPY.yway,
      shweGram,
      netKyat: finalNetKPY.kyat,
      netPae: finalNetKPY.pae,
      netYway: finalNetKPY.yway,
      netGram,
      convert24KValue,
      convert24KDetail,
    };
    console.log("calculateItemTotals result:", result);
    return result;
  };

  // const calculateTotalCash = () => {

  //   if (!items || items.length === 0) return 0;

  //   const baseTotalCash = items.reduce((sum, item) => {
  //     const qty = Number(item.qty || 1);

  //     // alyot values
  //     const rawAlyotKyat = Number(item.alyautKyat || 0) * qty;
  //     const rawAlyotPae = Number(item.alyautPae || 0) * qty;
  //     const rawAlyotYway = Number(item.alyautYway || 0) * qty;

  //     const alyotKPY = normalizeKPY(rawAlyotKyat, rawAlyotPae, rawAlyotYway);

  //     // shwe values
  //     const shweKyat = Number(item.kyat || 0);
  //     const shwePae = Number(item.pae || 0);
  //     const shweYway = Number(item.yway || 0);

  //     const roundedShweYway = roundYwayAndCarry(shweYway);

  //     const shweKPY = normalizeKPY(
  //       shweKyat,
  //       shwePae + (roundedShweYway?.carryPae || 0),
  //       roundedShweYway?.yway || 0
  //     );

  //     // net weight for **this** item
  //     const netKPY = normalizeKPY(
  //       shweKPY.kyat + alyotKPY.kyat,
  //       shweKPY.pae + alyotKPY.pae,
  //       shweKPY.yway + alyotKPY.yway
  //     );

  //     const netGram = kpyToGram(netKPY.kyat, netKPY.pae, netKPY.yway);

  //     console.log(netKPY, "netKPY:");

  //     const totalKyatValue = convertTo24K(
  //       netKPY.kyat,
  //       netKPY.pae,
  //       netKPY.yway,
  //       Number(item.karat || 24)
  //     );

  //     let convert24KDetail = convertToKPY(totalKyatValue);

  //     const rounded24KYway = roundYwayAndCarry(convert24KDetail.yway);

  //     convert24KDetail = normalizeKPY(
  //       convert24KDetail.kyat,
  //       convert24KDetail.pae + (rounded24KYway?.carryPae || 0),
  //       rounded24KYway?.yway || 0
  //     );
  //     // netKPY.kyat + netKPY.pae / 16 + netKPY.yway / 128;

  //     // console.log(roundedTotalKPY, "roundedTotalKPY:");

  //     const todayRate = Number(item.todayRate || 0);
  //     // const itemTotal = netGram * todayRate;
  //     // const itemTotal = (finalKPY.kyat + finalKPY.pae / 16 + finalKPY.yway / 128) * todayRate;
  //     const itemTotal =
  //       (convert24KDetail.kyat +
  //         convert24KDetail.pae / 16 +
  //         convert24KDetail.yway / 128) *
  //       todayRate;
  //     console.log("itemTotal:", itemTotal);
  //     console.log("netGram:", netGram);

  //     return sum + itemTotal;
  //   }, 0);

  //   // discount
  //   let totalDiscountCash = 0;
  //   if (discountPayments && discountPayments.length > 0) {
  //     totalDiscountCash = discountPayments.reduce((sum, discount) => {
  //       const discountCash = Number(discount?.discountCash) || 0;
  //       console.log("Discount cash calculation:", {
  //         discount,
  //         discountCash,
  //         runningTotal: sum + discountCash,
  //       });
  //       return sum + discountCash;
  //     }, 0);
  //   }

  //   const finalTotalCash = baseTotalCash - totalDiscountCash;
  //   // console.log("calculateTotalCash result:", {
  //   //   baseTotalCash,
  //   //   totalDiscountCash,
  //   //   finalTotalCash,
  //   // });

  //   return finalTotalCash;
  // };

  // Replace your existing calculateTotalCash with this version
  const calculateTotalCash = () => {
    if (!items || items.length === 0) return 0;

    // 1) compute base total cash from items (same logic you had)
    const baseTotalCash = items.reduce((sum, item) => {
      const qty = Number(item.qty || 1);

      // alyot
      const rawAlyotKyat = Number(item.alyautKyat || 0) * qty;
      const rawAlyotPae = Number(item.alyautPae || 0) * qty;
      const rawAlyotYway = Number(item.alyautYway || 0) * qty;
      const alyotKPY = normalizeKPY(rawAlyotKyat, rawAlyotPae, rawAlyotYway);

      // shwe
      const shweKyat = Number(item.kyat || 0);
      const shwePae = Number(item.pae || 0);
      const shweYway = Number(item.yway || 0);
      const roundedShweYway = roundYwayAndCarry(shweYway);
      const shweKPY = normalizeKPY(
        shweKyat,
        shwePae + (roundedShweYway?.carryPae || 0),
        roundedShweYway?.yway || 0
      );

      // net K/P/Y
      const netKPY = normalizeKPY(
        shweKPY.kyat + alyotKPY.kyat,
        shweKPY.pae + alyotKPY.pae,
        shweKPY.yway + alyotKPY.yway
      );

      // convert to 24K and to KPY detail
      const totalKyatValue = convertTo24K(
        netKPY.kyat,
        netKPY.pae,
        netKPY.yway,
        parseFloat(item.karat || 24)
      );

      let convert24KDetail = convertToKPY(totalKyatValue);
      const rounded24KYway = roundYwayAndCarry(convert24KDetail.yway);
      convert24KDetail = normalizeKPY(
        convert24KDetail.kyat,
        convert24KDetail.pae + (rounded24KYway?.carryPae || 0),
        rounded24KYway?.yway || 0
      );

      const todayRateLocal = Number(item.todayRate || 0);
      const itemTotal =
        (convert24KDetail.kyat +
          convert24KDetail.pae / 16 +
          convert24KDetail.yway / 128) *
        todayRateLocal;

      return sum + itemTotal;
    }, 0);

    // 2) discount cash sum (same as you had)
    let totalDiscountCash = 0;
    if (discountPayments && discountPayments.length > 0) {
      totalDiscountCash = discountPayments.reduce((sum, discount) => {
        const discountCash = Number(discount?.discountCash) || 0;
        return sum + discountCash;
      }, 0);
    }

    // 3) payments -> grams (this includes any explicit cash input because
    // calculateTotalPaymentsInGrams should account for `cash`)
    const paymentsGrams = calculateTotalPaymentsInGrams() || 0;
    const todayRateForConversion = Number(items?.[0]?.todayRate) || 0;
    // let paymentsKsFromArray = 0;
    // if (paymentsGrams > 0 && todayRateForConversion > 0) {
    //   paymentsKsFromArray = (paymentsGrams / 16.6) * todayRateForConversion;
    // }

    // console.log(paymentsKsFromArray,"paymentsKsFromArray:");

    const sumCashies = (cashies || []).reduce(
      (s, c) => s + (Number(c?.cash) || 0),
      0
    );

    // 4) direct cash entered by user (Ks) -> use directly (do NOT convert round-trip)

    // 5) final total: base - discount - (payments from array) - (cash input)
    const finalTotalCash = baseTotalCash - totalDiscountCash - sumCashies;

    console.log(finalTotalCash, "finalTotalCash:");

    return Math.max(0, Number(finalTotalCash.toFixed(2)));
  };

  // Get todayRate from items

  const getTodayRate = () => {
    // console.log("getTodayRate called");
    if (items && items.length > 0) {
      const rate = Number(items[0]?.todayRate) || 0;
      // console.log("Today rate:", rate);
      return rate;
    }
    // console.log("No items, returning 0");
    return 0;
  };

  const todayRate = getTodayRate();

  // Helper function to convert cash (Kyat) into KPY and Gram using today's rate
  // const convertCashToKPY = (cashAmount, todayRate) => {
  //   // console.log("convertCashToKPY called:", { cashAmount, todayRate });

  //   if (!cashAmount || cashAmount <= 0 || !todayRate || todayRate <= 0) {
  //     // console.log("Invalid values, returning zero");
  //     return { kyat: 0, pae: 0, yway: 0, gram: 0 };
  //   }

  //   // Step 1: cash → Kyat (stage)
  //   const totalKyat = cashAmount / todayRate;
  //   console.log("Cash to Kyat:", totalKyat);

  //   // Step 2: split into kyat / pae / yway
  //   const kyat = Math.floor(totalKyat);
  //   console.log("Kyat part:", kyat);

  //   const paeValue = (totalKyat - kyat) * 16;
  //   const pae = toFixedDown(paeValue, 0);

  //   console.log("paeValue:", paeValue, "Pae part:", pae);

  //   const ywayValue = (paeValue - pae) * 8;
  //   console.log("ywayValue", ywayValue);

  //   const yway = toFixedDown(ywayValue, 2);

  //   // Step 3: convert Kyat to grams
  //   const gram = totalKyat * 16.6;

  //   const result = {
  //     kyat,
  //     pae,
  //     yway,
  //     gram: parseFloat(gram.toFixed(3)),
  //   };

  //   // console.log("convertCashToKPY result:", result);
  //   return result;
  // };

  const convertCashToKPY = (cashAmount, todayRate) => {
    if (!cashAmount || cashAmount <= 0 || !todayRate || todayRate <= 0) {
      return { kyat: 0, pae: 0, yway: 0, gram: 0 };
    }

    const totalKyat = cashAmount / todayRate; // full precision

    const kyat = Math.floor(totalKyat);
    const paeValue = (totalKyat - kyat) * 16;
    const pae = Math.floor(paeValue); // use Math.floor not toFixedDown for internal

    const ywayValue = (paeValue - pae) * 8;
    // Keep yway as full precision here (for display you can round)
    // const yway = Math.round(ywayValue * 100) / 100; // e.g., 2 decimals for UI only

    const yway = toFixedDown(ywayValue, 2); // or keep 2 decimals for yway

    // convert totalKyat to gram (and use toFixedDown for 3 decimal places)

    console.log("yway:", yway);

    // IMPORTANT: keep gram full precision for internal calc (do NOT toFixed here)
    // const gram = toFixedDown(totalKyat * 16.6,2);
    const gram = totalKyat * 16.6;

    return {
      kyat,
      pae,
      yway,
      gram, // full precision number
    };
  };

  // Calculate total discount
  const calculateTotalDiscount = () => {
    // console.log("calculateTotalDiscount called");
    if (!discountPayments || discountPayments.length === 0) {
      // console.log("No discount payments, returning zero");
      return { kyat: 0, pae: 0, yway: 0, gram: 0, cash: 0 };
    }

    const result = discountPayments.reduce(
      (total, discount) => ({
        kyat: total.kyat + (Number(discount?.kyat) || 0),
        pae: total.pae + (Number(discount?.pae) || 0),
        yway: total.yway + (Number(discount?.yway) || 0),
        gram: total.gram + (Number(discount?.gram) || 0),
        cash: total.cash + (Number(discount?.discountCash) || 0),
      }),
      { kyat: 0, pae: 0, yway: 0, gram: 0, cash: 0 }
    );
    console.log("calculateTotalDiscount result:", result);
    return result;
  };

  const handleDownloadPdf = async () => {
    try {
      const ok = await handleConfirmOrder();
      if (ok) {
        // alert("Order confirm fail!");
        return;
      }
      const element = printRef.current;
      if (!element) {
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        ignoreElements: (el) => el.classList.contains("hide-on-pdf"),
      });
      const data = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      const imgProperties = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();

      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

      pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("examplepdf.pdf");
      alert("Order confirm success! PDF downloaded.");
      dispatch(clearCart());
      nav("/sale/sale-list");
    } catch (error) {
      alert("Something went wrong while generating PDF.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
        <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon />
        </span>
        Point of Sale
      </h1>

      <div className="border-b-2"></div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Side - Form */}
        <PurchaseLeft />

        {/* Right Side - Invoice */}
        <Card className="p-4 fixed top-0 right-0 bottom-0" ref={printRef}>
          {/* Invoice Info */}
          <div className="text-sm space-y-1 mb-4">
            <p>Voucher Code: {items[0]?.voucherCode || ""}</p>
            <p>Customer Name: {items[0]?.customerName || ""}</p>
            <p>Cashier Name: {items[0]?.cashierName || ""}</p>
            <p>Today Gold Rate: {items[0]?.todayRate || 0} Kyats</p>
            <p>Date: {items[0]?.orderDate || 0}</p>
            {/* <p>Time: {new Date().toLocaleTimeString()}</p> */}
          </div>

          {/* Invoice Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-collapse text-sm text-center">
              <thead>
                <tr>
                  <th className="border p-1" rowSpan={2}>
                    No.
                  </th>
                  <th className="border p-1" rowSpan={2}>
                    Product
                  </th>
                  <th className="border p-1" rowSpan={2}>
                    Qty
                  </th>
                  <th className="border p-1" rowSpan={2}>
                    Quality
                  </th>
                  <th className="border p-1" colSpan={4}>
                    အလျော့တွက်
                  </th>
                  <th className="border p-1" rowSpan={2}>
                    လက်ခ
                  </th>
                  <th className="border p-1" colSpan={4}>
                    ရွှေချိန်
                  </th>
                  <th className="border p-1" colSpan={4}>
                    Total
                  </th>
                  <th className="border p-1" colSpan={4}>
                    ConvertTo24K
                  </th>
                  <th className="border p-1" colSpan={4}>
                    Action
                  </th>
                </tr>
                <tr>
                  <th className="border p-1">ကျပ်</th>
                  <th className="border p-1">ပဲ</th>
                  <th className="border p-1">ရွေး</th>
                  <th className="border p-1">G</th>

                  <th className="border p-1">ကျပ်</th>
                  <th className="border p-1">ပဲ</th>
                  <th className="border p-1">ရွေး</th>
                  <th className="border p-1">G</th>

                  <th className="border p-1">ကျပ်</th>
                  <th className="border p-1">ပဲ</th>
                  <th className="border p-1">ရွေး</th>
                  <th className="border p-1">G</th>

                  <th className="border p-1">ကျပ်</th>
                  <th className="border p-1">ပဲ</th>
                  <th className="border p-1">ရွေး</th>
                  <th className="border p-1">G</th>

                  <th className="border p-1">Delete</th>
                </tr>
              </thead>

              <tbody>
                {items && items.length === 0 ? (
                  <tr>
                    <td className="border p-1" colSpan={21}>
                      No items added.
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => {
                    // console.log("Rendering item:", item);
                    const totals = calculateItemTotals(item);
                    const todayRate = Number(item.todayRate || 0);

                    console.log("Total :", totals);

                    return (
                      <tr key={index}>
                        <td className="border p-1 bg-yellow-100">
                          {index + 1}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {item.productName || "N/A"}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.qty}
                        </td>

                        <td className="border p-1 bg-yellow-100">
                          {item.qualityName}
                        </td>

                        {/* အလျော့တွက် - FIXED with quantity multiplication */}
                        <td className="border p-1 bg-yellow-100">
                          {totals.alyotKyat}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.alyotPae}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.alyotYway.toFixed(2)}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.alyotGram.toFixed(2)}
                        </td>

                        {/* လက်ခ */}
                        <td className="border p-1 bg-yellow-100">
                          {Number(item.laathk) || 0}
                        </td>

                        {/* ရွှေချိန် */}
                        <td className="border p-1 bg-yellow-100">
                          {totals.shweKyat}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.shwePae}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.shweYway}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.shweGram?.toFixed(2)}
                        </td>

                        {/* Total (Net Weight) - FIXED */}
                        <td className="border p-1 bg-yellow-100">
                          {totals.netKyat}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.netPae}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.netYway?.toFixed(2)}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals?.netGram}
                        </td>

                        {/* Convert to 24K - FIXED */}
                        <td className="border p-1 bg-yellow-100">
                          {totals.convert24KDetail?.kyat || 0}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.convert24KDetail?.pae || 0}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.convert24KDetail?.yway?.toFixed(2) || 0}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.convert24KDetail?.gram || 0}
                        </td>
                        {/* San Kyi Thar */}

                        {/* //Delete Button */}
                        <Button
                          onClick={() => handleDelete(index)}
                          className="border p-5 bg-red-400 text-black hover:bg-red-500 hover:text-white"
                        >
                          X
                        </Button>
                        {/* //Delete Button */}
                      </tr>
                    );
                  })
                )}
              </tbody>

              <tfoot>
                {/* Total Gold */}
                {/* <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">
                    Total Gold
                  </td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1">
                    {calculateTotalGoldDirectAdd()?.kyat || 0}
                  </td>
                  <td className="border p-1">
                    {calculateTotalGoldDirectAdd()?.pae || 0}
                  </td>
                  <td className="border p-1">
                    {calculateTotalGoldDirectAdd()?.yway || 0}
                  </td>
                  <td className="border p-1">
                    {calculateTotalGoldDirectAdd()?.gram?.toFixed(2) || 0}
                  </td>
                </tr> */}
                {/* Gold (24K) Row */}
                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">
                    Gold (24K)
                  </td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1" colSpan={4}></td>
                  {/* Display sum of all convertTo24K detail results */}
                  <td className="border p-1">
                    {calculateTotalConvert24K()?.kyat || 0}
                  </td>
                  <td className="border p-1">
                    {calculateTotalConvert24K()?.pae || 0}
                  </td>
                  <td className="border p-1">
                    {calculateTotalConvert24K()?.yway?.toFixed(2) || 0}
                  </td>
                  <td className="border p-1">
                    {calculateTotalConvert24K()?.gram || 0}
                  </td>
                </tr>

                {/* Previous Balance Row - NOW SHOWS CUSTOMER REMAINING BALANCE */}
                {/* <tr>
                  <td className="border p-1"></td>
                   <td className="border p-1 text-center font-bold">
                    Previous Balance
                  </td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1">
                    {customerRemainingBalance.kyat}
                  </td>
                  <td className="border p-1">{customerRemainingBalance.pae}</td>
                  <td className="border p-1">
                    {customerRemainingBalance.yway}
                  </td>
                  <td className="border p-1">
                    {customerRemainingBalance.gram.toFixed(2)}
                  </td>
                </tr> */}

                {/* Previous Balance Row - NOW SHOWS CUSTOMER REMAINING BALANCE CONVERTED TO 24K */}
                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">
                    Previous Balance (24K)
                  </td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1">
                    {convertPreviousBalanceTo24K()?.kyat || 0}
                  </td>
                  <td className="border p-1">
                    {convertPreviousBalanceTo24K()?.pae || 0}
                  </td>
                  <td className="border p-1">
                    {convertPreviousBalanceTo24K()?.yway || 0}
                  </td>
                  <td className="border p-1">
                    {convertPreviousBalanceTo24K()?.gram?.toFixed(2) || 0}
                  </td>
                </tr>

                {/* Heading row */}
                {/* <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">Payment</td>
                  <td className="border p-1" colSpan={10}></td>
                </tr> */}

                {/* Map rows */}
                {payments &&
                  payments.length > 0 &&
                  payments.map((p, idx) => (
                    <tr key={idx}>
                      <td className="border p-1 text-center font-bold">
                        {idx + 1}
                      </td>
                      <td className="border p-1 text-center font-bold">
                        Payment {p.qualityName}
                      </td>
                      <td className="border p-1"></td>
                      <td className="border p-1"></td>

                      {/* kyat / pae / yway / gram */}
                      <td className="border p-1 text-center">
                        {Number(p.kyat) || 0}
                      </td>
                      <td className="border p-1 text-center">
                        {Number(p.pae) || 0}
                      </td>
                      <td className="border p-1 text-center">
                        {Number(p.yway) || 0}
                      </td>
                      <td className="border p-1 text-center">
                        {p.gram ? Number(p.gram).toFixed(2) : 0}
                      </td>

                      <td className="border p-1"></td>
                      <td className="border p-1" colSpan={4}></td>
                      <td className="border p-1" colSpan={4}></td>
                      {convert24s?.map((convert24, index) => (
                        <Fragment key={index}>
                          <td className="border p-1">{convert24?.kyat}</td>
                          <td className="border p-1">{convert24?.pae}</td>
                          <td className="border p-1">{convert24?.yway}</td>
                          <td className="border p-1">{convert24?.gram}</td>
                        </Fragment>
                      ))}
                      {/* Convert 24K */}
                      {/* <tr>
                       <td className="border p-1"></td>
                      <td className="border p-1"></td>
                      <td className="border p-1"></td>
                      <td className="border p-1"></td>
                     </tr> */}
                      {/* Convert 24K */}

                      {/* Delete Button */}
                      <td className="border p-1">
                        <Button
                          onClick={() => handleDeletePayment(idx)}
                          className="border p-5 bg-red-400 text-black hover:bg-red-500 hover:text-white"
                        >
                          X
                        </Button>
                      </td>
                    </tr>
                  ))}

                {/* )} */}

                {/* <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">
                    Payment (Cash)
                  </td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={13}>
                    ငွေပမာဏ: {Number(cash || 0)?.toLocaleString()} Ks
                  </td>
                  <td className="border p-1">
                    {convertCashToKPY(Number(cash), todayRate).kyat || 0}
                  </td>
                  <td className="border p-1">
                    {convertCashToKPY(Number(cash), todayRate).pae || 0}
                  </td>
                  <td className="border p-1">
                    {convertCashToKPY(Number(cash), todayRate).yway || 0}
                  </td>
                  <td className="border p-1">
                    {convertCashToKPY(Number(cash), todayRate).gram?.toFixed(
                      2
                    ) || 0}
                  </td>
                </tr> */}

                {cashies &&
                  cashies.length > 0 &&
                  cashies.map((c, idx) => {
                    const converted = convertCashToKPY(
                      Number(c.cash || 0),
                      todayRate
                    );
                    return (
                      <tr key={`cashie-${idx}`}>
                        <td className="border p-1 text-center font-bold">
                          {idx + 1}
                        </td>
                        <td className="border p-1 text-center font-bold">
                          Payment {c.paymentCatName || "Cash"}
                        </td>
                        <td className="border p-1"></td>
                        <td className="border p-1"></td>

                        {/* show cash amount (Ks) */}
                        <td className="border p-1" colSpan={13}>
                          ငွေပမာဏ: {Number(c.cash || 0).toLocaleString()}{" "}
                          Ks
                        </td>

                        {/* converted to K/P/Y/Gram */}
                        <td className="border p-1">{converted.kyat || 0}</td>
                        <td className="border p-1">{converted.pae || 0}</td>
                        <td className="border p-1">{converted.yway || 0}</td>
                        <td className="border p-1">
                          {converted.gram
                            ? Number(converted.gram).toFixed(2)
                            : "0.00"}
                        </td>
                      </tr>
                    );
                  })}

                {/* Discount Payment Row */}
                {/* {discountPayments && discountPayments.length > 0 && ( */}
                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">
                    Discount Payment
                  </td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1">
                    {calculateTotalDiscount().kyat}
                  </td>
                  <td className="border p-1">{calculateTotalDiscount().pae}</td>
                  <td className="border p-1">
                    {calculateTotalDiscount().yway}
                  </td>
                  <td className="border p-1">
                    {calculateTotalDiscount().gram?.toFixed(2)}
                  </td>
                  <td className="border p-1">
                    {Number(calculateTotalDiscount().cash)?.toLocaleString() ||
                      0}
                  </td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1" colSpan={4}></td>
                  {discountPayments && discountPayments.length > 0 && (
                    <td className="border p-1">
                      <Button
                        onClick={handleDeleteDiscount}
                        className="border p-5 bg-red-400 text-black hover:bg-red-500 hover:text-white"
                      >
                        X
                      </Button>
                    </td>
                  )}
                  {/* //Delete Button */}
                </tr>
                {/* )} */}

                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">
                    Total (Cash)
                  </td>
                  <td className="border p-1" colSpan={19}>
                    {calculateTotalCash()
                      ? calculateTotalCash().toLocaleString()
                      : 0}
                    Ks
                  </td>
                </tr>

                {/* Remaining Gold Row - Using the correct formula */}
                <tr className="bg-green-100 font-bold">
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center">Remaining Gold</td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1">
                    {calculateRemainingGold()?.kyat || 0}
                  </td>
                  <td className="border p-1">
                    {calculateRemainingGold()?.pae || 0}
                  </td>
                  <td className="border p-1">
                    {calculateRemainingGold()?.yway || 0}
                  </td>
                  <td className="border p-1">
                    {calculateRemainingGold()?.normalizedGram || 0}
                  </td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1" colSpan={4}></td>
                </tr>
              </tfoot>
            </table>
          </div>
          {/* Footer Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <Button
              variant="outline"
              className="bg-gray-100 text-gray-700 hide-on-pdf"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmOrder}
              disabled={isLoading || !items || items.length === 0}
              className="bg-yellow-600 hover:bg-yellow-700 text-white hide-on-pdf"
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>

            <Button
              onClick={handleDownloadPdf}
              disabled={isLoading || !items || items.length === 0}
              className="bg-green-900 hover:bg-green-800 text-white hide-on-pdf"
            >
              {isLoading ? "Saving PDF..." : "Save & PDF"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PurchaseSystem;
