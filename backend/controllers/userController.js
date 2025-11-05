const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")



// User create / Sign-up Api
exports.createUser = async (req, res) => {
    const { firstName, lastName, email, mobileNo, password } = req.body
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User email already registered!" })
        }

        const hashPassword = await bcrypt.hash(password, 10)
        console.log(hashPassword, "hashPassword")
        const newUser = new User({
            firstName,
            lastName,
            email,
            mobileNo,
            password: hashPassword
        })

        await newUser.save()
        res.status(201).json({ message: 'User created successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



// Get All user data
exports.geAlltUser = async (req, res) => {
    try {
        const allUser = await User.find()
        console.log(allUser, "ALL user")
        res.status(200).json({ message: "Get all user data succesfully", User: allUser })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }
}


// Get single User data
exports.getUser = async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findOne({ _id: id })
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}


// Update User
exports.updateUser = async (req, res) => {
    const id = req.params.id;
    const { firstName, lastName, email, mobileNo, role } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { firstName, lastName, email, mobileNo, role },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.deleteOne({ _id: id })
        res.status(200).json("user delete succesfully")
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}


// Login
exports.login = async (req, res) => {
    const { email, password } = req.body
    console.log(email, password,  'email')
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "incorrect password" })
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" })

        res.status(200).json({
             message: "login succesfully",
             accessToken: token,
             user: { id: user._id, email: user.email, role: user.role }
         })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

