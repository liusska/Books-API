const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./server');
const expect = chai.expect;

chai.use(chaiHttp);


describe('Books API', () => {
    let bookId;

    it('should POST a book', (done) => {
        const book = {
            id: "1",
            title: "Test Book",
            author: "Test Author"
        };

        chai.request(server)
            .post('/books')
            .send(book)
            .end((err, res) => {
                if (err) { return done }
                expect(res).to.have.status(201);
                expect(res.body).to.be.a('object');
                expect(res.body).to.be.have.property('id');
                expect(res.body).to.be.have.property('title');
                expect(res.body).to.be.have.property('author');
                bookId = res.body.id;
                done();
            });
    });

    it('should GET all books', (done) => {
        chai.request(server)
            .get('/books')
            .end((err, res) => {
                if (err) { return done }
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                done();
            });
    });

    it('should GET a single book', (done) => {
        chai.request(server)
            .get('/books/1')
            .end((err, res) => {
                if (err) { return done }
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.be.have.property('id');
                expect(res.body).to.be.have.property('title');
                expect(res.body).to.be.have.property('author');
                bookId = res.body.id;
                done();
            });
    });

    it('should PUT an existing book', (done) => {
        const bookId = 1;
        const updateBook = {
            id: "1",
            title: "Update Test Book",
            author: "Update Test Author"
        };
        chai.request(server)
            .put('/books/1')
            .send(updateBook)
            .end((err, res) => {
                if (err) { return done }
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.title).to.equal('Update Test Book');
                expect(res.body.author).to.equal('Update Test Author');
                done();
            });
    });

    it('Should return 404 when trying to GET, PUT, DELETE a non-existinf book', (done) => {
        chai.request(server)
            .get('/books/99')
            .end((err, res) => {
                if (err) { return done }
                expect(res).to.have.status(404);
            });
        
        chai.request(server)
            .put('/books/99')
            .send({ 
                id: "1",
                title: "Non-existing Test Book",
                author: "Non-existing Test Author"
            })
            .end((err, res) => {
                if (err) { return done }
                expect(res).to.have.status(404);
            });  
        
        chai.request(server)
            .delete('/books/99')
            .end((err, res) => {
                if (err) { return done }
                expect(res).to.have.status(404);
                done();
            });

    });
});