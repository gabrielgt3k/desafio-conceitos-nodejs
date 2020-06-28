const { isUuid } = require('uuidv4');
module.exports = (req, res, next) => {
    const { id } = req.params;

    if (!isUuid(id)) {
        res.status(400).json({ error: 'invalid repository ID' })
    }

    return next();
}