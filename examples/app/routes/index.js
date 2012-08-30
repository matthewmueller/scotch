exports.index = function(req, res) {
  res.render('index/index', {
    title : 'Welcome to scotch',
    layout : '/views/layout/layout.mu'
  });
};
