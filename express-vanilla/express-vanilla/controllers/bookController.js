const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");
const { body, validationResult } = require("express-validator");

const async = require("async");

exports.index = (req, res) => {
  async.parallel(
    {
      book_count(callback) {
        Book.countDocuments({}, callback);
      },
      book_instance_count(callback) {
        BookInstance.countDocuments({}, callback);
      },
      book_instance_available_count(callback) {
        BookInstance.countDocuments({ status: "Available" }, callback);
      },
      author_count(callback) {
        Author.countDocuments({}, callback);
      },
      genre_count(callback) {
        Genre.countDocuments({}, callback);
      },
    },
    (err, results) => {
        //render the count if no error.
      res.render("index", {
        title: "Local Library Home",
        error: err,
        data: results, //array of the result of the functions above.
      });
    }
  );

};



// Display list of all books.
exports.book_list = function (req, res, next) {
  Book.find({}, "title author")
    .sort({ title: 1 })
    .populate("author")
    .exec(function (err, list_books) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("book_list", { title: "Book List", book_list: list_books });
    });
};


// Display detail page for a specific book.
exports.book_detail = (req, res, next) => {
    async.parallel(
      {
        book(callback) {
          Book.findById(req.params.id)
            .populate("author")
            .populate("genre")
            // this will pass the result as the argument into the callback below ("result")
            .exec(callback);
        },
        book_instance(callback) {
          BookInstance.find({ book: req.params.id }).exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        if (results.book == null) {
          // No results.
          const err = new Error("Book not found");
          err.status = 404;
          return next(err);
        }
        // Successful, so render.
        res.render("book_detail", {
          title: results.book.title,
          book: results.book,
          book_instances: results.book_instance,
        });
      }
    );
  };
  

// Display book create form on GET.
exports.book_create_get = (req, res, next) => {
    // we pass in all the author and genre to let user select
    async.parallel(
      {
        authors(callback) {
        // .exec is newer but MDN is using older code to pass the result to the callback directly.
          Author.find(callback);
        },
        genres(callback) {
          Genre.find(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        res.render("book_form", {
          title: "Create Book",
          authors: results.authors,
          genres: results.genres,
        });
      }
    );
  };
  

// Handle book create on POST.
exports.book_create_post = [
    // Convert the genre to an array - middleware 1 
    (req, res, next) => {
      if (!Array.isArray(req.body.genre)) {
        req.body.genre =
        // if undefined, it will be an empty array, if not, it will convert the string into an array.
          typeof req.body.genre === "undefined" ? [] : [req.body.genre];
      }
      next();
    },
  
    // Validate and sanitize fields by user - middleware 2
    body("title", "Title must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("author", "Author must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("summary", "Summary must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
    // sanitize every items in the genre array.
    body("genre.*").escape(),
  
    // Process request after validation and sanitization - middleware 3
    (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a Book object with escaped and trimmed data.
      const book = new Book({
        title: req.body.title,
        author: req.body.author,
        summary: req.body.summary,
        isbn: req.body.isbn,
        genre: req.body.genre,
      });
  
      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.
  
    // we pass in all the author and genre to let user select again 
        async.parallel(
          {
            authors(callback) {
              Author.find(callback);
            },
            genres(callback) {
              Genre.find(callback);
            },
          },
          (err, results) => {
            if (err) {
              return next(err);
            }
  
            // Mark our selected genres as checked.
            for (const genre of results.genres) {
              if (book.genre.includes(genre._id)) {
                genre.checked = "true";
              }
            }
            res.render("book_form", {
              title: "Create Book",
              authors: results.authors,
              genres: results.genres,
              book,
              errors: errors.array(),
            });
          }
        );
        return;
      }
  
      // Data from form is valid. Save book.
      book.save((err) => {
        if (err) {
          return next(err);
        }
        // Successful: redirect to new book record.
        res.redirect(book.url);
      });
    },
  ];
  

// Display book delete form on GET.
exports.book_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Book delete GET");
};

// Handle book delete on POST.
exports.book_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Book delete POST");
};

// Display book update form on GET.
exports.book_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Book update GET");
};

// Handle book update on POST.
exports.book_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Book update POST");
};
