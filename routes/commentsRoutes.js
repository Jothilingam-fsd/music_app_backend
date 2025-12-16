import express from "express";
import { getComments, createComment, deleteComments } from "../controllers/commentsController.js";

const router = express.Router();

router.get('/song/:songId', getComments);
router.post('/', createComment);
router.delete('/:id', deleteComments);

export default router;