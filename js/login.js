[29/10, 3:22 am] Sir Felix: @app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json(force=True, silent=False) or {}
    except Exception as e:
        logger.exception("Failed to parse JSON body: %s", str(e))
        return jsonify({"success": False, "error": "Invalid JSON body"}), 400

    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email:
        return jsonify({"success": False, "error": "Email is required"}), 400
    if not password:
        return jsonify({"success": False, "error": "Password is required"}), 400

    if supabase is None:
        return jsonify({"success": False, "error": "Database client missing"}), 500

    # Fetch user
    try:
        response = (
            supabase
            .table("dere")
            .select("*")
            .eq("email", email)
            .single()
            .execute()
        )
        user = response.data
    except Exception as e:
        logger.exception("Supabase lookup error: %s", str(e))
        return jsonify({"success": False, "error": "Database lookup failed"}), 500

    if not user:
        return jsonify({"success": False, "error": "Invalid email or password"}), 401

    hashed = user.get("password")
    if not hashed:
        return jsonify({"success": False, "error": "User password not set"}), 500

    # Check password
    try:
        if not bcrypt.checkpw(password.encode(), hashed.encode()):
            return jsonify({"success": False, "error": "Invalid email or password"}), 401
    except Exception as e:
        logger.exception("Password check error: %s", str(e))
        return jsonify({"success": False, "error": "Password verification failed"}), 500

    # 🔥 CREATE REAL JWT TOKEN
    access_token = create_access_token(identity=email)

    return jsonify({
        "success": True,
        "access_token": access_token,
        "message": "Login successful"
    }), 200
[29/10, 12:17 pm] Sir Felix: const toggle = document.getElementById("togglePass");
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
