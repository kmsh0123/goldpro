import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeftIcon } from "lucide-react";
import POSLeft from "./POS-left";
import { useDispatch, useSelector } from "react-redux";
import { useCreateOrderMutation } from "@/feature/api/posApi/posApi";
import {
  clearCart,
  removeCart,
  removePayment,
  resetDiscountPayments,
  resetGoldWeight,
  resetpayment,
  resetPayments,
  selectCartTotals,
  updateConvert24K,
} from "@/feature/service/cartSlice";

// Helper function to normalize KPY values (handle carry-over)
const normalizeKPY = (kyat, pae, yway) => {
  // console.log("normalizeKPY input:", { kyat, pae, yway });
  // Convert everything to yway first for precise calculation
  let totalYway = kyat * 16 * 8 + pae * 8 + yway;

  // Convert back to KPY format
  const newKyat = Math.floor(totalYway / (16 * 8));
  totalYway = totalYway % (16 * 8);

  const newPae = Math.floor(totalYway / 8);
  const newYway = totalYway % 8;

  const result = { kyat: newKyat, pae: newPae, yway: newYway };
  // console.log("normalizeKPY output:", result);
  return result;
};

// Helper function to convert KPY to grams
const kpyToGram = (kyat, pae, yway) => {
  // console.log("kpyToGram input:", { kyat, pae, yway });
  // Convert everything to kyat first, then to grams
  const totalKyat = kyat + pae / 16 + yway / 128;
  const result = totalKyat * 16.6;
  // console.log("kpyToGram output:", result);
  return result;
};

// Helper function to convert to 24K
const convertTo24K = (kyat, pae, yway, quality) => {
  // console.log("convertTo24K input:", { kyat, pae, yway, quality });
  // Convert KPY to total kyat value
  const totalKyat = kyat + pae / 16 + yway / 128;

  // Convert to 24K based on quality
  let converted24K = totalKyat;
  if (quality === 18) converted24K = (totalKyat * 16) / 12;
  else if (quality === 22) converted24K = (totalKyat * 17.5) / 16;
  else if (quality === 23) converted24K = (totalKyat * 17) / 16;

  // console.log("convertTo24K output:", converted24K);
  return converted24K;
};

// Helper function to convert Kyat value to KPY format
const convertToKPY = (kyatValue) => {
  // console.log("convertToKPY input:", kyatValue);
  const kyat = Math.floor(kyatValue);
  const paeValue = (kyatValue - kyat) * 16;
  const pae = Math.floor(paeValue);
  const yway = Math.floor((paeValue - pae) * 8);
  const gram = kyatValue * 16.6; // Convert to grams

  const result = { kyat, pae, yway, gram };
  // console.log("convertToKPY output:", result);
  return result;
};

// Helper function to convert grams to KPY
const gramToKPY = (gramValue) => {
  // console.log("gramToKPY input:", gramValue);
  // Convert grams to kyat
  const totalKyat = gramValue / 16.6;

  const kyat = Math.floor(totalKyat);
  const paeValue = (totalKyat - kyat) * 16;
  const pae = Math.floor(paeValue);
  const yway = Math.round((paeValue - pae) * 8);

  const result = { kyat, pae, yway, gram: parseFloat(gramValue.toFixed(2)) };
  // console.log("gramToKPY output:", result);
  return result;
};

// Helper function to add two KPY values correctly
const addKPY = (kpy1, kpy2) => {
  // console.log("addKPY input:", { kpy1, kpy2 });
  // Convert both to grams
  const grams1 = kpyToGram(kpy1.kyat, kpy1.pae, kpy1.yway);
  const grams2 = kpyToGram(kpy2.kyat, kpy2.pae, kpy2.yway);

  // Add grams
  const totalGrams = grams1 + grams2;

  // Convert back to KPY
  const totalKyatValue = totalGrams / 16.6;
  const kyat = Math.floor(totalKyatValue);
  const paeValue = (totalKyatValue - kyat) * 16;
  const pae = Math.floor(paeValue);
  const yway = Math.round((paeValue - pae) * 8);

  const result = { kyat, pae, yway, gram: parseFloat(totalGrams.toFixed(2)) };
  // console.log("addKPY output:", result);
  return result;
};

const POS = () => {
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const dispatch = useDispatch();

  const {
    items,
    goldWeight,
    alyut,
    payments,
    payment,
    laathk,
    cash,
    discount,
    discountPayments,
  } = useSelector((state) => state.cart);

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

  const convert24K = useSelector((state) => state.cart.convert24K);
  const convert24KDetail = useSelector((state) => state.cart.convert24KDetail);
  // console.log("convert24K:", convert24K);
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
      // console.log("Processing item:", item);
      const qty = Number(item.qty || 1);
      const alyotKyat = Number(item.alyautKyat || 0) * qty;
      const alyotPae = Number(item.alyautPae || 0) * qty;
      const alyotYway = Number(item.alyautYway || 0) * qty;

      const shweKyat = Number(item.kyat || 0);
      const shwePae = Number(item.pae || 0);
      const shweYway = Number(item.yway || 0);

      // Calculate net weight (shwe + alyot) and normalize
      const netKPY = normalizeKPY(
        shweKyat + alyotKyat,
        shwePae + alyotPae,
        shweYway + alyotYway
      );

      // Convert to 24K
      const convert24KValue = convertTo24K(
        netKPY.kyat,
        netKPY.pae,
        netKPY.yway,
        Number(item.karat || 24)
      );

      // console.log("Item 24K value:", convert24KValue);
      return sum + convert24KValue;
    }, 0);

    // console.log("Total 24K value (kyat):", total24KValue);
    // Convert total 24K value to KPY format
    const result = convertToKPY(total24KValue);
    // console.log("calculateTotalConvert24K result:", result);
    return result;
  };

  // Calculate total payments in grams
  const calculateTotalPaymentsInGrams = () => {
    // console.log("calculateTotalPaymentsInGrams called");
    if (!payments || payments.length === 0) {
      // console.log("No payments, returning 0");
      return 0;
    }

    const totalPayments = payments.reduce(
      (total, payment) => ({
        kyat: total.kyat + (Number(payment?.kyat) || 0),
        pae: total.pae + (Number(payment?.pae) || 0),
        yway: total.yway + (Number(payment?.yway) || 0),
        gram: total.gram + (Number(payment?.gram) || 0),
      }),
      { kyat: 0, pae: 0, yway: 0, gram: 0 }
    );
    // console.log("Total payments KPY:", totalPayments);

    // Convert to grams
    const result = kpyToGram(
      totalPayments.kyat,
      totalPayments.pae,
      totalPayments.yway
    );
    // console.log("calculateTotalPaymentsInGrams result:", result);
    return result;
  };

  // Calculate total discount payments in grams (negative values add, positive values subtract)
  const calculateTotalDiscountPaymentsInGrams = () => {
    // console.log("calculateTotalDiscountPaymentsInGrams called");
    if (!discountPayments || discountPayments.length === 0) {
      // console.log("No discount payments, returning 0");
      return 0;
    }

    const result = discountPayments.reduce((total, discount) => {
      const kyat = Number(discount?.kyat) || 0;
      const pae = Number(discount?.pae) || 0;
      const yway = Number(discount?.yway) || 0;
      const gram = Number(discount?.gram) || 0;

      // Convert to grams
      const discountInGrams = kpyToGram(kyat, pae, yway) + gram;

      // If discountCash is negative, it adds to the total (discount)
      // If discountCash is positive, it subtracts from the total (additional charge)
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

      // console.log("Discount payment calculation:", {
      //   discount,
      //   discountInGrams,
      //   discountCash,
      //   todayRate,
      //   cashDiscountInGrams,
      //   signedDiscount,
      //   runningTotal: total + signedDiscount,
      // });

      return total + signedDiscount;
    }, 0);

    // console.log("calculateTotalDiscountPaymentsInGrams result:", result);
    return result;
  };

  // Calculate remaining gold using the formula:
  // Remaining gold = (Remaining balance + Gold (24K)) - (Payment - Discount Payment)
  const calculateRemainingGold = () => {
    // console.log("calculateRemainingGold called");
    // 1. Convert remaining balance to grams
    const remainingBalanceGrams = kpyToGram(
      customerRemainingBalance.kyat,
      customerRemainingBalance.pae,
      customerRemainingBalance.yway
    );
    // console.log("Remaining balance grams:", remainingBalanceGrams);

    // 2. Convert Gold (24K) to grams
    const gold24K = calculateTotalConvert24K();
    const gold24KGrams = kpyToGram(gold24K.kyat, gold24K.pae, gold24K.yway);
    // console.log("Gold 24K grams:", gold24KGrams);

    // 3. Get total payments in grams
    const totalPaymentsGrams = calculateTotalPaymentsInGrams();
    // console.log("Total payments grams:", totalPaymentsGrams);

    // 4. Get total discount payments in grams
    const totalDiscountPaymentsGrams = calculateTotalDiscountPaymentsInGrams();
    // console.log("Total discount payments grams:", totalDiscountPaymentsGrams);

    // 5. Apply the formula: (Remaining balance + Gold 24K) - (Payment - Discount)
    // const totalRemainingGrams = remainingBalanceGrams + gold24KGrams;
    const totalRemainingGrams =
      gold24KGrams +
      remainingBalanceGrams -
      (totalPaymentsGrams - totalDiscountPaymentsGrams);
    // console.log("Total remaining grams:", totalRemainingGrams);

    // Convert back to KPY format
    const result = gramToKPY(totalRemainingGrams); // Ensure non-negative value
    // console.log("calculateRemainingGold result:", result);
    return result;
  };

  // Convert Previous Balance to 24K
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

    const result = convertToKPY(convert24KValue);
    // console.log("convertPreviousBalanceTo24K result:", result);
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

    // console.log("Adding previous balance (24K) and gold 24K:", {
    //   previousBalance,
    //   gold24K,
    // });
    // Add them properly using the addKPY function
    const result = addKPY(previousBalance, gold24K);
    // console.log("calculateCombinedTotal result:", result);
    return result;
  };

  const handleConfirmOrder = async () => {
    // console.log("handleConfirmOrder called");
    if (!items || items.length === 0) {
      // console.log("No items in cart!");
      alert("No items in cart!");
      return;
    }

    // Calculate the NEW remaining balance after payment
    const newRemainingBalance = calculateRemainingGold();

    const payload = {
      orderCode: "ORD-" + Date.now(),
      voucherCode: items[0]?.voucherCode || "N/A",
      customerId: items[0]?.customerId || 1,
      totalQuantity: items.reduce((sum, i) => sum + (Number(i.qty) || 1), 0),
      // Combined Total (Previous Balance + Gold 24K)
      totalKyat: Number(calculateCombinedTotal()?.kyat) || 0,
      totalPae: Number(calculateCombinedTotal()?.pae) || 0,
      totalYway: Number(calculateCombinedTotal()?.yway) || 0,
      totalGram: Number(calculateCombinedTotal()?.gram) || 0,
      totalPrice: items.reduce((sum, i) => sum + Number(i.price || 0), 0),
      todayRate: Number(items[0]?.todayRate) || 0,
      // Payment section
      // paymentKyat: Number(payment?.kyat) || 0,
      // paymentPae: Number(payment?.pae) || 0,
      // paymentYway: Number(payment?.yway) || 0,
      // paymentGram: Number(payment?.gram) || 0,
      // paymentCash: Number(cash) || 0,

      paymentKyat: convertCashToKPY(Number(cash), todayRate).kyat || 0,
      paymentPae: convertCashToKPY(Number(cash), todayRate).pae || 0,
      paymentYway: convertCashToKPY(Number(cash), todayRate).yway || 0,
      paymentGram: convertCashToKPY(Number(cash), todayRate).gram || 0,
      paymentCash: Number(cash) || 0,
      // Discount section
      discountKyat: Number(discount?.kyat) || 0,
      discountPae: Number(discount?.pae) || 0,
      discountYway: Number(discount?.yway) || 0,
      discountGram: Number(discount?.gram) || 0,
      discountCash: Number(discount?.cash) || 0,
      // NEW: Save the calculated remaining balance, not the original
      remainingKyat: Number(newRemainingBalance?.kyat) || 0,
      remainingPae: Number(newRemainingBalance?.pae) || 0,
      remainingYway: Number(newRemainingBalance?.yway) || 0,
      remainingGram: Number(newRemainingBalance?.gram) || 0,
      // Gold 24K total
      total24KKyat: Number(calculateTotalConvert24K()?.kyat) || 0,
      total24KPae: Number(calculateTotalConvert24K()?.pae) || 0,
      total24KYway: Number(calculateTotalConvert24K()?.yway) || 0,
      total24KGram: Number(calculateTotalConvert24K()?.gram) || 0,
      items: items.map((i) => ({
        productId: i.productId || 0,
        typeId: i.typeId || 0,
        qualityId: i.qualityId || 0,
        categoryId: i.categoryId || 0,
        quantity: Number(i.qty) || 0,
        // အလျော့တွက် (Alyaut)
        yautKyat: Number(i.alyautKyat) || 0,
        yautPae: Number(i.alyautPae) || 0,
        yautYway: Number(i.alyautYway) || 0,
        yautGram: Number(i.alyautGram) || 0,
        // ရွှေချိန် (Shwe)
        shweKyat: Number(i.kyat) || 0,
        shwePae: Number(i.pae) || 0,
        shweYway: Number(i.yway) || 0,
        shweGram: Number(i.gram) || 0,
        // Payment for this item
        paymentKyat: Number(i.paymentKyat) || 0,
        paymentPae: Number(i.payPae) || 0,
        paymentYway: Number(i.payYway) || 0,
        paymentGram: Number(i.payGram) || 0,
        paymentCash: Number(cash) || 0,
        // Discount for this item
        discountKyat: Number(discount?.kyat) || 0,
        discountPae: Number(discount?.pae) || 0,
        discountYway: Number(discount?.yway) || 0,
        discountGram: Number(discount?.gram) || 0,
        discountCash: Number(discountPayments) || 0,
        // Total for this item
        totalKyat: Number(i.kyat) || 0,
        totalPae: Number(i.pae) || 0,
        totalYway: Number(i.yway) || 0,
        totalGram: Number(i.gram) || 0,
        totalPrice: Number(i.price) || 0,
      })),
    };

    // console.log("Order payload:", payload);

    try {
      const result = await createOrder(payload).unwrap();
      // console.log("Order created successfully:", result);
      alert("Order created successfully!");
      dispatch(clearCart());
    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Order failed: " + (error.message || "Unknown error"));
    }
  };

  //h
  const handleDelete = (index) => {
    dispatch(removeCart(index));
  };

  const handleDeletePayment = () => {
  // Clear the list of added payments
  dispatch(resetPayments());
  };

  const handleDeleteDiscount = () => {
  // Clear the list of added payments
  dispatch(resetDiscountPayments());
  };

  useEffect(() => {
    // console.log("useEffect - dispatching updateConvert24K");
    dispatch(updateConvert24K());
  }, [items, dispatch]);

  // Calculate totals for display
  const calculateItemTotals = (item) => {
    // console.log("calculateItemTotals called for item:", item);
    const qty = Number(item.qty || 1);

    // Multiply alyot values by quantity
    const alyotKyat = Number(item.alyautKyat || 0) * qty;
    const alyotPae = Number(item.alyautPae || 0) * qty;
    const alyotYway = Number(item.alyautYway || 0) * qty;
    const alyotGram = Number(item.alyautGram || 0) * qty;

    const shweKyat = Number(item.kyat || 0);
    const shwePae = Number(item.pae || 0);
    const shweYway = Number(item.yway || 0);
    const shweGram = Number(item.gram || 0);

    // Calculate net weight (shwe + alyot) and normalize
    const netKPY = normalizeKPY(
      shweKyat + alyotKyat,
      shwePae + alyotPae,
      shweYway + alyotYway
    );

    const netKyat = netKPY.kyat;
    const netPae = netKPY.pae;
    const netYway = netKPY.yway;

    // Calculate net grams
    const netGram =
      kpyToGram(netKyat, netPae, netYway) + (alyotGram + shweGram);

    // Calculate 24K conversion for this item
    const convert24KValue = convertTo24K(
      netKyat,
      netPae,
      netYway,
      Number(item.karat || 24)
    );
    const convert24KDetail = convertToKPY(convert24KValue);

    // console.log("Net Weight:", { alyotKyat, alyotPae, alyotYway, alyotGram });

    const result = {
      qty,
      alyotKyat,
      alyotPae,
      alyotYway,
      alyotGram,
      shweKyat,
      shwePae,
      shweYway,
      shweGram,
      netKyat,
      netPae,
      netYway,
      netGram,
      convert24KValue,
      convert24KDetail,
    };
    // console.log("calculateItemTotals result:", result);
    return result;
  };

  // Calculate total payments
  const calculateTotalPayments = () => {
    // console.log("calculateTotalPayments called");
    if (!payments || payments.length === 0) {
      // console.log("No payments, returning zero");
      return { kyat: 0, pae: 0, yway: 0, gram: 0 };
    }

    const result = payments.reduce(
      (total, payment) => ({
        kyat: total.kyat + (Number(payment?.kyat) || 0),
        pae: total.pae + (Number(payment?.pae) || 0),
        yway: total.yway + (Number(payment?.yway) || 0),
        gram: total.gram + (Number(payment?.gram) || 0),
      }),
      { kyat: 0, pae: 0, yway: 0, gram: 0 }
    );
    // console.log("calculateTotalPayments result:", result);
    return result;
  };

  // Calculate total cash from all items including discountCash effect
  const calculateTotalCash = () => {
    // console.log("calculateTotalCash called");
    if (!items || items.length === 0) {
      // console.log("No items, returning 0");
      return 0;
    }

    const convert24KGram = Number(convert24K) || 0;
    const baseTotalCash = items.reduce((sum, item) => {
      const todayRate = Number(item.todayRate || 0);
      const itemTotal = convert24KGram * todayRate;
      // console.log("Item cash calculation:", {
      //   item,
      //   convert24KGram,
      //   todayRate,
      //   itemTotal,
      // });
      return sum + itemTotal;
    }, 0);

    // Get total discount cash from all discount payments
    let totalDiscountCash = 0;
    if (discountPayments && discountPayments.length > 0) {
      totalDiscountCash = discountPayments.reduce((sum, discount) => {
        const discountCash = Number(discount?.discountCash) || 0;
        // console.log("Discount cash calculation:", {
        //   discount,
        //   discountCash,
        //   runningTotal: sum + discountCash,
        // });
        return sum + discountCash;
      }, 0);
    }

    // Apply discountCash effect:
    // Negative discountCash adds to total (discount)
    // Positive discountCash subtracts from total (additional charge)
    const finalTotalCash = baseTotalCash - totalDiscountCash;
    // console.log("calculateTotalCash result:", {
    //   baseTotalCash,
    //   totalDiscountCash,
    //   finalTotalCash,
    // });

    return finalTotalCash;
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
  const convertCashToKPY = (cashAmount, todayRate) => {
    // console.log("convertCashToKPY called:", { cashAmount, todayRate });

    if (!cashAmount || cashAmount <= 0 || !todayRate || todayRate <= 0) {
      // console.log("Invalid values, returning zero");
      return { kyat: 0, pae: 0, yway: 0, gram: 0 };
    }

    // Step 1: cash → Kyat (stage)
    const totalKyat = cashAmount / todayRate;
    // console.log("Cash to Kyat:", totalKyat);

    // Step 2: split into kyat / pae / yway
    const kyat = Math.floor(totalKyat);

    const paeValue = (totalKyat - kyat) * 16;
    const pae = Math.floor(paeValue);

    const yway = Math.round((paeValue - pae) * 8);

    // Step 3: convert Kyat to grams
    const gram = totalKyat * 16.6;

    const result = {
      kyat,
      pae,
      yway,
      gram: parseFloat(gram.toFixed(3)),
    };

    // console.log("convertCashToKPY result:", result);
    return result;
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
    // console.log("calculateTotalDiscount result:", result);
    return result;
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
        <POSLeft />

        {/* Right Side - Invoice */}
        <Card className="p-4">
          {/* Invoice Info */}
          <div className="text-sm space-y-1 mb-4">
            <p>Voucher Code: {items[0]?.voucherCode || "N/A"}</p>
            <p>Customer Name: {items[0]?.customerName || "N/A"}</p>
            <p>Gold Quality: {items[0]?.qualityName || "N/A"}</p>
            <p>Date: {new Date().toLocaleDateString()}</p>
            <p>Time: {new Date().toLocaleTimeString()}</p>
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
                    <td className="border p-1" colSpan={20}>
                      No items added.
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => {
                    // console.log("Rendering item:", item);
                    const totals = calculateItemTotals(item);
                    const todayRate = Number(item.todayRate || 0);

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

                        {/* အလျော့တွက် - FIXED with quantity multiplication */}
                        <td className="border p-1 bg-yellow-100">
                          {totals.alyotKyat}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.alyotPae}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.alyotYway}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.alyotGram.toFixed(4)}
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
                          {totals.shweGram.toFixed(2)}
                        </td>

                        {/* Total (Net Weight) - FIXED */}
                        <td className="border p-1 bg-yellow-100">
                          {totals.netKyat}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.netPae}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.netYway}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.netGram.toFixed(2)}
                        </td>

                        {/* Convert to 24K - FIXED */}
                        <td className="border p-1 bg-yellow-100">
                          {totals.convert24KDetail?.kyat || 0}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.convert24KDetail?.pae || 0}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.convert24KDetail?.yway || 0}
                        </td>
                        <td className="border p-1 bg-yellow-100">
                          {totals.convert24KDetail?.gram?.toFixed(2) || 0}
                        </td>

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
                {/* Gold (24K) Row */}
                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">
                    Gold (24K)
                  </td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
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
                    {calculateTotalConvert24K()?.yway || 0}
                  </td>
                  <td className="border p-1">
                    {calculateTotalConvert24K()?.gram?.toFixed(2) || 0}
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

                {/* Combined Total Row - REMAINING BALANCE + GOLD (24K) with proper addition */}
                {/* <tr className="bg-yellow-50 font-bold">
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center">Combined Total</td>
                  <td className="border p-1"></td>
                  <td className="border p-1"colSpan={4}></td>
                  <td className="border p-1"colSpan={4}></td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1">
                    {calculateCombinedTotal()?.kyat || 0}
                  </td>
                  <td className="border p-1">
                    {calculateCombinedTotal()?.pae || 0}
                  </td>
                  <td className="border p-1">
                    {calculateCombinedTotal()?.yway || 0}
                  </td>
                  <td className="border p-1">
                    {calculateCombinedTotal()?.gram?.toFixed(2) || 0}
                  </td>
                </tr> */}

                {/* Payment Row */}
                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">Payment</td>
                  <td className="border p-1"></td>
                  <td className="border p-1">
                    {calculateTotalPayments().kyat}
                  </td>
                  <td className="border p-1">{calculateTotalPayments().pae}</td>
                  <td className="border p-1">
                    {calculateTotalPayments().yway}
                  </td>
                  <td className="border p-1">
                    {calculateTotalPayments().gram?.toFixed(2)}
                  </td>
                  <td className="border p-1"></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1" colSpan={4}></td>
                  <td className="border p-1" colSpan={4}></td>
                  {/* //Delete Button */}
                  {payments && payments.length > 0 && (
                    <td className="border p-1">
                      <Button
                        onClick={handleDeletePayment}
                        className="border p-5 bg-red-400 text-black hover:bg-red-500 hover:text-white"
                      >
                        X
                      </Button>
                    </td>
                  )}
                  {/* //Delete Button */}
                </tr>

                {/* )} */}

                {/* <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">
                    Payment (Cash)
                  </td>
                  <td className="border p-1" colSpan={18}>
                    <div className="flex flex-col items-center gap-1">
                      <span>
                        ငွေပမာဏ: {Number(cash || 0)?.toLocaleString()} Ks
                      </span>
                      {todayRate > 0 ? (
                        <div className="text-sm">
                          <span>
                            Today's Rate: {todayRate?.toLocaleString()} Ks/G
                          </span>
                          <br />
                          <span>
                            K: {convertCashToKPY(Number(cash), todayRate).kyat},
                          </span>
                          <span>
                            P: {convertCashToKPY(Number(cash), todayRate).pae},
                          </span>
                          <span>
                            Y: {convertCashToKPY(Number(cash), todayRate).yway},
                          </span>
                          <span>
                            G:{" "}
                            {convertCashToKPY(
                              Number(cash),
                              todayRate
                            ).gram.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-red-500">
                          Please enter today's rate
                        </span>
                      )}
                    </div>
                  </td>
                </tr> */}

                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">
                    Payment (Cash)
                  </td>
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
                    {convertCashToKPY(Number(cash), todayRate).gram.toFixed(
                      2
                    ) || 0}
                  </td>
                </tr>

                {/* Discount Payment Row */}
                {/* {discountPayments && discountPayments.length > 0 && ( */}
                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">
                    Discount Payment
                  </td>
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
                  {/* //Delete Button */}
                  {discountPayments && discountPayments.length > 0 && (
                    <td className="border p-1"><Button
                      onClick={handleDeleteDiscount}
                      className="border p-5 bg-red-400 text-black hover:bg-red-500 hover:text-white"
                    >
                      X
                    </Button></td>
                  )}
                  {/* //Delete Button */}
                </tr>
                {/* )} */}
                  

                <tr>
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center font-bold">
                    Total (Cash)
                  </td>
                  <td className="border p-1" colSpan={18}>
                    {calculateTotalCash()
                      ? calculateTotalCash().toLocaleString()
                      : 0}{" "}
                    Ks
                  </td>
                </tr>

                {/* Remaining Gold Row - Using the correct formula */}
                <tr className="bg-green-100 font-bold">
                  <td className="border p-1"></td>
                  <td className="border p-1 text-center">Remaining Gold</td>
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
                    {calculateRemainingGold()?.gram?.toFixed(2) || 0}
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
              className="bg-gray-100 text-gray-700"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmOrder}
              disabled={isLoading || !items || items.length === 0}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default POS;
