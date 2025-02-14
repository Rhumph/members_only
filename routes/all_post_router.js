const passport = require('passport');
const links = require('../links');
const pool = require('../db/pool');
const router = require('express').Router();

const getAllPostPage = async (req, res) => {
    res.render('all-posts');
};

const getAllPosts = async (req, res) => {
    try {
        const allposts = await pool.query(`
            SELECT messages.message_id, messages.message_content, users.email AS author_email
            FROM messages
            JOIN users ON messages.creator_user_id = users.user_id
        `);
        res.render('all-posts', { links: links, posts: allposts.rows, user: req.user });
    } catch (error) {
        return res.status(500
        ).send({ message: error.message });
    }
};

const createPost = async (req, res) => {
    passport.authenticate('local', (err, user, info) => {
        try {
            const message = req.body.message;
            const user_id = req.user.user_id;
            pool.query('INSERT INTO messages (message_content, creator_user_id) VALUES ($1, $2)', [message, user_id]);
            res.redirect('/');
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    })(req, res);
};

const deletePost = async (req, res) => {
    console.log('deletePost called');
    // passport.authenticate('local', (err, user, info) => {
        try {
            const post_id = req.body.message_id;
            pool.query('DELETE FROM messages WHERE message_id = $1', [post_id]);
            res.redirect('/');
        } catch (error) {
            return res.status(500).send({ message: error.message });
        }
    // })(req, res);
};

router.get('/all-posts', getAllPosts);
router.post('/create-post', createPost);
router.post('/delete-post', deletePost);


module.exports = {
    getAllPostPage,
    getAllPosts,
    createPost,
    deletePost
};