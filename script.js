const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const sideMenu = document.querySelector("[data-side-menu]");
const backdrop = document.querySelector("[data-menu-backdrop]");
const closeButtons = document.querySelectorAll("[data-menu-close]");

function syncHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
}

function closeMenu() {
  sideMenu?.classList.remove("is-open");
  backdrop?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  menuButton?.setAttribute("aria-expanded", "false");
  sideMenu?.setAttribute("aria-hidden", "true");
}

function openMenu() {
  sideMenu?.classList.add("is-open");
  backdrop?.classList.add("is-open");
  document.body.classList.add("menu-open");
  menuButton?.setAttribute("aria-expanded", "true");
  sideMenu?.setAttribute("aria-hidden", "false");
}

menuButton?.addEventListener("click", () => {
  if (sideMenu?.classList.contains("is-open")) {
    closeMenu();
  } else {
    openMenu();
  }
});

sideMenu?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    closeMenu();
  }
});

backdrop?.addEventListener("click", closeMenu);
closeButtons.forEach((button) => button.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

function settleHashScroll() {
  if (!window.location.hash) {
    return;
  }

  const target = document.querySelector(window.location.hash);

  if (target) {
    target.scrollIntoView({ block: "start" });
  }
}

window.addEventListener("scroll", syncHeader, { passive: true });
window.addEventListener("load", () => {
  [120, 520, 1000].forEach((delay) => window.setTimeout(settleHashScroll, delay));
});
window.addEventListener("hashchange", settleHashScroll);

syncHeader();
