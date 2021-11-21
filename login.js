const emailInp = document.getElementById("login-email-inp");
const passwordInp = document.getElementById("login-password-inp");
const loginForm = document.getElementById("login-form");
const guestBtn = document.getElementById("guest-btn");
//Login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  login();
});

guestBtn.addEventListener("click", () => {
  emailInp.value = "tester@test.com";
  passwordInp.value = "test@12345";
  setInterval(login(), 1000);
});

function login() {
  auth
    .signInWithEmailAndPassword(emailInp.value, passwordInp.value)
    .then((res) => {
      localStorage.setItem("user", JSON.stringify(res.user));
      location = "/";
      toast("Logged In..!!");
    })
    .catch((err) => toast(err.message));
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
