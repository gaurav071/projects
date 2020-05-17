import mongoose from '../../config/dbConfig';
import uniqueValidator from 'mongoose-unique-validator';

const folderSchema = mongoose.Schema({
    folderId       : {
        type     : String,
        required : true,
        unique   : true
    },
    parentFolderId : { type : String },
    name           : {
        type     : String,
        required : true
    }
});

folderSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Folder', folderSchema);
