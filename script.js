// Your backend URL on Render
const API_BASE = "https://drivers-backend-4spp.onrender.com";

// Toggle mobile menu
document.getElementById("hamburger").onclick = () => {
  document.getElementById("mobileMenu").classList.toggle("hidden");
};

// Toggle password visibility
function togglePassword(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);

  icon.onclick = () => {
    input.type = input.type === "password" ? "text" : "password";
  };
}

togglePassword("password", "togglePass");
togglePassword("confirmPassword", "toggleConfirm");

// Form submission
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const errorBox = document.getElementById("passwordError");
  const result = document.getElementById("result");

  errorBox.textContent = "";
  result.textContent = "";

  // Password match check
  if (password !== confirmPassword) {
    errorBox.textContent = "Passwords do not match!";
    return;
  }

  // Send signup request
  try {
    const response = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullname, email, phone, password })
    });

    const data = await response.json();

    if (!response.ok) {
      result.style.color = "red";
      result.textContent = data.error || "Signup failed.";
      return;
    }

    result.style.color = "green";
    result.textContent = "Signup successful!";

  } catch (err) {
    result.style.color = "red";
    result.textContent = "Network error. Could not reach backend.";
  }
});
