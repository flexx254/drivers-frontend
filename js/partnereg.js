"use strict";

/* ===============================
   PASSWORD TOGGLE
================================ */

document.querySelectorAll(".toggle-eye").forEach((toggle) => {

  function changeVisibility() {
    const input = document.getElementById(toggle.dataset.password);

    if (!input) return;

    if (input.type === "password") {
      input.type = "text";
      toggle.textContent = "🙈";
      toggle.setAttribute("aria-label", "Hide password");
      toggle.setAttribute("aria-pressed", "true");
    } else {
      input.type = "password";
      toggle.textContent = "👁️";
      toggle.setAttribute("aria-label", "Show password");
      toggle.setAttribute("aria-pressed", "false");
    }
  }

  toggle.addEventListener("click", changeVisibility);

  toggle.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      changeVisibility();
    }
  });

});


/* ===============================
   RESPONSIVE MENU
================================ */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {

  menuToggle.addEventListener("click", () => {

    navMenu.classList.toggle("active");

    const icon = menuToggle.querySelector("i");

    if (icon) {
      icon.className = navMenu.classList.contains("active")
        ? "fas fa-times"
        : "fas fa-bars";
    }

  });

}


/* ===============================
   PHONE AUTO +254 FORMAT
================================ */

const phoneInput = document.getElementById("phone_number");

function autoInsertPrefix() {

  if (!phoneInput) return;

  let value = phoneInput.value;

  // Keep digits only
  let digits = value.replace(/\D/g, "");

  // Remove Kenyan country code if already entered
  if (digits.startsWith("254")) {
    digits = digits.slice(3);
  }

  // Remove leading zero from local format
  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  // Kenyan mobile number has 9 digits after +254
  digits = digits.slice(0, 9);

  phoneInput.value = "+254" + digits;
}

if (phoneInput) {

  phoneInput.addEventListener("input", autoInsertPrefix);

  phoneInput.addEventListener("focus", () => {
    if (!phoneInput.value) {
      phoneInput.value = "+254";
    }
  });

}


/* ===============================
   FRONTEND VALIDATION
================================ */

function validateFrontend(name, email, phone, password, confirm) {

  const errors = [];

  if (!name) {
    errors.push("Name is required.");
  }

  if (!email) {
    errors.push("Email is required.");
  } else {

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    if (!emailRegex.test(email)) {
      errors.push("Enter a valid email address.");
    }

  }

  const phoneRegex = /^\+254\d{9}$/;

  if (!phoneRegex.test(phone)) {
    errors.push("Phone must be in +254XXXXXXXXX format.");
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters.");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("At least one capital letter required.");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("At least one lowercase letter required.");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("At least one number required.");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("At least one special character required.");
  }

  if (password !== confirm) {
    errors.push("Passwords do not match.");
  }

  return errors;
}


/* ===============================
   REGISTER USER (OWNER FORCED)
================================ */

async function registerUser() {

  const btn = document.getElementById("registerBtn");
  const errorBox = document.getElementById("errorBox");
  const successBox = document.getElementById("successBox");

  if (!btn || !errorBox || !successBox) {
    console.error("Registration form elements are missing.");
    return;
  }

  // Prevent repeated submissions
  if (btn.disabled) return;

  errorBox.textContent = "";
  successBox.textContent = "";

  const name = document.getElementById("name").value.trim();

  const email = document.getElementById("email").value
    .trim()
    .toLowerCase();

  const phone_number = document.getElementById("phone_number").value.trim();

  const password = document.getElementById("password").value;

  const confirm = document.getElementById("confirm").value;

  // OWNER role forced
  const sacco = 'OWNER"';


  /* FRONTEND VALIDATION */

  const errors = validateFrontend(
    name,
    email,
    phone_number,
    password,
    confirm
  );

  if (errors.length > 0) {

    errorBox.textContent = errors.join("\n");

    return;
  }


  /* START LOADING */

  btn.classList.add("loading");
  btn.disabled = true;
  btn.setAttribute("aria-busy", "true");


  try {

    /* ===============================
       STEP 1: REGISTER OWNER
    ================================ */

    const res = await fetch(
      "https://drivers-backend-4spp.onrender.com/register",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          name,
          email,
          phone_number,
          sacco,
          password,
          confirm
        })
      }
    );

    const regData = await res.json();

    if (!res.ok || !regData.success) {

      errorBox.textContent =
        regData.error || "Registration failed. Please try again.";

      return;
    }


    /* ===============================
       STEP 2: CONTINUE REGISTRATION
    ================================ */

    const res2 = await fetch(
      "https://drivers-backend-4spp.onrender.com/continue-reg",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email
        })
      }
    );

    const contData = await res2.json();

    if (!res2.ok || !contData.success) {

      errorBox.textContent =
        contData.error ||
        "Registration succeeded, but we could not continue. Please contact support.";

      return;
    }


    /* ===============================
       STEP 3: REDIRECT
    ================================ */

    window.location.href = "continue-form.html";

  } catch (err) {

    console.error("Registration error:", err);

    errorBox.textContent =
      "Unable to connect to the server. Please try again.";

  } finally {

    btn.classList.remove("loading");
    btn.disabled = false;
    btn.removeAttribute("aria-busy");

  }

}


/* ===============================
   REGISTER BUTTON EVENT
================================ */

const registerBtn = document.getElementById("registerBtn");

if (registerBtn) {

  registerBtn.addEventListener("click", registerUser);

}
