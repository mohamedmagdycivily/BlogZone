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
  // console.log("innnnnnnnnnnnnn multerFilter");
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

  req.file.filename = `post-${req.tour.id}-${Date.now()}.jpeg`;

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
  const filteredBody = filterObj(req.body, "title", "body", "tags");
  if (req.file) filteredBody.photo = req.file.filename;
  // 3) Update user document
  // console.log("filteredBody = ", filteredBody);
  const updatedPost = await Tour.findByIdAndUpdate(req.tour.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      tour: updatedPost,
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

// exports.updatePost = catchAsync(async (req, res, next) => {
//   // 1) Create error if user POSTs password data
//   if (req.body.password || req.body.passwordConfirm) {
//     return next(
//       new AppError(
//         "This route is not for password updates. Please use /updateMyPassword.",
//         400
//       )
//     );
//   }

//   // 2) Filtered out unwanted fields names that are not allowed to be updated
//   const filteredBody = filterObj(req.body, "name", "email");
//   if (req.file) filteredBody.photo = req.file.filename;
//   // 3) Update user document
// //   console.log("filteredBody = ", filteredBody);
//   const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
//     new: true,
//     runValidators: true,
//   });

//   res.status(200).json({
//     status: "success",
//     data: {
//       user: updatedUser,
//     },
//   });
// });

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: "reviews" });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

// exports.getTourStats = catchAsync(async (req, res, next) => {
//   const stats = await Tour.aggregate([
//     {
//       $match: { ratingsAverage: { $gte: 4.5 } },
//     },
//     {
//       $group: {
//         _id: { $toUpper: "$difficulty" },
//         numTours: { $sum: 1 },
//         numRatings: { $sum: "$ratingsQuantity" },
//         avgRating: { $avg: "$ratingsAverage" },
//         avgPrice: { $avg: "$price" },
//         minPrice: { $min: "$price" },
//         maxPrice: { $max: "$price" },
//       },
//     },
//     {
//       $sort: { avgPrice: 1 },
//     },
//     // {
//     //   $match: { _id: { $ne: 'EASY' } }
//     // }
//   ]);

//   res.status(200).json({
//     status: "success",
//     data: {
//       stats,
//     },
//   });
// });

// exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
//   const year = req.params.year * 1; // 2021

//   const plan = await Tour.aggregate([
//     {
//       $unwind: "$startDates",
//     },
//     {
//       $match: {
//         startDates: {
//           $gte: new Date(`${year}-01-01`),
//           $lte: new Date(`${year}-12-31`),
//         },
//       },
//     },
//     {
//       $group: {
//         _id: { $month: "$startDates" },
//         numTourStarts: { $sum: 1 },
//         tours: { $push: "$name" },
//       },
//     },
//     {
//       $addFields: { month: "$_id" },
//     },
//     {
//       $project: {
//         _id: 0,
//       },
//     },
//     {
//       $sort: { numTourStarts: -1 },
//     },
//     {
//       $limit: 12,
//     },
//   ]);

//   res.status(200).json({
//     status: "success",
//     data: {
//       plan,
//     },
//   });
// });

// // /tours-within/:distance/center/:latlng/unit/:unit
// // /tours-within/233/center/34.111745,-118.113491/unit/mi
// exports.getToursWithin = catchAsync(async (req, res, next) => {
//   const { distance, latlng, unit } = req.params;
//   const [lat, lng] = latlng.split(",");

//   const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

//   if (!lat || !lng) {
//     next(
//       new AppError(
//         "Please provide latitutr and longitude in the format lat,lng.",
//         400
//       )
//     );
//   }

//   const tours = await Tour.find({
//     startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
//   });

//   res.status(200).json({
//     status: "success",
//     results: tours.length,
//     data: {
//       data: tours,
//     },
//   });
// });

// exports.getDistances = catchAsync(async (req, res, next) => {
//   const { latlng, unit } = req.params;
//   const [lat, lng] = latlng.split(",");

//   const multiplier = unit === "mi" ? 0.000621371 : 0.001;

//   if (!lat || !lng) {
//     next(
//       new AppError(
//         "Please provide latitutr and longitude in the format lat,lng.",
//         400
//       )
//     );
//   }

//   const distances = await Tour.aggregate([
//     {
//       $geoNear: {
//         near: {
//           type: "Point",
//           coordinates: [lng * 1, lat * 1],
//         },
//         distanceField: "distance",
//         distanceMultiplier: multiplier,
//       },
//     },
//     {
//       $project: {
//         distance: 1,
//         name: 1,
//       },
//     },
//   ]);

//   res.status(200).json({
//     status: "success",
//     data: {
//       data: distances,
//     },
//   });
// });
