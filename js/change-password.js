/* =====================================================
   CHECK LOGIN TOKEN
===================================================== */

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login.html";
}


/* =====================================================
   PASSWORD TOGGLE
===================================================== */

document.querySelectorAll(".toggle-pass").forEach(toggle => {

  function togglePassword() {

    const id = toggle.dataset.target;
    const input = document.getElementById(id);

    if (!input) return;

    if (input.type === "password") {

      input.type = "text";
      toggle.textContent = "🙈";
      toggle.setAttribute("aria-pressed", "true");

    } else {

      input.type = "password";
      toggle.textContent = "👁️";
      toggle.setAttribute("aria-pressed", "false");

    }

  }

  toggle.addEventListener("click", togglePassword);

  toggle.addEventListener("keydown", event => {

    if (event.key === "Enter" || event.key === " ") {

      event.preventDefault();
      togglePassword();

    }

  });

});


/* =====================================================
   SHOW MESSAGE
===================================================== */

function showMessage(text, type) {

  const msg = document.getElementById("msgBox");

  msg.textContent = text;
  msg.className = "msg " + type;
  msg.style.display = "block";

}


/* =====================================================
   PASSWORD VALIDATION
===================================================== */

function validatePassword(password) {

  return {

    length: password.length >= 8,

    upper: /[A-Z]/.test(password),

    lower: /[a-z]/.test(password),

    number: /[0-9]/.test(password),

    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)

  };

}


/* =====================================================
   UPDATE REQUIREMENTS VISUALLY
===================================================== */

function updateRequirements() {

  const password =
    document.getElementById("newPassword").value;

  const result = validatePassword(password);

  document.getElementById("lengthReq").className =
    "requirement " + (result.length ? "valid" : "invalid");

  document.getElementById("upperReq").className =
    "requirement " + (result.upper ? "valid" : "invalid");

  document.getElementById("lowerReq").className =
    "requirement " + (result.lower ? "valid" : "invalid");

  document.getElementById("numberReq").className =
    "requirement " + (result.number ? "valid" : "invalid");

  document.getElementById("specialReq").className =
    "requirement " + (result.special ? "valid" : "invalid");

}


document
  .getElementById("newPassword")
  .addEventListener("input", updateRequirements);


/* =====================================================
   CHANGE PASSWORD
===================================================== */

async function changePassword() {

  const currentPassword =
    document.getElementById("currentPassword").value;

  const newPassword =
    document.getElementById("newPassword").value;

  const confirmPassword =
    document.getElementById("confirmPassword").value;

  const msgBox = document.getElementById("msgBox");

  msgBox.style.display = "none";


  /* =========================
     FRONTEND VALIDATION
  ========================= */

  if (!currentPassword) {

    showMessage(
      "Please enter your current password.",
      "error"
    );

    return;

  }


  if (!newPassword) {

    showMessage(
      "Please enter your new password.",
      "error"
    );

    return;

  }


  const requirements = validatePassword(newPassword);

  if (
    !requirements.length ||
    !requirements.upper ||
    !requirements.lower ||
    !requirements.number ||
    !requirements.special
  ) {

    showMessage(
      "Your new password does not meet all the requirements.",
      "error"
    );

    return;

  }


  if (newPassword !== confirmPassword) {

    showMessage(
      "The new passwords do not match.",
      "error"
    );

    return;

  }


  if (currentPassword === newPassword) {

    showMessage(
      "Your new password must be different from your current password.",
      "error"
    );

    return;

  }


  /* =========================
     BUTTON LOADING
  ========================= */

  const button = document.getElementById("changeBtn");

  const spinner = document.getElementById("btnSpinner");

  button.disabled = true;

  spinner.style.display = "inline-block";


  try {

    /* =========================
       SEND TO FLASK
    ========================= */

    const response = await fetch(
      "https://drivers-backend-4spp.onrender.com/change-password",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          "Authorization": "Bearer " + token
        },

        body: JSON.stringify({

          current_password: currentPassword,

          new_password: newPassword,

          confirm_password: confirmPassword

        })

      }
    );


    const data = await response.json();


/* =========================
   SUCCESS
========================= */

if (response.ok && data.success) {

  showMessage(
    "Password changed successfully! Redirecting you to login...",
    "success"
  );

  // Clear password fields
  document.getElementById("currentPassword").value = "";
  document.getElementById("newPassword").value = "";
  document.getElementById("confirmPassword").value = "";

  updateRequirements();

  // Remove the current login token
  localStorage.removeItem("token");

  // Redirect to driver login after 2 seconds
  setTimeout(() => {
    window.location.replace("login.html");
  }, 2000);

}


    /* =========================
       ERROR
    ========================= */

    else {

      showMessage(
        data.error || "Unable to change password.",
        "error"
      );

    }


  } catch (error) {

    showMessage(
      "Network error. Please try again.",
      "error"
    );

  } finally {

    button.disabled = false;

    spinner.style.display = "none";

  }

}


/* =====================================================
   BUTTON EVENT
===================================================== */

document
  .getElementById("changeBtn")
  .addEventListener("click", changePassword);


/* =====================================================
   RESPONSIVE MENU
===================================================== */

const menuToggle = document.getElementById("menuToggle");

const navMenu = document.getElementById("navMenu");

const menuIcon = menuToggle.querySelector("i");


menuToggle.addEventListener("click", () => {

  navMenu.classList.toggle("active");

  if (navMenu.classList.contains("active")) {

    menuIcon.classList.remove("fa-bars");
    menuIcon.classList.add("fa-times");

  } else {

    menuIcon.classList.remove("fa-times");
    menuIcon.classList.add("fa-bars");

  }

});
