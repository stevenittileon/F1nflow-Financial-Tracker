// Budget and expenses storage
let budget = 0;
let expenses = [];

// Charts
let expenseChart, budgetChart;

// Load data from localStorage
function loadData() {
  budget = parseFloat(localStorage.getItem("budget")) || 0;
  expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  updateUI();
}

// Save data to localStorage
function saveData() {
  localStorage.setItem("budget", budget);
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Initialize charts
function setupCharts() {
  const expenseCtx = document
    .getElementById("expenseChart")
    .getContext("2d");
  const budgetCtx = document
    .getElementById("budgetChart")
    .getContext("2d");

  expenseChart = new Chart(expenseCtx, {
    type: "doughnut",
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: ["#1a73e8", "#34a853", "#fbbc04", "#ea4335"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { title: { display: true, text: "Expenses by Category" } },
    },
  });

  budgetChart = new Chart(budgetCtx, {
    type: "bar",
    data: {
      labels: ["Budget Overview"],
      datasets: [
        { label: "Remaining", data: [0], backgroundColor: "#34a853" },
        { label: "Spent", data: [0], backgroundColor: "#ea4335" },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true },
      },
      plugins: { title: { display: true, text: "Budget Usage" } },
    },
  });

  loadData();
}

// Set budget
function setBudget() {
  budgetAmount = parseFloat(document.getElementById("budgetAmount").value) || 0;
  budget += budgetAmount;
  saveData();
  updateUI();
  document.getElementById("budgetAmount").value = "";
}

// Add expense
function addExpense() {
  let title = document.getElementById("expenseTitle").value;
  let amount =
    parseFloat(document.getElementById("expenseAmount").value) || 0;
  let category = document.getElementById("expenseCategory").value;

  if (title && amount < budget && category) {
    expenses.push({
      title,
      amount,
      category,
      date: new Date().toLocaleDateString(),
    });
    saveData();
    updateUI();
    document.getElementById("expenseTitle").value = "";
    document.getElementById("expenseAmount").value = "";
    document.getElementById("expenseCategory").value = "";
  }
}

// Delete expense
function deleteExpense(index) {
  expenses.splice(index, 1);
  saveData();
  updateUI();
}

// Update UI (budget, expenses, and charts)
function updateUI() {
  let totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  let remaining = budget - totalSpent;
  let percentageUsed = (totalSpent / budget) * 100;

  document.getElementById("totalBudget").textContent = `₹${budget.toFixed(
    2
  )}`;
  document.getElementById(
    "totalExpenses"
  ).textContent = `₹${totalSpent.toFixed(2)}`;
  document.getElementById(
    "remaining"
  ).textContent = `₹${remaining.toFixed(2)}`;

  let progressBar = document.getElementById("expenseProgress");
  progressBar.style.width = `${Math.min(percentageUsed, 100)}%`;
  progressBar.style.backgroundColor =
    percentageUsed > 90 ? "#dc3545" : "#1a73e8";

  document.getElementById("budgetAlert").style.display =
    remaining < 0 ? "block" : "none";

  updateExpenseList();
  updateCharts();
}

// Update expense list
function updateExpenseList() {
  let expenseList = document.getElementById("expenseList");
  expenseList.innerHTML = "";

  expenses.forEach((exp, index) => {
    expenseList.innerHTML += `
      <div class="expense-item">
          <div>
              <strong>${exp.title}</strong> <span>(${
      exp.category
    })</span> <small>${exp.date}</small>
          </div>
          <div>
              <span>₹${exp.amount.toFixed(2)}</span>
              <button class="delete-btn" onclick="deleteExpense(${index})">Delete</button>
          </div>
      </div>`;
  });
}

// Update charts
function updateCharts() {
  let categoryTotals = expenses.reduce((totals, exp) => {
    totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
    return totals;
  }, {});

  expenseChart.data.labels = Object.keys(categoryTotals);
  expenseChart.data.datasets[0].data = Object.values(categoryTotals);
  expenseChart.update();

  let totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  let remaining = Math.max(0, budget - totalSpent);

  budgetChart.data.datasets[0].data = [remaining];
  budgetChart.data.datasets[1].data = [totalSpent];
  budgetChart.update();
}

// Close modal function
function closeModal() {
  document.getElementById("budgetAlert").style.display = "none";
}

// Initialize application
setupCharts();