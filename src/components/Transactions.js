import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Transactions.css';

function Transactions({ budget, setBudget, expenses, setExpenses, user }) {
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');

  const setBudgetHandler = () => {
    const amount = parseFloat(budgetAmount) || 0;
    setBudget(prevBudget => prevBudget + amount);
    setBudgetAmount('');
  };

  const addExpense = () => {
    if (expenseTitle && expenseAmount && expenseCategory) {
      const amount = parseFloat(expenseAmount);
      if (amount > 0) {
        const newExpense = {
          title: expenseTitle,
          amount: amount,
          category: expenseCategory,
          date: new Date().toLocaleDateString(),
          userId: user
        };
        setExpenses(prevExpenses => [...prevExpenses, newExpense]);
        setExpenseTitle('');
        setExpenseAmount('');
        setExpenseCategory('');
      }
    }
  };

  const deleteExpense = (index) => {
    setExpenses(prevExpenses => prevExpenses.filter((_, i) => i !== index));
  };

  const userExpenses = expenses.filter(exp => exp.userId === user);
  const totalSpent = userExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = budget - totalSpent;
  const percentageUsed = (totalSpent / budget) * 100;

  return (
    <div className="container">
      <div className="header">
        <h1>Expense Tracker</h1>
        <div className="summary">
          <div className="summary-item">
            <h3>Total Budget</h3>
            <p>₹{budget.toFixed(2)}</p>
          </div>
          <div className="summary-item">
            <h3>Total Expenses</h3>
            <p>₹{totalSpent.toFixed(2)}</p>
            <div className="progress-bar">
              <div 
                className="progress" 
                style={{ 
                  width: `${Math.min(percentageUsed, 100)}%`,
                  backgroundColor: percentageUsed > 90 ? '#dc3545' : '#1a73e8'
                }}
              ></div>
            </div>
          </div>
          <div className="summary-item">
            <h3>Remaining</h3>
            <p>₹{remaining.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="dashboard">
        <div className="card">
          <h2>Set Budget</h2>
          <div className="form-group">
            <label htmlFor="budgetAmount">Monthly Budget</label>
            <input
              type="number"
              id="budgetAmount"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              placeholder="Enter your monthly budget"
            />
          </div>
          <div className="button-group">
            <button onClick={setBudgetHandler}>Set Budget</button>
            <button className="reset-btn" onClick={() => {
              setBudget(0);
              setExpenses([]);
            }}>Reset Budget</button>
          </div>
        </div>

        <div className="card">
          <h2>Add Expense</h2>
          <div className="form-group">
            <label htmlFor="expenseTitle">Expense Title</label>
            <input
              type="text"
              id="expenseTitle"
              value={expenseTitle}
              onChange={(e) => setExpenseTitle(e.target.value)}
              placeholder="Enter expense title"
            />
          </div>
          <div className="form-group">
            <label htmlFor="expenseAmount">Amount</label>
            <input
              type="number"
              id="expenseAmount"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>
          <div className="form-group">
            <label htmlFor="expenseCategory">Category</label>
            <select
              id="expenseCategory"
              value={expenseCategory}
              onChange={(e) => setExpenseCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Bills">Bills</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button onClick={addExpense}>Add Expense</button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Expense List</h2>
          <Link to="/visualizations" className="view-charts-btn">
            View Visualizations
          </Link>
        </div>
        <div className="expense-list">
          {userExpenses.map((expense, index) => (
            <div key={index} className="expense-item">
              <div>
                <strong>{expense.title}</strong> <span>({expense.category})</span> <small>{expense.date}</small>
              </div>
              <div>
                <span>₹{expense.amount.toFixed(2)}</span>
                <button className="delete-btn" onClick={() => deleteExpense(index)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Transactions;
