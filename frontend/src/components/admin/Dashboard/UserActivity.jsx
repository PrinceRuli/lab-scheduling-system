import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const UserActivity = ({ data = [] }) => {
  const chartData = {
    labels: data.map(activity => activity.type),
    datasets: [
      {
        data: data.map(activity => activity.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(249, 115, 22)',
          'rgb(139, 92, 246)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2,
        borderRadius: 8,
        spacing: 2,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => ({
                text: `${label}: ${data.datasets[0].data[i]}`,
                fillStyle: data.datasets[0].backgroundColor[i],
                strokeStyle: data.datasets[0].borderColor[i],
                lineWidth: 2,
                hidden: false,
                index: i
              }));
            }
            return [];
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
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%',
  };

  return (
    <div className="h-72">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default UserActivity;