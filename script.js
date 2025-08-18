/* =================== Yardımcı Fonksiyonlar =================== */
const _num = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? n : 0; };
const _fmt = (v) => (Number(v || 0)).toLocaleString("tr-TR", { maximumFractionDigits: 2 });

/* =================== MAAŞ / GİDER / BORÇ / GELECEK PARA =================== */
// ---------- MAAŞ ----------
function saveSalary() {
  const salary = parseFloat(document.getElementById("salaryInput")?.value);
  if (!isNaN(salary)) {
    localStorage.setItem("maas", salary);
    renderSalaryDetail();
    alert("Maaş kaydedildi!");
  }
}
function getSalary() { return parseFloat(localStorage.getItem("maas")) || 0; }

// ---------- GİDER ----------
function addExpense() {
  const note = document.getElementById("expenseNote")?.value?.trim();
  const amount = parseFloat(document.getElementById("expenseAmount")?.value);
  if (!note || isNaN(amount)) { alert("Lütfen açıklama ve tutar girin."); return; }
  const expenses = JSON.parse(localStorage.getItem("giderler")) || [];
  expenses.push({ note, amount });
  localStorage.setItem("giderler", JSON.stringify(expenses));
  document.getElementById("expenseNote").value = "";
  document.getElementById("expenseAmount").value = "";
  renderExpenses();
}
function getExpenses() { return JSON.parse(localStorage.getItem("giderler")) || []; }

// ---------- BORÇ ----------
function addDebt() {
  const title = document.getElementById("debtTitle")?.value?.trim();
  const amount = parseFloat(document.getElementById("debtAmount")?.value);
  const date = document.getElementById("debtDate")?.value;
  if (!title || isNaN(amount) || !date) { alert("Tüm alanları doldurun."); return; }
  const debts = JSON.parse(localStorage.getItem("borclar")) || [];
  debts.push({ title, amount, date });
  localStorage.setItem("borclar", JSON.stringify(debts));
  document.getElementById("debtTitle").value = "";
  document.getElementById("debtAmount").value = "";
  document.getElementById("debtDate").value = "";
  renderDebts();
}
function getDebts() { return JSON.parse(localStorage.getItem("borclar")) || []; }

// ---------- VERDİĞİM BORÇ ----------
function addIncoming() {
  const name = document.getElementById("lenderName")?.value?.trim();
  const amount = parseFloat(document.getElementById("lenderAmount")?.value);
  const date = document.getElementById("lenderDate")?.value;
  if (!name || isNaN(amount) || !date) { alert("Tüm alanları doldurun."); return; }
  const list = JSON.parse(localStorage.getItem("gelecekPara")) || [];
  list.push({ name, amount, date });
  localStorage.setItem("gelecekPara", JSON.stringify(list));
  document.getElementById("lenderName").value = "";
  document.getElementById("lenderAmount").value = "";
  document.getElementById("lenderDate").value = "";
  renderIncoming();
}
function getIncoming() { return JSON.parse(localStorage.getItem("gelecekPara")) || []; }

/* ============================= ALTIN MODÜLÜ ============================== */
/* Kayıt yapısı: { id, gram, price } — hem gram hem fiyat Düzenle/Sil */
(function GoldModule(){
  const LS_KEY = "altinlar";       // [{id, gram, price}]
  const LS_PRICE = "goldUnitPrice"; // son kullanılan gram fiyatı (input varsayılanı)

  // DOM
  const elPrice = document.getElementById("goldPrice");
  const elGram  = document.getElementById("goldInput");
  const elList  = document.getElementById("goldList");
  const elTotG  = document.getElementById("totalGoldGram");
  const elTotV  = document.getElementById("totalGoldValue");

  if (!elList || !elTotG || !elTotV) return;

  // State
  let items = []; // {id, gram, price}

  // Helpers
  const uid = () => Math.random().toString(36).slice(2, 9);

  // Load/Save
  function load(){
    const raw = JSON.parse(localStorage.getItem(LS_KEY)) || [];
    items = raw.map(it => ({ id: it.id || uid(), gram: _num(it.gram), price: _num(it.price) }));
    const lastPrice = _num(localStorage.getItem(LS_PRICE));
    if (elPrice) elPrice.value = lastPrice ? String(lastPrice) : "";
  }
  function save(){
    localStorage.setItem(LS_KEY, JSON.stringify(items));
    const p = _num(elPrice?.value);
    localStorage.setItem(LS_PRICE, String(p || 0));
  }

  // Render
  function render(){
    elList.innerHTML = "";
    let sumG = 0, sumV = 0;

    items.forEach((it, index) => {
      sumG += it.gram;
      sumV += it.gram * it.price;

      const li = document.createElement("li");
      li.className = "gold-item";
      li.dataset.id = it.id;

      const info = document.createElement("div");
      info.className = "gold-info";
      info.innerHTML = `
        <strong>${_fmt(it.gram)} gr</strong>
        <div class="muted">@ ${_fmt(it.price)} ₺ • Değer: ${_fmt(it.gram * it.price)} ₺</div>
      `;

      const actions = document.createElement("div");
      actions.className = "gold-actions";

      const btnEdit = document.createElement("button");
      btnEdit.textContent = "Düzenle";
      btnEdit.setAttribute("data-act","edit");
      btnEdit.onclick = () => editItem(index);

      const btnDel = document.createElement("button");
      btnDel.textContent = "Sil";
      btnDel.setAttribute("data-act","delete");
      btnDel.onclick = () => deleteItem(index);

      actions.appendChild(btnEdit);
      actions.appendChild(btnDel);

      li.appendChild(info);
      li.appendChild(actions);
      elList.appendChild(li);
    });

    elTotG.textContent = _fmt(sumG);
    elTotV.textContent = _fmt(sumV);
  }

  // CRUD
  function addItem(){
    const g = _num(elGram?.value);
    const p = _num(elPrice?.value);
    if (g <= 0 || p <= 0) { alert("Lütfen geçerli gram ve fiyat girin."); return; }
    items.push({ id: uid(), gram: g, price: p });
    elGram.value = "";
    save(); render();
  }

  function editItem(index){
    const it = items[index];
    if (!it) return;

    const newGram  = prompt("Yeni gram değeri:", String(it.gram));
    if (newGram === null) return;
    const g = _num(newGram);
    if (g <= 0) { alert("Geçerli bir gram değeri girin."); return; }

    const newPrice = prompt("Yeni gram fiyatı (₺):", String(it.price));
    if (newPrice === null) return;
    const p = _num(newPrice);
    if (p <= 0) { alert("Geçerli bir fiyat girin."); return; }

    items[index] = { ...it, gram: g, price: p };
    save(); render();
  }

  function deleteItem(index){
    items.splice(index, 1);
    save(); render();
  }

  // Public (HTML onclick)
  window.addGold = addItem;

  // Fiyat inputu değiştikçe yeni kayıtlara varsayılan olarak kalsın
  elPrice?.addEventListener("input", () => {
    localStorage.setItem(LS_PRICE, String(_num(elPrice.value) || 0));
  });

  // Init
  load();
  render();
})();

/* ===================== MAAŞ GÜNÜ GERİ SAYIM ===================== */
const PAYDAY_DAY = 15; // Ayın 15'i

function getNextPayday(day = PAYDAY_DAY) {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();

  if (d < day) {
    return new Date(y, m, day, 0, 0, 0, 0);
  } else if (d > day) {
    return new Date(y, m + 1, day, 0, 0, 0, 0);
  } else {
    return new Date(y, m, day, 0, 0, 0, 0);
  }
}

function formatDateTR(dt) {
  return dt.toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" });
}

function renderPaydayCountdown(day = PAYDAY_DAY) {
  const headEl = document.getElementById("paydayHeadline");
  const cntEl  = document.getElementById("paydayCountdown");
  const nextEl = document.getElementById("paydayNextDate");
  if (!cntEl || !headEl || !nextEl) return;

  const now = new Date();
  const today = now.getDate();

  if (today === day) {
    headEl.textContent = "🎉 Bugün maaş günü!";
    nextEl.textContent = `Sonraki: ${formatDateTR(new Date(now.getFullYear(), now.getMonth() + 1, day))}`;
    return;
  }

  const target = getNextPayday(day);
  const msLeft = target - now;
  const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));

  cntEl.textContent = `${daysLeft} gün kaldı`;
  nextEl.textContent = `Tarih: ${formatDateTR(target)}`;
}

function schedulePaydayAutoRefresh() {
  // Her gece 00:00'dan hemen sonra yeniden hesapla
  const now = new Date();
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
  const ms = nextMidnight - now;
  setTimeout(() => {
    renderPaydayCountdown();
    schedulePaydayAutoRefresh();
  }, ms);
}

/* ============ Ana sayfa özetleri (index) için görselleri güncelle ============ */
function updateIndex() {
  if (!document.getElementById("totalSalary")) return;

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
    li.textContent = `${d.title}: ${_fmt(d.amount)} ₺ (${d.date})`;
    upcomingList.appendChild(li);
  });
}

/* ============= DETAY SAYFASI RENDERER (Edit/Sil dâhil) ============= */
function renderSalaryDetail() {
  const el = document.getElementById("salaryCurrent");
  if (el) el.textContent = _fmt(getSalary());
}

function renderExpenses() {
  const ul = document.getElementById("expenseList");
  const totalEl = document.getElementById("totalExpenseDetail");
  if (!ul) return;

  const arr = getExpenses();
  ul.innerHTML = "";
  let total = 0;

  arr.forEach((e, index) => {
    total += e.amount;
    const li = document.createElement("li");
    li.innerHTML = `<span>${e.note}: ${_fmt(e.amount)} ₺</span>`;

    const actions = document.createElement("div");
    const btnEdit = document.createElement("button");
    btnEdit.textContent = "Düzenle";
    btnEdit.onclick = () => {
      const nNote = prompt("Açıklama:", e.note);
      if (nNote === null) return;
      const nAmount = prompt("Tutar (₺):", String(e.amount));
      if (nAmount === null) return;
      const a = _num(nAmount);
      if (!nNote.trim() || a <= 0) return alert("Geçerli değer girin.");
      const cur = getExpenses();
      cur[index] = { note: nNote.trim(), amount: a };
      localStorage.setItem("giderler", JSON.stringify(cur));
      renderExpenses();
    };

    const btnDel = document.createElement("button");
    btnDel.textContent = "Sil";
    btnDel.onclick = () => {
      const cur = getExpenses();
      cur.splice(index, 1);
      localStorage.setItem("giderler", JSON.stringify(cur));
      renderExpenses();
    };

    actions.appendChild(btnEdit);
    actions.appendChild(btnDel);
    li.appendChild(actions);
    ul.appendChild(li);
  });

  if (totalEl) totalEl.textContent = _fmt(total);
}

function renderDebts() {
  const ul = document.getElementById("debtList");
  const totalEl = document.getElementById("totalDebtDetail");
  if (!ul) return;

  const arr = getDebts();
  arr.sort((a, b) => new Date(a.date) - new Date(b.date));

  ul.innerHTML = "";
  let total = 0;

  arr.forEach((d, index) => {
    total += d.amount;
    const li = document.createElement("li");
    li.innerHTML = `<span>${d.title}: ${_fmt(d.amount)} ₺ (${d.date})</span>`;

    const actions = document.createElement("div");
    const btnEdit = document.createElement("button");
    btnEdit.textContent = "Düzenle";
    btnEdit.onclick = () => {
      const nTitle = prompt("Başlık:", d.title);
      if (nTitle === null) return;
      const nAmount = prompt("Tutar (₺):", String(d.amount));
      if (nAmount === null) return;
      const nDate = prompt("Tarih (YYYY-MM-DD):", d.date);
      if (nDate === null) return;

      const a = _num(nAmount);
      if (!nTitle.trim() || a <= 0 || !nDate) return alert("Geçerli değer girin.");
      const cur = getDebts();
      cur[index] = { title: nTitle.trim(), amount: a, date: nDate };
      localStorage.setItem("borclar", JSON.stringify(cur));
      renderDebts();
    };

    const btnDel = document.createElement("button");
    btnDel.textContent = "Sil";
    btnDel.onclick = () => {
      const cur = getDebts();
      cur.splice(index, 1);
      localStorage.setItem("borclar", JSON.stringify(cur));
      renderDebts();
    };

    actions.appendChild(btnEdit);
    actions.appendChild(btnDel);
    li.appendChild(actions);
    ul.appendChild(li);
  });

  if (totalEl) totalEl.textContent = _fmt(total);
}

function renderIncoming() {
  const ul = document.getElementById("incomingList");
  const totalEl = document.getElementById("totalIncoming");
  if (!ul) return;

  const arr = getIncoming();
  arr.sort((a, b) => new Date(a.date) - new Date(b.date));

  ul.innerHTML = "";
  let total = 0;

  arr.forEach((e, index) => {
    total += e.amount;
    const li = document.createElement("li");
    li.innerHTML = `<span>${e.name}: ${_fmt(e.amount)} ₺ (${e.date})</span>`;

    const actions = document.createElement("div");
    const btnEdit = document.createElement("button");
    btnEdit.textContent = "Düzenle";
    btnEdit.onclick = () => {
      const nName = prompt("Kimden?", e.name);
      if (nName === null) return;
      const nAmount = prompt("Tutar (₺):", String(e.amount));
      if (nAmount === null) return;
      const nDate = prompt("Tarih (YYYY-MM-DD):", e.date);
      if (nDate === null) return;

      const a = _num(nAmount);
      if (!nName.trim() || a <= 0 || !nDate) return alert("Geçerli değer girin.");
      const cur = getIncoming();
      cur[index] = { name: nName.trim(), amount: a, date: nDate };
      localStorage.setItem("gelecekPara", JSON.stringify(cur));
      renderIncoming();
    };

    const btnDel = document.createElement("button");
    btnDel.textContent = "Sil";
    btnDel.onclick = () => {
      const cur = getIncoming();
      cur.splice(index, 1);
      localStorage.setItem("gelecekPara", JSON.stringify(cur));
      renderIncoming();
    };

    actions.appendChild(btnEdit);
    actions.appendChild(btnDel);
    li.appendChild(actions);
    ul.appendChild(li);
  });

  if (totalEl) totalEl.textContent = _fmt(total);
}

/* =========================== SAYFA YÜKLENİNCE =========================== */
window.onload = function () {
  // Ana sayfa
  updateIndex();
  renderPaydayCountdown();
  schedulePaydayAutoRefresh();

  // Detay sayfası
  renderSalaryDetail();
  renderExpenses();
  renderDebts();
  renderIncoming();
};