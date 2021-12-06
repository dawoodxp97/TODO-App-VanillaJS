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

function signup(email, password, username) {
  if (email && password && username) {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        if (user) {
          const currUser = auth.currentUser;
          currUser
            .updateProfile({
              displayName: username,
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
  } else if (!password) {
    toast("Please Enter a Valid Password");
  } else if (!username) {
    toast("Username Cannot be Empty");
  } else {
    toast("Please Enter Valid Details in the Fields");
  }
}

// Signup
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  signup(
    email.value.trimStart(),
    password.value.trimStart(),
    userName.value.trimStart()
  );
});
