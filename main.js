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

    document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    localStorage.setItem("lang", lang);
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


// ---------------------------------------------------------
// ✅ NUOVA SEZIONE: Gestione Adulti / Bambini / Età bambino
// ---------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const childrenSelect = document.getElementById("children");
  const childAgeWrapper = document.getElementById("child-age-wrapper");
  const childAgeSelect = document.getElementById("child_age");

  if (childrenSelect && childAgeWrapper && childAgeSelect) {

    // Popola età bambino (0–17)
    for (let i = 0; i <= 17; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      childAgeSelect.appendChild(option);
    }

    // Mostra/nasconde il campo età bambino
    childrenSelect.addEventListener("change", () => {
      if (childrenSelect.value === "1") {
        childAgeWrapper.style.display = "block";
        childAgeSelect.required = true;
      } else {
        childAgeWrapper.style.display = "none";
        childAgeSelect.required = false;
        childAgeSelect.value = "";
      }
    });
  }
});


// EMAILJS FORM SUBMISSION
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (!form) return;

  emailjs.init("DU2OBUrvxSvRDvcaC"); // Public Key

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    status.textContent = "Sending...";

    const formData = {
      name: form.name.value,
      email: form.email.value,
      dates: form.dates.value,
      adults: form.adults?.value || "",
      children: form.children?.value || "",
      child_age: form.child_age?.value || "",
      message: form.message.value
    };

    try {
      await emailjs.send(
        "service_ebjsdpa",
        "template_vbedp48",
        formData
      );

      status.textContent = "Your request has been sent successfully!";
      form.reset();

      // Nasconde il campo età bambino dopo reset
      const childAgeWrapper = document.getElementById("child-age-wrapper");
      if (childAgeWrapper) childAgeWrapper.style.display = "none";

    } catch (error) {
      status.textContent = "There was an error. Please try again.";
    }
  });
});
