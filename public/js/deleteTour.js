/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

export const deleteTourFunc = async (e) => {
  // console.log("e.target.dataset.indexNumber = ", e.target.dataset.indexNumber);

  try {
    const res = await axios({
      method: "DELETE",
      url: `http://127.0.0.1:3000/api/v1/posts/${e.target.dataset.indexNumber}`,
    });
    // console.log("res.status = ", res.data);
    if ((res.status = "success")) {
      showAlert("success", "Deleted successfully!");
      window.setTimeout(() => {
        location.reload(true);
        // location.assign("/");
      }, 500);
    }
  } catch (err) {
    console.log(err.response);
    showAlert("error", "Error Deletting this tour !");
  }
};
