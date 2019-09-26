const knex = require('knex')
const bcrypt = require('bcryptjs')
const helpers = require('./test-helpers')
const app = require('../src/app');

describe('Users Endpoints', function () {
    let db;

    const { testUsers } = helpers.makeTestFixtures();
    const testUser = testUsers[0]

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


    describe(`POST /api/users`, () => {
        context(`User Validation`, () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db,
                    testUsers,
                )
            )

            const requiredFields = ['user_name', 'password', 'email', 'first_name', 'last_name']

            requiredFields.forEach(field => {
                const registerAttemptBody = {
                    user_name: 'test user_name',
                    password: 'test password',
                    email: 'test email',
                    first_name: 'test first_name',
                    last_name: 'test last_name',
                }

                it(`responds with 400 required error when '${field}' is missing`, () => {
                    delete registerAttemptBody[field]

                    return supertest(app)
                        .post('/api/users')
                        .send(registerAttemptBody)
                        .expect(400, {
                            error: `Missing '${field}' in request body`,
                        })
                })
            })

            it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
                const userShortPassword = {
                    user_name: 'test user_name',
                    password: '1234567',
                    email: 'test email',
                    first_name: 'test first_name',
                    last_name: 'test last_name',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(userShortPassword)
                    .expect(400, { error: `Password be longer than 8 characters` })
            })

            it(`responds 400 'Password be less than 72 characters' when long password`, () => {
                const userLongPassword = {
                    user_name: 'test user_name',
                    password: '*'.repeat(73),
                    email: 'test email',
                    first_name: 'test first_name',
                    last_name: 'test last_name',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(userLongPassword)
                    .expect(400, { error: `Password be less than 72 characters` })
            })

            it(`responds 400 error when password starts with spaces`, () => {
                const userPasswordStartsSpaces = {
                    user_name: 'test user_name',
                    password: ' 1Aa!2Bb@',
                    email: 'test email',
                    first_name: 'test first_name',
                    last_name: 'test last_name',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordStartsSpaces)
                    .expect(400, { error: `Password must not start or end with empty spaces` })
            })

            it(`responds 400 error when password ends with spaces`, () => {
                const userPasswordEndsSpaces = {
                    user_name: 'test user_name',
                    password: '1Aa!2Bb@ ',
                    email: 'test email',
                    first_name: 'test first_name',
                    last_name: 'test last_name',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordEndsSpaces)
                    .expect(400, { error: `Password must not start or end with empty spaces` })
            })

            it(`responds 400 error when password isn't complex enough`, () => {
                const userPasswordNotComplex = {
                    user_name: 'test user_name',
                    password: '11AAaabb',
                    email: 'test email',
                    first_name: 'test first_name',
                    last_name: 'test last_name',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordNotComplex)
                    .expect(400, { error: `Password must contain one upper case, lower case, number and special character` })
            })

            it(`responds 400 'User name already taken' when user_name isn't unique`, () => {
                const duplicateUser = {
                    user_name: testUser.user_name,
                    password: '11AAaa!!',
                    email: 'test email',
                    first_name: 'test first_name',
                    last_name: 'test last_name',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(duplicateUser)
                    .expect(400, { error: `Username already taken` })
            })
        })

        context(`Happy path`, () => {
            it(`responds 201, serialized user, storing bcryped password`, () => {
                const newUser = {
                    user_name: 'test user_name',
                    password: '11AAaa!!',
                    email: 'test@user.com',
                    first_name: 'test first_name',
                    last_name: 'test last_name'
                }
                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.user_name).to.eql(newUser.user_name)
                        expect(res.body.first_name).to.eql(newUser.first_name)
                        expect(res.body.email).to.eql(newUser.email)
                        expect(res.body).to.not.have.property('password')
                        expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
                        //Computer time needs to be in UTC 0 for it to match
                        // const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                        // const actualDate = new Date(res.body.date_created).toLocaleString()
                        // expect(actualDate).to.eql(expectedDate)
                    })
                    .expect(res =>
                        db
                            .from('users')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.user_name).to.eql(newUser.user_name)
                                expect(row.first_name).to.eql(newUser.first_name)
                                expect(row.email).to.eql(newUser.email)
                                // const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                                // const actualDate = new Date(row.date_created).toLocaleString()
                                // expect(actualDate).to.eql(expectedDate)
                                return bcrypt.compare(newUser.password, row.password)
                            })
                            .then(compareMatch => {
                                expect(compareMatch).to.be.true
                            })
                    )
            })
        })
    })
})
