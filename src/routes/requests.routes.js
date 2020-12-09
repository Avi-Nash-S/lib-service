const router = require("express").Router();
const Request = require("../models/request.model");
const User = require("../models/user.model");
const Book = require("../models/book.model");
const { authenticateToken } = require("../middlewares/authToken.middleware");

// fetch all requests API
router.route("/").get((req, res) =>
  Request.find()
    .then((requests) => res.json(requests))
    .catch((err) => res.status(400).json("Error: " + err))
);

// fetch requests user specific
router.route("/user").get(authenticateToken, (req, res) =>
  Request.find()
    .then((requests) => {
      const filteredResponse = requests.filter(
        (request) =>
          request.requestedBy._id === req.user._id ||
          request.book.ownerId === req.user._id
      );
      return res.json(filteredResponse);
    })
    .catch((err) => res.status(400).json("Error: " + err))
);

// fetch request by ID
router.route("/:id").get((req, res) =>
  Request.findById(req.params.id)
    .then((request) => res.json(request))
    .catch((err) => res.status(400).json("Error: " + err))
);

// create a new request by user
router.route("/create").post(authenticateToken, async (req, res) => {
  try {
    // find user
    const requestor = await User.findById(req.user._id);
    // add requested user's details
    const requestedBy = {
      userEmail: requestor.userEmail,
      userName: requestor.userName,
      _id: requestor._id,
    };
    // find and validate book for request
    const book = await Book.findById(req.body.bookId);
    if (!book) return res.status(404).send("Not a Valid Book");
    if (!book.available) return res.status(400).send("Book not available");
    // validate request duplicate
    const verifyRequest = await Request.findOne({
      book,
      requestedBy,
      requestStatus: "requested",
    });
    if (verifyRequest)
      return res.status(400).json({
        message: "Request is already present",
        requestId: verifyRequest._id,
      });
    // create new request
    const request = new Request({
      requestedBy,
      book: book,
      requestStatus: "requested",
    });
    // save request in DB
    request
      .save()
      .then((request) =>
        res.status(200).json({
          message: "Successfully Created request",
          requestId: request._id,
        })
      )
      .catch((err) => {
        res.status(400).json({ message: "Error Adding request" });
      });
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Approve request based on request ID
router
  .route("/approve/:requestId")
  .patch(authenticateToken, async (req, res) => {
    const requestId = req.params.requestId;
    const user = req.user._id;
    // find the request based on ID
    Request.findById(requestId, (err, request) => {
      if (err) return res.status(400).json(err);
      if (!request) return res.status(404).send("Request Not Found");
      // validate the user
      if (request.book.ownerId !== user)
        return res.status(403).send("User permission denied");
      // find the book in request
      Book.findById(request.book._id).then((book) => {
        if (!book) return res.status(404).send("Not a Valid Book");
        // check book availability before approval
        if (!book.available) return res.status(400).send("Book not available");
        // update book and request status
        book.available = false;
        request.book = book;
        request.requestStatus = "approved";
        // save the book and request in DB
        book
          .save()
          .then(
            request
              .save()
              .then((reqData) =>
                res
                  .status(200)
                  .json({ message: "Request Approved", request: reqData })
              )
              .catch((err) => res.status(500).send(err))
          )
          .catch((err) => res.status(500).send(err));
      });
    });
  });

// Reject request based on request ID
router
  .route("/reject/:requestId")
  .patch(authenticateToken, async (req, res) => {
    const requestId = req.params.requestId;
    const user = req.user._id;
    // find the request based on ID
    Request.findById(requestId, (err, request) => {
      if (err) return res.status(400).json(err);
      if (!request) return res.status(404).send("Request Not Found");
      // validate the user
      if (request.book.ownerId !== user)
        return res.status(403).send("User permission denied");
      // find the book in request
      Book.findById(request.book._id).then((book) => {
        if (!book) return res.status(404).send("Not a Valid Book");
        if (!book.available) return res.status(400).send("Book not available");
        // update book and request status
        request.book = book;
        request.requestStatus = "rejected";
        // save the book and request in DB
        book
          .save()
          .then(
            request
              .save()
              .then((reqData) =>
                res
                  .status(200)
                  .json({ message: "Request Rejected", request: reqData })
              )
              .catch((err) => res.status(500).send(err))
          )
          .catch((err) => res.status(500).send(err));
      });
    });
  });

// Cancel request based on request ID
router
  .route("/cancel/:requestId")
  .patch(authenticateToken, async (req, res) => {
    const requestId = req.params.requestId;
    const user = req.user._id;
    // find the request based on ID
    Request.findById(requestId, (err, request) => {
      if (err) return res.status(400).json(err);
      if (!request) return res.status(404).send("Request Not Found");
      // validate the user
      console.log(request.requestedBy._id != user);
      if (request.requestedBy._id != user)
        return res.status(403).send("User permission denied");
      // find the book in request
      Book.findById(request.book._id).then((book) => {
        if (!book) return res.status(404).send("Not a Valid Book");
        if (!book.available) return res.status(400).send("Book not available");
        // update book and request status
        request.book = book;
        request.requestStatus = "cancelled";
        // save the book and request in DB
        book
          .save()
          .then(
            request
              .save()
              .then((reqData) =>
                res
                  .status(200)
                  .json({ message: "Request Rejected", request: reqData })
              )
              .catch((err) => res.status(500).send(err))
          )
          .catch((err) => res.status(500).send(err));
      });
    });
  });

// Same as cancel request endpoint
router.route("/close/:requestId").patch(authenticateToken, async (req, res) => {
  const requestId = req.params.requestId;
  const user = req.user._id;
  Request.findById(requestId, (err, request) => {
    if (err) return res.status(400).json(err);
    if (!request) return res.status(404).send("Request Not Found");
    if (request.requestedBy._id != user)
      return res.status(403).send("User permission denied");
    Book.findById(request.book._id).then((book) => {
      if (!book) return res.status(404).send("Not a Valid Book");
      book.available = true;
      request.book = book;
      request.requestStatus = "closed";
      book
        .save()
        .then(
          request
            .save()
            .then((reqData) =>
              res
                .status(200)
                .json({ message: "Request Rejected", request: reqData })
            )
            .catch((err) => res.status(500).send(err))
        )
        .catch((err) => res.status(500).send(err));
    });
  });
});

module.exports = router;
