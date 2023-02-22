const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const MailService = require('./mail-service')
const TokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
var ApiError = require('../exeptions/api-error')
const tokenService = require('./token-service')

class UserService{

        async registration(email,password){
                const candidate = UserModel.findOne({email});
                if(!candidate){
                        throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
                }
                const hashPassword = await bcrypt.hash(password,10);
                const activationLink = uuid.v4();
                const user = await UserModel.create({email,password: hashPassword,activationLink});
                await MailService.sendActivationMail(email,`${process.env.API_URL}/api/activate/${activationLink}`);

                const tokens = this.generateAndSaveToken(user);
                return tokens;
        }

        async activate(activationLink){
                const user = await UserModel.findOne({activationLink});
                if(!user){
                        throw ApiError.BadRequest('Некорректная ссылка активации');
                }
                user.isActivate = true;
                user.save();

        }

        async login(email,password){
                const user = await UserModel.findOne({email});
                if(!user){
                        throw ApiError.BadRequest('Пользователь с таким email не найден');
                }
            
                const isPassEquals = bcrypt.compare(password, user.password);

                if(!isPassEquals)
                {
                        throw ApiError.BadRequest('Неверный пароль');
                }
                
                const tokens = this.generateAndSaveToken(user);
                return tokens;
        }

        async logout(refreshToken){
                const token = await tokenService.removeToken(refreshToken);
                return token;
        }

        async refreshToken(refreshToken){
                if(!refreshToken){
                        throw ApiError.UnauthorizedError();
                }
                const userData = tokenService.validateRefrehsToken(refreshToken);
                const tokenFromDb = await tokenService.findToken(refreshToken);

                if(!userData || !tokenFromDb)
                        throw ApiError.UnauthorizedError();

                const user = await UserModel.findById(userData.id);
                const tokens = await this.generateAndSaveToken(user);
                return tokens;
        }

        async generateAndSaveToken(user){
                const userDto = new UserDto(user);
                const tokens = TokenService.generateToken({...userDto});

                await TokenService.saveToken(userDto.id,tokens.refreshToken);
                return {...tokens, user: userDto};
        }

        async getAllUsers(){
                const users = await UserModel.find();
                return users;
        }
}

module.exports = new UserService();