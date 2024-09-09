const imgDiv = document.querySelector('.profile-pic-div');
const img = document.querySelector('#photo');
const file = document.querySelector('#file');
const uploadBtn = document.querySelector('#uploadBtn');

//if user hover on img div 
imgDiv.addEventListener('mouseenter', function(){
    uploadBtn.style.display = "block";
});

//if we hover out from img div
imgDiv.addEventListener('mouseleave', function(){
    uploadBtn.style.display = "none";
});

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
// saving image in local Storage ends


// adding username login-id and password starts
function getAndUpdate(){
    console.log("Updating List...."); 
    Setusername = document.getElementById('UUsername').value;
    SetLoginId = document.getElementById('LLogin').value;
    Setpassword = document.getElementById('PPassword').value;
    if (localStorage.getItem('Signupvalues')==null){
        itemJsonArray = [];
        itemJsonArray.push([Setusername, SetLoginId , Setpassword]); //<- Array which holds all these objects
        localStorage.setItem('Signupvalues', JSON.stringify(itemJsonArray)); //<- Storing the array in local storage after making it a string
    }
    else{
        itemJsonArrayStr = localStorage.getItem('Signupvalues')
        itemJsonArray = JSON.parse(itemJsonArrayStr);
        itemJsonArray.push([Setusername, SetLoginId , Setpassword]);
        localStorage.setItem('Signupvalues', JSON.stringify(itemJsonArray))
    }
    update();
    
}

function update(){
    if (localStorage.getItem('Signupvalues')==null){
        itemJsonArray = []; 
        localStorage.setItem('Signupvalues', JSON.stringify(itemJsonArray))
    } 
    else{
        itemJsonArrayStr = localStorage.getItem('Signupvalues')
        itemJsonArray = JSON.parse(itemJsonArrayStr); 
    }
}
// adding username login-id and password ends
