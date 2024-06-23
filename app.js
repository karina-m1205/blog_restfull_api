const express = require("express");
const app = express();

const body_parser = require("body-parser");
app.use(body_parser.json());

const fs = require("fs");

// task 3 Blog Posts with Comments and Likes
// task 3.1 CRUD Operations for Blog Posts:
app.post("/posts", (req, res) => {
    try {
        const posts = parseFileToArray("posts.json");

        const singlePostData = {
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
            likesAmount: 0
        }

        posts.push(singlePostData);

        fs.writeFileSync("posts.json", JSON.stringify(posts));
        res.send(singlePostData);
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.get("/posts", (req, res) => {
    try {
        const posts = parseFileToArray("posts.json");
        res.send(posts);
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.get('/posts/:id', (req, res) => {
    try {
        const posts = parseFileToArray("posts.json");
        const post = posts.find(post => posts.indexOf(post) === parseInt(req.params.id));
        if (!post) {
            return res.status(404).send("post not found");
        }

        res.send(post);
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.put("/posts/:id", (req, res) => {
    try {
        const posts = parseFileToArray("posts.json");
        const post = posts.find(post => posts.indexOf(post) === parseInt(req.params.id));
        if (!post) {
            return res.status(404).send("post not found");
        }

        const { title, content } = { ...req.body };
        post.title = title;
        post.content = content;

        fs.writeFileSync("posts.json", JSON.stringify(posts));
        res.send(post);
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.delete("/posts/:id", (req, res) => {
    try {
        const posts = parseFileToArray("posts.json");
        const post = posts.find(post => posts.indexOf(post) === parseInt(req.params.id));
        if (!post) {
            return res.status(404).send("post not found");
        }

        posts.splice(posts.indexOf(post), 1);

        fs.writeFileSync("posts.json", JSON.stringify(posts));
        res.send("post has been deleted");
    } catch (err) {
        return res.status(500).send("Something went wrong");
    }
});
//
// task 3.2 CRUD Operations for Comments:
app.post("/posts/:postId/comments", (req, res) => {
    const postId = parseInt(req.params.postId);
    const posts = parseFileToArray("posts.json");
    const post = posts[postId];
    if (!post) {
        return res.status(404).send("post not found");
    }

    let comment = {
        message: req.body.message,
        postId: postId
    }

    const commentsJson = fs.readFileSync("comments.json");
    const comments = JSON.parse(commentsJson);

    comments.push(comment);

    fs.writeFileSync("comments.json", JSON.stringify(comments));
    res.send(comment);
})

app.get('/posts/:postId/comments', (req, res) => {
    try {
        const comments = parseFileToArray("comments.json");
        const postComments = comments.filter(comment => comment.postId === parseInt(req.params.postId));

        res.send(postComments);
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.get('/posts/:postId/comments/:commentId', (req, res) => {
    try {
        const comments = parseFileToArray("comments.json");
        const postComment = comments.find(comment => comment.postId === parseInt(req.params.postId) && comments.indexOf(comment) === parseInt(req.params.commentId));

        res.send(postComment);
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.put('/posts/:postId/comments/:commentId', (req, res) => {
    try {
        const comments = parseFileToArray("comments.json");
        const postComment = comments.find(comment => comment.postId === parseInt(req.params.postId) && comments.indexOf(comment) === parseInt(req.params.commentId));

        postComment.message = req.body.message;

        fs.writeFileSync("comments.json",JSON.stringify(comments));
        res.send(postComment);
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.delete('/posts/:postId/comments/:commentId', (req, res) => {
    try {
        const comments = parseFileToArray("comments.json");
        const postComment = comments.find(comment => comment.postId === parseInt(req.params.postId) && comments.indexOf(comment) === parseInt(req.params.commentId));

        comments.splice(comments.indexOf(postComment), 1);
        
        fs.writeFileSync("comments.json",JSON.stringify(comments));
        res.send(postComment);
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});
//
// task 3.3 Post Likes:
app.post("/posts/:id/like", (req, res) => {
    const postId = req.params.id;
    const posts = parseFileToArray("posts.json");
    const post = posts[postId];
    ++post.likesAmount;

    fs.writeFileSync("posts.json", JSON.stringify(posts));

    res.send(post);
})

app.post("/posts/:id/unlike", (req, res) => {
    const postId = req.params.id;
    const posts = parseFileToArray("posts.json");
    const post = posts[postId];
    --post.likesAmount;

    fs.writeFileSync("posts.json", JSON.stringify(posts));

    res.send(post);
});
//
// task 3.4 Pagination
app.post("/posts?page=1&limit=10", (req, res) => {
    const page = req.query.page;
    const limit = req.query.limit;
    const posts = parseFileToArray("posts.json");

    const startIndex = page * limit - (limit - 1);

    const result = posts.toSpliced(startIndex, limit);

    res.send(result);
})
//

function parseFileToArray(fileName) {
    const fileData = fs.readFileSync(fileName);
    const resultArr = JSON.parse(fileData);
    return resultArr;
}


app.listen(3000);