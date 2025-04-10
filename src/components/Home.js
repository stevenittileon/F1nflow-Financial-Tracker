import React from 'react';
import { formatCurrency } from '../utils/currencyUtils';

const Home = ({ budget, setBudget, expenses, setExpenses, currency, theme }) => {
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = budget - totalSpent;

  const handleAddExpense = (e) => {
    e.preventDefault();
    const expense = {
      description: e.target.description.value,
      amount: parseFloat(e.target.amount.value),
      category: e.target.category.value,
      date: e.target.date.value
    };
    setExpenses([...expenses, expense]);
    e.target.reset();
  };

  const handleSetBudget = (e) => {
    e.preventDefault();
    const amount = parseFloat(e.target.amount.value);
    if (!isNaN(amount)) {
      setBudget(amount);
      e.target.reset();
    }
  };

  const handleResetBudget = () => {
    setBudget(0);
  };

  const deleteExpense = (index) => {
    const newExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(newExpenses);
  };

  return (
    <div className={`container ${theme}`}>
      <header className="header">
        <h1>F1nflow</h1>
        <div className="summary">
          <div className="summary-item">
            <h3>Daily Budget</h3>
            <p>{formatCurrency(budget, currency)}</p>
          </div>
          <div className="summary-item">
            <h3>Total Spent</h3>
            <p>{formatCurrency(totalSpent, currency)}</p>
          </div>
          <div className="summary-item">
            <h3>Remaining</h3>
            <p>{formatCurrency(remaining, currency)}</p>
          </div>
        </div>
      </header>

      <div className="dashboard">
        <div className="card">
          <h2>Set Budget</h2>
          <form onSubmit={handleSetBudget}>
            <div className="form-group">
              <label>Amount</label>
              <input type="number" name="amount" step="0.01" required />
            </div>
            <div className="button-group">
              <button type="submit">Set Budget</button>
              <button 
                type="button" 
                className="reset-btn"
                onClick={handleResetBudget}
              >
                Reset Budget
              </button>
            </div>
          </form>
        </div>

        <div className="card">
          <h2>Add Expense</h2>
          <form onSubmit={handleAddExpense}>
            <div className="form-group">
              <label>Description</label>
              <input type="text" name="description" required />
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input type="number" name="amount" step="0.01" required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" required>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Bills">Bills</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" name="date" required />
            </div>
            <div className="button-group">
              <button type="submit">Add Expense</button>
            </div>
          </form>
        </div>
      </div>

      <div className="expense-list">
        <h2>Recent Expenses</h2>
        {expenses.map((expense, index) => (
          <div key={index} className="expense-item">
            <div>
              <h3>{expense.description}</h3>
              <p>{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p>{formatCurrency(expense.amount, currency)}</p>
              <button 
                className="delete-btn"
                onClick={() => deleteExpense(index)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home; 