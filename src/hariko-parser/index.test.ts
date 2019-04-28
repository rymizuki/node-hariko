import assert = require('assert')
import * as HarikoParser from './'

describe('HarikoParser', () => {
  describe('parse', () => {
    describe('パラメータが定義されている', () => {
      describe('Requestセクションがない', () => {
        it('単一のエントリが登録される', () => {
          const result = HarikoParser.parse(`
# GET /posts/{year}/{month}

+ Response 200 (application/json)

        []
`)
          assert.deepEqual(result, {
            entries: [
              {
                file: 'posts/year/month-GET.json',
                request: {
                  method: 'GET',
                  uri: {
                    path: '/posts/:year/:month',
                    template: '/posts/{year}/{month}',
                    queries: []
                  }
                },
                response: {
                  statusCode: 200,
                  headers: [
                    { name: 'Content-Type', value: 'application/json' }
                  ],
                  body: '[]\n',
                  data: []
                }
              }
            ],
            warnings: []
          })
        })
      })

      describe('Requestセクションがある', () => {
        it('リクエスト分のエントリが登録される', () => {
          const result = HarikoParser.parse(`
# GET /posts/{year}/{month}

+ Request GET /posts/2019/04

+ Response 200 (application/json)

        []

+ Request GET /posts/2019/05

+ Response 200 (application/json)

        []
`)
          assert.deepEqual(result, {
            entries: [
              {
                file: 'posts/2019/04-GET.json',
                request: {
                  method: 'GET',
                  uri: {
                    path: '/posts/2019/04',
                    template: '/posts/2019/04',
                    queries: []
                  }
                },
                response: {
                  statusCode: 200,
                  headers: [
                    { name: 'Content-Type', value: 'application/json' }
                  ],
                  body: '[]\n',
                  data: []
                }
              },
              {
                file: 'posts/2019/05-GET.json',
                request: {
                  method: 'GET',
                  uri: {
                    path: '/posts/2019/05',
                    template: '/posts/2019/05',
                    queries: []
                  }
                },
                response: {
                  statusCode: 200,
                  headers: [
                    { name: 'Content-Type', value: 'application/json' }
                  ],
                  body: '[]\n',
                  data: []
                }
              },
              {
                file: 'posts/year/month-GET.json',
                request: {
                  method: 'GET',
                  uri: {
                    path: '/posts/:year/:month',
                    template: '/posts/{year}/{month}',
                    queries: []
                  }
                },
                response: {
                  statusCode: 200,
                  headers: [
                    { name: 'Content-Type', value: 'application/json' }
                  ],
                  body: '[]\n',
                  data: []
                }
              }
            ],
            warnings: []
          })
        })
      })
    })

    describe('クエリが定義されている', () => {
      describe('Requestセクションがない', () => {
        it('クエリのカラムが設定されている', () => {
          const result = HarikoParser.parse(`
# GET /posts/{year}/{month}{?page}

+ Response 200 (application/json)

        []
`)
          assert.deepEqual(result, {
            entries: [
              {
                file: 'posts/year/month?page-GET.json',
                request: {
                  method: 'GET',
                  uri: {
                    path: '/posts/:year/:month',
                    template: '/posts/{year}/{month}{?page}',
                    queries: ['page']
                  }
                },
                response: {
                  statusCode: 200,
                  headers: [
                    { name: 'Content-Type', value: 'application/json' }
                  ],
                  body: '[]\n',
                  data: []
                }
              }
            ],
            warnings: []
          })
        })
      })

      describe('Requestが定義されている', () => {
        it('クエリのカラムとパラメータが定義されている', () => {
          const result = HarikoParser.parse(`
# GET /posts/{year}/{month}{?page}

+ Request GET  /posts/{year}/{month}?page=1
+ Response 200 (application/json)

        []

+ Request GET  /posts/{year}/{month}?page=2
+ Response 200 (application/json)

        []
`)
          assert.deepEqual(result, {
            entries: [
              {
                file: 'posts/year/month?page=1-GET.json',
                request: {
                  method: 'GET',
                  uri: {
                    path: '/posts/:year/:month',
                    template: '/posts/{year}/{month}?page=1',
                    queries: [{ name: 'page', value: '1' }]
                  }
                },
                response: {
                  statusCode: 200,
                  headers: [
                    { name: 'Content-Type', value: 'application/json' }
                  ],
                  body: '[]\n',
                  data: []
                }
              },
              {
                file: 'posts/year/month?page=2-GET.json',
                request: {
                  method: 'GET',
                  uri: {
                    path: '/posts/:year/:month',
                    template: '/posts/{year}/{month}?page=2',
                    queries: [{ name: 'page', value: '2' }]
                  }
                },
                response: {
                  statusCode: 200,
                  headers: [
                    { name: 'Content-Type', value: 'application/json' }
                  ],
                  body: '[]\n',
                  data: []
                }
              },
              {
                file: 'posts/year/month?page-GET.json',
                request: {
                  method: 'GET',
                  uri: {
                    path: '/posts/:year/:month',
                    template: '/posts/{year}/{month}{?page}',
                    queries: ['page']
                  }
                },
                response: {
                  statusCode: 200,
                  headers: [
                    { name: 'Content-Type', value: 'application/json' }
                  ],
                  body: '[]\n',
                  data: []
                }
              }
            ],
            warnings: []
          })
        })
      })
    })
  })
})
