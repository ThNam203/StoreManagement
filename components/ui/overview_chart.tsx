import React from "react";
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
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
  Title,
  Tooltip,
  Legend,
  Filler // 1. Register Filler plugin
);

export const options = {
  responsive: true,
  tension: 0.2 // 2. Set the tension (curvature) of the line to your liking.  (You may want to lower this a smidge.)
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
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

const OverviewChart = () => (<Line className="w-full" options={options} data={data}></Line>)

export default OverviewChart