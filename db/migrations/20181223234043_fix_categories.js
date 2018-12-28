
exports.up = function(knex, Promise) {
    return knex.schema.table('categories', (t) => {
        t.dropColumn('name');
        t.string('category');
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('categories', (t) => {
        t.dropColumn('category');
        t.string('name');
    })
};
