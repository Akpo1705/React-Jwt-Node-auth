const { ObjectId } = require('mongodb');
const {Schema, model, models} = require('mongoose')

const TokenSchema = new Schema ({
        user: {type: Schema.Types.ObjectId, link: 'User'},
        refreshToken:{type: String, require: true}
});


module.exports = model('Token', TokenSchema);