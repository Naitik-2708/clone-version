// ============================================================
// PRESTIGE MOTORS — script.js
// Google Sheet URL (new deployment)
// ============================================================
const SHEET_URL = "https://script.google.com/macros/s/AKfycbwqZZ3gD7VnVjjTgAgyzHlrAeX_d5KlvF-DgXQe19pZXZyw0BaPiDC20LOpfUHNQx5R/exec";

// ---- Core submit helper ----
async function submitToSheet(data) {
  try {
    await fetch(SHEET_URL, {
      method: "POST",
      mode: "no-cors",           // avoids CORS preflight issues with Apps Script
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(data)
    });
    return true;
  } catch (err) {
    console.error("Sheet submission error:", err);
    return false;
  }
}

// ---- Helpers ----
function val(form, name) {
  const el = form.elements[name];
  return el ? el.value.trim() : "";
}

// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const popup  = document.getElementById('queryPopup');
  const navbar = document.getElementById('navbar');

  // ---- NAV SCROLL ----
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ---- POPUP ----
  window.openPopup = function () {
    if (!popup) return;
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  window.closePopup = function () {
    if (!popup) return;
    popup.classList.remove('active');
    document.body.style.overflow = '';
  };
  window.skipPopup = function () {
    localStorage.setItem('popupSkipped', 'true');
    closePopup();
  };
  if (popup) {
    popup.addEventListener('click', e => { if (e.target === popup) closePopup(); });
  }

  // ---- POPUP FORM SUBMIT ----
  window.handlePopupSubmit = async function (e) {
    e.preventDefault();
    const form = e.target;
    const btn  = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    await submitToSheet({
      type:     "Quick Query",
      name:     val(form, 'name'),
      phone:    val(form, 'phone'),
      email:    "",
      address:  val(form, 'address'),
      carModel: val(form, 'carModel'),
      budget:   "",
      message:  val(form, 'message'),
      source:   "Popup"
    });

    localStorage.setItem('popupSkipped', 'true');
    closePopup();
    alert("Query submitted! Our team will contact you shortly.");
    form.reset();
    btn.textContent = 'Submit Query';
    btn.disabled = false;
  };

  // ---- SERVICES FORM SUBMIT ----
  window.handleSubmit = async function (e, section) {
    e.preventDefault();
    const form = e.target;
    const btn  = form.querySelector('button[type="submit"]');
    btn.textContent = 'Submitting…';
    btn.disabled = true;

    const typeMap = { testdrive: "Test Drive", consultant: "Consultancy", buycar: "Buy Car" };

    const ok = await submitToSheet({
      type:     typeMap[section] || section,
      name:     val(form, 'name'),
      phone:    val(form, 'phone'),
      email:    val(form, 'email'),
      address:  val(form, 'address'),
      carModel: val(form, 'carModel'),
      budget:   val(form, 'budget'),
      message:  val(form, 'message'),
      dateTime: val(form, 'dateTime'),
      payment:  val(form, 'payment'),
      source:   "Services Page"
    });

    // We treat no-cors as success (fetch doesn't throw on 200)
    window.location.href = "thankyou.html?service=" + section;
  };

  // ---- CONTACT FORM SUBMIT ----
  window.handleContactSubmit = async function (e) {
    e.preventDefault();
    const form = e.target;
    const btn  = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    await submitToSheet({
      type:     "Enquiry",
      name:     val(form, 'name'),
      phone:    val(form, 'phone'),
      email:    val(form, 'email'),
      address:  "",
      carModel: "",
      budget:   "",
      message:  val(form, 'message'),
      subject:  val(form, 'subject'),
      source:   "Contact Page"
    });

    document.getElementById("contactForm").style.display = "none";
    document.getElementById("successMsg").style.display  = "block";
  };

  // ---- MOBILE MENU ----
  window.toggleMobileMenu = function () {
    const menu = document.getElementById('mobileMenu');
    if (!menu) return;
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  };
  window.closeMobileMenu = function () {
    const menu = document.getElementById('mobileMenu');
    if (!menu) return;
    menu.classList.remove('open');
    document.body.style.overflow = '';
  };

  // ---- BROCHURE ----
  window.downloadBrochure = function (carName) {
    alert("Brochure for " + carName + " is being prepared.\nOur team will email it shortly!");
  };

  // ---- FADE-IN ----
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // ---- AUTO POPUP ----
  //if (!localStorage.getItem('popupSkipped')) {
    setTimeout(() => { if (window.openPopup) openPopup(); }, 2000);
  
});
