const notes = {
  guby: {
    tag: "Губы",
    title: "Хочется объём, но чтобы знакомые не спрашивали «что сделала».",
    text: "В кабинете есть контурная пластика и «губы Моники». Препарат и объём — после осмотра, не из сторис. Если ткань тонкая или отёк склонен держаться — скажем сразу.",
    href: "https://wa.me/79195800927?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%2C%20%D1%85%D0%BE%D1%87%D1%83%20%D0%BE%D0%B1%D1%81%D1%83%D0%B4%D0%B8%D1%82%D1%8C%20%D0%B3%D1%83%D0%B1%D1%8B",
    cta: "Написать про губы",
  },
  glaza: {
    tag: "Глаза и плотность",
    title: "Кожа стала тоньше. Филлер сюда часто ни к чему.",
    text: "Жанна отдельно пишет про инъекционный коллаген: это не «надуть», а про плотность и рельеф. На схеме — периорбитальная зона, в жизни решение будет после осмотра. Есть канюльные техники и полинуклеотиды.",
    href: "https://wa.me/79195800927?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%2C%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D1%83%D0%B5%D1%82%20%D0%BF%D0%BB%D0%BE%D1%82%D0%BD%D0%BE%D1%81%D1%82%D1%8C%20%D0%BA%D0%BE%D0%B6%D0%B8",
    cta: "Написать про кожу",
  },
  oval: {
    tag: "Овал",
    title: "Подбородок, брыли, линия, которая не слушается спортзала.",
    text: "Для этого в списке есть липолитики, в том числе D2S, и SMAS. Курс обычно не из одной процедуры. Сначала смотрят, подходит ли метод именно вам — так написано в её посте.",
    href: "https://wa.me/79195800927?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%2C%20%D1%85%D0%BE%D1%87%D1%83%20%D0%BE%D0%B1%D1%81%D1%83%D0%B4%D0%B8%D1%82%D1%8C%20%D0%BE%D0%B2%D0%B0%D0%BB%20%D0%BB%D0%B8%D1%86%D0%B0",
    cta: "Написать про овал",
  },
  telo: {
    tag: "Тело",
    title: "Живот, бока, бёдра, руки — точечно, не «похудеть целиком».",
    text: "В открытых карточках: липолитики, Liposonix, SMAS тела. В отзывах пишут про Liposonix. Это не замена питанию. Есть противопоказания.",
    href: "https://wa.me/79195800927?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%2C%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D1%83%D0%B5%D1%82%20%D0%BA%D0%BE%D1%80%D1%80%D0%B5%D0%BA%D1%86%D0%B8%D1%8F%20%D1%82%D0%B5%D0%BB%D0%B0",
    cta: "Написать про тело",
  },
  zuby: {
    tag: "Зубы",
    title: "Отбеливание как отдельная история, не стоматология.",
    text: "В группе: от 1 790 ₽. В записи три комплекса — экспресс, стандарт и VIP. Это косметическая процедура. Если есть кариес или чувствительность, лучше сказать сразу.",
    href: "https://wa.me/79195800927?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%2C%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D1%83%D0%B5%D1%82%20%D0%BE%D1%82%D0%B1%D0%B5%D0%BB%D0%B8%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5",
    cta: "Написать про отбеливание",
  },
};

const noteRoot = document.querySelector("#zone-note");
const buttons = [...document.querySelectorAll(".zone")];
const paths = [...document.querySelectorAll(".face__zone")];

function showZone(id) {
  const item = notes[id];
  if (!item || !noteRoot) return;

  buttons.forEach((btn) => {
    const on = btn.dataset.zone === id;
    btn.classList.toggle("is-on", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  });

  paths.forEach((node) => {
    node.classList.toggle("is-on", node.dataset.zone === id);
  });

  noteRoot.innerHTML = `
    <p class="note__tag">${item.tag}</p>
    <h3>${item.title}</h3>
    <p>${item.text}</p>
    <a class="btn btn--copper" href="${item.href}">${item.cta}</a>
  `;
}

buttons.forEach((btn) => {
  btn.addEventListener("click", () => showZone(btn.dataset.zone));
});

paths.forEach((node) => {
  node.style.cursor = "pointer";
  node.addEventListener("click", () => showZone(node.dataset.zone));
});

const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav__toggle");
if (nav && toggle) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
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

showZone("guby");
