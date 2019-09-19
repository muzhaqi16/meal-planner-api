const MealService = {
    getAllMeals(knex, id) {
        return knex.select('*').from('meals').where('user_id', id)
    },
    getById(knex, id) {
        return knex.from('meals').select('*').where('id', id).first()
    },
    getByWeek(knex, week, id) {
        var date = new Date(week);
        date.setDate(date.getDate() + 7);

        return knex.from('meals').select('*').where('user_id', id).whereBetween('date', [week, date])
    },
    insertMeal(knex, newMeal) {
        return knex
            .insert(newMeal)
            .into('meals')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteMeal(knex, id) {
        return knex('meals')
            .where({ id })
            .delete()
    }
}

module.exports = MealService
