const toggle = document.getElementById("togglePass");
const pwd = document.getElementById("password");

toggle.addEventListener("click", () => {
  if (pwd.type === "password") {
    pwd.type = "text";
    toggle.textContent = "👁️";
  } else {
    pwd.type = "password";
    toggle.textContent = "🙈";
  }
});

function showMessage(text, type){
    const msg = document.getElementById("msgBox");
    msg.textContent = text;
    msg.className = `msg ${type}`;
    msg.style.display = "block";
}

async function login() {
    const emailInput = document.getElementById("email");
    const pwd = document.getElementById("password");
    const toggle = document.getElementById("togglePass");
    const email = emailInput.value.trim().toLowerCase();
    const password = pwd.value;
    const btn = document.getElementById("loginBtn");
    const spinner = document.getElementById("btnSpinner");

    if (!email) {
        showMessage("Email is required", "error");
        emailInput.focus();
        return;
    }

    if (!password) {
        showMessage("Password is required", "error");
        pwd.focus();
        return;
    }

    btn.disabled = true;
    spinner.style.display = "inline-block";

    // Hide the password immediately while login is processing
    pwd.type = "password";
    toggle.textContent = "👁️";

    try {
        const res = await fetch(
            "https://drivers-backend-4spp.onrender.com/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            }
        );

        let data;

        try {
            data = await res.json();
        } catch {
            data = null;
        }

        if (res.ok && data && data.access_token) {
            showMessage("Login successful! Redirecting...", "success");

            // Save the JWT token
            localStorage.setItem("token", data.access_token);

            // Redirect to the driver search page
            window.location.href = "driver-search.html";
            return;
        }

        // Clear the password after an unsuccessful response
        pwd.value = "";
        pwd.type = "password";
        toggle.textContent = "👁️";

        if (res.status === 429) {
            showMessage(
                "Too many login attempts. Please wait before trying again.",
                "error"
            );
        } else if (res.status === 401) {
            showMessage("Invalid email or password.", "error");
        } else {
            showMessage(
                "Login could not be completed. Please try again.",
                "error"
            );
        }

        pwd.focus();

    } catch (e) {
        // Clear the password if the request fails
        pwd.value = "";
        pwd.type = "password";
        toggle.textContent = "👁️";

        showMessage(
            "Unable to connect. Check your internet connection and try again.",
            "error"
        );

        pwd.focus();

    } finally {
        btn.disabled = false;
        spinner.style.display = "none";
    }
}

// ---------------------
// RESPONSIVE MENU
// ---------------------
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  menuToggle.innerHTML = navMenu.classList.contains('active') 
    ? '<i class="fas fa-times"></i>' 
    : '<i class="fas fa-bars"></i>';
});
