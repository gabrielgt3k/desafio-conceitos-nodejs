module.exports = function validateBodyRequest(req, res, next) {
    const { title, url, techs } = req.body;

    if (!(title && url && Array.isArray(techs) && techs.length > 0)) {
        return res.status(400).json({ message: 'Title, Url and techs are required.' })
    }

    next();
}