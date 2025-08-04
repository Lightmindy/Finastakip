function addGold() {
  const goldPrice = parseFloat(document.getElementById("goldPrice").value);
  const goldInput = parseFloat(document.getElementById("goldInput").value);

  if (isNaN(goldPrice) || isNaN(goldInput)) {
    alert("Lütfen hem fiyat hem gram girin.");
    return;
  }

  // Güncel kur ve yeni giriş
  const goldList = JSON.parse(localStorage.getItem("goldList")) || [];
  goldList.push({ gram: goldInput });
  localStorage.setItem("goldList", JSON.stringify(goldList));
  localStorage.setItem("goldPrice", goldPrice);

  loadGoldList();
}

function loadGoldList() {
  const goldPrice = parseFloat(localStorage.getItem("goldPrice")) || 0;
  const goldList = JSON.parse(localStorage.getItem("goldList")) || [];

  const ul = document.getElementById("goldList");
  ul.innerHTML = "";

  let totalGram = 0;
  let totalValue = 0;

  goldList.forEach((entry, i) => {
    const value = goldPrice * entry.gram;
    totalGram += entry.gram;
    totalValue += value;

    const li = document.createElement("li");
    li.textContent = `${entry.gram} gr → ${value.toFixed(2)} ₺`;
    ul.appendChild(li);
  });

  document.getElementById("totalGoldGram").textContent = totalGram.toFixed(2);
  document.getElementById("totalGoldValue").textContent = totalValue.toFixed(2);
}

// Sayfa açıldığında altınları da yükle
document.addEventListener("DOMContentLoaded", () => {
  ...
  loadGoldList(); // <-- bu satırı diğerlerine ekle
});

document.addEventListener("DOMContentLoaded", () => {
  const salary = parseFloat(localStorage.getItem("salary")) || 0;
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const debts = JSON.parse(localStorage.getItem("debts")) || [];

  // Gider hesaplama
  let totalExpense = expenses.reduce((total, item) => {
    return total + (parseFloat(item.amount) || 0);
  }, 0);

  // Yazdır
  document.getElementById("totalSalary").textContent = salary.toFixed(2);
  document.getElementById("totalExpense").textContent = totalExpense.toFixed(2);
  document.getElementById("remaining").textContent = (salary - totalExpense).toFixed(2);

  // Bugünkü taksitler
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
});