const Tour = require("../models/postModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getOverview = catchAsync(async (req, res, next) => {
  let tours;
  if (
    req.query.searchBarTitle ||
    req.query.searchBarAuthor ||
    req.query.searchBarTag
  ) {
    let filter = [];
    // console.log("req.query = ", req.query);
    let { searchBarTitle, searchBarAuthor, searchBarTag } = req.query;
    if (searchBarTag) {
      searchBarTag = searchBarTag.split(" ");
      filter.push({ tags: { $all: searchBarTag } });
    }
    if (searchBarTitle) filter.push({ title: searchBarTitle });
    if (searchBarAuthor) {
      let authorId = await User.findOne({ name: searchBarAuthor });
      if (authorId) authorId = authorId.id;
      filter.push({ author: authorId });
    }
    console.log("filter = ", filter);

    tours = await Tour.find({
      $and: filter,
    }).sort("-createdAt");
  } else {
    tours = await Tour.find().sort("-createdAt");
  }
  // res.status(200).json({
  //   status: "success",
  //   length: tours.length,
  //   data: {
  //     tours,
  //   },
  // });
  res.status(200).render("overview", {
    title: "All Posts",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug });

  if (!tour) {
    return next(new AppError("There is no post with that name.", 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render("tour", {
    title: `${tour.title} Tour`,
    tour,
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  // console.log("req.params.id =", req.params.id);
  const tours = await Tour.find({ author: req.params.id }).sort("-createdAt");

  if (!tours) {
    return next(new AppError("There is no posts", 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render("tours", {
    title: `MY POSTS`,
    tours,
  });
});
exports.getMyInterests = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  // console.log("req.user.id =", req.user.id);
  let followingIds = await User.findById(req.user.id).populate(
    "following",
    "id"
  );
  followingIds = followingIds.following;
  let tours = await Promise.all(
    followingIds.map(async (following) => {
      // console.log(following);
      const tour = await Tour.find({ author: following.id });
      return tour;
    })
  );
  tours = tours.flat();

  if (!tours) {
    return next(new AppError("There is no posts", 404));
  }

  // // 2) Build template
  // // 3) Render template using data from 1)
  res.status(200).render("tours", {
    title: `MY Interests`,
    tours,
    followers: true,
  });
});

exports.editTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug });

  if (!tour) {
    return next(new AppError("There is no post with that name.", 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render("editTour", {
    title: `${tour.title} Post`,
    tour,
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  res.status(200).render("createPost", {
    title: `createPost`,
  });
});

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   // 1) Get the data, for the requested tour (including reviews and guides)
//   const tour = await Tour.findOneAndDelete({ slug: req.params.slug });
//   // console.log(tour);
//   if (!tour) {
//     return next(new AppError("failed to delete this post", 404));
//   }
//   // const tours = await Tour.find({ author: req.params.id }).sort("-createdAt");
//   // const tours = await Tour.find().sort("-createdAt");
//   // 2) Build template
//   // 3) Render template using data from 1)
//   // res.status(200).render("overview", {
//   //   title: `${tour.title} Tour`,
//   //   tours,
//   // });
//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// });

exports.getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Log into your account",
  });
};
exports.getSignUpForm = (req, res) => {
  res.status(200).render("signUp", {
    title: "sign up",
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "Your account",
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render("account", {
    title: "Your account",
    user: updatedUser,
  });
});
