import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const OsPieChart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (chartRef?.current) {
      const uniqueOS = Array.from(
        new Set(data?.map((item) => item?.value?.os))
      );
      const osCounts = uniqueOS.reduce((acc, os) => {
        acc[os] = data?.filter((item) => item?.value?.os === os).length;
        return acc;
      }, {});

      const ctx = chartRef.current.getContext("2d");

      // Destroy any existing chart before creating a new one
      if (window.myOSPieChart) {
        window.myOSPieChart.destroy();
      }

      // Explicitly set the canvas size
      chartRef.current.width = 500;
      chartRef.current.height = 250;

      window.myOSPieChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: Object.keys(osCounts),
          datasets: [
            {
              data: Object.values(osCounts),
              backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)",
                "rgb(75, 192, 192)",
                "rgb(153, 102, 255)",
                // Add more colors if needed
              ],
              hoverBackgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)",
                "rgb(75, 192, 192)",
                "rgb(153, 102, 255)",
                // Add more colors if needed
              ],
            },
          ],
        },
        options: {
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
              position: "right",
            },
          },
          responsive: false,
          //   maintainAspectRatio: false,
        },
      });
    }
  }, [data]);

  return (
    <div style={{ width: "600px", height: "300px" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default OsPieChart;
