const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const WikiSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", WikiSchema);

//this is known  as chained path routing in express

////////////////// routing targetting all articles /////////////////

app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const postedArticles = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    postedArticles.save(function (err) {
      if (!err) {
        res.send("succefully added articles to the db!");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("successfully deleted the articles");
      } else {
        res.send(err);
      }
    });
  });

////////////////// routing targetting specific article  /////////////////

app
  .route("/articles/:articleTitle")

  .get(function (req, res) {
    Article.findOne({ title: req.params.articleTitle }, function (
      err,
      foundArticle
    ) {
      res.send(foundArticle);
    });
  })

  .put(function (req, res) {
    Article.updateMany(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      //   {overwrite : true}, // not need in updateOne or UpdateMany function
      function (err) {
        if (!err) {
          res.send("successfully updated the article");
        } else {
          res.send(err);
        }
      }
    );
  })

  .patch(function (req, res) {
    Article.updateMany(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("successfully updated");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send("successfully deleted!");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("the server has started at localhost : 3000");
});
