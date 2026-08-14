/* =========================================================
   Fine Arts DJ Amplifier — script.js
   Handles: sticky navbar, hamburger menu, active link
   highlight, scroll-to-top, fade-in on scroll, hero slider,
   animated counters, gallery lightbox, contact & newsletter
   form validation.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* -------- Element references -------- */
  const navbar    = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks  = document.getElementById("navLinks");
  const toTop     = document.getElementById("toTop");
  const links     = document.querySelectorAll(".nav-links a");
  const sections  = document.querySelectorAll("section[id]");

  /* =======================================================
     1. STICKY NAVBAR + SCROLL-TO-TOP VISIBILITY
     ======================================================= */
  function onScroll() {
    // Add shadow/background once the user scrolls a bit
    navbar.classList.toggle("scrolled", window.scrollY > 40);
    // Reveal the scroll-to-top button after 400px
    toTop.classList.toggle("show", window.scrollY > 400);
    // Highlight the nav link for the section currently in view
    highlightActiveLink();
  }
  window.addEventListener("scroll", onScroll);

  /* =======================================================
     2. MOBILE HAMBURGER MENU
     ======================================================= */
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });

  // Close the mobile menu whenever a link is clicked
  links.forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });

  // Close menu when clicking outside of it
  document.addEventListener("click", (e) => {
    if (
      navLinks.classList.contains("open") &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    }
  });

  /* =======================================================
     3. ACTIVE MENU HIGHLIGHT ON SCROLL
     ======================================================= */
  function highlightActiveLink() {
    let current = "";
    const offset = 140; // account for fixed navbar

    sections.forEach(section => {
      const top = section.offsetTop - offset;
      if (window.scrollY >= top) current = section.getAttribute("id");
    });

    links.forEach(link => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current}`
      );
    });
  }

  /* =======================================================
     4. SCROLL-TO-TOP BUTTON
     ======================================================= */
  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* =======================================================
     5. FADE-IN ANIMATIONS WHILE SCROLLING
        (IntersectionObserver reveals elements)
     ======================================================= */
  const faders = document.querySelectorAll("[data-fade]");
  const fadeObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Small stagger for a smoother cascade effect
        setTimeout(() => entry.target.classList.add("visible"), i * 70);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  faders.forEach(el => fadeObserver.observe(el));

  /* =======================================================
     6. ANIMATED COUNTERS (Stats section)
     ======================================================= */
  const counters = document.querySelectorAll(".counter");

  function animateCounter(el) {
    if (el.dataset.animated) return;   // run only once
    el.dataset.animated = "1";
    const target = +el.dataset.target;
    const duration = 1800;          // total animation time (ms)
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutQuad for a natural slow-down
      const eased = 1 - (1 - progress) * (1 - progress);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  /* =======================================================
     7. HERO TEXT + BACKGROUND SLIDER
     ======================================================= */
  const heroText   = document.getElementById("heroText");
  const heroSlides = document.querySelectorAll(".hero-slide");
  const dots       = document.querySelectorAll(".hero-dots .dot");
  const phrases    = ["Feel The Power", "Genuine Gear", "Trusted Since 1994"];
  let slideIndex   = 0;
  let slideTimer;

  function showSlide(index) {
    slideIndex = (index + heroSlides.length) % heroSlides.length;

    // Update background slides
    heroSlides.forEach((s, i) => s.classList.toggle("active", i === slideIndex));

    // Update dots
    dots.forEach((d, i) => d.classList.toggle("active", i === slideIndex));

    // Update the rotating heading text (re-trigger animation)
    heroText.style.animation = "none";
    void heroText.offsetWidth;            // force reflow
    heroText.style.animation = "";
    heroText.textContent = phrases[slideIndex];
  }

  function nextSlide() { showSlide(slideIndex + 1); }
  function startSlider() { slideTimer = setInterval(nextSlide, 4500); }
  function resetSlider() { clearInterval(slideTimer); startSlider(); }

  // Manual control via dots
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      showSlide(parseInt(dot.dataset.slide, 10));
      resetSlider();
    });
  });

  if (heroSlides.length) startSlider();

  /* =======================================================
     8. GALLERY LIGHTBOX
     ======================================================= */
  const galleryItems = document.querySelectorAll(".gallery-item img");
  const lightbox      = document.getElementById("lightbox");
  const lightboxImg   = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  galleryItems.forEach(img => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
  }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  /* =======================================================
     9. CONTACT FORM VALIDATION
     ======================================================= */
  const form        = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");

  // Helper: show an error message for a field
  function setError(field, message) {
    const input = form.querySelector(`#${field}`);
    const small = form.querySelector(`[data-error-for="${field}"]`);
    input.classList.add("invalid");
    small.textContent = message;
  }
  // Helper: clear an error
  function clearError(field) {
    const input = form.querySelector(`#${field}`);
    const small = form.querySelector(`[data-error-for="${field}"]`);
    input.classList.remove("invalid");
    small.textContent = "";
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    formSuccess.classList.remove("show");

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const phone   = form.phone.value.trim();
    const message = form.message.value.trim();
    let valid = true;

    // Regex patterns
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^[+]?[\d\s-]{7,15}$/;

    // Name
    if (name.length < 2) { setError("name", "Please enter your name."); valid = false; }
    else clearError("name");

    // Email
    if (!emailRe.test(email)) { setError("email", "Enter a valid email address."); valid = false; }
    else clearError("email");

    // Phone
    if (!phoneRe.test(phone)) { setError("phone", "Enter a valid phone number."); valid = false; }
    else clearError("phone");

    // Message
    if (message.length < 10) { setError("message", "Message must be at least 10 characters."); valid = false; }
    else clearError("message");

    // On success
    if (valid) {
      form.reset();
      formSuccess.classList.add("show");
      // Auto-hide the success message after a few seconds
      setTimeout(() => formSuccess.classList.remove("show"), 5000);
    }
  });

  // Clear errors live as the user types
  form.querySelectorAll("input, textarea").forEach(field => {
    field.addEventListener("input", () => clearError(field.id));
  });

  /* =======================================================
     10. NEWSLETTER (footer) — simple feedback
     ======================================================= */
  const newsletter = document.getElementById("newsletter");
  if (newsletter) {
    newsletter.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = newsletter.querySelector("input");
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRe.test(input.value.trim())) {
        input.value = "";
        input.placeholder = "✓ Subscribed!";
        setTimeout(() => (input.placeholder = "Your email"), 3000);
      } else {
        input.placeholder = "Enter a valid email";
      }
    });
  }

  /* =======================================================
     11. DYNAMIC FOOTER YEAR
     ======================================================= */
  document.getElementById("year").textContent = new Date().getFullYear();

  // Run once on load to set navbar / scroll-to-top state + active link
  onScroll();
});
