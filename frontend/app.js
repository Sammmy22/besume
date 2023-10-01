const userData = JSON.parse(localStorage.getItem("user"));

if (!userData) {
  window.location.href = "login.html";
}

document.querySelector(".log-out").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

const shrink_btn = document.querySelector(".shrink-btn");
const search = document.querySelector(".search");
const sidebar_links = document.querySelectorAll(".sidebar-links a");
const active_tab = document.querySelector(".active-tab");
const shortcuts = document.querySelector(".sidebar-links h4");
const tooltip_elements = document.querySelectorAll(".tooltip-element");
const content = document.querySelectorAll(".content");
let activeIndex;

const mainButton = document.querySelector("#portfolio");
const editButton = document.querySelector("#edit");

mainButton.addEventListener("click", () => {
  for (let i = 0; i < content.length; i++) {
    content[i].classList.add("hidden");
    document.querySelector("#main").classList.remove("hidden");
  }
});

editButton.addEventListener("click", () => {
  for (let i = 0; i < content.length; i++) {
    content[i].classList.add("hidden");
    document.querySelector("#edit-page").classList.remove("hidden");
  }
});

shrink_btn.addEventListener("click", () => {
  document.body.classList.toggle("shrink");
  setTimeout(moveActiveTab, 400);

  shrink_btn.classList.add("hovered");

  setTimeout(() => {
    shrink_btn.classList.remove("hovered");
  }, 500);
});

search.addEventListener("click", () => {
  document.body.classList.remove("shrink");
  search.lastElementChild.focus();
});

function moveActiveTab() {
  let topPosition = activeIndex * 58 + 2.5;

  if (activeIndex > 3) {
    topPosition += shortcuts.clientHeight;
  }

  active_tab.style.top = `${topPosition}px`;
}

function changeLink() {
  sidebar_links.forEach((sideLink) => sideLink.classList.remove("active"));
  this.classList.add("active");

  activeIndex = this.dataset.active;

  moveActiveTab();
}

sidebar_links.forEach((link) => link.addEventListener("click", changeLink));

function showTooltip() {
  let tooltip = this.parentNode.lastElementChild;
  let spans = tooltip.children;
  let tooltipIndex = this.dataset.tooltip;

  Array.from(spans).forEach((sp) => sp.classList.remove("show"));
  spans[tooltipIndex].classList.add("show");

  tooltip.style.top = `${(100 / (spans.length * 2)) * (tooltipIndex * 2 + 1)}%`;
}

tooltip_elements.forEach((elem) => {
  elem.addEventListener("mouseover", showTooltip);
});

document.querySelector("#user-name").innerHTML = userData.name;
document.querySelector("#d-qual").innerHTML = userData.qualification
  ? userData.qualification
  : "please enter qualification";

document.querySelector("#d-status").innerHTML = userData.status
  ? userData.status
  : "please enter status";

document.querySelector("#d-name").innerHTML =
  userData.name +
  `&nbsp;<a target="_blank" style="color: #000;" href=${userData.githubProfile}>
  <i class="bx bxl-github"></i>
  </a>
  `;

document.querySelector("#d-email").innerHTML = userData.email;

const skills = userData.skills.split(",");
const achievements = userData.achievements.split(",");
const projects = userData.projects.split(",");

document.querySelector("#d-skills").innerHTML =
  userData.skills != null
    ? `<ul>${skills.map((s) => `<li>${s.trim()}</li>`).join("")}</ul>`
    : "<p>please enter skills</p>";

document.querySelector("#d-achievements").innerHTML = userData.achievements
  ? `<ul>${achievements.map((a) => `<li>${a.trim()}</li>`).join("")}</ul>`
  : "<p>please enter achievements</p>";

document.querySelector("#d-projects").innerHTML = userData.projects
  ? `<ul>${projects
      .map(
        (p) => `<li><a target="_blank" href=${p.trim()}>${p.trim()}</a></li>`
      )
      .join("")}</ul>`
  : "please enter projects";

document.querySelector("#d-about-text").innerHTML = userData.about
  ? userData.about
  : "please enter about";
