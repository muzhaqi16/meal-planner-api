const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function cleanTables(db) {
    return db.raw(
        `TRUNCATE
        meals,
        users
        RESTART IDENTITY CASCADE`
    )
}
function seedMeals(db, users, meals) {
    // use a transaction to group the queries and auto rollback on any failure
    return db.transaction(async trx => {
        await seedUsers(trx, users)
        await trx.into('meals').insert(meals)
        // update the auto sequence to match the forced id values
        await trx.raw(
            `SELECT setval('meals_id_seq', ?)`,
            [meals[meals.length - 1].id],
        )
    })
}
function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('users').insert(preppedUsers)
        .then(() =>
            // update the auto sequence to stay in sync
            db.raw(
                `SELECT setval('users_id_seq', ?)`,
                [users[users.length - 1].id],
            )
        )
}
function makeTestFixtures() {
    const testUsers = makeUsersArray()
    const testMeals = makeMealsArray()
    return { testUsers, testMeals }
}
function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.user_name,
        algorithm: 'HS256',
    })
    return `Bearer ${token}`
}
function makeUsersArray() {
    return [
        {
            id: 1,
            user_name: 'test',
            email: 'test@user.com',
            first_name: 'Test',
            last_name: 'User',
            password: 'Test123!',
            date_created: '2019-01-22T16:28:32.615Z',
            status: false
        }
    ]
}
function makeMealsArray() {
    return [
        {
            id: 1,
            user_id: 1,
            name: "Potatoe Pie",
            details: "for this recipe we will need",
            time: "breakfast",
            date: "2019-09-16",
            calories: 100

        }, {
            id: 2,
            user_id: 1,
            name: "Soup",
            details: "for this recipe we will need",
            time: "dinner",
            date: "2019-09-17",
            calories: 100
        }, {
            id: 3,
            user_id: 1,
            name: "Pasta Fagoli",
            details: "for this recipe we will need",
            time: "lunch",
            date: "2019-09-18",
            calories: 100
        }
        , {
            id: 4,
            user_id: 1,
            name: "Pancakes",
            details: "for this recipe we will need",
            time: "breakfast",
            date: "2019-09-17",
            calories: 100
        }
    ]
}
module.exports = {
    makeTestFixtures,
    cleanTables,
    makeAuthHeader,
    seedUsers,
    seedMeals
}