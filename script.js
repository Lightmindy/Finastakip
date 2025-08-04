function hesapla() {
  let maas = parseFloat(document.getElementById("maas").value);
  let gider = parseFloat(document.getElementById("gider").value);
  let altin = parseFloat(document.getElementById("altin").value);

  if (isNaN(maas)) maas = 0;
  if (isNaN(gider)) gider = 0;
  if (isNaN(altin)) altin = 0;

  let kalan = maas - gider;
  let altinDegeri = altin * 2450; // sabit gram fiyat

  document.getElementById("sonuc").innerText = "Kalan Bakiye: " + kalan + " TL";
  document.getElementById("altinDeger").innerText = "Altın Değeri: " + altinDegeri + " TL";
}