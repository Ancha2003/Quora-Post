const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse JSON bodies
app.use(methodOverride('_method'));
// app.use(helmet()); // Basic security improvements, uncomment after installing

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

let posts = [
    {
        id: uuidv4(),
        username: "anchal",
        content: "student of RECB"
    },
    {
        id: uuidv4(),
        username: "anoop",
        content: "student of RDC",
    },
    {
        id: uuidv4(),
        username: "Divyanka",
        content: "student of RDC",
    }
];

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to the home page!!");
});

// Render the EJS template for /posts
app.get("/posts", (req, res) => {
    res.render('posts', { posts: posts });
});

// Render form for new post
app.get("/posts/new", (req, res) => {
    res.render("new");
});

// Handle new post submission
app.post("/posts", (req, res) => {
    const { username, content } = req.body;
    if (username && content) {
        const newPost = { id: uuidv4(), username, content };
        posts.push(newPost);
        res.redirect('/posts'); // Redirect to posts page to see the new post
    } else {
        res.status(400).send("Username and content are required!");
    }
});

// Show a specific post
app.get("/posts/:id", (req, res) => {
    const { id } = req.params;
    const post = posts.find((p) => p.id === id);
    if (post) {
        res.render("show", { post });
    } else {
        res.status(404).send("Post not found!");
    }
});

// Edit a specific post
app.get("/posts/:id/edit", (req, res) => {
    const { id } = req.params;
    const post = posts.find((p) => p.id === id);
    if (post) {
        res.render("edit", { post }); // Pass the post object
    } else {
        res.status(404).send("Post not found!");
    }
});

// Update a specific post
app.patch("/posts/:id", (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const post = posts.find((p) => p.id === id);
    if (post) {
        post.content = content;
        res.redirect(`/posts/${id}`);
    } else {
        res.status(404).send("Post not found!");
    }
});

app.delete("/posts/:id", (req, res) => {
    const { id } = req.params;
    posts = posts.filter((p) => p.id !== id);
    res.redirect(`/posts`);
});


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
