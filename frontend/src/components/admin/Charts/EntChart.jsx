import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const EntChart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (chartRef.current) {
      const foodOccurrencesData = data?.map((food) => ({
        label: food?.data[0]?.name,
        data: food?.occurrences,
      }));

      const ctx = chartRef.current.getContext("2d");

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: foodOccurrencesData?.map((food) => food?.label),
          datasets: [
            {
              label: "Occurrences",
              borderColor: "rgb(138, 2, 125)", // Set border color
              fill: false, // Do not fill the area under the line
              data: foodOccurrencesData?.map((food) => food?.data),
              backgroundColor: "rgb(138, 2, 125)",
              barPercentage: 0.5,
              categoryPercentage: 0.5,
            },
          ],
        },
        options: {
          scales: {
            x: { title: { display: true, text: "Entertainment" } },
            y: {
              title: { display: true, text: "Occurrences" },
              beginAtZero: true,
            },
          },
          layout: {
            padding: {
              left: 10,
              right: 10,
              top: 10,
              bottom: 10,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          barThickness: 60,
        },
      });
    }
  }, []);

  return (
    <div>
      <canvas ref={chartRef} width={400} height={200}></canvas>
    </div>
  );
};

export default EntChart;
