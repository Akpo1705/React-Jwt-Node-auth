const ApiError = require('../exeptions/api-error')
const tokenservice = require('../service/token-service')
module.exports = function(req,res,next){
        try {
                const autharizationHeader = req.headers.authorization;
                if(!autharizationHeader)
                {
                        return next(ApiError.UnauthorizedError());
                }

                const accessToken = autharizationHeader.split(' ')[1];
                if(!accessToken)
                {
                        return next(ApiError.UnauthorizedError());
                }
                const userData = tokenservice.validateAccessToken(accessToken);
                if(!userData)
                {
                        return next(ApiError.UnauthorizedError());
                }

                req.user = userData;
                next();
        } catch (e) {
                return next(ApiError.UnauthorizedError());
        }
};