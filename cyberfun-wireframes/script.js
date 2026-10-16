const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const filterButtons = document.querySelectorAll(".filter-pill");
const experienceCards = document.querySelectorAll(".experience-card");
const bookingCards = document.querySelectorAll(".booking-card");
const bookingSubmit = document.querySelector("#booking-submit");
const bookingDate = document.querySelector("#booking-date");
const toast = document.querySelector(".toast");

let selectedBooking = "Day tickets";

const today = new Date();
if (bookingDate) {
  bookingDate.valueAsDate = today;
}

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    experienceCards.forEach((card) => {
      const tags = card.dataset.tags || "";
      const shouldShow = filter === "all" || tags.includes(filter);
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

bookingCards.forEach((card) => {
  card.addEventListener("click", () => {
    selectedBooking = card.dataset.booking;
    bookingCards.forEach((item) => item.classList.remove("is-active"));
    card.classList.add("is-active");
  });
});

bookingSubmit?.addEventListener("click", () => {
  const dateText = bookingDate.value
    ? new Date(`${bookingDate.value}T12:00:00`).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      })
    : "your selected date";

  toast.textContent = `${selectedBooking} selected for ${dateText}. Next step: choose package and time slot.`;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 4200);
});
