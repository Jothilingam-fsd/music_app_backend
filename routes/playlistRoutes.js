import express from "express";
import { getplaylist, getplaylistById, createPlaylist, updatePlaylist, deletePlaylist, addPlaylist, removePlaylist } from "../controllers/playlistController.js";

const router = express.Router();

// CRUD
router.get('/user/:userId', getplaylist);
router.get('/:id', getplaylistById);
router.post('/', createPlaylist);
router.put('/:id', updatePlaylist);
router.delete('/:id', deletePlaylist);

// Add/Remove songs in playlist
router.post('/:id/addsong', addPlaylist);
router.delete('/:id/removesong/:songId', removePlaylist);

export default router;



