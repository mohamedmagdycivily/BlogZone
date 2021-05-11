/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

// type is either 'password' or 'data'
export const createAcc = async (data, type) => {
  try {
    let url;
    if (type === "create") url = "http://127.0.0.1:3000/api/v1/users/signup";

    const res = await axios({
      method: "POST",
      url,
      data,
    });

    if (res.data.status === "success") {
      window.location = "/";
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
