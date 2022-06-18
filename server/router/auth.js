const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

require('../db/conn');
const User = require('../model/userSchema')

router.get('/', (req, res) => {
    // res.cookie("try", 'hello');
    res.send('hello Contact world from router');
})


router.post('/register', async (req, res) => {

    const { name, email, phone, work, password, cpassword } = req.body;
    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "plzz filled the field properly" })
    }

    try {

        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(422).json({ error: "Email already Exist" })
        } else if (password != cpassword) {
            return res.status(422).json({ error: "password are not matching" })
        } else {
            const user = new User({ name, email, phone, work, password, cpassword });

            await user.save()

            res.status(201).json({ message: "user registered successfuly" });
        }



    } catch (err) {
        console.log(err);
    }

});



router.post('/signin', async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "plz filled the data" })
        }

        const userLogin = await User.findOne({ email: email });

        if (userLogin) {

            const isMatch = await bcrypt.compare(password, userLogin.password);


            const token = await userLogin.genrateAuthToken();
            console.log(token);

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            });

            if (!isMatch) {
                res.status(400).json({ error: "Invalid credentials" })
            } else {
                res.json({ message: "user Signin Successfully" })
            }


        } else {
            res.status(400).json({ error: "Invalid credentials" })
        }

    } catch (err) {
        console.log(err);
    }
})
module.exports = router;