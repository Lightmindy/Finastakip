/* =================== MAAŞ / GİDER / BORÇ / GELECEK PARA =================== */
// ---------- MAAŞ ----------
function saveSalary() {
  const salary = parseFloat(document.getElementById("salaryInput")?.value);
  if (!isNaN(salary)) {
    localStorage.setItem("maas", salary);
    alert("Maaş kaydedildi!");
  }
}
function getSalary() { return parseFloat(localStorage.getItem("maas")) || 0; }

// ---------- GİDER ----------
function addExpense() {
  const note = document.getElementById("expenseNote")?.value;
  const amount = parseFloat(document.getElementById("expenseAmount")?.value);
  if (!note || isNaN(amount)) { alert("Lütfen açıklama ve tutar girin."); return; }
  const expenses = JSON.parse(localStorage.getItem("giderler")) || [];
  expenses.push({ note, amount });
  localStorage.setItem("giderler", JSON.stringify(expenses));
  alert("Gider eklendi!");
}
function getExpenses() { return JSON.parse(localStorage.getItem("giderler")) || []; }

// ---------- BORÇ ----------
function addDebt() {
  const title = document.getElementById("debtTitle")?.value;
  const amount = parseFloat(document.getElementById("debtAmount")?.value);
  const date = document.getElementById("debtDate")?.value;
  if (!title || isNaN(amount) || !date) { alert("Tüm alanları doldurun."); return; }
  const debts = JSON.parse(localStorage.getItem("borclar")) || [];
  debts.push({ title, amount, date });
  localStorage.setItem("borclar", JSON.stringify(debts));
  alert("Borç eklendi!");
}
function getDebts() { return JSON.parse(localStorage.getItem("borclar")) || []; }

// ---------- VERDİĞİM BORÇ ----------
function addIncoming() {
  const name = document.getElementById("lenderName")?.value;
  const amount = parseFloat(document.getElementById("lenderAmount")?.value);
  const date = document.getElementById("lenderDate")?.value;
  if (!name || isNaN(amount) || !date) { alert("Tüm alanları doldurun."); return; }
  const list = JSON.parse(localStorage.getItem("gelecekPara")) || [];
  list.push({ name, amount, date });
  localStorage.setItem("gelecekPara", JSON.stringify(list));
  alert("Gelecek para kaydedildi!");
}
function getIncoming() { return JSON.parse(localStorage.getItem("gelecekPara")) || []; }

/* ============================= ALTIN MODÜLÜ ============================== */
/*
  - Kayıt yapısı: { id, gram, price }
  - Ekle: goldInput (gram) + goldPrice (fiyat) kullanır
  - Düzenle: hem gram hem fiyatı prompt ile günceller
  - Sil: listedeki öğeyi kaldırır
  - Kalıcılık: localStorage('altinlar')
*/
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
  const num = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };
  const fmt = (v) => (Number(v || 0)).toLocaleString("tr-TR", { maximumFractionDigits: 2 });

  // Load/Save
  function load(){
    // Eski format (sadece gram) kullandıysan dönüştür
    const raw = JSON.parse(localStorage.getItem(LS_KEY)) || [];
    items = raw.map(it => {
      if (typeof it === "object" && ("gram" in it)) {
        return { id: it.id || uid(), gram: num(it.gram), price: num(it.price) };
      }
      return { id: uid(), gram: 0, price: 0 };
    });

    const lastPrice = num(localStorage.getItem(LS_PRICE));
    if (elPrice) elPrice.value = lastPrice ? String(lastPrice) : "";
  }
  function save(){
    localStorage.setItem(LS_KEY, JSON.stringify(items));
    // Son kullanılan fiyatı da saklayalım (yeni eklemelerde varsayılan olsun)
    const p = num(elPrice?.value);
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
        <strong>${fmt(it.gram)} gr</strong>
        <div class="muted">@ ${fmt(it.price)} ₺ • Değer: ${fmt(it.gram * it.price)} ₺</div>
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

    elTotG.textContent = fmt(sumG);
    elTotV.textContent = fmt(sumV);
  }

  // CRUD
  function addItem(){
    const g = num(elGram?.value);
    const p = num(elPrice?.value);
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
    const g = num(newGram);
    if (g <= 0) { alert("Geçerli bir gram değeri girin."); return; }

    const newPrice = prompt("Yeni gram fiyatı (₺):", String(it.price));
    if (newPrice === null) return;
    const p = num(newPrice);
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

  // Fiyat inputunu değiştikçe saklayalım (yeni kayıtlar için varsayılan)
  elPrice?.addEventListener("input", () => {
    localStorage.setItem(LS_PRICE, String(num(elPrice.value) || 0));
  });

  // Init
  load();
  render();
})();

/* ================== ANA SAYFA ÖZETLERİNİ GÜNCELLE ================== */
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
    li.textContent = `${d.title}: ${d.amount}₺ (${d.date})`;
    upcomingList.appendChild(li);
  });
}

/* =========================== SAYFA YÜKLENİNCE =========================== */
window.onload = function () {
  updateIndex();
  // (Detay sayfası varsa onun yükleyicisini burada çağırabilirsin)
};