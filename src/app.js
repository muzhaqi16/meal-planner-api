
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')


const mealRouter = require('./meals/mealRouter')
const recipeRouter = require('./recipes/recipeRouter')
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')

const errorHandler = require('./error-handler');
const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())

app.use('/api/meal', mealRouter)
app.use('/api/recipe', recipeRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use(errorHandler);

module.exports = app;