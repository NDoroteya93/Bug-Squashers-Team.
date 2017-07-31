const request = require('supertest');

describe('/sells tests', () => {
    const connectionString = 'mongodb://localhost/items-db-test';
    let app = null;

    beforeEach(() => {
        return Promise.resolve()
         .then(() => require('../../../../../app/db').connect(connectionString))
    .then((database) => {
        const data = require('../../../../../app/data').initData(database);
        return require('../../../../../app').initApp(data, database);
    })
    .then((_app) => {
        app = _app;
    });
    });

    describe('GET /sells/', () => {
        it('expect to return 200', (done) => {
            request(app)
                .get('/rents/')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    return done();
                });
        });
    });

        describe('GET /sells/all', () => {
        it('expect to return 200', (done) => {
            request(app)
                .get('/rents/all')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    return done();
                });
        });
    });
});
