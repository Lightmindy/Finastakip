// Ana sayfa verilerini yükle
document.addEventListener("DOMContentLoaded", () => {
  // Maaş
  const salary = parseFloat(localStorage.getItem("maas")) || 0;
  const salaryEl = document.getElementById("totalSalary");
  if (salaryEl) salaryEl.textContent = salary;

  // Giderler
  const expenses = JSON.parse(localStorage.getItem("giderler")) || [];
  let totalExpense = 0;
  expenses.forEach(item => totalExpense += parseFloat(item.amount));
  const expenseEl = document.getElementById("totalExpense");
  if (expenseEl) expenseEl.textContent = totalExpense;

  // Kalan
  const remaining = salary - totalExpense;
  const remainingEl = document.getElementById("remaining");
  if (remainingEl) remainingEl.textContent = remaining;

  // Yaklaşan taksitler
  const debts = JSON.parse(localStorage.getItem("borclar")) || [];
  const today = new Date().toISOString().split("T")[0];
  const upcoming = debts
    .filter(b => b.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  const upcomingList = document.getElementById("upcomingDebts");
  if (upcomingList) {
    upcomingList.innerHTML = "";
    upcoming.slice(0, 3).forEach(debt => {
      const li = document.createElement("li");
      li.textContent = `${debt.title} - ${debt.amount} ₺ (${debt.date})`;
      upcomingList.appendChild(li);
    });
  }

  // Altın takibi
  const goldData = JSON.parse(localStorage.getItem("altinlar")) || [];
  let totalGram = 0;
  let totalValue = 0;
  const goldList = document.getElementById("goldList");

  if (goldList) {
    goldList.innerHTML = "";
    goldData.forEach(item => {
      totalGram += parseFloat(item.gram);
      totalValue += parseFloat(item.gram) * parseFloat(item.price);

      const li = document.createElement("li");
      li.textContent = `${item.gram} gr @ ${item.price}₺ = ${(item.gram * item.price).toFixed(2)} ₺`;
      goldList.appendChild(li);
    });

    const goldGramEl = document.getElementById("totalGoldGram");
    const goldValEl = document.getElementById("totalGoldValue");
    if (goldGramEl) goldGramEl.textContent = totalGram.toFixed(2);
    if (goldValEl) goldValEl.textContent = totalValue.toFixed(2);
  }
});

// Altın ekle
function addGold() {
  const price = parseFloat(document.getElementById("goldPrice").value);
  const gram = parseFloat(document.getElementById("goldInput").value);

  if (isNaN(price) || isNaN(gram)) {
    alert("Lütfen geçerli değerler girin!");
    return;
  }

  let altinlar = JSON.parse(localStorage.getItem("altinlar")) || [];
  altinlar.push({ price, gram });
  localStorage.setItem("altinlar", JSON.stringify(altinlar));

  alert("Altın eklendi!");
  location.reload();
}