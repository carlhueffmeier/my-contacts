exports.catchErrors = fn => 
  (req, res, next) => fn(req, res, next).catch(next);

exports.notFound = (req, res, next) => {
  var err = new Error('Not found');
  err.status = 404;
  next(err);
};

exports.developmentErrors = (err, req, res, next) => {
  res.status = err.status || 500;
  res.format({
    'text/html': () => res.send(`<h1>${err.message}</h1>\n<p>${err}</p>`),
    'application/json': () => res.json(err)
  });
};

exports.productionErrors = (err, req, res, next) => {
  res.status = err.status || 500;
  res.send(err.message);
  res.format({
    'text/html': () => res.send(`<h1>${err.message}</h1>`),
    'application/json': () => res.json({ message: err.message })
  });
};
