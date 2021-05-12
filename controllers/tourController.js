const Tour = require("../models/postModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");
const multer = require("multer");
const sharp = require("sharp");

// const addId = (req, res, next) => {
//   next();
// };
const multerStorage = multer.memoryStorage(); //use memory storage

const multerFilter = (req, file, cb) => {
  // don not accept any file
  // console.log("file.mimetype = ", file.mimetype);
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};
//when upload use the last 2 limitations
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
//upload only one photo and practice the 2 limitations in it
exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  // console.log("in resizeUserPhoto");
  if (!req.file) return next();
  // console.log("req.user.id = ", req.user.id);
  // console.log("req.user.id = ", req.user.id);
  if (req.user.id) {
    req.file.filename = `post-${req.user.id}-${Date.now()}.jpeg`;
  } else {
    req.file.filename = `post-${req.tour.id}-${Date.now()}.jpeg`;
  }

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.file.filename}`);
  next();
});

exports.getMe = (req, res, next) => {
  // console.log("req.params.id = ", req.params.id);
  // console.log("req.body =", req.body);
  req.tour = {};
  req.tour.id = req.params.id;
  // console.log("req.tour.id = ", req.tour.id);
  next();
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updatePost = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }
  // console.log("req.body =", req.body);
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  // console.log("req.body.tags after", req.body.tags);
  req.body.tags = req.body.tags.split(" ");
  // console.log("req.body.tags after", req.body.tags);
  const filteredBody = filterObj(req.body, "title", "body", "tags");
  if (req.file) filteredBody.photo = req.file.filename;
  // 3) Update user document
  // console.log("filteredBody = ", filteredBody);
  const updatedPost = await Tour.findByIdAndUpdate(req.tour.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  // console.log("updatedPost = ", updatedPost);
  res.status(200).json({
    status: "success",
    data: {
      tour: updatedPost,
    },
  });
});
exports.createPost = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }
  // console.log("req.body =", req.body);
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  if (req.body.tags) req.body.tags = req.body.tags.split(" ");
  const filteredBody = filterObj(req.body, "title", "body", "tags");
  if (req.file) filteredBody.photo = req.file.filename;
  filteredBody.author = req.user.id;
  // console.log("in create post ");
  // console.log(filteredBody);
  // 3) Update user document
  // console.log("filteredBody = ", filteredBody);

  const doc = await Tour.create(filteredBody);
  // console.log("the created doc = ", doc);
  res.status(200).json({
    status: "success",
    data: {
      tour: doc,
    },
  });
});

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.setUserId = (req, res, next) => {
  // Allow nested routes
  if (!req.body.author) req.body.author = req.user.id;
  // console.log("req.body.author = ", req.body.author);
  next();
};

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: "reviews" });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
