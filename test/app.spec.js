const app = require('../src/app')

describe('App', () => {
    it('GET / responds with 200 containing "Hello, world!"', () => {
        return supertest(app)
            .get('/')
            .expect(200, 'Hello, world!')
    }),
        describe('/api/users', () => {
            it('POST / responds with user information', () => {
            })
        }),
        describe('/api/auth', () => {
            it('POST /login', () => {
            })
        }),
        describe('/api/meal', () => {
            it('GET / ', () => {
            }),
                it('POST / ', () => {
                }),
                it('GET /:week ', () => {
                }),
                it('PATCH /:id ', () => {
                }),
                it('DELETE /:id ', () => {
                })

        })
})