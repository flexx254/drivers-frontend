/* =========================
   MOBILE NAVIGATION
========================= */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {

    const isOpen = navMenu.classList.toggle("active");

    menuToggle.innerHTML = isOpen
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';

  });
}


/* =========================
   PASSWORD VISIBILITY
========================= */

const passwordToggles = document.querySelectorAll(".toggle-eye");

function togglePasswordVisibility(toggle) {

  const passwordId = toggle.dataset.password;
  const input = document.getElementById(passwordId);

  if (!input) return;

  const isVisible = input.type === "text";

  input.type = isVisible ? "password" : "text";

  toggle.textContent = isVisible ? "👁️" : "🙈";

  toggle.setAttribute(
    "aria-pressed",
    String(!isVisible)
  );

  toggle.setAttribute(
    "aria-label",
    isVisible ? "Show password" : "Hide password"
  );
}

passwordToggles.forEach(toggle => {

  toggle.addEventListener("click", () => {
    togglePasswordVisibility(toggle);
  });

  toggle.addEventListener("keydown", event => {

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      togglePasswordVisibility(toggle);
    }

  });

});


/* =========================
   PHONE NUMBER PREFIX
========================= */

const phoneInput = document.getElementById("phone_number");

function autoInsertPrefix() {

  if (!phoneInput) return;

  let digits = phoneInput.value.replace(/\D/g, "");

  // Remove country code if already present
  if (digits.startsWith("254")) {
    digits = digits.slice(3);
  }

  // Accept Kenyan numbers beginning with 0
  else if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  // Allow a maximum of 9 digits after country code
  digits = digits.slice(0, 9);

  phoneInput.value = "+254" + digits;
}

if (phoneInput) {
  phoneInput.addEventListener("input", autoInsertPrefix);
}


/* =========================
   FRONTEND VALIDATION
========================= */

function validateFrontend(name, email, phone, sacco, password, confirm) {

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

  if (!sacco) {
    errors.push("Please select a sacco.");
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


/* =========================
   REGISTRATION
========================= */

const registerBtn = document.getElementById("registerBtn");

async function registerUser() {

  if (!registerBtn) return;

  const errorBox = document.getElementById("errorBox");
  const successBox = document.getElementById("successBox");

  registerBtn.classList.add("loading");
  registerBtn.disabled = true;

  errorBox.textContent = "";
  successBox.textContent = "";

  const name = document.getElementById("name").value.trim();

  const email = document.getElementById("email").value.trim().toLowerCase();

  const phone_number = document.getElementById("phone_number").value.trim();

  const sacco = document.getElementById("sacco").value;

  const password = document.getElementById("password").value;

  const confirm = document.getElementById("confirm").value;


  // Frontend validation

  const errors = validateFrontend(
    name,
    email,
    phone_number,
    sacco,
    password,
    confirm
  );

  if (errors.length > 0) {

    errorBox.textContent = errors.join("\n");

    registerBtn.classList.remove("loading");
    registerBtn.disabled = false;

    return;
  }


  try {

    // REGISTER USER

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


    // CONTINUE REGISTRATION

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
        contData.error || "Unable to continue registration.";

      return;
    }


    // SUCCESS

    successBox.textContent =
      "Registration complete! Check your email to continue ✔";


  } catch (err) {

    errorBox.textContent =
      "Network error. Please check your connection and try again.";

  } finally {

    registerBtn.classList.remove("loading");
    registerBtn.disabled = false;

  }

}


/* =========================
   REGISTRATION BUTTON EVENT
========================= */

if (registerBtn) {

  registerBtn.addEventListener("click", registerUser);

}
