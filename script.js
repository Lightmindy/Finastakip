function saveSalary() {
  const salary = parseFloat(document.getElementById("salaryInput").value);
  if (!isNaN(salary)) {
    localStorage.setItem("salary", salary);
    alert("Maaş kaydedildi!");
    document.getElementById("salaryInput").value = "";
  }
}

// Gider işlemleri
function addExpense() {
  const note = document.getElementById("expenseNote").value;
  const amount = parseFloat(document.getElementById("expenseAmount").value);
  if (!note || isNaN(amount)) return;

  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  expenses.push({ note, amount });
  localStorage.setItem("expenses", JSON.stringify(expenses));

  document.getElementById("expenseNote").value = "";
  document.getElementById("expenseAmount").value = "";
  loadExpenses();
}

function loadExpenses() {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const list = document.getElementById("expenseList");
  list.innerHTML = "";
  expenses.forEach((e, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${e.note} - ${e.amount} ₺ <button onclick="deleteExpense(${i})">❌</button>`;
    list.appendChild(li);
  });
}

function deleteExpense(index) {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  loadExpenses();
}

// Borç işlemleri
function addDebt() {
  const title = document.getElementById("debtTitle").value;
  const amount = parseFloat(document.getElementById("debtAmount").value);
  const dueDate = document.getElementById("debtDate").value;
  if (!title || isNaN(amount) || !dueDate) return;

  const debts = JSON.parse(localStorage.getItem("debts")) || [];
  debts.push({ title, amount, dueDate });
  localStorage.setItem("debts", JSON.stringify(debts));

  document.getElementById("debtTitle").value = "";
  document.getElementById("debtAmount").value = "";
  document.getElementById("debtDate").value = "";
  loadDebts();
}

function loadDebts() {
  const debts = JSON.parse(localStorage.getItem("debts")) || [];
  const list = document.getElementById("debtList");
  list.innerHTML = "";
  debts.forEach((d, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${d.title} - ${d.amount} ₺ - ${d.dueDate} <button onclick="deleteDebt(${i})">❌</button>`;
    list.appendChild(li);
  });
}

function deleteDebt(index) {
  const debts = JSON.parse(localStorage.getItem("debts")) || [];
  debts.splice(index, 1);
  localStorage.setItem("debts", JSON.stringify(debts));
  loadDebts();
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("expenseList")) loadExpenses();
  if (document.getElementById("debtList")) loadDebts();
});