const router = require('express').Router();
const bcrypt = require('bcryptjs');
const pool = require('../db/pool');
const links = require('../links');


const getCreateUserPage = (req, res) => res.render("./create-user-page", { links: links });

const postNewUser = async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const memberStatus = "inactive".trim().toLowerCase();
        await pool.query("INSERT INTO users (first_name, last_name, email, password, membership_status) VALUES ($1, $2, $3, $4, $5)", [
            req.body.first_name,
            req.body.last_name,
            req.body.email,
            hashedPassword,
            memberStatus
        ]);
        res.redirect("/login");
    } catch (err) {
        return next(err);
    }
};

router.get('/create-user', getCreateUserPage);
router.post('/create-user', postNewUser);

module.exports = {
    getCreateUserPage,
    postNewUser
};