import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const HotelChart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (chartRef?.current) {
      const chartData = data?.map((item) => {
        return {
          label: item?.data[0]?.hotelName,
          occurrences: item?.events.reduce(
            (acc, event) => acc + event?.occurrences,
            0
          ),
          social:
            item?.events.find((event) => event?.event === "social")
              ?.occurrences || 0,
          all:
            item?.events.find((event) => event?.event === "all")?.occurrences ||
            0,
          corporate:
            item?.events.find((event) => event?.event === "corporate")
              ?.occurrences || 0,
        };
      });

      // Sort chartData based on total occurrences in descending order
      chartData.sort((a, b) => b.occurrences - a.occurrences);

      const ctx = chartRef.current.getContext("2d");

      // Destroy any existing chart before creating a new one
      if (window.myBarChart) {
        window.myBarChart.destroy();
      }

      // Explicitly set the canvas size
      chartRef.current.width = 500;
      chartRef.current.height = 300;

      window.myBarChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: chartData?.map((item) => item?.label),
          datasets: [
            {
              label: "Social",
              backgroundColor: "rgba(255, 99, 132, 0.9)",
              data: chartData?.map((item) => item?.social),
              barPercentage: 0.4, // Adjust the bar width
              categoryPercentage: 0.5, // Adjust the spacing between bars
            },
            {
              label: "Both",
              backgroundColor: "rgba(75, 192, 192, 0.9)",
              data: chartData?.map((item) => item?.all),
              barPercentage: 0.4,
              categoryPercentage: 0.5,
            },
            {
              label: "Corporate",
              backgroundColor: "rgba(255, 205, 86, 0.9)",
              data: chartData?.map((item) => item?.corporate),
              barPercentage: 0.4,
              categoryPercentage: 0.5,
            },
          ],
        },
        options: {
          scales: {
            x: { stacked: true, title: { display: true, text: "Hotel Name" } },
            y: {
              stacked: true,
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
              display: true,
              labels: {
                font: { color: "white" },
              },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 5000,
            easing: "easeOutQuart",
          },
        },
      });
    }
  }, [data]);

  return <canvas ref={chartRef}></canvas>;
};

export default HotelChart;
