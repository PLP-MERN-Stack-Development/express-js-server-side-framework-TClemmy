// Middleware authentication
const authenticate = (req, res, next) => {
    const apiKey = req.header('api-key');
    const valid_API_Key = 'plpstudent';//in the mean time
    if(!apiKey || apiKey !== valid_API_Key)
    {
      return res.status(401).json(console.error('Missing or Invalid API key'));
    }
    next();
};
module.exports = authenticate;