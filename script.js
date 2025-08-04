document.addEventListener("DOMContentLoaded", () => {
  const salary = parseFloat(localStorage.getItem("salary")) || 0;
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const debts = JSON.parse(localStorage.getItem("debts")) || [];

  let totalExpense = 0;
  expenses.forEach(e => totalExpense += parseFloat(e.amount));

  document.getElementById("totalSalary").textContent = salary.toFixed(2);
  document.getElementById("totalExpense").textContent = totalExpense.toFixed(2);
  document.getElementById("remaining").textContent = (salary - totalExpense).toFixed(2);

  const today = new Date().toISOString().split("T")[0];
  const upcoming = debts.filter(d => d.dueDate === today);

  const ul = document.getElementById("upcomingDebts");
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