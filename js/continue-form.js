// ============================
// TOKEN HELPER
// ============================
function getToken() {
    return localStorage.getItem("token");
}

// ============================
// CHECK JWT ON PAGE LOAD
// ============================
if (!getToken()) {
    alert("Session expired. Please login again.");
    window.location.href = "login.html";
}

// ============================
// SHOW MESSAGES
// ============================
function showMessage(text, type) {
    const msg = document.getElementById("msgBox");

    msg.textContent = text;
    msg.className = `msg ${type} show`;
}

// ============================
// IMAGE PREVIEWS
// ============================
function setupPreview(inputId, previewId) {

    document.getElementById(inputId).addEventListener("change", function () {

        if (this.files && this.files[0]) {

            const preview = document.getElementById(previewId);

            preview.src = URL.createObjectURL(this.files[0]);
            preview.hidden = false;
        }
    });
}

setupPreview("profile_pic", "preview");
setupPreview("driving_license", "license_preview");
setupPreview("psv_badge", "psv_preview");
setupPreview("good_conduct", "gc_preview");

// ============================
// CAR AVAILABILITY
// ============================
const hasCarSelect = document.getElementById("has_car");
const numberPlateField = document.getElementById("numberPlateField");
const numberPlateInput = document.getElementById("number_plate");

function updateCarField() {

    if (hasCarSelect.value === "yes") {

        numberPlateField.hidden = false;
        numberPlateInput.value = "";

    } else if (hasCarSelect.value === "no") {

        numberPlateField.hidden = true;
        numberPlateInput.value = "NONE";

    } else {

        numberPlateField.hidden = true;
        numberPlateInput.value = "";
    }
}

hasCarSelect.addEventListener("change", updateCarField);

// Set initial state
updateCarField();

// ============================
// HANDLE 401
// ============================
function handleUnauthorized(res) {

    if (res.status === 401) {

        localStorage.removeItem("token");
        window.location.href = "login.html";

        return true;
    }

    return false;
}

// ============================
// FILE UPLOAD FUNCTION
// ============================
async function uploadFile(fileInputId, expiryId, route) {

    const fileInput = document.getElementById(fileInputId);

    if (!fileInput.files.length) {
        return { success: true };
    }

    const form = new FormData();

    if (fileInputId === "profile_pic") {
        form.append("profile_picture", fileInput.files[0]);
    }

    if (fileInputId === "driving_license") {
        form.append("license", fileInput.files[0]);
    }

    if (fileInputId === "psv_badge") {
        form.append("psv_badge", fileInput.files[0]);
    }

    if (fileInputId === "good_conduct") {
        form.append("good_conduct", fileInput.files[0]);
    }

    if (expiryId) {

        const expiryValue =
            document.getElementById(expiryId).value || "";

        form.append(expiryId, expiryValue);
    }

    try {

        const res = await fetch(
            `https://drivers-backend-4spp.onrender.com/${route}`,
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + getToken()
                },
                body: form
            }
        );

        if (handleUnauthorized(res)) {
            return { success: false };
        }

        const data = await res.json();

        return data;

    } catch (e) {

        return {
            success: false,
            error: `Network error uploading ${fileInputId}`
        };
    }
}

// ============================
// SPINNER
// ============================
function showSpinner() {

    const btn = document.getElementById("saveBtn");

    btn.disabled = true;

    document.getElementById("btnSpinner").classList.add("show");
}

function hideSpinner() {

    const btn = document.getElementById("saveBtn");

    btn.disabled = false;

    document.getElementById("btnSpinner").classList.remove("show");
}

// ============================
// SAVE DETAILS FUNCTION
// ============================
async function saveDetails() {

    showSpinner();

    const id = document.getElementById("id_number").value.trim();

    const hasCar = hasCarSelect.value;

    const plate = hasCar === "no"
        ? "NONE"
        : numberPlateInput.value.trim();

    if (!id) {

        showMessage("ID number is required.", "error");
        hideSpinner();

        return;
    }

    // Validate car selection
    if (!hasCar) {

        showMessage("Please indicate whether you have a car.", "error");
        hideSpinner();

        return;
    }

    // Validate number plate when driver has a car
    if (hasCar === "yes" && !plate) {

        showMessage("Number plate is required.", "error");
        hideSpinner();

        return;
    }

    // --- Update ID ---
    try {

        const formID = new FormData();

        formID.append("id_number", id);

        const resID = await fetch(
            "https://drivers-backend-4spp.onrender.com/update-id",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + getToken()
                },
                body: formID
            }
        );

        if (handleUnauthorized(resID)) return;

        const dataID = await resID.json();

        if (!dataID.success) {

            showMessage(
                dataID.error || "Error saving ID number",
                "error"
            );

            hideSpinner();

            return;
        }

    } catch (e) {

        showMessage("Network error updating ID number.", "error");
        hideSpinner();

        return;
    }

    // --- Update Number Plate ---
    try {

        const formPlate = new FormData();

        formPlate.append("number_plate", plate);

        const resPlate = await fetch(
            "https://drivers-backend-4spp.onrender.com/update-number-plate",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + getToken()
                },
                body: formPlate
            }
        );

        if (handleUnauthorized(resPlate)) return;

        const dataPlate = await resPlate.json();

        if (!dataPlate.success) {

            showMessage(
                dataPlate.error || "Error saving number plate",
                "error"
            );

            hideSpinner();

            return;
        }

    } catch (e) {

        showMessage("Network error updating number plate.", "error");
        hideSpinner();

        return;
    }

    // --- Upload Profile Picture ---
    const resultProfile = await uploadFile(
        "profile_pic",
        null,
        "update-profile-picture"
    );

    if (!resultProfile.success) {

        showMessage(
            resultProfile.error || "Error uploading profile picture",
            "error"
        );

        hideSpinner();

        return;
    }

    // --- Upload Other Documents ---
    const docs = [
        {
            id: "driving_license",
            expiry: "license_expiry",
            route: "update-driving-license"
        },
        {
            id: "psv_badge",
            expiry: "psv_badge_expiry",
            route: "update-psv-badge"
        },
        {
            id: "good_conduct",
            expiry: "good_conduct_expiry",
            route: "update-good-conduct"
        }
    ];

    for (const doc of docs) {

        const res = await uploadFile(
            doc.id,
            doc.expiry,
            doc.route
        );

        if (!res.success) {

            showMessage(
                res.error || "Error uploading document",
                "error"
            );

            hideSpinner();

            return;
        }
    }

    hideSpinner();

    showMessage(
        "All details saved successfully!",
        "success"
    );
}

// ============================
// SAVE BUTTON EVENT
// ============================
document.getElementById("saveBtn").addEventListener(
    "click",
    saveDetails
);

// ============================
// RESPONSIVE MENU
// ============================
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

const menuIcon = menuToggle.querySelector("i");

menuToggle.addEventListener("click", () => {

    navMenu.classList.toggle("active");

    menuIcon.classList.toggle("fa-bars");
    menuIcon.classList.toggle("fa-times");

});
