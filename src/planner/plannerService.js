const PlannerService = {
    // getAllGroceries(knex, id) {
    //     return knex.select('*').from('groceries').where('user_id', id)
    // },
    // getById(knex, id) {
    //     return knex.from('groceries').select('*').where('id', id).first()
    // },
    // getByStorageLocation(knex, location) {
    //     return knex.from('groceries').select('*').where('location', location)
    // },
    // insertGrocery(knex, newGroceryItem) {
    //     return knex
    //         .insert(newGroceryItem)
    //         .into('groceries')
    //         .returning('*')
    //         .then(rows => {
    //             return rows[0]
    //         })
    // },
    // deleteGrocery(knex, id) {
    //     return knex('groceries')
    //         .where({ id })
    //         .delete()
    // },
    // updateGrocery(knex, id, newGroceryItemFields) {
    //     return knex('groceries')
    //         .where({ id })
    //         .update(newGroceryItemFields)
    // },
}

module.exports = PlannerService
