const path = require('path')
const express = require('express')
const xss = require('xss')
const logger = require('../logger')
const PlannerService = require('./plannerService')

const plannerRouter = express.Router()
const bodyParser = express.json()

plannerRouter
    .route('/')
    .get((req, res, next) => {

    })


module.exports = plannerRouter;