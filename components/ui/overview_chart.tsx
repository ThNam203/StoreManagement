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

const labels = ["January", "February", "March", "April", "May", "June", "July"];

const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => faker.number.int({ min: 0, max: 500 })),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 0, 0)",
      fill: {
        target: "origin", // 3. Set the fill options
        above: "rgba(255, 0, 0, 0.3)"
      }
    },
    {
      label: "Dataset 2",
      data: labels.map(() => faker.number.int({ min: 0, max: 500 })),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.3)",
      fill: "origin" // 3. Set the fill options
    }
  ]
};

const OverviewChart = () => (<Line className="w-full h-full min-h-[350px]" options={options} data={data}></Line>)

// BAR CHART

const barLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const barData = {
  labels: barLabels,
  datasets: [{
    label: 'My First Dataset',
    data: [65, 59, 80, 81, 56, 55, 40, 10, 20, 35, 76, 59],
    backgroundColor: "#338df6",
    borderWidth: 1
  }]
};

const barConfig = {
  type: 'bar',
  data: barData,
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
};

const BarChart = () => (<Bar {...barConfig}></Bar>)

const Charts = {
  BarChart
}

export default Charts