import mongoose, { mongo } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /.+\@.+\..+/ // Regex simple email validation xxx@xxxx.xx
    },
    password: {
        type: String,
        required: true,
    },
});

userSchema.pre('save', async function(next){
    if(this.isModified('password') || this.isNew){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

export default mongoose.model('User', userSchema);