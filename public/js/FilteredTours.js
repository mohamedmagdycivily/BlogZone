/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

export const displayFilteredTours = async (data) => {
  console.log("in displayFilteredTours");
  console.log("data =", data);
  //   console.log("tours = ", tours[0]);
  //   console.log(e.target.value);
  try {
    const res = await axios({
      method: "get",
      url: "/",
      data: data,
    });
    console.log(res.body);
    // if ((res.data.status = "success")) {
    //   location.reload(true);
    //   // location.assign("/");
    // }
  } catch (err) {
    console.log(err.message);
  }
};
