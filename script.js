window.onload = () => {
  document.getElementById("maas").value = localStorage.getItem("maas") || "";
  document.getElementById("harcama").value = localStorage.getItem("harcama") || "";
  document.getElementById("altin").value = localStorage.getItem("altin") || "";
  document.getElementById("borc").value = localStorage.getItem("borc") || "";
  hesaplaKalan();
  borclariGoster();
};

function verileriKaydet() {
  localStorage.setItem("maas", document.getElementById("maas").value);
  localStorage.setItem("harcama", document.getElementById("harcama").value);
  localStorage.setItem("altin", document.getElementById("altin").value);
  localStorage.setItem("borc", document.getElementById("borc").value);
  hesaplaKalan();
  borclariGoster();
  alert("Veriler kaydedildi!");
}

function hesaplaKalan() {
  const maas = parseFloat(document.getElementById("maas").value) || 0;
  const harcama = parseFloat(document.getElementById("harcama").value) || 0;
  const kalan = maas - harcama;
  document.getElementById("kalan").value = kalan.toFixed(2) + " ₺";
}

function borclariGoster() {
  const borcAlani = document.getElementById("borc").value;
  const borclar = borcAlani.split("\n");
  const liste = document.getElementById("borcGoster");
  liste.innerHTML = "";
  borclar.forEach(b => {
    if (b.trim() !== "") {
      const li = document.createElement("li");
      li.textContent = b;
      liste.appendChild(li);
    }
  });
}