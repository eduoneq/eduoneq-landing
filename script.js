const header = document.querySelector("[data-header]");
const revealTargets = document.querySelectorAll(".reveal");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 18);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealTargets.forEach((target) => revealObserver.observe(target));

if (window.lucide) {
  window.lucide.createIcons();
}
