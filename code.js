// code.js
document.querySelectorAll(".subpage").forEach(button => {
    button.addEventListener("click", () => {
        const page = button.getAttribute("data-page");
        console.log(`Navigating to ${page} page...`);
        // Future: Implement navigation to subpages (e.g., window.location.href = `/${page}`);
    });
});

const mynode = document.createElement("div");
mynode.id = "work1_intro";
mynode.innerHTML = "The work is an exhibition";
mynode.style.color = "#1a73e8";

let isToggled = false;
mynode.addEventListener("click", () => {
    isToggled = !isToggled;
    mynode.innerHTML = isToggled
        ? "Thank you for your interest in my work!"
        : "The work is an exhibition";
});

document.querySelector("#my_work1").appendChild(mynode);