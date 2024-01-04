import React from "react";
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // 1. Import Filler plugin,
} from "chart.js";

import { faker } from '@faker-js/faker';

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

const options = {
  responsive: true,
  maintainAspectRatio: false,
  tension: 0.2 // 2. Set the tension (curvature) of the line to your liking.  (You may want to lower this a smidge.),
};

// const labels = ["January", "February", "March", "April", "May", "June", "July"];

// const data = {
//   labels,
//   datasets: [
//     {
//       label: "Dataset 1",
//       data: labels.map(() => faker.number.int({ min: 0, max: 500 })),
//       borderColor: "rgb(255, 99, 132)",
//       backgroundColor: "rgba(255, 0, 0)",
//       fill: {
//         target: "origin", // 3. Set the fill options
//         above: "rgba(255, 0, 0, 0.3)"
//       }
//     },
//     {
//       label: "Dataset 2",
//       data: labels.map(() => faker.number.int({ min: 0, max: 500 })),
//       borderColor: "rgb(53, 162, 235)",
//       backgroundColor: "rgba(53, 162, 235, 0.3)",
//       fill: "origin" // 3. Set the fill options
//     }
//   ]
// };

// const OverviewChart = () => (<Line className="w-full h-full min-h-[350px]" options={options} data={data}></Line>)

// BAR CHART

const barLabels = Array.from({ length: 24 }, (_, i) => `${i.toString()}h`);
const barData = (label: string, data: number[]) => ({
  labels: barLabels,
  datasets: [{
    label: label,
    data: data,
    backgroundColor: "#338df6",
    borderWidth: 1
  }]
});

const barConfig = (label: string, data: number[]) => ({
  type: 'bar',
  data: barData(label, data),
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false,
      }
  }
  },
});

const BarChart = ({label, data}:{label: string, data: number[]}) => (<Bar {...barConfig(label, data)}></Bar>)

const Charts = {
  BarChart
}

export default Charts
