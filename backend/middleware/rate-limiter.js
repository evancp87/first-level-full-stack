const rateLimiter = require("express-rate-limit");

const limiter = rateLimiter({
  max: 500,
  windowMs: 5000,
  trustProxy: true,
  message:
    "you can't make any more requests at the moment, please try again later",
});

module.exports = limiter;
