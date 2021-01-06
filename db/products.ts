import * as mongoose from 'mongoose';

const {Schema} = mongoose;

const productSchema = new Schema({
    __v: {type: Number, select: false},
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {versionKey: false});
export default mongoose.model('Product', productSchema);
