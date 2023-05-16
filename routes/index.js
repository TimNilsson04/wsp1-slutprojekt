const express = require('express');
const { response } = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../utils/database.js');
const session = require('express-session');
const promisePool = pool.promise();
const validator = require('validator')
var Filter = require('bad-words'),
    filter = new Filter();
    filter.addWords('agel')

module.exports = router;

const mysql = require('mysql2');



router.get('/', async function (req, res, next) {
    const [rows] = await promisePool.query("SELECT * FROM tn03products");
    console.log(req.session.login)
    
    res.render('index.njk', {
        rows: rows,
        title: 'Home',
        loggedin: req.session.login,
    });
});



router.get('/flipflops/:name', async function (req, res) {
    const [rows] = await promisePool.query(
        "SELECT * FROM tn03products WHERE tn03products.name = ?",
        [req.params.name]
    );

    res.render('product-pages.njk', {
        rows: rows,
        title: 'Product',
        loggedin: req.session.login,
    });
});


router.get('/login', async function (req, res, next) {

    res.render('login.njk', { title: 'Log' });
});

router.post('/login', async function (req, res, next) {
    const { username, password } = req.body;

    const [user] = await promisePool.query('SELECT * FROM tn03users WHERE name = ?', [username]);


    bcrypt.compare(password, user[0].password, function (err, result) {
        //logga in eller nåt

        if (result === true) {
            // return res.send('Welcome')
           
            req.session.username = username;
            req.session.login = 1;
            req.session.userid = user[0].id;
            return res.redirect('/profile');
        }
        else {
            return res.send("Invalid username or password")
        }
    })
    


});

router.get('/profile', async function (req, res, next) {


    if (req.session.login == 1) {

        res.render('profile.njk', { title: 'Profile', name: req.session.username })
    }
    else {
        return res.redirect('/denied');
    }

});

router.post('/profile', async function (req, res, next) {
    req.body = { logout };


});

router.get('/logout', async function (req, res, next) {

    res.render('logout.njk', { title: 'Logged out' });
    req.session.login = undefined;
});

router.post('/logout', async function (req, res, next) {


});



router.get('/crypt/:password', async function (req, res, next) {
    const password = req.params.password
    // const [password] = await promisePool.query('SELECT password FROM dbusers WHERE none = ?', [password]);
    bcrypt.hash(password, 10, function (err, hash) {
        return res.json({ hash });

    })
});

router.get('/register', function (req, res, next) {
    
    if(req.session.login === undefined || req.session.login === 0){
    res.render('register.njk', { title: 'Register' });
    }
    else{
        return res.redirect('/denied');
}
});

router.post('/register', async function (req, res, next) {
    const { username, password, passwordConfirmation } = req.body;
    const char1 = ';';
    const char2 = '\'';
    const char3 = '*';
    
    if(req.session.login === undefined || req.session.login === 0){

    if (username < 3) {
        return res.send('Username needs at least 3 characters')
    }
    else if (username.includes(char1) ) {
        return res.send('Can\'t have ; in your username')
    }
    else if (username.includes(char2) ) {
        return res.send('Can\'t have \' in your username')
    }
    else if (username.includes(char3) ) {
        return res.send('Can\'t have * in your username')
    }
    else if (password.length < 8) {
        return res.send('Password needs at least 8 characters')
    }
    else if (passwordConfirmation.length < 8) {
        return res.send('PasswordConfirmation needs at least 8 characters')
    }
    else if (password !== passwordConfirmation) {
        return res.send('Passwords do not match')
    }

    const [user] = await promisePool.query('SELECT name FROM tn03users WHERE name = ?', [username]);


    if (user.length > 0) {
        return res.send('Username is already taken')
    } else {
        bcrypt.hash(password, 10, async function (err, hash) {
            const [creatUser] = await promisePool.query('INSERT INTO tn03users (name, password) VALUES (?, ?)', [username, hash]);
            res.redirect('/')
        })
    }
}
else {
    return res.redirect('/denied');
}


});

router.get('/delete', async function (req, res, next) {

    res.render('delete.njk', { title: 'Delete' });

});

router.post('/delete', async function (req, res, next) {
    const { username } = req.body;
    if (req.session.login === 1) {
        const [Delet] = await promisePool.query('DELETE FROM tn03users WHERE name = ?', [username]);
        req.session.login = undefined
        res.redirect('/')
    }
});

router.get('/denied', async function (req, res, next) {

    res.render('denied.njk', { 
        title: 'Access denied',
        loggedin: req.session.login,
    });

});




module.exports = router;
