import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RecurringExpenses.css';

function RecurringExpenses({ expenses, setExpenses, selectedCurrency }) {
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: '',
    frequency: 'monthly',
    startDate: '',
    endDate: '',
    currency: selectedCurrency
  });

  // Load recurring expenses from localStorage
  useEffect(() => {
    const savedRecurringExpenses = JSON.parse(localStorage.getItem('recurringExpenses')) || [];
    setRecurringExpenses(savedRecurringExpenses);
  }, []);

  // Save recurring expenses to localStorage
  useEffect(() => {
    localStorage.setItem('recurringExpenses', JSON.stringify(recurringExpenses));
  }, [recurringExpenses]);

  // Check and add recurring expenses daily
  useEffect(() => {
    const checkRecurringExpenses = () => {
      const today = new Date();
      const todayStr = today.toLocaleDateString();

      recurringExpenses.forEach(expense => {
        const lastAdded = expense.lastAdded ? new Date(expense.lastAdded) : new Date(expense.startDate);
        const shouldAdd = shouldAddExpense(expense, lastAdded, today);

        if (shouldAdd) {
          const newExpense = {
            title: expense.title,
            amount: expense.amount,
            category: expense.category,
            date: todayStr,
            currency: expense.currency
          };

          setExpenses(prev => [...prev, newExpense]);
          
          // Update lastAdded date
          setRecurringExpenses(prev => 
            prev.map(e => 
              e.id === expense.id 
                ? { ...e, lastAdded: todayStr }
                : e
            )
          );
        }
      });
    };

    // Check once per day
    const interval = setInterval(checkRecurringExpenses, 24 * 60 * 60 * 1000);
    checkRecurringExpenses(); // Initial check

    return () => clearInterval(interval);
  }, [recurringExpenses, setExpenses]);

  const shouldAddExpense = (expense, lastAdded, today) => {
    if (expense.endDate && new Date(expense.endDate) < today) return false;
    
    const daysSinceLastAdded = Math.floor((today - lastAdded) / (1000 * 60 * 60 * 24));
    
    switch (expense.frequency) {
      case 'daily':
        return daysSinceLastAdded >= 1;
      case 'weekly':
        return daysSinceLastAdded >= 7;
      case 'monthly':
        return daysSinceLastAdded >= 30;
      case 'yearly':
        return daysSinceLastAdded >= 365;
      default:
        return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newExpense.title && newExpense.amount && newExpense.category && newExpense.startDate) {
      const expenseWithId = {
        ...newExpense,
        id: Date.now(),
        lastAdded: null
      };
      setRecurringExpenses(prev => [...prev, expenseWithId]);
      setNewExpense({
        title: '',
        amount: '',
        category: '',
        frequency: 'monthly',
        startDate: '',
        endDate: '',
        currency: selectedCurrency
      });
    }
  };

  const deleteRecurringExpense = (id) => {
    setRecurringExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Recurring Expenses</h1>
        <Link to="/" className="nav-link">Back to Transactions</Link>
      </div>

      <div className="dashboard">
        <div className="card">
          <h2>Add Recurring Expense</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newExpense.title}
                onChange={handleInputChange}
                placeholder="Enter expense title"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={newExpense.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={newExpense.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Bills">Bills</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="frequency">Frequency</label>
              <select
                id="frequency"
                name="frequency"
                value={newExpense.frequency}
                onChange={handleInputChange}
                required
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={newExpense.startDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">End Date (Optional)</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={newExpense.endDate}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit">Add Recurring Expense</button>
          </form>
        </div>

        <div className="card">
          <h2>Active Recurring Expenses</h2>
          <div className="recurring-expenses-list">
            {recurringExpenses.map(expense => (
              <div key={expense.id} className="recurring-expense-item">
                <div>
                  <strong>{expense.title}</strong>
                  <span>({expense.category})</span>
                  <small>Frequency: {expense.frequency}</small>
                  <small>Start: {expense.startDate}</small>
                  {expense.endDate && <small>End: {expense.endDate}</small>}
                </div>
                <div>
                  <span>{expense.currency} {expense.amount}</span>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteRecurringExpense(expense.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecurringExpenses; 