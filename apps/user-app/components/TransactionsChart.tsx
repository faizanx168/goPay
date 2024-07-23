// components/TransactionsChart.tsx
"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { subDays } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const TransactionsChart = ({ transactions }: any) => {
  // Filter transactions to only include those from the last 7 days
  const oneWeekAgo = subDays(new Date(), 7);
  const filteredTransactions = transactions.filter(
    (t: any) => new Date(t.time) >= oneWeekAgo
  );

  console.log("Filtered Transactions:", filteredTransactions); // Debug log

  const data = {
    labels: filteredTransactions.map((t: any) =>
      new Date(t.time).toISOString()
    ),
    datasets: [
      {
        label: "Transaction Amount (USD)",
        data: filteredTransactions.map((t: any) => t.amount / 100),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Transactions Over the Last Week",
        font: {
          size: 20,
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `$${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          displayFormats: {
            day: "MMM d",
          },
        },
        title: {
          display: true,
          text: "Date",
          font: {
            size: 14,
          },
        },
        ticks: {
          font: {
            size: 12,
          },
        },
        grid: {
          display: true,
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount (USD)",
          font: {
            size: 14,
          },
        },
        ticks: {
          callback: (value: any) => `$${value}`,
          font: {
            size: 12,
          },
        },
        grid: {
          display: true,
        },
      },
    },
  };
  // @ts-ignore
  return <Bar data={data} options={options} />;
};

export default TransactionsChart;
