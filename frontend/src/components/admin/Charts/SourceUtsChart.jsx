import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const SourceUtsChart = ({ data }) => {
  const chartRef = useRef();
  const chartInstanceRef = useRef(null); // To store the chart instance

  useEffect(() => {
    if (chartRef.current && data) {
      const ctx = chartRef.current.getContext("2d");

      // If a chart instance exists, destroy it before creating a new one
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Create a new chart instance
      chartInstanceRef.current = new Chart(ctx, {
        type: "pie",
        data: {
          labels: data?.utmSourcesWithCounts.map(
            (item) => (item._id ? item._id : "Unknown") // Handle cases where _id is null
          ),
          datasets: [
            {
              label: "UTM Sources",
              data: data?.utmSourcesWithCounts.map((item) => item.count),
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `${tooltipItem.label}: ${tooltipItem.raw}`;
                },
              },
            },
          },
        },
      });
    }

    // Cleanup function to destroy the chart instance on unmount or when data changes
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]);

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ width: "450px", height: "300px" }}
    >
      <canvas ref={chartRef} width={400} height={200}></canvas>
    </div>
  );
};

export default SourceUtsChart;
