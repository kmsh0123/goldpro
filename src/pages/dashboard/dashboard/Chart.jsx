import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import moment from "moment";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
import { useGetOrderQuery } from "@/feature/api/posApi/posApi";
import { useGetPurchaseQuery } from "@/feature/api/purchaseApi/purchaseApi";
import { Bar } from "react-chartjs-2";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Chart = () => {
//   const token = Cookies.get("token");
//   const {sub} = jwtDecode(token)
//   const { data, isLoading, error } = useGetOrderQuery({token,sub});
//   const { data : GetPurchase } = useGetPurchaseQuery(token);
  const { data, isLoading, error } = useGetOrderQuery();
  const { data : GetPurchase } = useGetPurchaseQuery();

  
//   const totalPurchaseAmount = GetPurchase?.data?.length
//   ? GetPurchase.data
//       .map(purchase => 
//         purchase?.purchase_items?.map(item => parseInt(item?.product_purchase_price) * item?.product_stock || 0)
//       )
//       .flat()
//       .reduce((acc, price) => acc + price, 0)
//   : 0;

// console.log(totalPurchaseAmount);
  
  
  

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data</p>;

  // ✅ Define all 12 months
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // ✅ Initialize sales data with 0 for each month
  const salesByMonth = months.reduce((acc, month) => {
    acc[month] = 0;
    return acc;
  }, {});

  const purchaseByMonth = months.reduce((acc, month) => {
    acc[month] = 0;
    return acc;
  }, {});

  // ✅ Map API data to respective months
  data?.data?.forEach(order => {
    const orderDate = moment(order.order_date).startOf("day"); // <-- remove time
  const month = orderDate.format("MMMM");
    salesByMonth[month] += parseFloat(order.payment_amount);
  });

  GetPurchase?.data?.forEach(purchase => {
   const purcahseDate = moment(purchase.purchase_date).startOf("day"); // <-- remove time
  const month = purcahseDate.format("MMMM");
    purchaseByMonth[month] += parseFloat(purchase.payment_amount);
  });

  // ✅ Extract labels and sales data
  const labels = Object.keys(salesByMonth);
  const salesData = Object.values(salesByMonth);
  const purchaseDataValues = Object.values(purchaseByMonth);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Sales Price",
        data: salesData,
        backgroundColor: "rgba(0, 128, 0, 0.7)", // Green
        borderColor: "green",
        borderWidth: 1,
      },
      {
        label: "Total Purchases Price",
        data: purchaseDataValues,
        backgroundColor: "rgba(0, 0, 255, 0.7)", // Blue
        borderColor: "blue",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
    },
    // scales: {
    //   x: {
    //     title: {
    //       display: true,
    //       text: "Month",
    //     },
    //   },
    //   y: {
    //     title: {
    //       display: true,
    //       text: "Total Sales (MMK)",
    //     },
    //     beginAtZero: true,
    //   },
    // },
  };

  return (
    <div className="w-full h-[300px] md:h-[350px] xl:h-[400px] bg-white rounded p-6">
      <h1 className="text-xl text-center">Purchase & Sales Bar Chart</h1>
      <Bar data={chartData} options={options} className="" />
    </div>
  );
};

export default Chart;
