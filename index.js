const emailInp = document.getElementById("login-email-inp");
const passwordInp = document.getElementById("login-password-inp");
const loginForm = document.getElementById("login-form");
const guestBtn = document.getElementById("guest-btn");
//Login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  login(emailInp.value.trimStart(), passwordInp.value.trimStart());
});

guestBtn.addEventListener("click", () => {
  emailInp.value = "tester@test.com";
  passwordInp.value = "test@12345";
  login("tester@test.com", "test@12345");
});

function login(email, password) {
  if (email && password) {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.user));
        location = "home.html";
        toast("Logged In..!!");
      })
      .catch((err) => toast(err.message));
  } else if (!password) {
    toast("Please Enter a Valid Password");
  } else {
    toast("Please fill all the Fields");
  }
}

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
