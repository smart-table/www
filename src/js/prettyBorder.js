for (let f of Array.from(document.querySelectorAll('.framed'))){
  f.style.setProperty('--edgeLength', Math.floor(Math.random() * 100) + '%');
}