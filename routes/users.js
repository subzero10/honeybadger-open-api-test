var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.json([
        {name: 'pan', address_BROKEN: 'somewhere'},
        {name: 'john', address: 'somewhere else'},
    ]);
});

module.exports = router;
