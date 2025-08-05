// ---------- MAAŞ ----------
function saveSalary() {
  const salary = parseFloat(document.getElementById("salaryInput").value);
  if (!isNaN(salary)) {
    localStorage.setItem("maas", salary);
    alert("Maaş kaydedildi!");
  }
}

function getSalary() {
  return parseFloat(localStorage.getItem("maas")) || 0;
}

// ---------- GİDER ----------
function addExpense() {
  const note = document.getElementById("expenseNote").value;
  const amount = parseFloat(document.getElementById("expenseAmount").value);
  if (!note || isNaN(amount)) {
    alert("Lütfen açıklama ve tutar girin.");
    return;
  }
  const expenses = JSON.parse(localStorage.getItem("giderler")) || [];
  expenses.push({ note, amount });
  localStorage.setItem("giderler", JSON.stringify(expenses));
  alert("Gider eklendi!");
}

function getExpenses() {
  return JSON.parse(localStorage.getItem("giderler")) || [];
}

// ---------- BORÇ ----------
function addDebt() {
  const title = document.getElementById("debtTitle").value;
  const amount = parseFloat(document.getElementById("debtAmount").value);
  const date = document.getElementById("debtDate").value;
  if (!title || isNaN(amount) || !date) {
    alert("Tüm alanları doldurun.");
    return;
  }
  const debts = JSON.parse(localStorage.getItem("borclar")) || [];
  debts.push({ title, amount, date });
  localStorage.setItem("borclar", JSON.stringify(debts));
  alert("Borç eklendi!");
}

function getDebts() {
  return JSON.parse(localStorage.getItem("borclar")) || [];
}

// ---------- VERDİĞİM BORÇ ----------
function addIncoming() {
  const name = document.getElementById("lenderName").value;
  const amount = parseFloat(document.getElementById("lenderAmount").value);
  const date = document.getElementById("lenderDate").value;
  if (!name || isNaN(amount) || !date) {
    alert("Tüm alanları doldurun.");
    return;
  }
  const list = JSON.parse(localStorage.getItem("gelecekPara")) || [];
  list.push({ name, amount, date });
  localStorage.setItem("gelecekPara", JSON.stringify(list));
  alert("Gelecek para kaydedildi!");
}

function getIncoming() {
  return JSON.parse(localStorage.getItem("gelecekPara")) || [];
}

// ---------- ALTIN ----------
function addGold() {
  const gram = parseFloat(document.getElementById("goldInput").value);
  const price = parseFloat(document.getElementById("goldPrice").value);
  if (isNaN(gram) || isNaN(price)) {
    alert("Geçerli değerler girin.");
    return;
  }
  const golds = JSON.parse(localStorage.getItem("altinlar")) || [];
  golds.push({ gram, price });
  localStorage.setItem("altinlar", JSON.stringify(golds));
  displayGold();
}

// ---------- ANASAYFA VERİLERİ ----------
function updateIndex() {
  if (document.getElementById("totalSalary")) {
    const salary = getSalary();
    const expenses = getExpenses();
    const debts = getDebts();
    const incoming = getIncoming();

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = salary - totalExpense;
    const totalIncoming = incoming.reduce((sum, e) => sum + e.amount, 0);

    document.getElementById("totalSalary").textContent = salary.toFixed(2);
    document.getElementById("totalExpense").textContent = totalExpense.toFixed(2);
    document.getElementById("remaining").textContent = remaining.toFixed(2);
    document.getElementById("totalIncomingHome").textContent = totalIncoming.toFixed(2);

    const today = new Date();
    const upcomingDebts = debts
      .filter(d => new Date(d.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const upcomingList = document.getElementById("upcomingDebts");
    upcomingList.innerHTML = "";
    upcomingDebts.slice(0, 3).forEach(d => {
      const li = document.createElement("li");
      li.textContent = `${d.title}: ${d.amount}₺ (${d.date})`;
      upcomingList.appendChild(li);
    });

    displayGold();
  }
}

// ---------- ALTIN GÖSTER ----------
function displayGold() {
  const golds = JSON.parse(localStorage.getItem("altinlar")) || [];
  const totalGr = golds.reduce((sum, g) => sum + g.gram, 0);
  const totalVal = golds.reduce((sum, g) => sum + g.gram * g.price, 0);

  const list = document.getElementById("goldList");
  const grSpan = document.getElementById("totalGoldGram");
  const valSpan = document.getElementById("totalGoldValue");

  if (list) {
    list.innerHTML = "";
    golds.forEach(g => {
      const li = document.createElement("li");
      li.textContent = `${g.gram} gr @ ${g.price}₺`;
      list.appendChild(li);
    });
  }

  if (grSpan) grSpan.textContent = totalGr.toFixed(2);
  if (valSpan) valSpan.textContent = totalVal.toFixed(2);
}

// ---------- DETAY SAYFASI GÖSTER ----------
function loadDetailData() {
  const expenseList = document.getElementById("expenseList");
  const debtList = document.getElementById("debtList");
  const incomingList = document.getElementById("incomingList");
  const totalIncoming = document.getElementById("totalIncoming");

  if (expenseList) {
    expenseList.innerHTML = "";
    getExpenses().forEach((e, index) => {
      const li = document.createElement("li");
      li.textContent = `${e.note}: ${e.amount}₺`;
      const del = document.createElement("button");
      del.textContent = "X";
      del.onclick = () => {
        const arr = getExpenses();
        arr.splice(index, 1);
        localStorage.setItem("giderler", JSON.stringify(arr));
        loadDetailData();
      };
      li.appendChild(del);
      expenseList.appendChild(li);
    });
  }

  if (debtList) {
    debtList.innerHTML = "";
    getDebts().forEach((d, index) => {
      const li = document.createElement("li");
      li.textContent = `${d.title}: ${d.amount}₺ (${d.date})`;
      const del = document.createElement("button");
      del.textContent = "X";
      del.onclick = () => {
        const arr = getDebts();
        arr.splice(index, 1);
        localStorage.setItem("borclar", JSON.stringify(arr));
        loadDetailData();
      };
      li.appendChild(del);
      debtList.appendChild(li);
    });
  }

  if (incomingList && totalIncoming) {
    const incoming = getIncoming();
    incomingList.innerHTML = "";
    const total = incoming.reduce((sum, e) => sum + e.amount, 0);
    totalIncoming.textContent = total.toFixed(2);

    incoming.forEach((e, index) => {
      const li = document.createElement("li");
      li.textContent = `${e.name}: ${e.amount}₺ (${e.date})`;
      const del = document.createElement("button");
      del.textContent = "X";
      del.onclick = () => {
        const arr = getIncoming();
        arr.splice(index, 1);
        localStorage.setItem("gelecekPara", JSON.stringify(arr));
        loadDetailData();
      };
      li.appendChild(del);
      incomingList.appendChild(li);
    });
  }
}

// ---------- SAYFA YÜKLENİNCE ----------
window.onload = function () {
  updateIndex();
  loadDetailData();
};