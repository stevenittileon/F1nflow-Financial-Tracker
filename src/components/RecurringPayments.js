import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/currencyUtils';

const RecurringPayments = ({ expenses, setExpenses, currency, user }) => {
  const [recurringPayments, setRecurringPayments] = useState(() => {
    const savedPayments = localStorage.getItem(`recurringPayments_${user}`) || '[]';
    return JSON.parse(savedPayments);
  });
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    frequency: 'monthly',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const savedPayments = JSON.parse(localStorage.getItem(`recurringPayments_${user}`)) || [];
    setRecurringPayments(savedPayments);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(`recurringPayments_${user}`, JSON.stringify(recurringPayments));
  }, [recurringPayments, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPayment = {
      ...formData,
      id: Date.now(),
      amount: parseFloat(formData.amount),
      userId: user
    };
    
    const updatedPayments = [...recurringPayments, newPayment];
    setRecurringPayments(updatedPayments);
    localStorage.setItem(`recurringPayments_${user}`, JSON.stringify(updatedPayments));
    
    setFormData({
      description: '',
      amount: '',
      category: '',
      frequency: 'monthly',
      startDate: '',
      endDate: ''
    });
  };

  const handleDelete = (id) => {
    const updatedPayments = recurringPayments.filter(payment => payment.id !== id);
    setRecurringPayments(updatedPayments);
    localStorage.setItem(`recurringPayments_${user}`, JSON.stringify(updatedPayments));
  };

  const userRecurringPayments = recurringPayments.filter(payment => payment.userId === user);

  return (
    <div className="card">
      <h2>Recurring Payments</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Bills">Bills</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Frequency</label>
          <select
            name="frequency"
            value={formData.frequency}
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
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>End Date (Optional)</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn">Add Recurring Payment</button>
      </form>

      <div className="recurring-payments-list">
        <h3>Active Recurring Payments</h3>
        {userRecurringPayments.map(payment => (
          <div key={payment.id} className="recurring-payment-item">
            <div className="payment-info">
              <h4>{payment.description}</h4>
              <p>Amount: {formatCurrency(payment.amount, currency)}</p>
              <p>Category: {payment.category}</p>
              <p>Frequency: {payment.frequency}</p>
              <p>Start Date: {new Date(payment.startDate).toLocaleDateString()}</p>
              {payment.endDate && (
                <p>End Date: {new Date(payment.endDate).toLocaleDateString()}</p>
              )}
            </div>
            <button
              onClick={() => handleDelete(payment.id)}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecurringPayments;
