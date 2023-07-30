const express = require('express');
const dotenv = require('dotenv');

const app = express();

dotenv.config({ path: './.env'})

app.set('view engine', 'hbs')

const path = require("path")
const axios = require('axios')

const publicDir = path.join(__dirname, './public')

app.use(express.static(publicDir))
app.use(express.urlencoded({extended: 'false'}))
app.use(express.json())

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/auth/register", (req, res) => {
    const { name, email, password, password_confirm } = req.body
    console.log("Registration Initiated")
    return res.render('register', {
            message: 'Registration successful'
    })

})

app.post("/auth/login", (req, res) => {
    const { name, password } = req.body
    console.log("Login Initiated")
    const BACKEND_URL = process.env.BACKEND_URL

    console.log(`${BACKEND_URL}/login/verify`)

    return axios(
    {
        method: 'POST',
        url: `${BACKEND_URL}/login/verify` ,
        headers: {
            "Content-type": "application/json"
        },
        data: {
            user_name: name,
            password: password
        }
    })
    .then(function(response) {
        console.log('Login succeeded');
        return res.render('login', {
          message: 'Login successful'
        })
    })
    .then(function(data) {
        console.log('Login succeeded with JSON response', data);
        return res.render('login', {
          message: 'Login successful !'
        })
    })
    .catch(function(error) {
        if (error.response) {
          console.log('Login failed with status: ', error.request?.status);
          return res.render('login', {
            message: 'Login Failed with status :'+ error.request?.status
          })
        }else {
          console.log('Login failed with error: ', error);
          return res.render('login', {
            message: 'Login Failed with error: ' + error
          })
        }
    });
})

app.listen(5000, ()=> {
    console.log("server started on port 5000")
})

