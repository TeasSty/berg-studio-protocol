const cases = [
  {
    label: "Губы",
    caption: "Контурная пластика / «губы Моники» — объём подбирается после осмотра.",
  },
  {
    label: "Кожа",
    caption: "Биоревитализация, коллаген, полинуклеотиды — про плотность и тон, не про «надуть».",
  },
  {
    label: "Овал",
    caption: "Липолитики, SMAS, RF — зоны и курс после консультации. Есть противопоказания.",
  },
];

const nav = document.querySelector(".nav");
const burger = document.querySelector(".nav__burger");

burger?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", open ? "true" : "false");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    burger?.setAttribute("aria-expanded", "false");
  });
});

const compare = document.querySelector("[data-compare]");
if (compare) {
  const before = compare.querySelector(".compare__layer--before");
  const handle = compare.querySelector(".compare__handle");
  const range = compare.querySelector(".compare__range");
  const caption = compare.querySelector("[data-caption]");
  const tabs = [...compare.querySelectorAll("[data-case]")];

  const setPos = (value) => {
    const pos = `${value}%`;
    before.style.setProperty("--pos", pos);
    handle.style.setProperty("--pos", pos);
    range.value = String(value);
  };

  range?.addEventListener("input", (event) => {
    setPos(event.target.value);
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const index = Number(tab.dataset.case);
      tabs.forEach((item) => {
        const on = item === tab;
        item.classList.toggle("is-active", on);
        item.setAttribute("aria-selected", on ? "true" : "false");
      });
      if (caption && cases[index]) {
        caption.textContent = cases[index].caption;
      }
      setPos(52);
    });
  });
}

const form = document.querySelector("#lead");
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const contact = String(data.get("contact") || "").trim();
  const about = String(data.get("about") || "").trim();
  const text = `Здравствуйте, это ${name}. Связь: ${contact}. Запрос: ${about}`;
  window.location.href = `https://wa.me/79195800927?text=${encodeURIComponent(text)}`;
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion) {
  const targets = document.querySelectorAll(
    ".strip, .voices__grid blockquote, .flow__list li, .results__head, .compare",
  );
  targets.forEach((node) => node.classList.add("reveal"));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
  );
  targets.forEach((node) => observer.observe(node));

  const startOrb = () => {
    import("./orb.js")
      .then(({ initScrollOrb }) => initScrollOrb())
      .catch(() => {
        /* keep CSS fallback */
      });
  };

  if ("requestIdleCallback" in window) {
    requestIdleCallback(startOrb, { timeout: 400 });
  } else {
    setTimeout(startOrb, 80);
  }
}
