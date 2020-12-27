import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const saverRuleSchema = new Schema({
    userId: {type: String, required: [true]},
    dId: { type: String, required: [true] },
    emqxRuleId: { type: String, required: [true] },
    status:  { type: Boolean, required: [true] }
});

const SaverRule = mongoose.model('SaverRule', saverRuleSchema);

export default SaverRule;  