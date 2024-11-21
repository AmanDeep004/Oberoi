import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const DecorChart = ({ data }) => {
  console.log("data..1", data);
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
          labels: foodOccurrencesData.map((food) => food.label),
          datasets: [
            {
              label: "Occurrences",
              backgroundColor: "rgb(138, 2, 125)",
              data: foodOccurrencesData.map((food) => food.data),
            },
          ],
        },
        options: {
          indexAxis: "y",
          scales: {
            x: { title: { display: true, text: "Occurrences" } },
            y: {
              title: { display: true, text: "Decor  Name" },
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
          barThickness: 30,
        },
      });
    }
  }, []);

  return (
    <div>
      <canvas ref={chartRef} width={300} height={300}></canvas>
    </div>
  );
};

export default DecorChart;
