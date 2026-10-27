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

async function login(){
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const btn = document.getElementById("loginBtn");
    const spinner = document.getElementById("btnSpinner");

    if(!email){ showMessage("Email is required","error"); return; }
    if(!password){ showMessage("Password is required","error"); return; }

    btn.disabled = true;
    spinner.style.display = "inline-block";

    try{
        const res = await fetch("https://drivers-backend-4spp.onrender.com/login", {
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        // 🔥 UPDATED PART
        if(res.ok && data.access_token){
            showMessage("Login successful! Redirecting...", "success");

            // Save real JWT
            localStorage.setItem("token", data.access_token);

            // Redirect immediately
            window.location.href = "driver-search.html";
        } 
        else {
            showMessage(data.error || "Invalid credentials", "error");
        }

    } catch(e){
        showMessage("Network error. Try again.", "error");
    }

    btn.disabled = false;
    spinner.style.display = "none";
}

document.getElementById("loginBtn").addEventListener("click", login);

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
