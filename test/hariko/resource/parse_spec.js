var expect = require('expect.js'),
    sinon  = require('sinon');
var fs   = require('fs'),
    path = require('path');

describe('hariko/resource/parser', function () {
  var parser;
  beforeEach(function () {
    parser = require('../../../lib/hariko/resource/parser');
  });
  afterEach(function () {
    parser = null;
  });
  describe('.parse(markdown_data)', function () {
    it('should be parse content', function () {
      expect(parser.parse(fs.readFileSync(path.join(path.dirname(__filename), 'fixture.md')).toString())).to.be.eql({
        entries: [
          {
            "request": {
              "method": "GET",
              "uri": {
                "path": "/api/app",
                "template": "/api/app",
                "queries": []
              }
            },
            "response": {
              "statusCode": 200,
              "headers": [{name: 'Content-Type', value: 'application/json'}],
              "body": "    {}\n",
              "data": {},
            }
          },
          {
            "request": {
              "method": "GET",
              "uri": {
                "path": "/api/user",
                "template": "/api/user{?page}",
                "queries": ['page']
              }
            },
            "response": {
              "statusCode": 200,
              "headers": [{name: 'Content-Type', value: 'application/json'}],
              "body": "    {}\n",
              "data": {},
            }
          },
          {
            "request": {
              "method": "GET",
              "uri": {
                "path": "/api/user/:user_id",
                "template": "/api/user/{user_id}",
                "queries": []
              }
            },
            "response": {
              "statusCode": 200,
              "headers": [{name: 'Content-Type', value: 'application/json'}],
              "body": "    {}\n",
              "data": {},
            }
          },
          {
            "request": {
              "method": "POST",
              "uri": {
                "path": "/api/user",
                "template": "/api/user",
                "queries": []
              }
            },
            "response": {
              "statusCode": 200,
              "headers": [{name: 'Content-Type', value: 'application/json'}],
              "body": "    {}\n",
              "data": {},
            }
          },
          {
            "request": {
              "method": "PUT",
              "uri": {
                "path": "/api/user/:user_id",
                "template": "/api/user/{user_id}",
                "queries": []
              }
            },
            "response": {
              "statusCode": 200,
              "headers": [{name: 'Content-Type', value: 'application/json'}],
              "body": "    {}\n",
              "data": {},
            }
          },
          {
            "request": {
              "method": "GET",
              "uri": {
                "path": "/api/item/hariko",
                "template": "/api/item/hariko",
                "queries": []
              }
            },
            "response": {
              "statusCode": 200,
              "headers": [{name: 'Content-Type', value: 'application/json'}],
              "body": "    []\n",
              "data": []
            }
          },
          {
            "request": {
              "method": "GET",
              "uri": {
                "path": "/api/item/deco",
                "template": "/api/item/deco",
                "queries": []
              }
            },
            "response": {
              "statusCode": 200,
              "headers": [{name: 'Content-Type', value: 'application/json'}],
              "body": "    []\n",
              "data": []
            }
          }
        ],
        warnings: []
      });
    });
  });
});
