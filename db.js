const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email : {type : String , unique : true},
    password : String ,
    firstName : String ,
    lastName : String
})

const resumeSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    originalName: { type: String, required: true },
    fileName: { type: String, required: true },
    fileData: { type: Buffer, required: true },
    fileSize: { type: Number, required: true },
    mimeType: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
});

const portfolioSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    name: { type: String, required: true },
    template: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    url: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
    resumeId: { type: Schema.Types.ObjectId, ref: 'resume' }
});

const userModel = mongoose.model("user" , userSchema);
const resumeModel = mongoose.model("resume", resumeSchema);
const portfolioModel = mongoose.model("portfolio", portfolioSchema);

module.exports = {
    userModel : userModel,
    resumeModel: resumeModel,
    portfolioModel: portfolioModel
}