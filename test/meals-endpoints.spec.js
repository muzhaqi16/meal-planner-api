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
    })
    describe(`POST /api/meal`, () => {
        beforeEach('insert meal', () =>
            helpers.seedUsers(
                db,
                testUsers
            )
        )

        it(`creates a meal, responding with 201 and the new meal`, function () {
            this.retries(3)
            const testMeal = testMeals[0];
            const testUser = testUsers[0];

            return supertest(app)
                .post('/api/meal')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send(testMeal)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.name).to.eql(testMeal.name)
                    expect(res.body.time).to.eql(testMeal.time)
                    expect(res.headers.location).to.eql(`/api/meal/${res.body.id}`)
                })
                .expect(res =>
                    db
                        .from('meals')
                        .select('*')
                        .where({ id: res.body.id })
                        .first()
                        .then(row => {
                            expect(row.name).to.eql(testMeal.name)
                            expect(row.time).to.eql(testMeal.time)
                            expect(row.user_id).to.eql(testUser.id)
                        })
                )
        })

        const requiredFields = ['name', 'time', 'date']

        requiredFields.forEach(field => {
            const testUser = testUsers[0]
            const newMeal = {
                name: 'Pasta Fagoli',
                time: 'breakfast',
                date: '2019-09-16'
            }

            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete newMeal[field]
                return supertest(app)
                    .post('/api/meal')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .send(newMeal)
                    .expect(400, {
                        error: { message: `'${field}' is required` }
                    })
            })
        })
    })
})