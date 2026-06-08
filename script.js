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

const textBindings = {
  heroEyebrow: ".hero .eyebrow",
  heroTitle: "#hero-title",
  heroLead: ".hero-lead",
  introKicker: ".intro .section-kicker",
  introTitle: ".intro h2",
  introText: ".intro-card",
  directionsKicker: ".directions .section-kicker",
  directionsTitle: "#directions-title",
  directionsLead: ".directions .section-heading > p:last-child",
  directionBaliTitle: ".direction-card:nth-child(1) h3",
  directionBaliText: ".direction-card:nth-child(1) > p",
  directionPhuketTitle: ".direction-card:nth-child(2) h3",
  directionPhuketText: ".direction-card:nth-child(2) > p",
  directionUaeTitle: ".direction-card:nth-child(3) h3",
  directionUaeText: ".direction-card:nth-child(3) > p",
  projectsKicker: ".projects .section-kicker",
  projectsTitle: "#projects-title",
  projectsLead: ".projects .section-heading.split > p",
  projectOneLocation: ".project-card:nth-child(1) .project-location",
  projectOneTitle: ".project-card:nth-child(1) h3",
  projectOneText: ".project-card:nth-child(1) .project-body p:not(.project-location):not(.vpn-note)",
  projectTwoLocation: ".project-card:nth-child(2) .project-location",
  projectTwoTitle: ".project-card:nth-child(2) h3",
  projectTwoText: ".project-card:nth-child(2) .project-body p:not(.project-location):not(.vpn-note)",
  projectFeaturedLocation: ".project-card-featured .project-location",
  projectFeaturedTitle: ".project-card-featured h3",
  projectFeaturedText: ".project-card-featured .project-body p:not(.project-location):not(.vpn-note)",
  platformKicker: ".platform .section-kicker",
  platformTitle: "#platform-title",
  platformTextOne: ".platform-copy p:nth-child(1)",
  platformTextTwo: ".platform-copy p:nth-child(2)",
  linksKicker: ".link-hub .section-kicker",
  linksTitle: "#links-title",
  linksLead: ".link-hub-copy p:last-child",
  linkTileOneTitle: ".link-tile:nth-child(1) strong",
  linkTileOneText: ".link-tile:nth-child(1) small",
  linkTileTwoTitle: ".link-tile:nth-child(2) strong",
  linkTileTwoText: ".link-tile:nth-child(2) small",
  linkTileThreeTitle: ".link-tile:nth-child(3) strong",
  linkTileThreeText: ".link-tile:nth-child(3) small",
  linkTileFourTitle: ".link-tile:nth-child(4) strong",
  linkTileFourText: ".link-tile:nth-child(4) small",
  benefitsKicker: ".benefits .section-kicker",
  benefitsTitle: "#benefits-title",
  benefitOneTitle: ".benefit-list article:nth-child(1) h3",
  benefitOneText: ".benefit-list article:nth-child(1) p",
  benefitTwoTitle: ".benefit-list article:nth-child(2) h3",
  benefitTwoText: ".benefit-list article:nth-child(2) p",
  benefitThreeTitle: ".benefit-list article:nth-child(3) h3",
  benefitThreeText: ".benefit-list article:nth-child(3) p",
  benefitFourTitle: ".benefit-list article:nth-child(4) h3",
  benefitFourText: ".benefit-list article:nth-child(4) p",
  teamKicker: ".team .section-kicker",
  teamTitle: "#team-title",
  teamLead: ".team .section-heading > p:last-child",
  personOneName: ".person-card:nth-child(1) h3",
  personOneRole: ".person-card:nth-child(1) .person-role",
  personOneText: ".person-card:nth-child(1) p:last-child",
  personTwoName: ".person-card:nth-child(2) h3",
  personTwoRole: ".person-card:nth-child(2) .person-role",
  personTwoText: ".person-card:nth-child(2) p:last-child",
  finalKicker: ".final-cta .section-kicker",
  finalTitle: ".final-cta h2",
  finalText: ".final-cta-inner > div:first-child p:not(.section-kicker)"
};

const imageBindings = {
  projectOneImage: ".project-card:nth-child(1) img",
  projectTwoImage: ".project-card:nth-child(2) img",
  personOneImage: ".person-card:nth-child(1) img",
  personTwoImage: ".person-card:nth-child(2) img"
};

const backgroundBindings = {
  heroBackground: {
    selector: ".hero-media",
    overlay: ""
  },
  featuredBackground: {
    selector: ".project-card-featured",
    overlay: "linear-gradient(150deg,rgba(255,106,0,0.94),rgba(28,28,27,0.96)),"
  },
  benefitsBackground: {
    selector: ".benefits-media",
    overlay: ""
  }
};

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element && typeof value === "string") {
    element.textContent = value;
  }
}

function setImage(selector, value) {
  const element = document.querySelector(selector);
  if (element instanceof HTMLImageElement && value) {
    element.src = value;
  }
}

function setBackground(binding, value) {
  const element = document.querySelector(binding.selector);
  if (element && value) {
    element.style.backgroundImage = `${binding.overlay}url("${value}")`;
  }
}

async function loadEditableContent() {
  try {
    const response = await fetch("./data/content.json", { cache: "no-store" });
    if (!response.ok) {
      return;
    }

    const content = await response.json();
    const text = content.text || {};
    const images = content.images || {};

    Object.entries(textBindings).forEach(([key, selector]) => setText(selector, text[key]));
    Object.entries(imageBindings).forEach(([key, selector]) => setImage(selector, images[key]));
    Object.entries(backgroundBindings).forEach(([key, binding]) => setBackground(binding, images[key]));

    if (text.vpnNotice) {
      document.querySelectorAll(".vpn-note").forEach((element) => {
        element.textContent = text.vpnNotice;
      });
    }
  } catch (error) {
    // Static fallback: keep the HTML content if editable content is unavailable.
  }
}

loadEditableContent();
