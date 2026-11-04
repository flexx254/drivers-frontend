/* PASSWORD TOGGLE */
function togglePassword(id, el) {
  const input = document.getElementById(id);
  if (input.type === "password") {
    input.type = "text";
    el.textContent = "🙈";
  } else {
    input.type = "password";
    el.textContent = "👁️";
  }
}

/* RESPONSIVE MENU */
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  if (navMenu.classList.contains('active')) {
    menuToggle.innerHTML = '<i class="fas fa-times"></i>';
  } else {
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
  }
});

/* FRONTEND VALIDATION & REGISTER */
function validateFrontend(name, email, phone, sacco, password, confirm) {
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

  if (!sacco) errors.push("Please select a sacco.");

  if (password.length < 8) errors.push("Password must be at least 8 characters.");
  if (!/[A-Z]/.test(password)) errors.push("At least one capital letter required.");
  if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter required.");
  if (!/[0-9]/.test(password)) errors.push("At least one number required.");
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) errors.push("At least one special character required.");
  if (password !== confirm) errors.push("Passwords do not match.");

  return errors;
}


async function registerUser() {
  const btn = document.querySelector("button");
  btn.classList.add("loading");
  btn.disabled = true;

  document.getElementById("errorBox").textContent = "";
  document.getElementById("successBox").textContent = "";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const phone_number = document.getElementById("phone_number").value.trim();
  const sacco = document.getElementById("sacco").value;
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;

  const errors = validateFrontend(name, email, phone_number, sacco, password, confirm);
  if (errors.length > 0) {
    document.getElementById("errorBox").textContent = errors.join("\n");
    btn.classList.remove("loading");
    btn.disabled = false;
    return;
  }

  try {
    const res = await fetch("https://drivers-backend-4spp.onrender.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone_number, sacco, password, confirm })
    });

    const regData = await res.json();
    if (!regData.success) {
      document.getElementById("errorBox").textContent = regData.error;
      btn.classList.remove("loading");
      btn.disabled = false;
      return;
    }

    const res2 = await fetch("https://drivers-backend-4spp.onrender.com/continue-reg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const contData = await res2.json();
    if (!contData.success) {
      document.getElementById("errorBox").textContent = contData.error;
      btn.classList.remove("loading");
      btn.disabled = false;
      return;
    }

    document.getElementById("successBox").textContent =
      "Registration complete! Check your email to continue ✔";

  } catch (err) {
    document.getElementById("errorBox").textContent = "Network error: " + err;

  } finally {
    btn.classList.remove("loading");
    btn.disabled = false;

  }
  }

  let firstTyped = false;

function autoInsertPrefix() {
  const input = document.getElementById("phone_number");
  let value = input.value;

  // If this is the first input ever
  if (!firstTyped) {
    firstTyped = true;
    input.value = "+254";
    return;
  }

  // Always force +254 at the start
  if (!value.startsWith("+254")) {
    value = "+254" + value.replace(/[^\d]/g, "");
  }

  // Digits allowed only after +254
  const digits = value.slice(4).replace(/[^\d]/g, "").slice(0, 9);

  input.value = "+254" + digits;
  }
  
