const BASE_URL = "https://drivers-backend-4spp.onrender.com";

const signupForm = document.getElementById("signupForm");
const signupMsg = document.getElementById("signupMsg");

const otpSection = document.getElementById("otp-section");
const otpInput = document.getElementById("otpInput");
const otpMsg = document.getElementById("otpMsg");
const verifyBtn = document.getElementById("verifyBtn");

let signupEmail = ""; // store email for OTP verification

// -----------------------------
// SUBMIT SIGNUP FORM
// -----------------------------
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  signupMsg.innerText = "Submitting...";

  const formData = new FormData(signupForm);

  signupEmail = formData.get("email"); // save for OTP

  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      signupMsg.innerText = data.error || "Signup failed";
      signupMsg.style.color = "red";
      return;
    }

    signupMsg.style.color = "green";
    signupMsg.innerText = "Signup successful! Sending OTP...";

    // Now send OTP
    sendOTP(signupEmail);

  } catch (err) {
    signupMsg.innerText = "Network error";
    signupMsg.style.color = "red";
  }
});

// -----------------------------
// SEND OTP FUNCTION
// -----------------------------
async function sendOTP(email) {
  try {
    const res = await fetch(`${BASE_URL}/send_otp`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (!res.ok) {
      signupMsg.innerText = data.error || "OTP sending failed";
      signupMsg.style.color = "red";
      return;
    }

    // Show OTP section
    otpSection.style.display = "block";
    signupMsg.innerText = "OTP sent. Check your email.";

  } catch (err) {
    signupMsg.innerText = "Error sending OTP";
    signupMsg.style.color = "red";
  }
}

// -----------------------------
// VERIFY OTP
// -----------------------------
verifyBtn.addEventListener("click", async () => {
  const code = otpInput.value.trim();

  otpMsg.innerText = "Verifying...";

  try {
    const res = await fetch(`${BASE_URL}/verify_otp`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email: signupEmail, code })
    });

    const data = await res.json();

    if (!res.ok) {
      otpMsg.innerText = data.error || "Invalid OTP";
      otpMsg.style.color = "red";
      return;
    }

    otpMsg.innerText = "OTP verified! Account activated.";
    otpMsg.style.color = "green";

  } catch (err) {
    otpMsg.innerText = "Network error";
    otpMsg.style.color = "red";
  }
});
