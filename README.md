# F1nflow - Expense Tracker

A modern, user-friendly expense tracking application built with React. F1nflow helps you manage your finances with ease, offering features like budget tracking, expense categorization, and detailed visualizations.

## Features

- 📊 Real-time budget tracking
- 💰 Multi-currency support (INR, USD, EUR, GBP)
- 📈 Interactive expense visualizations
- 📱 Responsive design for all devices
- 🔄 Recurring payments management
- 📤 Export functionality for expenses and budget
- 🎨 Dark theme for comfortable viewing

## Technologies Used

- React.js
- Chart.js for visualizations
- React Router for navigation
- LocalStorage for data persistence
- CSS3 for styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/f1nflow.git
cd f1nflow
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`.

## Project Structure

```
f1nflow/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Home.js
│   │   ├── Visualizations.js
│   │   └── RecurringPayments.js
│   ├── context/
│   │   └── NotificationContext.js
│   ├── utils/
│   │   ├── currencyUtils.js
│   │   └── exportUtils.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

## Usage

1. **Set Your Budget**
   - Enter your total budget amount
   - Choose your preferred currency

2. **Add Expenses**
   - Enter expense details (amount, description, category)
   - View real-time budget updates

3. **View Visualizations**
   - Check expense distribution
   - Monitor spending trends
   - Analyze category-wise expenses

4. **Manage Recurring Payments**
   - Add recurring expenses
   - Set payment frequencies
   - Track upcoming payments

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Chart.js for the visualization library
- React community for the amazing ecosystem
