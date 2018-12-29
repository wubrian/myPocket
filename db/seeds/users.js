exports.seed = function(knex, Promise) {
  return knex('comments').del()
  .then(() => knex('ratings').del() )
  .then(() => knex('likes').del() )
  .then(() => knex('urls').del() )
  .then(() => knex('users').del() )
  .then(() => knex('categories').del() )
  .then(() => {
    return knex('users').insert([
      {id: 2000,name: 'Alice', email: 'example1@gmail.com', password: '123'},
      {id: 2001,name: 'Bob', email: 'example2@gmail.com', password: '456'},
      {id: 2002,name: 'Charlie', email: 'example3@gmail.com', password: '456'},
    ]).returning('*');
  }).then(() => {
    //seeding categories
    const categories = Promise.all([
      knex('categories').insert({id: 1000, category: 'Engineering'}),
      knex('categories').insert({id: 1001,category: 'Web Dev'}),
      knex('categories').insert({id: 1002,category: 'CS'})
    ]);
    return Promise.all([categories]);
  }).then(() => {
    //seeding urls
    // console.log(categories)
    // const [alice, bob, charlie] = users;
    // const [engineering, webDev, cS] = categories;
    
    return Promise.all([
      knex('urls').insert({id: 5000, title:'https://online-learning.harvard.edu/course/cs50-introduction-computer-science', description: 'introduction to computer science from harvard', user_id: 2000, category_id: 1002 , image: 'https://online-learning.harvard.edu/sites/default/files/styles/header/public/course/cs50x-original.jpg?itok=Cl52MS32'}),
      knex('urls').insert({id: 5001,title: 'https://www.fastcompany.com/28121/they-write-right-stuff', description: 'blog about how to write bug free code', user_id: 2001, category_id: 1001, image: 'https://images.fastcompany.net/image/upload/w_1153,ar_16:9,c_fill,g_auto,f_auto,q_auto,fl_lossy/fc/28121-poster-p-1-fast-company-number-6-1996.jpg'}),
      knex('urls').insert({id: 5002,title: 'https://www.amazon.ca/Cracking-Coding-Interview-Programming-Questions/dp/0984782850/ref=sr_1_1/133-0972702-4166551?ie=UTF8&qid=1543368338&sr=8-1&keywords=cracking+the+coding+interview', description: 'book that helps with web dev interviews ', user_id: 2002 , category_id: 1001 , image: 'https://images-na.ssl-images-amazon.com/images/I/51l5XzLln%2BL._SX348_BO1,204,203,200_.jpg'}),
      knex('urls').insert({id: 5003,title: 'https://www.khanacademy.org/computing/computer-programming', description: 'Courses about computer programming', user_id: 2000, category_id: 1001, image:'https://cdn.kastatic.org/images/khan-logo-dark-background.new.png'}),
      knex('urls').insert({id: 5004,title: 'https://www.khanacademy.org/science/electrical-engineering', description: 'Courses about electrical engineering', user_id: 2001, category_id: 1000, image: 'https://cdn.kastatic.org/images/khan-logo-dark-background.new.png'}),
      knex('urls').insert({id: 5005,title: 'https://api.jquery.com/', description: 'Documentation for jquery api', user_id: 2000 , category_id: 1001, image: 'https://cdn-images-1.medium.com/max/1200/0*s1Goua9K1MuNuapv.jpg'}),
      knex('urls').insert({id: 5006,title: 'https://www.seleniumhq.org/', description: 'Documentation for selenium', user_id: 2001 , category_id: 1001 , image: 'http://epages.su/upload/iblock/107/learn-selenium-a2c1a1be9fa6a703985944c78a0c8a25cbfc0a7775846b627af2edc2488d4e18.png'}),
      knex('urls').insert({id: 5007,title: 'https://www.awwwards.com/', description: 'inspiration for website design', user_id: 2002 , category_id: 1001 , image: 'https://assets.awwwards.com/assets/images/logo-schema.png'}),
      knex('urls').insert({id: 5008,title: 'https://www.wolframalpha.com/', description: 'website that helps with engineering problems', user_id: 2002, category_id: 1000, image: 'http://www.wolframalpha.com/share.png'})
    ])
  
    // return Promise.all([users, categories,urls]);
  }).then(() => {
    //seeding commments
    // const [alice, bob, charlie] = users;
    

    return Promise.all([
      knex('comments').insert({url_id: 5000, user_id: 2000, text: "this was helpful"}),
      knex('comments').insert({ url_id: 5000, user_id: 2001, text: "this was The SHIT" }),
      knex('comments').insert({ url_id: 5000, user_id: 2002, text: "this was fucking shit" }),      
      knex('comments').insert({ url_id: 5000, user_id: 2002, text: "this was shit" }),
      knex('comments').insert({url_id: 5000, user_id: 2001, text: "this was helpful"}), 
      knex('comments').insert({ url_id: 5000, user_id: 2000, text: "this wasn't helpful at all" })
    ])
    // return Promise.all([users, categories,urls,comments]);
  }).then(() => {
    //seeding likes
    
    const likes = Promise.all([
      knex('likes').insert({url_id: 5000, user_id: 2001}),
      knex('likes').insert({url_id: 5000}),
      knex('likes').insert({url_id: 5000}),
      knex('likes').insert({url_id: 5000}),
      knex('likes').insert({url_id: 5000}),
      knex('likes').insert({url_id: 5000}),
      knex('likes').insert({url_id: 5002, user_id: 2001}),
      knex('likes').insert({url_id: 5002}),
      knex('likes').insert({url_id: 5002}),
      knex('likes').insert({url_id: 5002}),
      knex('likes').insert({url_id: 5002}),
      knex('likes').insert({url_id: 5002}),
      knex('likes').insert({url_id: 5002}),
      knex('likes').insert({url_id: 5002}),
      knex('likes').insert({url_id: 5003, user_id: 2001}),
    ])
    return Promise.all([likes]);
  }).then(() => {
    //seeding rates
    const rates = Promise.all([
        knex('ratings').insert({url_id: 5002, user_id: 2002, rating:5}),
        knex('ratings').insert({ url_id: 5003, user_id: 2001, rating: 1 }),
        knex('ratings').insert({ url_id: 5004, user_id: 2002, rating: 4 }),
        knex('ratings').insert({ url_id: 5005, user_id: 2002, rating: 3 }),
        knex('ratings').insert({ url_id: 5006, user_id: 2002, rating: 2 })
      ])
    return Promise.all([rates]);
  })

};
