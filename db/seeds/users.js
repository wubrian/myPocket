exports.seed = function(knex, Promise) {
  return knex('urls').del()
  .then(() => knex('users').del() )
  .then(() => knex('categories').del() )
  .then(() => {
    return knex('users').insert([
      {name: 'Alice', email: 'example1@gmail.com', password: '123'},
      {name: 'Bob', email: 'example2@gmail.com', password: '456'},
      {name: 'Charlie', email: 'example3@gmail.com', password: '456'},
    ]).returning('*');
  }).then((users) => {
    //seeding categories
    const categories = Promise.all([
      knex('categories').insert({name: 'Engineering'}),
      knex('categories').insert({name: 'Web Dev'}),
      knex('categories').insert({name: 'CS'})
    ]);
    return Promise.all([users, categories]);
  }).then(([users, categories]) => {
    //seeding urls
    const [alice, bob, charlie] = users;
    const [engineering, webDev, cS] = categories;
    const urls = Promise.all([
      knex('urls').insert({title:'https://online-learning.harvard.edu/course/cs50-introduction-computer-science', description: 'introduction to computer science from harvard', user_id: alice.id, category_id: cS.id , image: 'https://online-learning.harvard.edu/sites/default/files/styles/header/public/course/cs50x-original.jpg?itok=Cl52MS32'}),
      knex('urls').insert({title: 'https://www.fastcompany.com/28121/they-write-right-stuff', description: 'blog about how to write bug free code', user_id: bob.id, category_id:webDev.id, image: 'https://images.fastcompany.net/image/upload/w_1153,ar_16:9,c_fill,g_auto,f_auto,q_auto,fl_lossy/fc/28121-poster-p-1-fast-company-number-6-1996.jpg'}),
      knex('urls').insert({title: 'https://www.amazon.ca/Cracking-Coding-Interview-Programming-Questions/dp/0984782850/ref=sr_1_1/133-0972702-4166551?ie=UTF8&qid=1543368338&sr=8-1&keywords=cracking+the+coding+interview', description: 'book that helps with web dev interviews ', user_id: charlie.id , category_id: webDev.id , image: 'https://images-na.ssl-images-amazon.com/images/I/51l5XzLln%2BL._SX348_BO1,204,203,200_.jpg'}),
      knex('urls').insert({title: 'https://www.khanacademy.org/computing/computer-programming', description: 'Courses about computer programming', user_id: alice.id, category_id: webDev.id, image:'https://cdn.kastatic.org/images/khan-logo-dark-background.new.png'}),
      knex('urls').insert({title: 'https://www.khanacademy.org/science/electrical-engineering', description: 'Courses about electrical engineering', user_id: bob.id, category_id: engineering.id, image: 'https://cdn.kastatic.org/images/khan-logo-dark-background.new.png'}),
      knex('urls').insert({title: 'https://api.jquery.com/', description: 'Documentation for jquery api', user_id: alice.id , category_id: webDev.id, image: 'https://cdn-images-1.medium.com/max/1200/0*s1Goua9K1MuNuapv.jpg'}),
      knex('urls').insert({title: 'https://www.seleniumhq.org/', description: 'Documentation for selenium', user_id: bob.id , category_id: webDev.id , image: 'http://epages.su/upload/iblock/107/learn-selenium-a2c1a1be9fa6a703985944c78a0c8a25cbfc0a7775846b627af2edc2488d4e18.png'}),
      knex('urls').insert({title: 'https://www.awwwards.com/', description: 'inspiration for website design', user_id: charlie.id , category_id: webDev.id , image: 'https://assets.awwwards.com/assets/images/logo-schema.png'}),
      knex('urls').insert({title: 'https://www.wolframalpha.com/', description: 'website that helps with engineering problems', user_id: charlie.id, category_id: engineering.id, image: 'http://www.wolframalpha.com/share.png'})
    ])
  
    return Promise.all([users, categories,urls]);
  }).then(([users, categories, urls]) => {
    //seeding commments
    const [alice, bob, charlie] = users;
    const [engineering, webDev, cS] = categories;
    const [harvard,right,interview,khanComp,khanEl,JQ,SL,AWW,wolf] = urls;

    const comments = Promise.all([
      knex('comments').insert({url_id: harvard.id, user_id: alice.id, text: "this was helpful"})
    ])
    return Promise.all([users, categories,urls,comments]);
  })/*.then(([users, categories, urls,comments]) => {
    //seeding likes
    const [alice, bob, charlie] = users;
    const [engineering, webDev, cS] = categories;
    const [harvard,right,interview,khanComp,khanEl,JQ,SL,AWW,wolf] = urls;
    
    const likes = Promise.all([
      knex('likes').insert({url_id: interview.id, user_id: bob.id})
    ])
    return Promise.all([likes]);
  }).then(([users, categories, urls,comments, likes]) => {
    //seeding rates
    const [alice, bob, charlie] = users;
    const [engineering, webDev, cS] = categories;
    const [harvard,right,interview,khanComp,khanEl,JQ,SL,AWW,wolf] = urls;
    

    const rates = Promise.all([
      knex('ratings').insert({url_id: SL.id, user_id: charlie.id, rating:5})
    ])
    return Promise.all([ratings]);
  })
 */
};
