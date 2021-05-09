/* eslint-disable */
import "@babel/polyfill";
import { displayMap } from "./mapbox";
import { login, logout } from "./login";
import { updateSettings } from "./updateSettings";
import { deleteTourFunc } from "./deleteTour";
import { createPost } from "./createPost";

// DOM ELEMENTS
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logOutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const postDataForm = document.querySelector(".form-post-data");
const createPostDataForm = document.querySelector(".form-createPost-data");
const userPasswordForm = document.querySelector(".form-user-password");
const deleteTour = document.querySelectorAll(".clickListen");

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener("click", logout);
if (deleteTour) {
  deleteTour.forEach((a) => {
    a.addEventListener("click", deleteTourFunc);
  });
}

if (userDataForm) {
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);
    console.log("form = ", form);

    updateSettings(form, "data");
  });
}

if (postDataForm) {
  postDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", document.getElementById("title").value);
    form.append("body", document.getElementById("body").value);
    form.append("tags", document.getElementById("tags").value);
    form.append("photo", document.getElementById("image").files[0]);
    console.log("form = ", form);

    updateSettings(form, "post");
  });
}

if (createPostDataForm) {
  createPostDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", document.getElementById("title").value);
    form.append("body", document.getElementById("body").value);
    form.append("tags", document.getElementById("tags").value);
    form.append("photo", document.getElementById("image").files[0]);
    console.log("form = ", form);

    createPost(form, "create");
  });
}

if (userPasswordForm)
  userPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";

    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password"
    );

    document.querySelector(".btn--save-password").textContent = "Save password";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
