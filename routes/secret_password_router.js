const router = require('express').Router();
const bcrypt = require('bcryptjs');
const pool = require('../db/pool');
const links = require('../links');


const getSPWPage = (req, res) => {
    res.render('secret_password_page', { links });
}

const postSPWPage = async (req, res) => {
    const userSecretWord = req.body.secret_word;
    console.log('User secret word:', userSecretWord);
    const user_id = req.user.user_id;
    console.log('Username:', user_id);
    console.log('Secret word:', process.env.SECRET_WORD);

    try {
        if (userSecretWord === process.env.SECRET_WORD) {
            await pool.query('UPDATE users SET membership_status = $1 WHERE user_id = $2', ['active', user_id]);
            return res.redirect('/');
        } else if (userSecretWord === process.env.SECRET_ADMIN_WORD) {
            await pool.query('UPDATE users SET membership_status = $1, admin_status = $2 WHERE user_id = $3', ['active', true, user_id]);
            return res.redirect('/');

        }
        else {
            return res.render('secret_password_page', { links, error: 'Incorrect secret word' });
        }
    } catch (error) {
        console.log('Error:', error);
        return res.render('secret_password_page', { links, error: 'An error occurred' });
    }
}

router.get('/', getSPWPage);
router.post('/', postSPWPage);



module.exports = {
    getSPWPage,
    postSPWPage,
};