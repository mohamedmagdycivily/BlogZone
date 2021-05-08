/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    let url;
    if (type === "post") {
      const id = document.getElementById("title").dataset.indexNumber;
      console.log(id);
      url = `http://127.0.0.1:3000/api/v1/posts/edit/${id}`;
    }
    if (type === "password")
      url = "http://127.0.0.1:3000/api/v1/users/updateMyPassword";
    if (type === "data") url = "http://127.0.0.1:3000/api/v1/users/updateMe";

    const res = await axios({
      method: "PATCH",
      url,
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
