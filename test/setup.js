process.env.TZ = 'UCT'
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'change-this-secret'

require('dotenv').config()

process.env.TEST_DB_URL = process.env.TEST_DB_URL
    || "postgresql://postgress@localhost/meal-planner-test"


const { expect } = require('chai')
const supertest = require('supertest')

global.expect = expect
global.supertest = supertest