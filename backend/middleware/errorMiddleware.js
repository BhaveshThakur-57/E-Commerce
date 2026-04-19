// middleware/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
  });
};

module.exports = errorHandler;