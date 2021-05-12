/* eslint-disable */
import "@babel/polyfill";
import { displayMap } from "./mapbox";
import { login, logout } from "./login";
import { updateSettings } from "./updateSettings";
import { deleteTourFunc } from "./deleteTour";
import { createPost } from "./createPost";
import { createAcc } from "./createAcc";
import { followHandler } from "./follow";
import { displayFilteredTours } from "./FilteredTours";

// DOM ELEMENTS
// const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logOutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const postDataForm = document.querySelector(".form-post-data");
const createPostDataForm = document.querySelector(".form-createPost-data");
const userPasswordForm = document.querySelector(".form-user-password");
const signUpForm = document.querySelector(".form-user-create");
const deleteTour = document.querySelectorAll(".clickListen");
const followButton = document.querySelector(".followButton");
// const search = document.querySelector(".searchContainer");
// const searchBarTitle = document.querySelector(".searchBarTitle");
const searchBar = document.querySelectorAll(".search__input");
const search = document.querySelector(".search");

// console.log("searchBar = ", searchBar);
// if (search) {
//   let data = { title: "", author: "", tag: "" };
//   searchBar.forEach((element) => {
//     element.addEventListener("keyup", (e) => {
//       e.preventDefault();
//       if (e.target.name == "searchBarTitle") {
//         data.title = e.target.value;
//       } else if (e.target.name == "searchBarAuthor") {
//         data.author = e.target.value;
//       } else {
//         data.tag = e.target.value;
//       }
//       // console.log(data);
//     });
//   });

//   search.addEventListener("click", (e) => {
//     // console.log(data);
//     displayFilteredTours(data);
//   });
// }

// DELEGATION
// if (mapBox) {
//   const locations = JSON.parse(mapBox.dataset.locations);
//   displayMap(locations);
// }

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

if (signUpForm)
  signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--save-account").textContent = "signing up...";

    const form = new FormData();
    form.append("name", document.getElementById("name_create").value);
    form.append("email", document.getElementById("email_create").value);
    form.append("photo", document.getElementById("photo").files[0]);
    form.append("password", document.getElementById("password_create").value);
    form.append(
      "passwordConfirm",
      document.getElementById("password_confirm_create").value
    );
    await createAcc(
      // { name, email, photo, password, passwordConfirm },
      form,
      "create"
    );
  });

if (followButton) {
  followButton.addEventListener("click", followHandler);
}

///////////////////////////////////////////////////////////////////////////

// if (search) {
//   console.log("in search");
//   console.log(tours);
//   const title = document.getElementById("searchBarTitle");
//   const author = document.getElementById("searchBarAuthor");
//   const tag = document.getElementById("searchBarTag");

//   let data = { title: "", author: "", tag: "" };
//   title.addEventListener("keyup", (e) => {
//     data.title = e.target.value.toLowerCase();
//     displayFilteredTours(data);
//   });
//   author.addEventListener("keyup", (e) => {
//     data.author = e.target.value.toLowerCase();
//     displayFilteredTours(data);
//   });
//   tag.addEventListener("keyup", (e) => {
//     data.tag = e.target.value.toLowerCase();
//     displayFilteredTours(data);
//   });
// }
///////////////////////////////////////////////////////////////////////////////

// const charactersList = document.getElementById("charactersList");
// const searchBar = document.getElementById("searchBar");
// let hpCharacters = [];

// searchBar.addEventListener("keyup", (e) => {
//   const searchString = e.target.value.toLowerCase();

//   const filteredCharacters = hpCharacters.filter((character) => {
//     return (
//       character.name.toLowerCase().includes(searchString) ||
//       character.house.toLowerCase().includes(searchString)
//     );
//   });
//   displayCharacters(filteredCharacters);
// });

// const loadCharacters = async () => {
//   try {
//     const res = await fetch("https://hp-api.herokuapp.com/api/characters");
//     hpCharacters = await res.json();
//     displayCharacters(hpCharacters);
//   } catch (err) {
//     console.error(err);
//   }
// };

// const displayCharacters = (characters) => {
//   const htmlString = characters
//     .map((character) => {
//       return `
//             <li class="character">
//                 <h2>${character.name}</h2>
//                 <p>House: ${character.house}</p>
//                 <img src="${character.image}"></img>
//             </li>
//         `;
//     })
//     .join("");
//   charactersList.innerHTML = htmlString;
// };

// loadCharacters();
