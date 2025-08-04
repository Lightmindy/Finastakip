document.addEventListener("DOMContentLoaded", () => {
  const salary = parseFloat(localStorage.getItem("salary")) || 0;
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const debts = JSON.parse(localStorage.getItem("debts")) || [];

  let totalExpense = expenses.reduce((total, item) => total + (parseFloat(item.amount) || 0), 0);

  if (document.getElementById("totalSalary")) {
    document.getElementById("totalSalary").textContent = salary.toFixed(2);
    document.getElementById("totalExpense").textContent = totalExpense.toFixed(2);
    document.getElementById("remaining").textContent = (salary - totalExpense).toFixed(2);
  }

  if (document.getElementById("upcomingDebts")) {
    const today = new Date().toISOString().split("T")[0];
    const upcoming = debts.filter(d => d.dueDate === today);
    const ul = document.getElementById("upcomingDebts");
    ul.innerHTML = "";
    if (upcoming.length === 0) {
      ul.innerHTML = "<li>Bugün taksit yok</li>";
    } else {
      upcoming.forEach(d => {
        const li = document.createElement("li");
        li.textContent = `${d.title} → ${d.amount} ₺`;
        ul.appendChild(li);
      });
    }
  }

  loadExpenses();
  loadDebts();
  loadGoldList();
});

const CORRECT_USERNAME = "aykut";
const CORRECT_PASSWORD = "123456";

document.addEventListener("DOMContentLoaded", () => {
  // Hatırlanmış kullanıcı varsa otomatik doldur
  const savedUser = localStorage.getItem("savedUsername");
  if (savedUser) {
    document.getElementById("username").value = savedUser;
    document.getElementById("rememberMe").checked = true;
  }

  // Şifre göster/gizle
  const toggle = document.getElementById("togglePassword");
  const pass = document.getElementById("password");
  if (toggle && pass) {
    toggle.addEventListener("click", () => {
      pass.type = pass.type === "password" ? "text" : "password";
    });
  }
});

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorBox = document.getElementById("loginError");

  if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
    // Oturumu kaydet
    sessionStorage.setItem("isLoggedIn", "true");

    // Kullanıcıyı hatırla
    if (document.getElementById("rememberMe").checked) {
      localStorage.setItem("savedUsername", username);
    } else {
      localStorage.removeItem("savedUsername");
    }

    errorBox.textContent = "";
    window.location.href = "index.html"; // ✅ Ana sayfaya yönlendirme
  } else {
    errorBox.textContent = "❌ Hatalı kullanıcı adı veya şifre!";
  }
}

function forgotPassword() {
  alert("Şifrenizi unuttuysanız sistem yöneticisine başvurun.\nTest: aykut / 123456");
}

function addExpense() {
  const note = document.getElementById("expenseNote").value;
  const amount = parseFloat(document.getElementById("expenseAmount").value);
  if (!note || isNaN(amount)) return;
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  expenses.push({ note, amount: parseFloat(amount.toFixed(2)) });
  localStorage.setItem("expenses", JSON.stringify(expenses));
  document.getElementById("expenseNote").value = "";
  document.getElementById("expenseAmount").value = "";
  loadExpenses();
}

function loadExpenses() {
  const list = document.getElementById("expenseList");
  if (!list) return;
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
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

function addDebt() {
  const title = document.getElementById("debtTitle").value;
  const amount = parseFloat(document.getElementById("debtAmount").value);
  const dueDate = document.getElementById("debtDate").value;
  if (!title || isNaN(amount) || !dueDate) return;
  const debts = JSON.parse(localStorage.getItem("debts")) || [];
  debts.push({ title, amount: parseFloat(amount.toFixed(2)), dueDate });
  localStorage.setItem("debts", JSON.stringify(debts));
  document.getElementById("debtTitle").value = "";
  document.getElementById("debtAmount").value = "";
  document.getElementById("debtDate").value = "";
  loadDebts();
}

function loadDebts() {
  const list = document.getElementById("debtList");
  if (!list) return;
  const debts = JSON.parse(localStorage.getItem("debts")) || [];
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

function addGold() {
  const goldPrice = parseFloat(document.getElementById("goldPrice").value);
  const goldInput = parseFloat(document.getElementById("goldInput").value);
  if (isNaN(goldPrice) || isNaN(goldInput)) {
    alert("Lütfen hem fiyat hem gram girin.");
    return;
  }
  const goldList = JSON.parse(localStorage.getItem("goldList")) || [];
  goldList.push({ gram: goldInput });
  localStorage.setItem("goldList", JSON.stringify(goldList));
  localStorage.setItem("goldPrice", goldPrice);
  loadGoldList();
}

function loadGoldList() {
  const price = parseFloat(localStorage.getItem("goldPrice")) || 0;
  const list = JSON.parse(localStorage.getItem("goldList")) || [];
  const ul = document.getElementById("goldList");
  if (!ul) return;
  ul.innerHTML = "";
  let totalGram = 0;
  let totalValue = 0;
  list.forEach((entry) => {
    totalGram += entry.gram;
    const value = entry.gram * price;
    totalValue += value;
    const li = document.createElement("li");
    li.textContent = `${entry.gram} gr → ${value.toFixed(2)} ₺`;
    ul.appendChild(li);
  });
  const tg = document.getElementById("totalGoldGram");
  const tv = document.getElementById("totalGoldValue");
  if (tg) tg.textContent = totalGram.toFixed(2);
  if (tv) tv.textContent = totalValue.toFixed(2);
}