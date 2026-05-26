const hamburger = document.getElementById("hamburgerBtn");
const mobileNav = document.getElementById("mobileNav");

hamburger.addEventListener("click", () => {
  mobileNav.classList.toggle("show");
  hamburger.classList.toggle("active");
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

// AUTO-GALLERY LOADER
const galleryContainer = document.getElementById("autoGallery");

if (galleryContainer) {
  fetch("images/gallery/gallery.json")
    .then(response => response.json())
    .then(data => {
      data.photos.forEach(photo => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("square-photo");

        const img = document.createElement("img");
        img.src = `images/gallery/${photo}`;
        img.alt = "Gallery photo";

        wrapper.appendChild(img);
        galleryContainer.appendChild(wrapper);
      });
    })
    .catch(err => console.error("Gallery loading error:", err));
}

// DATE RANGE PICKER (Litepicker)
document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("date-range");
  if (!dateInput) return;

  const isMobile = window.matchMedia("(max-width: 600px)").matches;

  const picker = new Litepicker({
    element: dateInput,
    singleMode: false,
    numberOfMonths: isMobile ? 1 : 2,
    numberOfColumns: isMobile ? 1 : 2,
    format: 'DD MMM YYYY',
    minDate: new Date(),
    autoApply: true,
    tooltipText: {
      one: 'night',
      other: 'nights'
    },
    tooltipNumber: (totalDays) => totalDays - 1
  });
});


// EMAILJS FORM SUBMISSION
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (!form) return;

  // Inizializza EmailJS
  emailjs.init("DU2OBUrvxSvRDvcaC"); // <-- incolla qui la tua Public Key

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    status.textContent = "Sending...";

    const formData = {
      name: form.name.value,
      email: form.email.value,
      dates: form.dates.value,
      message: form.message.value
    };

    try {
      const response = await emailjs.send(
        "service_ebjsdpa",   // <-- incolla qui il tuo Service ID
        "template_vbedp48",  // <-- incolla qui il tuo Template ID
        formData
      );

      status.textContent = "Your request has been sent successfully!";
      form.reset();

    } catch (error) {
      status.textContent = "There was an error. Please try again.";
    }
  });
});

