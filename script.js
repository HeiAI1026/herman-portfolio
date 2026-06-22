const header = document.querySelector("[data-header]");
const hero = document.querySelector(".hero");
const splash = document.querySelector("[data-splash]");
const splashSkip = document.querySelector("[data-splash-skip]");
const revealTargets = document.querySelectorAll(".section-heading, .work-card, .about-visual, .about-text, .contact");

function setupSplash() {
  if (!splash) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let hasSeenSplash = false;

  try {
    hasSeenSplash = sessionStorage.getItem("hermanSplashSeen") === "true";
  } catch {
    hasSeenSplash = false;
  }

  function markSeen() {
    try {
      sessionStorage.setItem("hermanSplashSeen", "true");
    } catch {
      // Session storage can be unavailable in some local browser contexts.
    }
  }

  function closeSplash() {
    markSeen();
    document.body.classList.add("splash-leaving");
    document.body.classList.remove("splash-active");
    window.setTimeout(() => {
      splash.setAttribute("aria-hidden", "true");
      document.body.classList.remove("splash-leaving");
    }, 560);
  }

  if (hasSeenSplash || reduceMotion) {
    splash.setAttribute("aria-hidden", "true");
    return;
  }

  splash.setAttribute("aria-hidden", "false");
  document.body.classList.add("splash-active");
  splashSkip?.addEventListener("click", closeSplash);
  window.setTimeout(closeSplash, 1700);
}

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}

function setPointerVars(event) {
  if (!hero) {
    return;
  }

  const x = event.clientX / window.innerWidth - 0.5;
  const y = event.clientY / window.innerHeight - 0.5;
  hero.style.setProperty("--mx", x.toFixed(3));
  hero.style.setProperty("--my", y.toFixed(3));
}

function setupReveal() {
  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  revealTargets.forEach((target) => {
    target.classList.add("reveal");
    observer.observe(target);
  });
}

setupSplash();
updateHeader();
setupReveal();

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("pointermove", setPointerVars, { passive: true });
