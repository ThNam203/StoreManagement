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
import { format } from "date-fns";
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

const SingleColumnChart = ({
  data,
  label,
  direction = "x",
  backgroundColor = "#338df6",
  borderWidth = 1,
  sortOption = "none",
  viewOption = "none",
  reverseViewOption = false,
  limitNumOfLabels = 10,
}: {
  data: Array<{ label: string; value: number }>;
  label: string;
  direction?: "y" | "x" | undefined;
  backgroundColor?: string;
  borderWidth?: number;
  sortOption?: "value_asc" | "value_desc" | "none";
  viewOption?:
    | "label_asc"
    | "label_desc"
    | "label_time_asc"
    | "label_time_desc"
    | "none";
  reverseViewOption?: boolean;
  limitNumOfLabels?: number;
}) => {
  if (sortOption === "value_asc") {
    data.sort((a, b) => {
      if (a.value < b.value) return -1;
      else return 1;
    });
  } else if (sortOption === "value_desc") {
    data.sort((a, b) => {
      if (a.value > b.value) return -1;
      else return 1;
    });
  }

  if (viewOption === "label_asc") {
    data.sort((a, b) => {
      if (a.label < b.label) return -1;
      else return 1;
    });
  } else if (viewOption === "label_desc") {
    data.sort((a, b) => {
      if (a.label > b.label) return -1;
      else return 1;
    });
  } else if (viewOption === "label_time_asc") {
    data.sort((a, b) => {
      try {
        const timeA = new Date(a.label);
        const timeB = new Date(b.label);

        if (timeA < timeB) return -1;
        else return 1;
      } catch (e) {
        return 0;
      }
    });
  } else if (viewOption === "label_time_desc") {
    data.sort((a, b) => {
      try {
        const timeA = new Date(a.label);
        const timeB = new Date(b.label);

        if (timeA > timeB) return -1;
        else return 1;
      } catch (e) {
        return 0;
      }
    });
  }

  data = data.slice(0, limitNumOfLabels);
  if (reverseViewOption) data.reverse();

  if (viewOption === "label_time_asc" || viewOption === "label_time_desc")
    data = data.map((row) => {
      try {
        const date = new Date(row.label);
        let formated;
        if (date.toLocaleDateString() === new Date().toLocaleDateString()) {
          formated = format(date, "HH:mm");
        } else {
          formated = format(date, "dd/MM/yyyy");
        }
        return {
          label: formated,
          value: row.value,
        };
      } catch (e) {
        return row;
      }
    });

  const barData = {
    labels: data.map((row) => row.label),
    datasets: [
      {
        label: label,
        data: data.map((row) => row.value),
        backgroundColor: backgroundColor,
        borderWidth: borderWidth,
      },
    ],
  };

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
      responsive: true,
      plugins: {
        legend: {
          position: "top" as const,
        },
        title: {
          display: false,
          text: "Chart.js Bar Chart",
        },
      },
    },
  };
  return <Bar {...barConfig}></Bar>;
};

const MultiColumnChart = ({
  dataLabel,
  dataValue,
  label,
  direction = "x",
  backgroundColor = ["#3498db", "#2ecc71", "#e74c3c", "#f39c12", "#9b59b6"],
  borderWidth = 1,
  sortOption = "none",
  viewOption = "none",
  reverseViewOption = false,
  limitNumOfLabels = 10,
  colsPerLabel = 1,
}: {
  dataLabel: string[];
  dataValue: number[][];
  label: string[];
  direction?: "y" | "x" | undefined;
  backgroundColor?: string[];
  borderWidth?: number;
  sortOption?: "value_asc" | "value_desc" | "none";
  viewOption?:
    | "label_asc"
    | "label_desc"
    | "label_time_asc"
    | "label_time_desc"
    | "none";
  reverseViewOption?: boolean;
  limitNumOfLabels?: number;
  colsPerLabel?: number;
}) => {
  // if (sortOption === "value_asc") {
  //   data.sort((a, b) => {
  //     if (a.value < b.value) return -1;
  //     else return 1;
  //   });
  // } else if (sortOption === "value_desc") {
  //   data.sort((a, b) => {
  //     if (a.value > b.value) return -1;
  //     else return 1;
  //   });
  // }

  if (viewOption === "label_asc") {
    dataLabel.sort((a, b) => {
      if (a < b) return -1;
      else return 1;
    });
  } else if (viewOption === "label_desc") {
    dataLabel.sort((a, b) => {
      if (a > b) return -1;
      else return 1;
    });
  } else if (viewOption === "label_time_asc") {
    dataLabel.sort((a, b) => {
      try {
        const timeA = new Date(a);
        const timeB = new Date(b);

        if (timeA < timeB) return -1;
        else return 1;
      } catch (e) {
        return 0;
      }
    });
  } else if (viewOption === "label_time_desc") {
    dataLabel.sort((a, b) => {
      try {
        const timeA = new Date(a);
        const timeB = new Date(b);

        if (timeA > timeB) return -1;
        else return 1;
      } catch (e) {
        return 0;
      }
    });
  }

  dataLabel = dataLabel.slice(0, limitNumOfLabels);
  if (reverseViewOption) dataLabel.reverse();

  if (viewOption === "label_time_asc" || viewOption === "label_time_desc")
    dataLabel = dataLabel.map((row) => {
      try {
        const date = new Date(row);
        let formated;
        if (date.toLocaleDateString() === new Date().toLocaleDateString()) {
          formated = format(date, "HH:mm");
        } else {
          formated = format(date, "dd/MM/yyyy");
        }
        return formated;
      } catch (e) {
        return row;
      }
    });

  let datasets: any[] = [];
  dataValue.forEach((values, index) => {
    const dataset = {
      label: label[index],
      data: values,
      backgroundColor:
        backgroundColor[
          index >= backgroundColor.length
            ? index % backgroundColor.length
            : index
        ],
      borderWidth: borderWidth,
    };
    datasets.push(dataset);
  });
  const barData = {
    labels: dataLabel,
    datasets: datasets,
  };

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
      responsive: true,
      plugins: {
        legend: {
          position: "top" as const,
        },
        title: {
          display: false,
          text: "Chart.js Bar Chart",
        },
      },
    },
  };
  return <Bar {...barConfig}></Bar>;
};

export { SingleColumnChart, MultiColumnChart };
