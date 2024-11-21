import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const BrowserPieChart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (chartRef?.current) {
      // Extract only the browser names (ignoring versions) and count them
      const browserCounts = data.reduce((acc, item) => {
        // Use regex to split on the first number, extracting only the browser name
        const browser = item?.value?.browser?.split(/\d/)[0].trim();
        if (browser) {
          acc[browser] = (acc[browser] || 0) + 1;
        }
        return acc;
      }, {});

      const ctx = chartRef.current.getContext("2d");

      // Destroy any existing chart before creating a new one
      if (window.myBrowserPieChart) {
        window.myBrowserPieChart.destroy();
      }

      // Set the canvas size
      chartRef.current.width = 400;
      chartRef.current.height = 380;

      window.myBrowserPieChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: Object.keys(browserCounts),
          datasets: [
            {
              data: Object.values(browserCounts),
              backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)",
                "rgb(75, 192, 192)",
                "rgb(153, 102, 255)",
              ],
              hoverBackgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)",
                "rgb(75, 192, 192)",
                "rgb(153, 102, 255)",
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
              position: "bottom",
            },
          },
          responsive: false,
        },
      });
    }
  }, [data]);

  return (
    <div
      style={{
        width: "600px",
        maxWidth: "650px",
        height: "410px",
        maxHeight: "410px",
      }}
    >
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default BrowserPieChart;
