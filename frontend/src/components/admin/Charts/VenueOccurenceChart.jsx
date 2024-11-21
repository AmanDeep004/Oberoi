import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const VenueOccurrenceChart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (chartRef.current) {
      const venueData = [...data]?.sort(
        (a, b) => b.occurrences - a.occurrences
      );
      const labels = venueData?.map((venue) => venue?._id);
      const occurrences = venueData?.map((venue) => venue?.occurrences);
      const ctx = chartRef.current.getContext("2d");

      chartRef.current.width = 500;
      chartRef.current.height = 250;

      new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Occurrences",
              backgroundColor: "rgba(138,2,125,0.7)",
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 1,
              pointRadius: 5,
              pointHoverRadius: 7,
              pointBackgroundColor: "rgb(138,2,125)",
              data: occurrences,
              fill: true,
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: { display: true, text: "Venue Name" },
            },
            y: {
              title: { display: true, text: "Occurrences" },
              beginAtZero: true,
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
        },
      });
    }
  }, []);

  return <canvas ref={chartRef} width={400} height={200}></canvas>;
};

export default VenueOccurrenceChart;
