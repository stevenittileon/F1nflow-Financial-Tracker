import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import { exportToExcel } from './utils/exportUtils';
import { convertCurrency, formatCurrency } from './utils/currencyUtils';
import './App.css';
import Visualizations from './components/Visualizations';
import RecurringPayments from './components/RecurringPayments';
import Home from './components/Home';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function AppContent() {
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('budget');
    return saved ? parseFloat(saved) : 0;
  });
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('currency') || '₹';
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const { showSuccess, showInfo } = useNotification();

  useEffect(() => {
    localStorage.setItem('budget', budget);
  }, [budget]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    const oldCurrency = currency;
    
    // Convert budget
    const convertedBudget = convertCurrency(budget, oldCurrency, newCurrency);
    setBudget(convertedBudget);
    
    // Convert expenses
    const convertedExpenses = expenses.map(expense => ({
      ...expense,
      amount: convertCurrency(expense.amount, oldCurrency, newCurrency)
    }));
    setExpenses(convertedExpenses);
    
    setCurrency(newCurrency);
  };

  const handleResetBudget = () => {
    setBudget(0);
    setExpenses([]);
    showInfo('Budget and expenses have been reset');
  };

  const handleExportExpenses = () => {
    const formattedExpenses = expenses.map(expense => ({
      Description: expense.description,
      Amount: formatCurrency(expense.amount, currency),
      Category: expense.category,
      Date: new Date(expense.date).toLocaleDateString()
    }));
    exportToExcel(formattedExpenses, 'f1nflow_expenses.csv');
    showSuccess('Expenses exported successfully');
  };

  const handleExportBudget = () => {
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const remaining = budget - totalSpent;
    
    const budgetData = [{
      'Total Budget': formatCurrency(budget, currency),
      'Total Spent': formatCurrency(totalSpent, currency),
      'Remaining': formatCurrency(remaining, currency)
    }];
    
    exportToExcel(budgetData, 'f1nflow_budget.csv');
    showSuccess('Budget exported successfully');
  };

  return (
    <div className="App">
      <nav className="nav">
        <div className="nav-left">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/visualizations" className="nav-link">Visualizations</Link>
          <Link to="/recurring" className="nav-link">Recurring Payments</Link>
        </div>
        <div className="nav-right">
          <select 
            value={currency} 
            onChange={handleCurrencyChange}
            className="currency-selector"
          >
            <option value="₹">₹ INR</option>
            <option value="$">$ USD</option>
            <option value="€">€ EUR</option>
            <option value="£">£ GBP</option>
          </select>
          <button onClick={handleExportExpenses} className="export-btn">
            Export Expenses
          </button>
          <button onClick={handleExportBudget} className="export-btn">
            Export Budget
          </button>
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              budget={budget}
              setBudget={setBudget}
              expenses={expenses}
              setExpenses={setExpenses}
              currency={currency}
            />
          } 
        />
        <Route 
          path="/visualizations" 
          element={
            <Visualizations 
              budget={budget}
              expenses={expenses}
              currency={currency}
              theme={theme} // Add this line to pass the theme
            />
          } 
        />
        <Route 
          path="/recurring" 
          element={
            <RecurringPayments 
              expenses={expenses}
              setExpenses={setExpenses}
              currency={currency}
            />
          } 
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <NotificationProvider>
      <Router>
        <AppContent />
      </Router>
    </NotificationProvider>
  );
}

export default App;
