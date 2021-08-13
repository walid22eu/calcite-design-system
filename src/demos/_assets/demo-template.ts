const toggleDir = (): void => {
  document.dir = document.dir === "rtl" ? "ltr" : "rtl";
};

const toggleTheme = (): void => {
  document.body.classList.toggle("calcite-theme-dark");
};

const loadDemoToggles = () => {
  document.querySelectorAll("h1:not(#demo-heading)").forEach((h1) => h1.remove());
  document.getElementById("demo-heading").textContent = document.title;
  document.getElementById("toggle-dir").addEventListener("calciteSwitchChange", toggleDir);
  document.getElementById("toggle-theme").addEventListener("calciteSwitchChange", toggleTheme);
};

document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", loadDemoToggles) : loadDemoToggles();
