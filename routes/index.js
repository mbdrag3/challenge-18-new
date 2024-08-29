const router = require('express').Router();
const apiRouter = require('./api');

router.use('/api',apiRouter);

router.use((req,res) => {
    return res.status(404).send("Wrong route. Try a different one.")
})

module.exports = router;