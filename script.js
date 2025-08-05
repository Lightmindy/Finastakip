// === Maaş ===
function saveSalary() {
  const salary = parseFloat(document.getElementById("salaryInput").value);
  if (!isNaN(salary)) {
    localStorage.setItem("maas", salary);
    alert("Maaş kaydedildi!");
    updateDashboard();
  }
}

// === Gider ===
function addExpense() {
  const note = document.getElementById("expenseNote").value;
  const amount = parseFloat(document.getElementById("expenseAmount").value);
  if (!note || isNaN(amount)) {
    alert("Geçerli gider girin.");
    return;
  }
  const expenses = JSON.parse(localStorage.getItem("giderler")) || [];
  expenses.push({ note, amount });
  localStorage.setItem("giderler", JSON.stringify(expenses));
  alert("Gider kaydedildi!");
  updateDashboard();
}

function calculateExpenses() {
  const expenses = JSON.parse(localStorage.getItem("giderler")) || [];
  return expenses.reduce((sum, x) => sum + x.amount, 0);
}

// === Borç ===
function addDebt() {
  const title = document.getElementById("debtTitle").value;
  const amount = parseFloat(document.getElementById("debtAmount").value);
  const date = document.getElementById("debtDate").value;
  if (!title || isNaN(amount) || !date) {
    alert("Lütfen tüm borç alanlarını doldurun.");
    return;
  }
  const debts = JSON.parse(localStorage.getItem("borclar")) || [];
  debts.push({ title, amount, date });
  localStorage.setItem("borclar", JSON.stringify(debts));
  alert("Borç eklendi!");
  updateDashboard();
}

function getUpcomingDebts() {
  const debts = JSON.parse(localStorage.getItem("borclar")) || [];
  const today = new Date().toISOString().split("T")[0];
  return debts.filter(debt => debt.date >= today).sort((a, b) => a.date.localeCompare(b.date));
}

// === Altın ===
function addGold() {
  const gram = parseFloat(document.getElementById("goldInput").value);
  const price = parseFloat(document.getElementById("goldPrice").value);
  if (isNaN(gram) || isNaN(price)) {
    alert("Lütfen geçerli altın verileri girin.");
    return;
  }
  const gold = JSON.parse(localStorage.getItem("gold")) || [];
  gold.push({ gram, price });
  localStorage.setItem("gold", JSON.stringify(gold));
  updateDashboard();
}

// === Verilen Borç (Gelecek Para) ===
function addIncoming() {
  const name = document.getElementById("lenderName").value;
  const amount = parseFloat(document.getElementById("lenderAmount").value);
  const date = document.getElementById("lenderDate").value;
  if (!name || isNaN(amount) || !date) {
    alert("Lütfen geçerli bilgi girin.");
    return;
  }
  const incoming = JSON.parse(localStorage.getItem("incoming")) || [];
  incoming.push({ name, amount, date });
  localStorage.setItem("incoming", JSON.stringify(incoming));
  alert("Gelecek para eklendi!");
  updateDashboard();
}

// === Ana Panel Güncelleme ===
function updateDashboard() {
  if (document.getElementById("totalSalary")) {
    const maas = parseFloat(localStorage.getItem("maas")) || 0;
    const gider = calculateExpenses();
    const bakiye = maas - gider;
    document.getElementById("totalSalary").innerText = maas.toFixed(2);
    document.getElementById("totalExpense").innerText = gider.toFixed(2);
    document.getElementById("remaining").innerText = bakiye.toFixed(2);
  }

  if (document.getElementById("upcomingDebts")) {
    const list = document.getElementById("upcomingDebts");
    list.innerHTML = "";
    const debts = getUpcomingDebts();
    debts.slice(0, 3).forEach(d => {
      const li = document.createElement("li");
      li.innerText = `${d.title}: ${d.amount}₺ (${d.date})`;
      list.appendChild(li);
    });
  }

  if (document.getElementById("goldList")) {
    const gold = JSON.parse(localStorage.getItem("gold")) || [];
    const list = document.getElementById("goldList");
    list.innerHTML = "";
    let totalGram = 0;
    let totalValue = 0;
    gold.forEach(g => {
      totalGram += g.gram;
      totalValue += g.gram * g.price;
      const li = document.createElement("li");
      li.innerText = `${g.gram} gr x ${g.price}₺ = ${(g.gram * g.price).toFixed(2)} ₺`;
      list.appendChild(li);
    });
    document.getElementById("totalGoldGram").innerText = totalGram.toFixed(2);
    document.getElementById("totalGoldValue").innerText = totalValue.toFixed(2);
  }

  if (document.getElementById("expenseList")) {
    const expenses = JSON.parse(localStorage.getItem("giderler")) || [];
    const list = document.getElementById("expenseList");
    list.innerHTML = "";
    expenses.forEach((x, i) => {
      const li = document.createElement("li");
      li.innerText = `${x.note} - ${x.amount}₺ `;
      const del = document.createElement("button");
      del.textContent = "❌";
      del.onclick = () => {
        expenses.splice(i, 1);
        localStorage.setItem("giderler", JSON.stringify(expenses));
        updateDashboard();
      };
      li.appendChild(del);
      list.appendChild(li);
    });
  }

  if (document.getElementById("debtList")) {
    const debts = JSON.parse(localStorage.getItem("borclar")) || [];
    const list = document.getElementById("debtList");
    list.innerHTML = "";
    debts.forEach((x, i) => {
      const li = document.createElement("li");
      li.innerText = `${x.title} - ${x.amount}₺ (${x.date}) `;
      const del = document.createElement("button");
      del.textContent = "❌";
      del.onclick = () => {
        debts.splice(i, 1);
        localStorage.setItem("borclar", JSON.stringify(debts));
        updateDashboard();
      };
      li.appendChild(del);
      list.appendChild(li);
    });
  }

  if (document.getElementById("incomingList")) {
    const incoming = JSON.parse(localStorage.getItem("incoming")) || [];
    const list = document.getElementById("incomingList");
    list.innerHTML = "";
    let toplam = 0;
    incoming.forEach((x, i) => {
      toplam += x.amount;
      const li = document.createElement("li");
      li.innerText = `${x.name} - ${x.amount}₺ (${x.date}) `;
      const del = document.createElement("button");
      del.textContent = "❌";
      del.onclick = () => {
        incoming.splice(i, 1);
        localStorage.setItem("incoming", JSON.stringify(incoming));
        updateDashboard();
      };
      li.appendChild(del);
      list.appendChild(li);
    });
    document.getElementById("totalIncoming").innerText = toplam.toFixed(2);
  }
}

document.addEventListener("DOMContentLoaded", updateDashboard);