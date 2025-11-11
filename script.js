const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  if (navMenu.style.display === 'flex') {
    navMenu.style.display = 'none';
  } else {
    navMenu.style.display = 'flex';
  }
});

const signupForm = document.getElementById('signupForm');
const responseDiv = document.getElementById('response');

// Replace this with your Render backend URL
const BACKEND_URL = 'https://drivers-backend-4spp.onrender.com';

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(signupForm);

  try {
    const res = await fetch(`${BACKEND_URL}/signup`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    responseDiv.textContent = data.message || JSON.stringify(data);
    if (!res.ok) {
      responseDiv.style.color = 'red';
    } else {
      responseDiv.style.color = 'green';
      signupForm.reset();
    }
  } catch (err) {
    responseDiv.textContent = 'Network error';
    responseDiv.style.color = 'red';
  }
});
