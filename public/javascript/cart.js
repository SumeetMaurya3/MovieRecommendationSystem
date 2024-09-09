
const cartsymbol = document.querySelector('.barrs');
cartsymbol.addEventListener('click', ()=>{
    console.log("works")
  // barrrs.classList.toggle('fa-rotate-9');
  barrrs.classList.toggle('fa-times');
  if(maincart.classList.contains('tBcg')){
      maincart.classList.remove('tBcg');
      car.classList.remove('showcart');

  }else{
  maincart.classList.add('tBcg');
  car.classList.add('showcart');}

  });
