import express from 'express';
import { getAllSongs, getSongById, addSong, updateSong, deleteSong, likeSong, downloads, searchSongs } from '../controllers/songController.js';
import uploadAudio from '../middleware/uploadAudio.js';
const router = express.Router();

router.post('/upload', uploadAudio.single('audio'),uploadAudio.single('image'), addSong);
router.get('/getallsongs', getAllSongs);
router.get('/getsong/:id', getSongById);
router.put('/updatesong/:id', updateSong);
router.delete('/deletesong/:id', deleteSong);
router.post('/:userId/:id/like', likeSong);
router.get('/:userId/downloads', downloads);
router.get('/search', searchSongs);
export default router;