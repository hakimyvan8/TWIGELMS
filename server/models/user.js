
import mongoose from 'mongoose';
//desctructure schema
const { Schema } = mongoose;

//write the schema
//first being the user schema
const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 64,
    },
    picture: {
        type: String,
        default:'/avatar.png',
    },
    role: {
       type: [String],
       default: ["Subscriber"],
       enum: ["Subscriber", "Instructor", "Admin"],
    },
    stripe_account_id: '',
    stripe_seller: {},
    stripeSession: {},
}, 
//the database will automatically create an updated timestamp for any change made
{timestamps: true}
);

export default mongoose.model('User', userSchema); //export the user schema to be used in the routes folder