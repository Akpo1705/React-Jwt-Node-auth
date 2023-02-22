const {Schema, model, models} = require('mongoose')

const UserSchema = new Schema ({

        email: {type: String, require: true, unique: true},
        password: {type: String, require: true}, 
        isActivate: {type: Boolean, default: false},
        activationLink:{type: String}

});


module.exports = model('User', UserSchema);