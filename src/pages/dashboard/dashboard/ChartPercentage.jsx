import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useGetOrderListDetailQuery } from "@/feature/api/posApi/posApi";

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartPercentage = ({ id, orderId  }) => {
  const { data, isLoading, error } = useGetOrderListDetailQuery(orderId);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data</p>;

  const orderItems = data?.data || [];

  const salesByProduct = {};
  orderItems.forEach((item) => {
    const productName = item.product_name || `Product-${item.product_id}`;
    const qty = parseInt(item.quantity, 10) || 0;
    salesByProduct[productName] = (salesByProduct[productName] || 0) + qty;
  });

  // ✅ Extract chart data
  const labels = Object.keys(salesByProduct);
  const salesData = Object.values(salesByProduct);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Product Count",
        data: salesData,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.label}: ${context.formattedValue} items`,
        },
      },
    },
  };

  return (
   <div className="bg-white">
      <h1 className="mt-5 text-center text-2xl pt-5">Sales by Product Count</h1>
      <Pie data={chartData} options={options} className="pie" />
    </div>
  );
};

export default ChartPercentage;
