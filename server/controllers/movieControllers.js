import Movie from "../models/movieModel.js";

//Need to GET all movies
export const getAllMovies = async(req,res) => {
    try{
        const movies = await Movie.find();
        res.json(movies);
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

//get all movies using Id
export const  getMovieById = async (req,res)=> {
    try{
        const movie = await Movie.findById(req.params.id);
        if(!movie) return res.status(404).json({message:'movie not found'});
        res.json(movie)


    }catch(error){
        res.status(500).json({message:error.message})

    }

};

// create new movies
export const createMovie = async (req,res) => {
    try{
        const newMovie = new Movie(req.body);
        const saveMovie = await newMovie.save();
        res.status(201).json(saveMovie);
    }catch(error){
        res.status(401).json({message:error.message});
    }
};

// update the movies
export const updateMovies = async(req,res) => {
    try{
        const  movieUpdated = await Movie.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.json(movieUpdated);
    }catch(error){
        res.status(400).json({message:error.message});
    }

};

//create a delete movie option

export const  deleteMovie = async(req,res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id);
        res.status(200).json({message:'message successfully deleted'})
    } catch (error){
        res.status(400).json({message:error.message})
    }
};