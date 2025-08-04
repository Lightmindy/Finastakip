// Verileri yükle
let salary = parseFloat(localStorage.getItem('salary')) || 0;
let goldPrice = parseFloat(localStorage.getItem('goldPrice')) || 0;
let goldAmount = parseFloat(localStorage.getItem('goldAmount')) || 0;
let totalExpense = 0;

document.addEventListener("DOMContentLoaded", () => {
  // Giriş değerlerini yerleştir
  document.getElementById("salary").value = salary;
  document.getElementById("goldPrice").value = goldPrice;
  document.getElementById("goldAmount").value = goldAmount;

  loadExpenses();
  updateSummary();
});

function addExpense() {
  const salaryInput = document.getElementById("salary");
  const goldPriceInput = document.getElementById("goldPrice");
  const goldAmountInput = document.getElementById("goldAmount");
  const expenseInput = document.getElementById("expense");
  const noteInput = document.getElementById("note");
  const categoryInput = document.getElementById("category");

  if (salaryInput.value) {
    salary = parseFloat(salaryInput.value);
    localStorage.setItem("salary", salary);
  }

  goldPrice = parseFloat(goldPriceInput.value);
  goldAmount = parseFloat(goldAmountInput.value);
  localStorage.setItem("goldPrice", goldPrice);
  localStorage.setItem("goldAmount", goldAmount);

  const expense = parseFloat(expenseInput.value);
  const note = noteInput.value;
  const category = categoryInput.value;

  if (!isNaN(expense) && note) {
    const expenseData = {
      amount: expense,
      note: note,
      category: category,
      date: new Date().toLocaleDateString()
    };

    let expenseList = JSON.parse(localStorage.getItem("expenses")) || [];
    expenseList.push(expenseData);
    localStorage.setItem("expenses", JSON.stringify(expenseList));

    renderExpenseItem(expenseData);
    playDing();
  }

  expenseInput.value = "";
  noteInput.value = "";
  updateSummary();
}

function loadExpenses() {
  const expenseList = JSON.parse(localStorage.getItem("expenses")) || [];
  totalExpense = 0;
  document.getElementById("expenseList").innerHTML = "";

  expenseList.forEach((data) => {
    totalExpense += data.amount;
    renderExpenseItem(data);
  });
}

function renderExpenseItem(data) {
  const li = document.createElement("li");
  li.textContent = `${data.category} | ${data.note} - ${data.amount} ₺ (${data.date})`;
  document.getElementById("expenseList").appendChild(li);
}

function updateSummary() {
  document.getElementById("totalSalary").textContent = salary.toFixed(2);
  document.getElementById("totalExpense").textContent = totalExpense.toFixed(2);
  document.getElementById("balance").textContent = (salary - totalExpense).toFixed(2);

  const totalGold = goldAmount * goldPrice;
  document.getElementById("totalGold").textContent = isNaN(totalGold) ? "0" : totalGold.toFixed(2);
}

function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  const theme = document.body.classList.contains("dark-theme") ? "dark" : "light";
  localStorage.setItem("theme", theme);
}

// Sayfa yüklendiğinde tema ayarı
window.onload = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
  }
};

function playDing() {
  const sound = document.getElementById("dingSound");
  if (sound) {
    sound.play();
  }
}

function showNotification() {
  playDing();
  alert("Bildirim test edildi!");
}