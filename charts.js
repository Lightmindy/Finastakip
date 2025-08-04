document.addEventListener("DOMContentLoaded", () => {
  const expenseList = JSON.parse(localStorage.getItem("expenses")) || [];

  const categorySums = {};
  expenseList.forEach(item => {
    if (categorySums[item.category]) {
      categorySums[item.category] += item.amount;
    } else {
      categorySums[item.category] = item.amount;
    }
  });

  const labels = Object.keys(categorySums);
  const data = Object.values(categorySums);

  // Pasta Grafik
  const ctxPie = document.getElementById("pieChart").getContext("2d");
  new Chart(ctxPie, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        label: "Kategori Bazlı Harcamalar",
        data: data,
        backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545", "#6f42c1"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });

  // Çubuk Grafik
  const ctxBar = document.getElementById("barChart").getContext("2d");
  new Chart(ctxBar, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Harcamalar (₺)",
        data: data,
        backgroundColor: "#17a2b8"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
});