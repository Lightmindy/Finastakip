window.onload = () => {
  document.getElementById('maas').value = localStorage.getItem('maas') || '';
  document.getElementById('harcama').value = localStorage.getItem('harcama') || '';
  document.getElementById('birikim').value = localStorage.getItem('birikim') || '';
  document.getElementById('altin').value = localStorage.getItem('altin') || '';
  document.getElementById('taksitler').value = localStorage.getItem('taksitler') || '';
};

function save() {
  localStorage.setItem('maas', document.getElementById('maas').value);
  localStorage.setItem('harcama', document.getElementById('harcama').value);
  localStorage.setItem('birikim', document.getElementById('birikim').value);
  localStorage.setItem('altin', document.getElementById('altin').value);
  localStorage.setItem('taksitler', document.getElementById('taksitler').value);
  alert("Veriler kaydedildi!");
}