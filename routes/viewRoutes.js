const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();
router.get("/", authController.isLoggedIn, viewsController.getOverview);
router.get("/tour/:slug", authController.isLoggedIn, viewsController.getTour);
router.get(
  "/myPosts/:id",
  authController.protect,
  // authController.isLoggedIn,
  viewsController.getMyTours
);

router.get(
  "/myInterests",
  authController.protect,
  // authController.isLoggedIn,
  viewsController.getMyInterests
);

router.get("/edit/:slug", authController.isLoggedIn, viewsController.editTour);
// router.get(
//   "/delete/:slug",
//   authController.isLoggedIn,
//   viewsController.deleteTour
// );

router.get("/login", authController.isLoggedIn, viewsController.getLoginForm);
router.get("/signUp", viewsController.getSignUpForm);
router.get("/me", authController.protect, viewsController.getAccount);

router.post(
  "/submit-user-data",
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;

router.get("/create-post", authController.protect, viewsController.createPost);
