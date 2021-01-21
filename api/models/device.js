import mongoose from 'mongoose';

const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    userId: { type: String, required: [true] },
    dId: { type: String, unique: true, required: [true] },
    name: { type: String, required: [true] },
    password: { type: String, required: [true] }, 
    selected: { type: Boolean, required: [true], default: false },
    templateId: {type: String, required: [true]},
    templateName: {type: String, required: [true]},
    createdTime: { type: Number }
});

// Validator
deviceSchema.plugin(uniqueValidator, { message: 'Error, device already exists.' });

// Schema to model.
const Device = mongoose.model('Device', deviceSchema);

export default Device;