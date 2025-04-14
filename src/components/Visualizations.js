import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Doughnut, Bar, Line, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, RadialLinearScale } from 'chart.js';
import { formatCurrency } from '../utils/currencyUtils';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale
);

function Visualizations({ budget, expenses, currency, theme }) {
  const [chartType, setChartType] = useState('doughnut');
  const [dateRange, setDateRange] = useState('all');

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = budget - totalSpent;

  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    const diffTime = Math.abs(now - expenseDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    switch (dateRange) {
      case 'week':
        return diffDays <= 7;
      case 'month':
        return diffDays <= 30;
      case 'year':
        return diffDays <= 365;
      default:
        return true;
    }
  });

  const categoryTotals = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const doughnutData = {
    labels: Object.keys(categoryTotals),
    datasets: [{
      data: Object.values(categoryTotals),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40'
      ],
      borderWidth: 0
    }]
  };

  const barData = {
    labels: ['Budget Overview'],
    datasets: [
      {
        label: 'Total Budget',
        data: [budget],
        backgroundColor: '#36A2EB'
      },
      {
        label: 'Total Spent',
        data: [totalSpent],
        backgroundColor: '#FF6384'
      },
      {
        label: 'Remaining',
        data: [remaining],
        backgroundColor: '#4BC0C0'
      }
    ]
  };

  const dailyExpenses = filteredExpenses.reduce((acc, expense) => {
    const date = new Date(expense.date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + expense.amount;
    return acc;
  }, {});

  const lineData = {
    labels: Object.keys(dailyExpenses),
    datasets: [{
      label: 'Daily Expenses',
      data: Object.values(dailyExpenses),
      borderColor: '#FF6384',
      tension: 0.1,
      fill: false
    }]
  };

  const radarData = {
    labels: Object.keys(categoryTotals),
    datasets: [{
      label: 'Average Expenses by Category',
      data: Object.values(categoryTotals),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: '#4BC0C0',
      pointBackgroundColor: '#4BC0C0',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#4BC0C0'
    }]
  };

  // Dynamic chart options based on theme
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: theme === 'light' ? '#1a1a1a' : '#ffffff', // Dynamic text color based on theme
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${formatCurrency(context.raw, currency)}`;
          }
        },
        bodyColor: theme === 'light' ? '#1a1a1a' : '#ffffff' // Dynamic tooltip text color
      }
    }
  };

  const renderChart = () => {
    switch (chartType) {
      case 'doughnut':
        return <Doughnut data={doughnutData} options={chartOptions} />;
      case 'bar':
        return <Bar data={barData} options={chartOptions} />;
      case 'line':
        return <Line data={lineData} options={chartOptions} />;
      case 'radar':
        return <Radar data={radarData} options={chartOptions} />;
      default:
        return null;
    }
  };

  return (
    <div className="visualizations-container">
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Budget</h3>
          <p>{formatCurrency(budget, currency)}</p>
        </div>
        <div className="summary-card">
          <h3>Total Spent</h3>
          <p>{formatCurrency(totalSpent, currency)}</p>
        </div>
        <div className="summary-card">
          <h3>Remaining</h3>
          <p>{formatCurrency(remaining, currency)}</p>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <h2 className="chart-title">Expense Analysis</h2>
          <div className="chart-controls">
            <select 
              value={chartType} 
              onChange={(e) => setChartType(e.target.value)}
              className="chart-select"
            >
              <option value="doughnut">Expense Distribution</option>
              <option value="bar">Budget Overview</option>
              <option value="line">Daily Expenses</option>
              <option value="radar">Category Analysis</option>
            </select>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="date-range-select"
            >
              <option value="all">All Time</option>
              <option value="year">Last Year</option>
              <option value="month">Last Month</option>
              <option value="week">Last Week</option>
            </select>
          </div>
        </div>
        <div className="chart-wrapper">
          {renderChart()}
        </div>
      </div>

      <div className="button-group">
        <Link to="/" className="nav-link">
          Back to Transactions
        </Link>
      </div>
    </div>
  );
}

export default Visualizations;
