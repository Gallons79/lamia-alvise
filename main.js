const hamburger = document.getElementById("hamburgerBtn");
const mobileNav = document.getElementById("mobileNav");

hamburger.addEventListener("click", () => {
  mobileNav.classList.toggle("show");
});

// Language selector
let currentLang = localStorage.getItem("lang") || "en";

function applyTranslations(lang) {
  fetch("translations.json")
    .then(res => res.json())
    .then(data => {
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        const text = key.split(".").reduce((o, i) => o[i], data[lang]);
        if (text) el.textContent = text;
      });
    });
}

applyTranslations(currentLang);

// Toggle logic
document.querySelectorAll(".lang-btn").forEach(btn => {
  if (btn.dataset.lang === currentLang) {
    btn.classList.add("active");
  }

  btn.addEventListener("click", () => {
    const lang = btn.dataset.lang;

    // Update active state
    document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Save preference
    localStorage.setItem("lang", lang);

    // Apply translations
    applyTranslations(lang);
  });
});


