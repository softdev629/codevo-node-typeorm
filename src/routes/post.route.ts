import express from "express";
import {
  createPostHandler,
  getPostHandler,
  getPostsHandler,
  updatePostHandler,
  deletePostHandler,
} from "../controllers/post.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import { validate } from "../middleware/validate";
import {
  createPostSchema,
  getPostSchema,
  updatePostSchema,
  deletePostSchema,
} from "../schemas/post.schema";

const router = express.Router();

router.use(deserializeUser, requireUser);

router
  .route("/")
  .post(validate(createPostSchema), createPostHandler)
  .get(getPostHandler);

router
  .route("/:postId")
  .get(validate(getPostSchema), getPostsHandler)
  .patch(validate(updatePostSchema), updatePostHandler)
  .delete(validate(deletePostSchema), deletePostHandler);

export default router;
