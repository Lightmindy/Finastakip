document.addEventListener("DOMContentLoaded", () => {
  loadReminders();
  checkDueReminders();
});

function addReminder() {
  const title = document.getElementById("reminderTitle").value;
  const amount = parseFloat(document.getElementById("reminderAmount").value);
  const dueDate = document.getElementById("reminderDate").value;

  if (!title || isNaN(amount) || !dueDate) {
    alert("Lütfen tüm alanları eksiksiz doldurun.");
    return;
  }

  const reminder = {
    title,
    amount,
    dueDate,
    added: new Date().toLocaleDateString()
  };

  const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
  reminders.push(reminder);
  localStorage.setItem("reminders", JSON.stringify(reminders));

  renderReminder(reminder);
  clearReminderForm();
}

function loadReminders() {
  const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
  reminders.forEach(renderReminder);
}

function renderReminder(r) {
  const container = document.getElementById("reminderList");
  const li = document.createElement("li");
  li.textContent = `${r.title} - ${r.amount} ₺ - Son Tarih: ${r.dueDate}`;
  container.appendChild(li);
}

function clearReminderForm() {
  document.getElementById("reminderTitle").value = "";
  document.getElementById("reminderAmount").value = "";
  document.getElementById("reminderDate").value = "";
}

function checkDueReminders() {
  const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
  const today = new Date().toISOString().split("T")[0];

  reminders.forEach(r => {
    if (r.dueDate === today) {
      playDing();
      alert(`⏰ Bugün son ödeme günü: ${r.title} - ${r.amount} ₺`);
    }
  });
}

function playDing() {
  const ding = document.getElementById("dingSound");
  if (ding) {
    ding.play();
  }
}