const multer = require("multer");
const sharp = require("sharp");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  // console.log("file.mimetype = ", file.mimetype);
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  if (req.user) req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  else req.file.filename = `user-${Date.now()}.jpeg`;
  // console.log("end of resizeUserPhoto");
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  // console.log("end of resizeUserPhoto");
  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;
  // 3) Update user document
  // console.log("filteredBody = ", filteredBody);
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined! Please use /signup instead",
  });
};

exports.getUser = factory.getOne(User, {
  path: "posts",
  select: "title ",
});
exports.getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.updateFollowers = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const following = [...user.following, req.body.following];
  let doc;
  // console.log(
  //   "user.following.indexOf(req.body.following) = ",
  //   user.following.indexOf(req.body.following)
  // );
  if (user.following.indexOf(req.body.following) >= 0) {
    // console.log("un following ...");

    doc = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { following: req.body.following } },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    // console.log("following ...");
    // console.log("req.body.following = ", req.body.following);
    doc = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { following: req.body.following } },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});
