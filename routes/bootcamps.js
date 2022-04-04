const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");
const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

//Include other resource routers
const courseRouter = require("./courses");

//Re route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

router.route("/").get(getBootcamps).post(protect, createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);

module.exports = router;
