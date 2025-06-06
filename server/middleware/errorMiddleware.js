// The error that could be coming from the backend, it can be handle here

// UNSUPPORTED ENDPOINT

const notFound = (req, res, next) => {
  const error = new Error(`Not Found = ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// ERROR MIDDLEWARE
const errorHandler = (error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500)
    .json({ message: error.message || "An unknown error occured." });
};

module.exports = {notFound, errorHandler}