import Song from "../models/songModels.js";
import User from "../models/userModels.js";

// Get all songs with search and filter functionality
export const getAllSongs = async (req, res) => {
    try {
        const { search, genre, artist, album, movieName, releaseYear } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { artist: { $regex: search, $options: 'i' } },
                { album: { $regex: search, $options: 'i' } },
                { movieName: { $regex: search, $options: 'i' } },
            ];
        }

        if (genre) query.genre = { $regex: genre, $options: 'i' };
        if (artist) query.artist = { $regex: artist, $options: 'i' };
        if (album) query.album = { $regex: album, $options: 'i' };
        if (movieName) query.movieName = { $regex: movieName, $options: 'i' };

        const songs = await Song.find(query).sort({ createdAt: -1 });
        res.status(200).json(songs);
        
    } catch (error) {
        console.log(`Error in getAllSongs controller ${error.message}`);
        res.status(500).json({ error: error.message }); 
        
    }
}

// Get single song by ID
export const getSongById = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (song) {
            res.status(200).json(song);
        } else {
            res.status(404).json({ error: "Song not found" });
        }
    } catch (error) {
        console.log(`Error in getSongById controller ${error.message}`);
        res.status(500).json({ error: error.message });
        
    }
}

// Add new song
export const addSong = async (req, res) => {
  try {
    const { title, artist, movie, genre, duration, audioUrl } = req.body;

    const imageUrl = req.file?.path;
    const imagePublicId = req.file?.filename;

    const song = await Song.create({
      title,
      artist,
      movie,
      genre,
      duration,
      audioUrl,
      imageUrl,
      cloudinaryPublicId: imagePublicId
    });

    res.status(201).json({
      status: "success",
      data: song
    });
  } catch (err) {
    res.status(500).json({
      message: "Error adding song",
      error: err.message
    });
  }
};

// Update song by ID
export const updateSong = async (req, res) => {
    try {
        const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!song) return res.status(404).json({ error: "Song not found" });
        res.status(200).json(song);
        
    } catch (error) {
        console.log(`Error in updateSong controller ${error.message}`);
        res.status(500).json({ error: error.message });
        
    }
}

// Delete song by ID
export const deleteSong = async (req, res) => {
    try {
        const song = await Song.findByIdAndDelete(req.params.id);
        if (!song) return res.status(404).json({ error: "Song not found" });
        res.status(200).json({ message: "Song deleted successfully" });
    } catch (error) {
        console.log(`Error in deleteSong controller ${error.message}`);
        res.status(500).json({ error: error.message });
        
    }
}

// Like/Unlike a song
export const likeSong = async (req, res) => {
  try {
    const { userId, id } = req.params; // IDs from URL

    // Find the song and user
    const song = await Song.findById(id);
    const user = await User.findById(userId);

    if (!song || !user) {
      return res.status(404).json({ error: "Song or User not found" });
    }

    // Initialize likedSongs array if not exists
    if (!user.likedSongs) user.likedSongs = [];

    // Check if user already liked the song
    const hasLiked = user.likedSongs.includes(song._id);

    if (hasLiked) {
      // Unlike
      user.likedSongs = user.likedSongs.filter(
        sId => sId.toString() !== song._id.toString()
      );
      song.likes = Math.max(0, (song.likes || 0) - 1);
    } else {
      // Like
      user.likedSongs.push(song._id);
      song.likes = (song.likes || 0) + 1;
    }

    // Save changes
    await user.save();
    await song.save();

    res.status(200).json({
      success: true,
      liked: !hasLiked,
      song,
    });

  } catch (error) {
    console.log(`Error in likeSong controller: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

//Download song
export const downloads = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('downloadedSongs');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.downloadedSongs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching downloads', error: error.message });
  }
};
// Search songs
export const searchSongs = async (req, res) => {
    try {
        const { q } = req.query;
        const songs = await Song.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { artist: { $regex: q, $options: 'i' } },
                { album: { $regex: q, $options: 'i' } },
                { genre: { $regex: q, $options: 'i' } },
                { movie: { $regex: q, $options: 'i' } },
            ],
        }).sort({ createdAt: -1 });
        res.json(songs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}