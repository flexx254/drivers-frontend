const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const icon = menuToggle.querySelector("i");

menuToggle.addEventListener("click", () => {
  const open = navMenu.classList.toggle("active");
  icon.className = open ? "fas fa-times" : "fas fa-bars";
});


document.querySelectorAll(".inline-toggle").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const moreText = btn.previousElementSibling;
    const open = moreText.style.display === "inline";

    moreText.style.display = open ? "none" : "inline";
    btn.textContent = open ? "see more" : "see less";
  });
});


window.addEventListener("load", () => {
  const loader = document.getElementById("page-loader");

  if (loader) {
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";

    setTimeout(() => {
      loader.remove();
    }, 300);
  }
});



/* LOGIN DROPDOWN */
const loginToggle = document.getElementById("loginToggle");
const loginMenu = document.getElementById("loginMenu");

loginToggle.addEventListener("click", () => {
  loginMenu.classList.toggle("show");
});

/* CLOSE WHEN CLICKING OUTSIDE */
document.addEventListener("click", (e) => {
  if (!loginToggle.contains(e.target) && !loginMenu.contains(e.target)) {
    loginMenu.classList.remove("show");
  }
});



window.addEventListener("load", function () {

fetch("https://drivers-backend-4spp.onrender.com/wake-render")
.catch(error => console.log("Wake request sent"));

});
     
