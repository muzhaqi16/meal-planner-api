function cleanTables(db) {
    return db.raw(
        `TRUNCATE
        meals,
        users
        RESTART IDENTITY CASCADE`
    )
}
function makeTestFixtures() {
    const testUsers = makeUsersArray()
    const testMeals = makeMealsArray()
    return { testUsers, testMeals }
}
function makeAuthHeader(user) {
    const token = Buffer.from(`${user.user_name}:${user.password}`).toString('base64')
    return `bearer ${token}`
}
function makeUsersArray() {
    return [
        {
            id: 1,
            user_name: 'test',
            email: 'test@user.com',
            first_name: 'Test',
            last_name: 'User',
            password: '$2a$12$AzjtJ3HFHRk48grXUEYIBua1BKN6FziDOofBORvo0x9Z5A6RBBgZK',
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
            time: "breakfast",
            date: "2019-09-16",
            calories: 100

        }, {
            id: 2,
            user_id: 1,
            name: "Soup",
            time: "dinner",
            date: "2019-09-17",
            calories: 100
        }, {
            id: 3,
            user_id: 1,
            name: "Pasta Fagoli",
            time: "lunch",
            date: "2019-09-18",
            calories: 100
        }
        , {
            id: 4,
            user_id: 1,
            name: "Pancakes",
            time: "breakfast",
            date: "2019-09-17",
            calories: 100
        }
    ]
}
module.exports = {
    makeTestFixtures,
    cleanTables,
    makeAuthHeader
}