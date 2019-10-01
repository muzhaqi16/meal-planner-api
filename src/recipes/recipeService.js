const RecipeService = {

    search(knex, query, id) {
        return knex.from('recipes').select('*').where('user_id', id).where("name", 'ilike', `%${query}%`)
    },
    insertRecipe(knex, newRecipe) {
        return knex
            .insert(newRecipe)
            .into('recipes')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
}

module.exports = RecipeService
