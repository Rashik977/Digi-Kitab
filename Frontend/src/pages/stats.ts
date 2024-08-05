import { createElement } from "../utils/createElement";
import { Navbar } from "../components/userNavigation";
import { fetchReadingStats } from "../services/libraryServices";
import Chart from "chart.js/auto";

export const render = async () => {
  const main = createElement("main", {
    className: "min-h-screen dark:bg-zinc-900 dark:text-white",
  });

  const navigation = Navbar();

  const statsContainer = createElement("div", {
    className: "stats-page p-6 flex flex-col items-center gap-10 lg:px-80",
  });

  const title = createElement("h1", {
    className: "text-2xl font-bold",
    textContent: "Reading Statistics",
  });

  const chartContainer = createElement("div", {
    className: "w-full max-w-3xl",
  });

  const canvas = document.createElement("canvas") as HTMLCanvasElement;
  canvas.id = "readingChart";

  chartContainer.appendChild(canvas);
  statsContainer.appendChild(title);
  statsContainer.appendChild(chartContainer);

  main.appendChild(navigation);
  main.appendChild(statsContainer);

  // Fetch reading stats and create chart
  try {
    const stats = await fetchReadingStats();
    createChart(canvas, stats);
  } catch (error) {
    console.error("Error fetching reading stats:", error);
    const errorMessage = createElement("p", {
      className: "text-red-500",
      textContent: "Failed to load reading stats. Please try again later.",
    });
    statsContainer.appendChild(errorMessage);
  }

  return main;
};

const createChart = (
  canvas: HTMLCanvasElement,
  stats: { date: string; minutes: number }[]
) => {
  const ctx = canvas.getContext("2d");
  if (ctx) {
    new Chart(ctx, {
      type: "line",
      data: {
        labels: stats.map((stat) => stat.date),
        datasets: [
          {
            label: "Reading Time (minutes)",
            data: stats.map((stat) => stat.minutes),
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
            pointBackgroundColor: "rgb(75, 192, 192)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgb(75, 192, 192)",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Daily Reading Time",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Minutes",
            },
          },
          x: {
            title: {
              display: true,
              text: "Date",
            },
          },
        },
      },
    });
  }
};

export default {
  render,
};
