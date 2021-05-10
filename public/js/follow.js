/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

export const followHandler = async (e) => {
  console.log("e.target.dataset.id =", e.target.dataset.id);
  console.log(e.target.value);
  try {
    const res = await axios({
      method: "patch",
      url: "http://127.0.0.1:3000/api/v1/users/updateFollowers",
      data: {
        following: e.target.dataset.id,
      },
    });
    if ((res.data.status = "success")) {
      location.reload(true);
      // location.assign("/");
    }
  } catch (err) {
    console.log(err.message);
  }
};
