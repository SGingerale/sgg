document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const navBar = document.querySelector(".nav-bar");

  if (hamburger && navBar) {
    hamburger.addEventListener("click", function () {
      navBar.classList.toggle("open");
    });
  }
});
