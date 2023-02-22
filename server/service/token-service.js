const jwt = require('jsonwebtoken');
const ApiError = require('../exeptions/api-error');
const tokenModel = require('../models/token-model')
require('dotenv').config({path:'../.env'});

class TokenService{
        generateToken(payload){
                const accessToken = jwt.sign(payload, `${process.env.JWT_ACCESS_TOKEN}`, {expiresIn: '30m'});
                const refreshToken = jwt.sign(payload, `${process.env.JWT_REFRESH_SECRET}`, {expiresIn: '30d'});
                return {accessToken,refreshToken}
        }

        validateAccessToken(token){
                try {
                        const userData = jwt.verify(token, `${process.env.JWT_ACCESS_TOKEN}`);
                        return userData;
                } catch (e) {
                        return null;
                }                
        }

        validateRefrehsToken(token){
                try {
                        const userData = jwt.verify(token, `${process.env.JWT_REFRESH_SECRET}`);
                        return userData;
                } catch (e) {
                        return null;
                }
        }
        
        async saveToken(userId,refreshToken){
                const tokenData = await tokenModel.findOne({user: userId});
                if(tokenData){
                        tokenData.refreshToken = refreshToken;
                        return tokenData.save();
                }

                const token = await tokenModel.create({userId,refreshToken});
                return token;
        }


        async removeToken(refreshToken){
                const tokenData = await tokenModel.deleteOne({refreshToken});
                return tokenData;
        }

        async findToken(refreshToken){
                const tokenData = await tokenModel.findOne({refreshToken});
                return tokenData;
        }
}

module.exports = new TokenService();