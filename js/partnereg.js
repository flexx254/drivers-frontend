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

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  menuToggle.innerHTML = navMenu.classList.contains("active")
    ? '<i class="fas fa-times"></i>'
    : '<i class="fas fa-bars"></i>';
});

/* ===============================
   FRONTEND VALIDATION
================================ */
function validateFrontend(name, email, phone, password, confirm) {
  let errors = [];

  if (!name) errors.push("Name is required.");

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

  if (password.length < 8) errors.push("Password must be at least 8 characters.");
  if (!/[A-Z]/.test(password)) errors.push("At least one capital letter required.");
  if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter required.");
  if (!/[0-9]/.test(password)) errors.push("At least one number required.");
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
    errors.push("At least one special character required.");
  if (password !== confirm) errors.push("Passwords do not match.");

  return errors;
}

/* ===============================
   REGISTER USER (OWNER FORCED)
================================ */
async function registerUser() {
  const btn = document.querySelector(".container button");
  btn.classList.add("loading");
  btn.disabled = true;

  const errorBox = document.getElementById("errorBox");
  const successBox = document.getElementById("successBox");

  errorBox.textContent = "";
  successBox.textContent = "";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const phone_number = document.getElementById("phone_number").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;

  // OWNER role forced
  const sacco = 'OWNER"';

  const errors = validateFrontend(name, email, phone_number, password, confirm);

  if (errors.length > 0) {
    errorBox.textContent = errors.join("\n");
    btn.classList.remove("loading");
    btn.disabled = false;
    return;
  }

  try {
    const res = await fetch(
      "https://drivers-backend-4spp.onrender.com/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

    if (!regData.success) {
      errorBox.textContent = regData.error;
      btn.classList.remove("loading");
      btn.disabled = false;
      return;
    }

    const res2 = await fetch(
      "https://drivers-backend-4spp.onrender.com/continue-reg",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      }
    );

    const contData = await res2.json();

    if (!contData.success) {
      errorBox.textContent = contData.error;
      btn.classList.remove("loading");
      btn.disabled = false;
      return;
    }

    // Redirect to continue form
window.location.href = "continue-form.html";

  } catch (err) {
    errorBox.textContent = "Network error: " + err;
  } finally {
    btn.classList.remove("loading");
    btn.disabled = false;
  }
}

/* ===============================
   PHONE AUTO +254 FORMAT
================================ */
let firstTyped = false;

function autoInsertPrefix() {
  const input = document.getElementById("phone_number");
  let value = input.value;

  if (!firstTyped) {
    firstTyped = true;
    input.value = "+254";
    return;
  }

  if (!value.startsWith("+254")) {
    value = "+254" + value.replace(/[^\d]/g, "");
  }

  const digits = value.slice(4).replace(/[^\d]/g, "").slice(0, 9);
  input.value = "+254" + digits;
}
