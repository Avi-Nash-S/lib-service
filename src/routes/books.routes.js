const router = require('express').Router();
let Book = require('../models/book.model');
let { authenticateToken } = require('../middlewares/authToken.middleware');

router.route('/').get((req, res) => Book.find().then(books => res.json(books)).catch(err => res.status(400).json('Error: ' + err)));

router.route('/:id').get((req, res) => Book.findById(req.params.id).then(book => res.json(book)).catch(err => res.status(400).json('Error: ' + err)));

router.route('/').post((req, res) => {
    const book = new Book(req.body);
    book.save().then(book => res.status(200).json({message:'Successfully Added Book', bookId: book._id})).catch(err => {
        res.status(400).json({message: 'Error Adding book'})
    });
});

router.route('/:id').patch((req, res) => {
    const bookId = req.params.id;
    Book.findById(bookId, (err, book) => {
        if(err) return res.status(400).json(err)
        if(!book) {
            res.status(404).json({ message: 'Book not found'});
        } else {
            book.isbn = req.body.isbn,
            book.title = req.body.title,
            book.author = req.body.author,
            book.publisher = req.body.publisher,
            book.subject = req.body.subject, 
            book.available = req.body.available,
            book.ownerId = req.body.ownerId,
            book.ownerMailId = req.body.ownerMailId,
            book.save().then(book => res.status(200).json({message: 'Succesfully Updated Book', bookId: book._id}))
        };
    })
});

router.route('/return/:id').patch((req, res) => {
    const bookId = req.params.id;
    Book.findById(bookId, (err, book) => {
        if(err) return res.status(400).json(err)
        if(!book) {
            res.status(404).json({ message: 'Book not found'});
        } else {
            book.available = true;
            book.save().then(book => res.status(200).json({message: 'Succesfully Updated Book', bookId: book._id}))
        };
    })
});

router.route('/:id').delete(authenticateToken, (req, res) => {
    const bookId = req.params.id;
    Book.findById(bookId, (err, book) => {
        if(err) return res.status(400).json(err)
        if(!book) {
            return res.status(404).json({ message: 'Book not found'});
        } else if(book.ownerId !== req.user._id) {
            return res.status(404).json({message: 'Access Denied'});
        } else {
            Book.deleteOne({_id: book._id}).then(resBook => res.status(200).json({ message: 'Successfully Deleted Book', bookId: resBook._id}));
        }
    }) 
});

module.exports = router;