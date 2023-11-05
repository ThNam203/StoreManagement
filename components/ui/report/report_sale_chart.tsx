import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler // 1. Register Filler plugin
);
// BAR CHART

const barLabels = ["Snack", "Food", "C2", "Sting", "NumberOne"];
const barData = {
  labels: barLabels,
  datasets: [
    {
      label: "Revenue",
      data: [100000, 205000, 80000, 123801, 123123],
      backgroundColor: "#338df6",
      borderWidth: 1,
    },
  ],
};

const direction = "y" as "y";
const barConfig = {
  type: "bar",
  data: barData,
  options: {
    indexAxis: direction,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  },
};

const HorizontalBarChart = () => <Bar {...barConfig}></Bar>;

const Charts = {
  HorizontalBarChart,
};

export default Charts;
