const rateLimiter = require("express-rate-limit");

const limiter = rateLimiter({
  max: 5,
  windowMs: 1000,
  message:
    "you can't make any more requests at the moment, please try again later",
});

module.exports = limiter;
