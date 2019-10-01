const path = require('path')
const express = require('express')
const xss = require('xss')
const logger = require('../logger')
const MealService = require('./mealService')
const { requireAuth } = require('../middleware/jwt-auth')

const mealRouter = express.Router()
const bodyParser = express.json()

const serializeMeal = meal => ({
    id: meal.id,
    name: xss(meal.name),
    time: xss(meal.time),
    calories: Number(meal.calories),
})
mealRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        MealService.getAllMeals(req.app.get('db'), req.user.id)
            .then(meals =>
                res.json(meals)
            )
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const { date, name, time, calories = 0, details = '' } = req.body
        const newMeal = { date, name, time, calories, details }

        for (const field of ['name', 'time', 'date']) {
            if (!newMeal[field]) {
                logger.error(`${field} is required`)
                return res.status(400).send({
                    error: { message: `'${field}' is required` }
                })
            }
        }
        newMeal.user_id = req.user.id;

        MealService.insertMeal(
            req.app.get('db'),
            newMeal
        )
            .then(meal => {
                logger.info(`Meal Item with id ${meal.id} created.`)
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${meal.id}`))
                    .json(serializeMeal(meal))
            })
            .catch(next)
    })
mealRouter
    .route('/:week')
    .all(requireAuth)
    .get((req, res, next) => {
        const { week } = req.params;
        MealService.getByWeek(req.app.get('db'), week, req.user.id)
            .then(week => {
                res.json(week)
            })
            .catch(next)

    })
    .patch(bodyParser, (req, res, next) => {
        const { name, date, time, calories } = req.body;
        const { week } = req.params
        const id = Number(week);
        MealService.getById(req.app.get('db'), id)
            .then(numRowsAffected => {
                if (!numRowsAffected) {
                    logger.error(`Meal with id ${id} not found.`)
                    return res.status(404).json({
                        error: { message: `Meal Not Found` }
                    })
                }
            })
        const newMeal = { name, date, time, calories }

        MealService.updateMeal(
            req.app.get('db'), id, newMeal)
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        const { week } = req.params
        const id = Number(week);
        if (!id) {
            logger.error(`Meal with id ${id} not found.`)
            return res.status(404).json({
                error: { message: `Meal Not Found` }
            })
        }
        MealService.deleteMeal(
            req.app.get('db'), id)
            .then(numRowsAffected => {
                logger.info(`Meal item with id ${id} deleted.`)
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = mealRouter;