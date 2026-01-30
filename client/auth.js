import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let isSignup = false;

window.toggleSignup = function () {
  isSignup = !isSignup;

  document.getElementById("nameFields").style.display = isSignup ? "block" : "none";
  document.getElementById("confirmPassword").style.display = isSignup ? "block" : "none";

  document.getElementById("loginBtn").style.display = isSignup ? "none" : "block";
  document.getElementById("signupBtn").style.display = isSignup ? "block" : "none";

  document.getElementById("authSubtitle").textContent =
    isSignup ? "Create your account" : "Login to manage your expenses";
};


function getAuthErrorMessage(code) {
  switch (code) {
    case "auth/invalid-credential":
      return "Incorrect email or password";
    case "auth/user-not-found":
      return "No account found with this email";
    case "auth/wrong-password":
      return "Incorrect password";
    case "auth/email-already-in-use":
      return "This email is already registered.";
    case "auth/weak-password":
      return "Password should be at least 6 characters";
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/network-request-failed":
      return "Network error. Check your connection.";
    default:
      return "Something went wrong. Please try again.";
  }
}


function showError(message) {
  const errorEl = document.getElementById("authError");
  if (errorEl) errorEl.textContent = message;
}


window.signup = function () {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const errorBox = document.getElementById("authError");

  errorBox.textContent = "";

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    errorBox.textContent = "All fields are required.";
    return;
  }

  if (password !== confirmPassword) {
    errorBox.textContent = "Passwords do not match.";
    return;
  }

  if (password.length < 6) {
    errorBox.textContent = "Password must be at least 6 characters.";
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(error => {
  showError(getAuthErrorMessage(error.code));
});
};


window.login = function () {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  showError("");

  if (!email || !password) {
    showError("Email and password are required");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(error => {
      showError(getAuthErrorMessage(error.code)); 
    });
};


window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};


onAuthStateChanged(auth, user => {
  if (!user && window.location.pathname.includes("dashboard.html")) {
    window.location.href = "index.html";
  }

  if (user) {
    const emailSpan = document.getElementById("userEmail");
    if (emailSpan) {
      emailSpan.textContent = user.email;
    }
  }
});
