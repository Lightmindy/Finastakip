function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const error = document.getElementById("loginError");

  if (user === "aykut" && pass === "123") {
    document.getElementById("loginPanel").classList.add("hidden");
    document.getElementById("mainPanel").classList.remove("hidden");
  } else {
    error.textContent = "Hatalı kullanıcı adı veya şifre!";
  }
}

function showDetail() {
  document.getElementById("mainPanel").classList.add("hidden");
  document.getElementById("detailPanel").classList.remove("hidden");
}

function showMain() {
  document.getElementById("detailPanel").classList.add("hidden");
  document.getElementById("mainPanel").classList.remove("hidden");
}

let totalSalary = 10000;
let totalExpense = 0;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("salary").textContent = `₺${totalSalary}`;
  document.getElementById("balance").textContent = `₺${totalSalary - totalExpense}`;
});

function addExpense() {
  const name = document.getElementById("expenseName").value;
  const amount = parseFloat(document.getElementById("expenseAmount").value);
  if (!name || isNaN(amount)) return;

  totalExpense += amount;
  document.getElementById("expense").textContent = `₺${totalExpense}`;
  document.getElementById("balance").textContent = `₺${totalSalary - totalExpense}`;

  const list = document.getElementById("expenseList");
  const item = document.createElement("div");
  item.textContent = `• ${name}: ₺${amount}`;
  list.appendChild(item);

  document.getElementById("expenseName").value = "";
  document.getElementById("expenseAmount").value = "";
}