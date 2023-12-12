import React, { useState, useEffect } from 'react';
import { CategoryScale, LinearScale, Chart, BarElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';
import {
	Card,
	CardBody,
	Typography,
	Checkbox,
	List,
	ListItem,
	ListItemPrefix,
	Chip,
	Carousel,
} from "@material-tailwind/react";
Chart.register(CategoryScale, LinearScale, BarElement);

// Define a styled component for the chart container
const ChartContainer = styled.div`
  width: 100%; /* Increase width for more space */
`;

// Function to split long labels word by word
const splitLongLabels = (labels) => {
  const result = [];
  labels?.forEach((label) => {
    const words = label.split(' ');
    result.push(words);
  });
  return result;
};

// Calculate the maximum value for the y-axis
const calculateMaxValue = (counts) => {
  if (!counts || counts.length === 0) {
    return 0; // or any default value you prefer
  }

  const maxCount = Math.max(...counts);
  // Set the max value to a multiple of 10 or any other desired value
  const maxValue = Math.ceil(maxCount / 10) * 10;
  return maxValue;
};


// Define shared options for the x-axis scale
const sharedOptions = {
  scales: {
    x: {
      type: 'category',
      position: 'bottom',
      ticks: {
        maxRotation: 0, // Set rotation to 0 degrees
        autoSkip: false, // Disable automatic label skipping
        padding: 10, // Add padding between labels
        maxTextWidth: 150, // Increase the maximum width for tick labels
      },
    },
    y: {
      max: 100, // Set this to the desired maximum value for the y-axis
    },
  },
};

const createBarChart = (labels, counts, maxValue) => {
  const splitLabels = splitLongLabels(labels);

  // Create the chart data object
  const chartData = {
    labels: splitLabels,
    datasets: [
      {
        label: 'Times',
        data: counts,
        backgroundColor: 'blue', // Bar color
        borderColor: 'blue', // Border color
        borderWidth: 1, // Border width
      },
    ],
  };

  // Update the y-axis options with the calculated maximum value
  const updatedOptions = {
    ...sharedOptions,
    scales: {
      ...sharedOptions.scales,
      y: {
        ...sharedOptions.scales.y,
        max: maxValue,
      },
    },
  };

  return (
    <Bar data={chartData} options={updatedOptions} />
  );
};

const VerticalBarGraph = ({ data }) => {
  const { labels, data: counts } = data;
  const numLabels = labels?.length;

  // Calculate the maximum value for the y-axis
  const maxValue = calculateMaxValue(counts);

  // Use state to track the screen width
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Update the screen width on window resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Check if the screen width is smaller than 1200px
  const isScreenSmall = screenWidth <= 1200;

  if (isScreenSmall) {
    // Render a text list
    return (
      <div>
        {labels?.map((label, index) => (
        <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p><b>Reason:</b> {label}</p>
        <p><b>x{counts[index]}</b></p>
      </div>
      
        ))}
      </div>
    );
  }

  if (numLabels > 5) {
    const barCharts = [];
    let start = 0;
    while (start < numLabels) {
      const end = Math.min(start + 5, numLabels);
      const labelsSlice = labels?.slice(start, end);
      const countsSlice = counts?.slice(start, end);
      barCharts.push(createBarChart(labelsSlice, countsSlice, maxValue));
      start = end;
    }

    return (
      <ChartContainer>
        {barCharts.map((barChart, index) => (
          <div key={index}>{barChart}</div>
        ))}
      </ChartContainer>
    );
  } else {
    return (
      <ChartContainer>
        {createBarChart(labels, counts, maxValue)}
      </ChartContainer>
    );
  }
};

export default VerticalBarGraph;
