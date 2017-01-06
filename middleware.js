var middleware = {
  requireAuthentication: function (req, res, next) {
    console.log('private route hit');
    next();
  }
}


module.exports = middleware;
