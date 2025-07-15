import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    director:String,
    releaseYear:Number,
    genre:String,
    description:String 
},{
    timstamps:true,

});
const Movie = mongoose.model('Movie',movieSchema)
export default Movie