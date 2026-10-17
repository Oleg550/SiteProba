// ======================================================
// ЗДАВ — ЗАБУВ
// Основний JavaScript сайту
const SITE_BUILD = "2026-10-17-clean";
// ======================================================


// ------------------------------------------------------
// 1. TELEGRAM
// ------------------------------------------------------

const TELEGRAM_USERNAME = "shlak0block";


// ------------------------------------------------------
// 2. ТИПИ РОБІТ І ЦІНИ
// ------------------------------------------------------

const typeData = {

  essay: {
    name: "Есе",
    min: 200,
    max: 500,
    pMin: 2,
    pMax: 15,
    uMin: 40,
    uMax: 90
  },

  abstract: {
    name: "Реферат",
    min: 200,
    max: 600,
    pMin: 5,
    pMax: 25,
    uMin: 40,
    uMax: 90
  },

  theses: {
    name: "Тези",
    min: 200,
    max: 500,
    pMin: 2,
    pMax: 10,
    uMin: 40,
    uMax: 90
  },

  report: {
    name: "Доповідь",
    min: 300,
    max: 900,
    pMin: 3,
    pMax: 15,
    uMin: 40,
    uMax: 90
  },

  article: {
    name: "Стаття",
    min: 400,
    max: 2000,
    pMin: 5,
    pMax: 25,
    uMin: 50,
    uMax: 95
  },

  presentation: {
    name: "Презентація",
    min: 250,
    max: 1000,
    pMin: 5,
    pMax: 30,
    uMin: 0,
    uMax: 0
  },

  business: {
    name: "Бізнес-план",
    min: 700,
    max: 2000,
    pMin: 15,
    pMax: 60,
    uMin: 40,
    uMax: 90
  },

  practical: {
    name: "Практична робота",
    min: 300,
    max: 1500,
    pMin: 5,
    pMax: 40,
    uMin: 40,
    uMax: 90
  },

  annotation: {
    name: "Анотація",
    min: 200,
    max: 500,
    pMin: 1,
    pMax: 8,
    uMin: 40,
    uMax: 90
  },

  explanatory: {
    name: "Пояснювальна записка",
    min: 1000,
    max: 4000,
    pMin: 15,
    pMax: 80,
    uMin: 40,
    uMax: 90
  },

  course: {
    name: "Курсова робота",
    min: 900,
    max: 2000,
    pMin: 20,
    pMax: 50,
    uMin: 50,
    uMax: 90
  },

  bachelor: {
    name: "Бакалаврська робота",
    min: 3500,
    max: null,
    pMin: 45,
    pMax: 100,
    uMin: 50,
    uMax: 95
  },

  diploma: {
    name: "Дипломна робота",
    min: 3500,
    max: null,
    pMin: 45,
    pMax: 110,
    uMin: 50,
    uMax: 95
  },

  master: {
    name: "Магістерська робота",
    min: 4000,
    max: null,
    pMin: 55,
    pMax: 120,
    uMin: 50,
    uMax: 95
  },

  dissertation: {
    name: "Дисертація",
    min: 20000,
    max: null,
    pMin: 100,
    pMax: 300,
    uMin: 60,
    uMax: 95
  }

};


// ------------------------------------------------------
// 3. КОЕФІЦІЄНТ ТЕРМІНОВОСТІ
// ------------------------------------------------------

const urgency = {
  3: 1.28,
  7: 1.14,
  14: 1.00,
  21: 0.96
};


// ------------------------------------------------------
// 4. ДОПОМІЖНІ ФУНКЦІЇ
// ------------------------------------------------------

const $ = selector => document.querySelector(selector);

const workType = $("#workType");
const field = $("#field");
const pages = $("#pages");
const uniqueness = $("#uniqueness");

const addons = [
  ...document.querySelectorAll(".addons input")
];


function round50(number) {
  return Math.round(number / 50) * 50;
}


function getDays() {

  const selected = document.querySelector(
    'input[name="days"]:checked'
  );

  return selected ? Number(selected.value) : 14;
}


// ------------------------------------------------------
// 5. ДІАПАЗОНИ СТОРІНОК ТА УНІКАЛЬНОСТІ
// ------------------------------------------------------

function setRanges() {

  const type = typeData[workType.value];

  // Сторінки

  pages.min = type.pMin;
  pages.max = type.pMax;

  if (
    Number(pages.value) < type.pMin ||
    Number(pages.value) > type.pMax
  ) {

    pages.value = Math.round(
      (type.pMin + type.pMax) / 2
    );
  }


  // Унікальність

  if (type.uMin === 0) {

    uniqueness.disabled = true;

    uniqueness.min = 0;
    uniqueness.max = 0;
    uniqueness.value = 0;

  } else {

    uniqueness.disabled = false;

    uniqueness.min = type.uMin;
    uniqueness.max = type.uMax;

    if (
      Number(uniqueness.value) < type.uMin ||
      Number(uniqueness.value) > type.uMax
    ) {

      uniqueness.value = Math.max(
        type.uMin,
        70
      );
    }
  }
}


// ------------------------------------------------------
// 6. КАЛЬКУЛЯТОР
// ------------------------------------------------------

function calculate() {

  const type = typeData[workType.value];

  const pageCount = Number(pages.value);

  const uniqueValue =
    Number(uniqueness.value);

  const selectedDays =
    getDays();

  const fieldCoefficient =
    Number(field.value);


  // Положення повзунка сторінок

  const pageRatio =
    (pageCount - type.pMin) /
    Math.max(
      1,
      type.pMax - type.pMin
    );


  // Положення повзунка унікальності

  const uniquenessRatio =
    type.uMin === 0
      ? 0
      : (
          uniqueValue - type.uMin
        ) /
        Math.max(
          1,
          type.uMax - type.uMin
        );


  // Додаткові послуги

  const selectedAddons = addons.filter(addon => addon.checked);

  const isDegreeWork = ["bachelor", "diploma", "master"].includes(workType.value);

  const addonTotal = selectedAddons.reduce((sum, addon) => {
    if (isDegreeWork && addon.dataset.name === "Презентація") return sum + 300;
    if (isDegreeWork && addon.dataset.name === "Доповідь до захисту") return sum + 200;
    return sum + Number(addon.value);
  }, 0);


  let basePrice;


  // --------------------------------------------------
  // РОБОТИ З МІНІМАЛЬНОЮ ТА МАКСИМАЛЬНОЮ ЦІНОЮ
  // --------------------------------------------------

  if (type.max !== null) {

    const complexity =
      0.72 * pageRatio +
      0.28 * uniquenessRatio;


    basePrice =
      type.min +
      (type.max - type.min) *
      complexity;


    basePrice *=
      fieldCoefficient *
      urgency[selectedDays];


    // Не нижче мінімальної ціни

    basePrice =
      Math.max(
        type.min,
        basePrice
      );


    // Не вище максимальної ціни

    basePrice =
      Math.min(
        type.max,
        basePrice
      );

  }


  // --------------------------------------------------
  // ВЕЛИКІ РОБОТИ БЕЗ ВЕРХНЬОЇ МЕЖІ
  // --------------------------------------------------

  else {

    const additionalRange =
      type.min *
      (
        workType.value ===
        "dissertation"
          ? 1.4
          : 1.15
      );


    basePrice =
      type.min +
      additionalRange *
      (
        0.68 * pageRatio +
        0.32 * uniquenessRatio
      );


    basePrice *=
      fieldCoefficient *
      urgency[selectedDays];


    basePrice =
      Math.max(
        type.min,
        basePrice
      );
  }


  // Округлення

  basePrice =
    round50(basePrice);


  // Додаткові послуги

  const total =
    basePrice +
    addonTotal;


  // Діапазон ціни

  const lowPrice =
    round50(total * 0.96);

  const highPrice =
    round50(total * 1.06);


  // --------------------------------------------------
  // ВИВЕДЕННЯ НА СТОРІНКУ
  // --------------------------------------------------

  $("#pagesValue").textContent =
    pageCount;


  $("#uniqueValue").textContent =
    type.uMin === 0
      ? "—"
      : uniqueValue;


  $("#summaryType").textContent =
    type.name;


  $("#summaryMeta").textContent =
    `${pageCount} стор. • ${
      type.uMin === 0
        ? "без параметра унікальності"
        : uniqueValue +
          "% унікальності"
    } • ${
      selectedDays === 21
        ? "21+ день"
        : selectedDays + " днів"
    }`;


  $("#price").textContent =
    `${lowPrice.toLocaleString("uk-UA")}–${highPrice.toLocaleString("uk-UA")} ₴`;


  if (type.max !== null) {

    $("#priceLimits").textContent =
      `${type.name}: базова ціна ${type.min.toLocaleString("uk-UA")}–${type.max.toLocaleString("uk-UA")} ₴`;

  } else {

    $("#priceLimits").textContent =
      `${type.name}: базова ціна від ${type.min.toLocaleString("uk-UA")} ₴`;
  }


  const discountBox = $("#degreeDiscount");

  if (discountBox) {
    const presentationDiscount = isDegreeWork && selectedAddons.some(addon => addon.dataset.name === "Презентація");
    const speechDiscount = isDegreeWork && selectedAddons.some(addon => addon.dataset.name === "Доповідь до захисту");

    if (presentationDiscount || speechDiscount) {
      discountBox.classList.add("show");
      discountBox.innerHTML = `🎁 <b>Знижка для кваліфікаційної роботи:</b> ${presentationDiscount ? "презентація — 300 ₴" : ""}${presentationDiscount && speechDiscount ? " · " : ""}${speechDiscount ? "доповідь — 200 ₴" : ""}`;
    } else {
      discountBox.classList.remove("show");
      discountBox.innerHTML = "";
    }
  }

  return {

    type,

    pageCount,

    uniqueValue,

    selectedDays,

    lowPrice,

    highPrice,

    fieldName:
      field.options[
        field.selectedIndex
      ].text,

    addons:
      selectedAddons.map(
        addon =>
          addon.dataset.name
      )
  };
}


// ------------------------------------------------------
// 7. ОНОВЛЕННЯ КАЛЬКУЛЯТОРА
// ------------------------------------------------------

workType.addEventListener(
  "change",
  () => {

    setRanges();

    calculate();
  }
);


$("#calcForm").addEventListener(
  "input",
  calculate
);


setRanges();

calculate();


// ------------------------------------------------------
// 8. МОДАЛЬНЕ ВІКНО
// ------------------------------------------------------

const modal =
  $("#orderModal");


function openModal() {

  const calculation =
    calculate();


  $("#orderSummary").innerHTML = `

    <b>
      ${calculation.type.name}
    </b>

    · ${calculation.fieldName}

    <br>

    ${calculation.pageCount} стор.

    ·

    ${
      calculation.type.uMin === 0
        ? "—"
        : calculation.uniqueValue +
          "% унікальності"
    }

    ·

    <b>
      ${calculation.lowPrice.toLocaleString("uk-UA")}–${calculation.highPrice.toLocaleString("uk-UA")} ₴
    </b>
  `;


  modal.classList.add("open");

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow =
    "hidden";
}


function closeModal() {

  modal.classList.remove(
    "open"
  );

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow =
    "";
}


$("#openOrder").addEventListener(
  "click",
  openModal
);


document
  .querySelectorAll("[data-close]")
  .forEach(element => {

    element.addEventListener(
      "click",
      closeModal
    );
  });


document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {

      closeModal();
    }
  }
);


// ------------------------------------------------------
// 9. ФОРМУВАННЯ ЗАЯВКИ
// ------------------------------------------------------

function createOrderText() {

  const calculation =
    calculate();


  const extra =
    calculation.addons.length
      ? calculation.addons.join(", ")
      : "не обрано";


  const name =
    $("#clientName").value.trim();


  const deadline =
    $("#deadline").value;


  const topic =
    $("#topic").value.trim();


  const university =
    $("#university").value.trim();


  const comment =
    $("#comment").value.trim();


  return `Вітаю! Хочу уточнити замовлення.

📌 Тип роботи: ${calculation.type.name}
📚 Предмет: ${calculation.fieldName}
📝 Тема: ${topic}
📄 Обсяг: ${calculation.pageCount} сторінок
🔎 Унікальність: ${
  calculation.type.uMin === 0
    ? "не застосовується"
    : calculation.uniqueValue + "%"
}
⏱ Термін: ${
  calculation.selectedDays === 21
    ? "21+ день"
    : calculation.selectedDays + " днів"
}
📅 Дедлайн: ${deadline}
➕ Додатково: ${extra}

💰 Попередня вартість:
${calculation.lowPrice.toLocaleString("uk-UA")}–${calculation.highPrice.toLocaleString("uk-UA")} ₴

👤 Ім’я: ${name}${
  university
    ? "\n🏫 Навчальний заклад: " +
      university
    : ""
}${
  comment
    ? "\n💬 Коментар: " +
      comment
    : ""
}

Методичку та інші файли надішлю в Telegram.`;
}


// ------------------------------------------------------
// 10. ВІДПРАВЛЕННЯ / TELEGRAM
// ------------------------------------------------------

$("#orderForm").addEventListener("submit", async event => {
  event.preventDefault();
  const text=createOrderText();
  try{await navigator.clipboard.writeText(text);}catch(error){console.log("Буфер обміну недоступний:",error);}
  const telegramURL=`https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(text)}`;
  window.location.href=telegramURL;
});

// ------------------------------------------------------
// 11. ПЛАВАЮЧА КНОПКА TELEGRAM
// ------------------------------------------------------

const telegramFloat =
  $("#telegramFloat");


if (telegramFloat) {

  telegramFloat.href =
    `https://t.me/${TELEGRAM_USERNAME}`;

  telegramFloat.target =
    "_blank";
}


// ------------------------------------------------------
// 12. МОБІЛЬНЕ МЕНЮ
// ------------------------------------------------------

const menuButton =
  $(".menu-btn");


const mobileNav =
  $(".mobile-nav");


if (
  menuButton &&
  mobileNav
) {

  menuButton.addEventListener(
    "click",
    () => {

      mobileNav.classList.toggle(
        "open"
      );
    }
  );


  document
    .querySelectorAll(
      ".mobile-nav a"
    )
    .forEach(link => {

      link.addEventListener(
        "click",
        () => {

          mobileNav.classList.remove(
            "open"
          );
        }
      );
    });
}


// ------------------------------------------------------
// 13. МІНІМАЛЬНА ДАТА ДЕДЛАЙНУ
// ------------------------------------------------------

const deadlineInput =
  $("#deadline");


if (deadlineInput) {

  const today =
    new Date();


  today.setMinutes(
    today.getMinutes() -
    today.getTimezoneOffset()
  );


  deadlineInput.min =
    today
      .toISOString()
      .split("T")[0];
}


// ------------------------------------------------------
// 14. АНІМАЦІЯ БЛОКІВ
// ------------------------------------------------------

const observer =
  new IntersectionObserver(

    entries => {

      entries.forEach(
        entry => {

          if (
            entry.isIntersecting
          ) {

            entry.target.animate(

              [
                {
                  opacity: 0,
                  transform:
                    "translateY(18px)"
                },

                {
                  opacity: 1,
                  transform:
                    "translateY(0)"
                }
              ],

              {
                duration: 450,
                easing: "ease-out",
                fill: "both"
              }
            );


            observer.unobserve(
              entry.target
            );
          }
        }
      );
    },

    {
      threshold: 0.08
    }
  );


document
  .querySelectorAll(
    ".service-card, " +
    ".steps > div, " +
    ".examples-grid article, " +
    ".review-grid blockquote"
  )
  .forEach(
    element => {

      observer.observe(
        element
      );
    }
  );