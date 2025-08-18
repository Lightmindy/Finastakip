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

/* ================== ALTIN (CRUD + Fiyat API - sadece gram girişi) ================== */
(function GoldModule() {
  const LS_ITEMS = "altinlar";        // altın listesi
  const LS_PRICE = "goldUnitPrice";   // tekil gram fiyatı (API'den)

  // DOM
  const elPrice      = document.getElementById("goldPrice");
  const elInputGram  = document.getElementById("goldInput");
  const elList       = document.getElementById("goldList");
  const elTotalGram  = document.getElementById("totalGoldGram");
  const elTotalValue = document.getElementById("totalGoldValue");
  const elFetchBtn   = document.getElementById("fetchGoldBtn");
  const elInfo       = document.getElementById("goldApiInfo");

  if (!elList || !elTotalGram || !elTotalValue) return;

  // Durum
  let items = [];     // {id, gram}
  let unitPrice = 0;  // API'den gelecek

  // Utils
  const uid = () => Math.random().toString(36).slice(2, 9);
  const n = (v) => { const x = parseFloat(v); return Number.isFinite(x) ? x : 0; };
  const fmt = (v) => (Number(v || 0)).toLocaleString("tr-TR", { maximumFractionDigits: 2 });

  // ---- API yardımcıları ----
  // "2.496,50 ₺" -> 2496.50
  function normalizePrice(val) {
    if (val == null) return NaN;
    const s = String(val).replace(/[^\d.,]/g, "");
    const t = s.replace(/\./g, "").replace(",", ".");
    const num = parseFloat(t);
    return Number.isFinite(num) ? num : NaN;
  }
  // JSON içinden gram altın fiyatını esnek bul
  function extractGramGoldPrice(data) {
    if (!data || typeof data !== "object") return NaN;

    const direct = data["Gram Altın"] || data["gram altın"] || data["gram-altin"] || data["gram_altin"] || data["GA"];
    if (direct && typeof direct === "object") {
      const cand = direct.Alış ?? direct.Alis ?? direct.alis ?? direct.Satış ?? direct.Satis ?? direct.satis ?? direct.price ?? direct.fiyat;
      const p = normalizePrice(cand);
      if (p > 0) return p;
    }
    for (const [key, val] of Object.entries(data)) {
      const k = key.toLowerCase();
      if (k.includes("gram") && k.includes("alt")) {
        if (val && typeof val === "object") {
          const cand = val.Alış ?? val.Alis ?? val.alis ?? val.Satış ?? val.Satis ?? val.satis ?? val.price ?? val.fiyat;
          const p = normalizePrice(cand);
          if (p > 0) return p;
        } else {
          const p = normalizePrice(val);
          if (p > 0) return p;
        }
      }
    }
    const flat = normalizePrice(data.price ?? data.fiyat ?? data.gram ?? data.ga);
    if (flat > 0) return flat;
    return NaN;
  }
  function withTimeout(promise, ms = 8000) {
    return Promise.race([
      promise,
      new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))
    ]);
  }

  // Kaydet/Yükle
  function load() {
    const raw = JSON.parse(localStorage.getItem(LS_ITEMS)) || [];
    items = raw.map((it) => ({ id: it.id || uid(), gram: typeof it.gram === "number" ? it.gram : n(it.gram) }));
    unitPrice = n(localStorage.getItem(LS_PRICE));
    if (elPrice) elPrice.value = unitPrice ? String(unitPrice) : "";
  }
  function save() {
    localStorage.setItem(LS_ITEMS, JSON.stringify(items));
    localStorage.setItem(LS_PRICE, String(unitPrice || 0));
  }

  // Çizim
  function render() {
    elList.innerHTML = "";
    let sumG = 0, sumVal = 0;
    items.forEach((it) => {
      sumG += it.gram;
      sumVal += it.gram * (unitPrice || 0);
      const li = document.createElement("li");
      li.className = "gold-item"; li.dataset.id = it.id;
      const info = document.createElement("div");
      info.className = "gold-info";
      info.innerHTML = `<strong>${fmt(it.gram)} gr</strong>
                        <div class="muted">Değer: ${fmt(it.gram * (unitPrice || 0))} ₺</div>`;
      const actions = document.createElement("div");
      actions.className = "gold-actions";
      const btnEdit = document.createElement("button"); btnEdit.textContent = "Düzenle"; btnEdit.setAttribute("data-act","edit");
      const btnDel  = document.createElement("button"); btnDel.textContent  = "Sil";     btnDel.setAttribute("data-act","delete");
      actions.appendChild(btnEdit); actions.appendChild(btnDel);
      li.appendChild(info); li.appendChild(actions); elList.appendChild(li);
    });
    elTotalGram.textContent = fmt(sumG);
    elTotalValue.textContent = fmt(sumVal);
    if (elPrice) elPrice.value = unitPrice ? String(unitPrice) : "";
  }

  // İşlemler
  function addItem(gram) {
    const g = n(gram);
    if (g <= 0) { alert("Lütfen geçerli bir gram değeri girin."); return; }
    if (!unitPrice) { alert("Güncel gram fiyatı alınamadı. Lütfen 'Güncel Fiyatı Getir' tuşuna bas."); return; }
    items.push({ id: uid(), gram: g });
    save(); render();
  }
  function editItem(id) {
    const idx = items.findIndex((x) => x.id === id); if (idx === -1) return;
    const nv = prompt("Yeni gram değerini girin:", String(items[idx].gram)); if (nv === null) return;
    const g = n(nv); if (g <= 0) { alert("Geçerli bir gram değeri girin."); return; }
    items[idx].gram = g; save(); render();
  }
  function deleteItem(id) { items = items.filter((x) => x.id !== id); save(); render(); }

  // API: Güncel Gram Altın fiyatı
  async function fetchGoldPrice() {
    if (elInfo) elInfo.textContent = "Güncel fiyat alınıyor...";
    try {
      let price = NaN;

      // Kaynak 1: Truncgil
      try {
        const res1 = await withTimeout(fetch("https://finans.truncgil.com/v4/today.json"), 7000);
        const data1 = await res1.json();
        price = extractGramGoldPrice(data1);
      } catch (_) { /* yedek kaynağa geçilebilir */ }

      // (İstersen burada ikinci bir kaynak daha deneyebilirsin.)

      if (Number.isFinite(price) && price > 0) {
        unitPrice = price; save(); render();
        if (elInfo) elInfo.textContent = `Son güncelleme: ${new Date().toLocaleTimeString()} (${fmt(price)} ₺)`;
      } else {
        if (elInfo) elInfo.textContent = "Fiyat alınamadı.";
      }
    } catch (e) {
      console.error(e);
      if (elInfo) elInfo.textContent = "API hatası!";
    }
  }

  // Dışa açık: sadece gram girilir
  window.addGold = function () {
    const g = elInputGram?.value;
    addItem(g);
    if (elInputGram) elInputGram.value = "";
  };
  // Dışarıdan gerekirse yeniden çizim için
  window.displayGold = function () { render(); };

  // Olaylar
  elList.addEventListener("click", (e) => {
    const btn = e.target.closest("button"); if (!btn) return;
    const act = btn.getAttribute("data-act");
    const id  = btn.closest("li")?.dataset?.id; if (!id) return;
    if (act === "edit") editItem(id); else if (act === "delete") deleteItem(id);
  });
  elFetchBtn?.addEventListener("click", fetchGoldPrice);

  // Başlat
  load();
  render();
  // Sayfa açıldığında otomatik çek
  fetchGoldPrice();
  // Periyodik yenileme istersen aç:
  // setInterval(fetchGoldPrice, 30 * 60 * 1000);
})();

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

    if (typeof window.displayGold === "function") window.displayGold();
  }
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