var title = document.querySelector("h1");
title.innerHTML = "This is the title from code.js";

var button = document.querySelector("button");

button.addEventListener("click", myfunction);

function myfunction(){
    alert("Let me tell you more about myself!")
}