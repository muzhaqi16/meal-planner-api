const knex = require('knex')
const helpers = require('./test-helpers')
const app = require('../src/app');

describe('Meals Endpoints', () => {
    let db;

    const { testUsers, testMeals } = helpers.makeTestFixtures();

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())


    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))


    describe(`Unauthorized requests`, () => {
        beforeEach('insert users and meals', () => {
            return db
                .into('users')
                .insert(testUsers)
                .then(() =>
                    db
                        .into('meals')
                        .insert(testMeals)
                )

        })
        it(`responds with 401 'Missing bearer token' when no token`, () => {
            return supertest(app)
                .get('/api/meal')
                .expect(401, { error: 'Missing bearer token' })
        })

        it(`responds 401 'Unauthorized request' when no credentials in token`, () => {
            const userNoCreds = { user_name: '', password: '' }
            return supertest(app)
                .get('/api/meal')
                .set('Authorization', helpers.makeAuthHeader(userNoCreds))
                .expect(401, { error: `Unauthorized request` })
        })

        it(`responds 401 'Unauthorized request' when invalid user`, () => {
            const userInvalidCreds = { user_name: 'user-not', password: 'existy' }
            return supertest(app)
                .get('/api/meal')
                .set('Authorization', helpers.makeAuthHeader(userInvalidCreds))
                .expect(401, { error: `Unauthorized request` })
        })

        it(`responds 401 'Unauthorized request' when invalid password`, () => {
            const userInvalidPass = { user_name: 'test', password: 'wrong' }
            return supertest(app)
                .get('/api/meal')
                .set('Authorization', helpers.makeAuthHeader(userInvalidPass))
                .expect(401, { error: `Unauthorized request` })
        })
    })

})