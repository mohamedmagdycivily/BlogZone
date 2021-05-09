/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

// type is either 'password' or 'data'
export const createPost = async (data, type) => {
  try {
    let url;

    if (type === "create") {
      url = `http://127.0.0.1:3000/api/v1/posts`;
    }
    const res = await axios({
      method: "post",
      url,
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", "post created successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
