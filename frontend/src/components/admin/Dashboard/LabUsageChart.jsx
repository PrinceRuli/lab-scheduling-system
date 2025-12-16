import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LabUsageChart = ({ data = [] }) => {
  const chartData = {
    labels: data.map(lab => lab.name),
    datasets: [
      {
        label: 'Hours Booked',
        data: data.map(lab => lab.hoursBooked),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.6,
      },
      {
        label: 'Total Capacity',
        data: data.map(lab => lab.totalHours),
        backgroundColor: 'rgba(249, 115, 22, 0.7)',
        borderColor: 'rgb(249, 115, 22)',
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.6,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          drawBorder: false,
        },
        ticks: {
          stepSize: 10,
          font: {
            size: 11
          }
        },
        title: {
          display: true,
          text: 'Hours',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11
          }
        }
      }
    }
  };

  return (
    <div className="h-72">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default LabUsageChart;