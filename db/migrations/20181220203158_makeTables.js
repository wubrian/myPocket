
exports.up = function(knex, Promise) {
  const createCategoryTable = 
  knex.schema.createTable('categories', (t) => {
    t.increments();
    t.string('name').notNullable();
  }).return();

  const createUrlsTable = createCategoryTable
  .then(() => {
      return knex.schema.createTable('urls', (t) =>{
        t.increments();
        t.string('title').notNullable();
        t.string('description');
        t.integer('user_id').references('id').inTable('users');
        t.integer('category_id').references('id').inTable('categories');    
    })
  })

  const createCommentsTable = createUrlsTable
  .then(() => {
      return knex.schema.createTable('comments', (t) =>{
        t.increments();
        t.integer('url_id').references('id').inTable('urls');
        t.integer('user_id').references('id').inTable('users'); 
        t.string('text').notNullable();
    })
  })

  const createLikesTable = createUrlsTable
  .then(() => {
      return knex.schema.createTable('likes', (t) =>{
        t.increments();
        t.integer('url_id').references('id').inTable('urls');
        t.integer('user_id').references('id').inTable('users');  
    })
  })

  const createRatingsTable = createUrlsTable
  .then(() => {
      return knex.schema.createTable('ratings', (t) =>{
        t.increments();
        t.integer('url_id').references('id').inTable('urls');
        t.integer('user_id').references('id').inTable('users'); 
        t.integer('rating');
    })
  })
  return Promise.all([
    createCommentsTable, 
    createLikesTable, 
    createRatingsTable]);
};

exports.down = function(knex, Promise) {
  const dropUrlsTable = knex.schema.dropTable('urls');
  const dropCategoriesTable = knex.schema.dropTable('categories');
  const dropCommentsTable = knex.schema.dropTable('comments');
  const dropLikesTable = knex.schema.dropTable('likes');
  const dropRatingsTable = knex.schema.dropTable('ratings');
  return Promise.all([
     dropCommentsTable, 
      dropLikesTable, 
      dropRatingsTable,
      dropUrlsTable,
      dropCategoriesTable]);
};
