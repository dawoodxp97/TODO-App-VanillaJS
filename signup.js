const userName = document.getElementById("signup-username-inp");
const email = document.getElementById("signup-email-inp");
const password = document.getElementById("signup-password-inp");
const signupForm = document.getElementById("signup-form");

function toast(text) {
  Toastify({
    text: text,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top",
    position: "center",
    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    stopOnFocus: true,
  }).showToast();
}

// Signup
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  auth
    .createUserWithEmailAndPassword(email.value, password.value)
    .then((user) => {
      if (user) {
        const currUser = auth.currentUser;
        currUser
          .updateProfile({
            displayName: userName.value,
          })
          .then(() => {
            // Update successful
            location = "login.html";
            toast("Account Created Successfully. Please Login");
          })
          .catch((error) => {
            // An error occurred
            toast(error.message);
          });
      }
    })
    .catch((err) => toast(err.message));
});
