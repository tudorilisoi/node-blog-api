const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

let serverPromise

describe('Blog Posts', function() {

  before(function() {
    serverPromise =  runServer();
  });

  after(function() {
    serverPromise = null
    return closeServer();
  });

  it('should list items on GET', function() {

    return serverPromise.then(()=>chai.request(app)
      .get('/posts')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        console.log("GOT /posts JSON")

        expect(res.body.length).to.be.at.least(1);
        const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys(expectedKeys);
        });
      }));
  });


  it('should add an item on POST', function() {
    const newPost = {
      title: 'pizza',
      content: ['how are those pepperoni so round, id like to know'],
      author: 'paul'
    };
    return chai.request(app)
      .post('/blog-posts')
      .send(newPost)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
        expect(res.body.id).to.not.equal(null);
        // response should be deep equal to `newItem` from above if we assign
        // `id` to it from `res.body.id`
        console.log('res dot body', res.body);
  console.log('newPost', newPost)
        expect(res.body).to.deep.equal(Object.assign(newPost, {id: res.body.id}, {publishDate: res.body.publishDate}));

      });
  });

  it('should update items on PUT', function() {
    const updateData = {
      name: 'pizza',
      content: 'emmy squared: four stars'
    };

    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        updateData.id = res.body[0].id;

        return chai.request(app)
          .put(`/blog-posts/${updateData.id}`)
          .send(updateData);
      })

      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });


  it('should delete items on DELETE', function() {
    return chai.request(app)

      .get('/blog-posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-posts/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });
});
