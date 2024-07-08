const mongoose = require("mongoose");
const jsonweb = require("jsonwebtoken");

const adminSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})

adminSchema.methods.generateToken = async function(){
    try{
        let token = jsonweb.sign({_id: this._id}, process.env.SECRETKEY) ;
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        return token;

    }
    catch(err){
        console.log(err);
    }
}

const Admin = mongoose.model("admin", adminSchema);

module.exports =  Admin;
