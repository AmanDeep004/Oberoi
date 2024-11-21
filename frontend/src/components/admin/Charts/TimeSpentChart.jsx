import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const LineChart = ({ data }) => {
  console.log("timespent", data);
  const chartRef = useRef();

  useEffect(() => {
    if (chartRef?.current) {
      const chartData = data?.map((item) => ({
        x: item.value,
        y: item.totalTimeSpent / (1000 * 60),
      }));

      const ctx = chartRef.current.getContext("2d");

      // Destroy any existing chart before creating a new one
      if (window.myLineChart) {
        window.myLineChart.destroy();
      }

      // Explicitly set the canvas size
      chartRef.current.width = 500;
      chartRef.current.height = 250;

      window.myLineChart = new Chart(ctx, {
        type: "line",
        data: {
          datasets: [
            {
              label: "Time Spent (minutes)",
              data: chartData,
              fill: true,
              backgroundColor: "rgba(138,2,125,0.7)",
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 1,
              pointRadius: 5,
              pointHoverRadius: 7,
              pointBackgroundColor: "rgb(138,2,125)",
              // hoverBackgroundColor: "rgba(138,2,125,0.8)",
              // hoverBorderColor: "rgba(75,192,192,1)",
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: "category",
              labels: chartData?.map((item) => item.x),
              title: { display: true, text: "Room Name" },
            },
            y: {
              title: { display: true, text: "Time Spent (minutes)" },
            },
          },
          elements: {
            line: {
              tension: 0, // Set tension to 0 to start the line chart at zero
            },
          },
          animation: {
            duration: 2000, // Set the duration of the animation in milliseconds
            easing: "easeInOutQuart", // Set the easing function for the animation
          },
          // responsive: false,
          // maintainAspectRatio: false,
        },
      });
    }
  }, [data]);

  return <canvas ref={chartRef} width={400} height={200}></canvas>;
};

export default LineChart;
