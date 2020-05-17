import mongoose from '../../config/dbConfig';
import uniqueValidator from 'mongoose-unique-validator';

const testcaseSchema = mongoose.Schema({
    testCaseId : {
        type     : String,
        required : true,
        unique   : true
    },
    name       : {
        type     : String,
        required : true
    },
    stepCount  : {
        type     : Number,
        required : true
    },
    folderId   : {
        type     : String,
        required : true
    },
    content    : { type : String }
});

testcaseSchema.plugin(uniqueValidator);

module.exports = mongoose.model('TestCase', testcaseSchema);


