import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const alarmRuleSchema = new Schema({
    userId: {type: String, required: [true]},
    dId: { type: String, required: [true] },
    emqxRuleId: { type: String, required: [true] },
    variableFullName: { type: String },
    variable: { type: String },
    value: {type: Number},
    condition:  { type: String },
    triggerTime: { type: Number },
    status:  { type: Boolean },
    counter: { type: Number, default: 0},
    createdTime: {type: Number}
});



const AlarmRule = mongoose.model('alarmRule', alarmRuleSchema);


export default AlarmRule;  