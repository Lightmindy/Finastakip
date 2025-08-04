// Maaş Kaydet
function saveSalary() {
  const salary = document.getElementById("salaryInput").value;
  localStorage.setItem("maas", salary);
  alert("Maaş kaydedildi!");
}

// Gider Ekle
function addExpense() {
  const note = document.getElementById("expenseNote").value;
  const amount = document.getElementById("expenseAmount").value;
  let expenses = JSON.parse(localStorage.getItem("giderler")) || [];
  expenses.push({ note, amount });
  localStorage.setItem("giderler", JSON.stringify(expenses));
  alert("Gider eklendi!");
}

// Borç Ekle
function addDebt() {
  const title = document.getElementById("debtTitle").value;
  const amount = document.getElementById("debtAmount").value;
  const date = document.getElementById("debtDate").value;
  let debts = JSON.parse(localStorage.getItem("borclar")) || [];
  debts.push({ title, amount, date });
  localStorage.setItem("borclar", JSON.stringify(debts));
  alert("Borç eklendi!");
}

// Ana sayfa verileri yükle
function loadIndexData() {
  const maas = localStorage.getItem("maas") || 0;
  const maasElem = document.getElementById("maasGoster");
  if (maasElem) maasElem.textContent = maas + " TL";

  const giderListesi = document.getElementById("giderListesi");
  if (giderListesi) {
    const giderler = JSON.parse(localStorage.getItem("giderler")) || [];
    giderListesi.innerHTML = "";
    giderler.forEach(g => {
      const li = document.createElement("li");
      li.textContent = `${g.note}: ${g.amount} TL`;
      giderListesi.appendChild(li);
    });
  }

  const borcListesi = document.getElementById("borcListesi");
  if (borcListesi) {
    const borclar = JSON.parse(localStorage.getItem("borclar")) || [];
    borcListesi.innerHTML = "";
    borclar.forEach(b => {
      const li = document.createElement("li");
      li.textContent = `${b.title}: ${b.amount} TL - ${b.date}`;
      borcListesi.appendChild(li);
    });
  }
}

document.addEventListener("DOMContentLoaded", loadIndexData);