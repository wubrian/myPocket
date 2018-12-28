
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('urls', (t) => {
      t.string("image");
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('urls', (t) =>{
      t.dropColumn('image');
  })
};
