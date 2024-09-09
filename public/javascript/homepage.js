//selectors
const cartsymbol = document.querySelector('.barrs');
const FindMovieButton = document.querySelector('.findmov');
const HomeButton = document.querySelector('.Homebut');
const loginButton = document.querySelector('.login');
const AddMovies = document.querySelector('.addmov')
const img = document.querySelector('#pho');
const about = document.querySelector(".about");

//Event listeners
cartsymbol.addEventListener('click', opencart)
FindMovieButton.addEventListener('click', changePage1);
HomeButton.addEventListener('click', changePage2);
loginButton.addEventListener('click', OpenLoginPage);
AddMovies.addEventListener('click', openaddmovies);
about.addEventListener('click', openabout);

// cart open and close
function opencart() {
    // barrrs.classList.toggle('fa-rotate-9');
    console.log("kaam")
    barrrs.classList.toggle('fa-times');
    if(maincart.classList.contains('tBcg')){
        maincart.classList.remove('tBcg');
        car.classList.remove('showcart');

    }else{
    maincart.classList.add('tBcg');
    car.classList.add('showcart');}

    };
//Events(Functions)
function changePage1(){
    window.open('show', "_self");
}
function changePage2(){
    window.open('/', "_self");
}
function OpenLoginPage(){
    window.open('/mrslogin', "_self");
}
function openaddmovies(){
  window.open('addMovies.html', "_self");
}
function openabout(){
  window.open('aboutus.html', "_self");
}

file.addEventListener('change', handleFileSelect, false);
// saving image in local storage starts
var imagesObject = [];

function handleFileSelect(evt) {
    var files = evt.target.files; 
    for (var i = 0, f; f = files[i]; i++) {
      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }
      var reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = function(e) {
            img.setAttribute('src', reader.result);
          // displayImgData(e.target.result)
          addImage(e.target.result);
      };
      reader.readAsDataURL(f);
    }
}

function loadFromLocalStorage(){
  var images = JSON.parse(localStorage.getItem("images"))

  if(images && images.length > 0){
    imagesObject = images;
    
    // displayNumberOfImgs();
    images.forEach(displayImgData);
  }
}
function addImage(imgData){
  imagesObject.push(imgData);
  if(imagesObject.length > 1){
    imagesObject[0]=imagesObject[1];
    while(imagesObject.length != 1){
    imagesObject.shift();}
  }
  localStorage.setItem("images", JSON.stringify(imagesObject));
}

function displayImgData(imgData){
  img.setAttribute('src', imgData);
}
loadFromLocalStorage();


