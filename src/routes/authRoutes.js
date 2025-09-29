import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient.js'

const router = express.Router()

// register a new user endpoint /auth/register
router.post('/register', async (req, res) => {
    const { username, password } = req.body
    
    // hashing password
    const hashedPassword = bcrypt.hashSync(password, 8)

    // save to db
    try {
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        })
    
        // default todo
        const defaultTodo = `Add a ToDo!`
        await prisma.todo.create({
            data: {
                task: defaultTodo,
                userId: user.id
            }
        })

        // create a token
        const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, {expiresIn: '24h'})
        res.json({ token })

    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

// for /auth/login route
router.post('/login', async(req, res) => {
    const { username, password } = req.body

    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })
        if (!user) {
            return res.status(404).send({message: "User not found"})
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password)

        if (!passwordIsValid) {return res.status(401).send({message:"Invalid password"})}

        console.log(user)
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

export default router