var express = require('express');
var axios = require('axios');

var router = express.Router();
module.exports = router;

/* GET users listing. */
router.get('/', async (req, res, next) => {
  const response = await axios.get(req.query.url);
  res.send(response.data);
});