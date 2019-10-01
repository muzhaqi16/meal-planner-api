const path = require('path')
const express = require('express')
const xss = require('xss')
const logger = require('../logger')
const RecipeService = require('./recipeService')
const { requireAuth } = require('../middleware/jwt-auth')

const recipeRouter = express.Router()
const bodyParser = express.json()


recipeRouter
    .route('/')
    .all(requireAuth)
    .post(bodyParser, (req, res, next) => {
        const { name, calories = 0, details = '' } = req.body
        const newMeal = { name, calories, details }

        if (!newMeal['name']) {
            logger.error(`Recipe name is required`)
            return res.status(400).send({
                error: { message: `'Recipe name' is required` }
            })
        }
        newMeal.user_id = req.user.id;

        RecipeService.insertRecipe(
            req.app.get('db'),
            newMeal
        )
            .then(recipe => {
                logger.info(`Recipe with id ${recipe.id} created.`)
                res
                    .status(201).end()
            })
            .catch(next)
    })
recipeRouter
    .route('/:searchText')
    .all(requireAuth)
    .get((req, res, next) => {
        const { searchText } = req.params;
        RecipeService.search(req.app.get('db'), searchText, req.user.id)
            .then(recipes => {
                res.json(recipes)
            })
            .catch(next)

    })

module.exports = recipeRouter;