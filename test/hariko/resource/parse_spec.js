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
      var data = parser.parse(fs.readFileSync(path.join(path.dirname(__filename), 'fixture.md')).toString());
      expect(data).to.be.eql({
        entries: [
          {
            "file": "index-GET.json",
            "request": {
              "method": "GET",
              "uri": {
                "path": "/",
                "template": "/",
                "queries": []
              }
            },
            "response": {
              "statusCode": 200,
              "headers": [{"name": "Content-Type", "value": "text/plain"}],
              "body": "Hello world\n",
              "data": null
            }
          },
          {
            "file": "api/app-GET.json",
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
            "file": "api/user?page-GET.json",
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
            "file": "api/user/user_id-GET.json",
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
            "file": "api/user-POST.json",
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
            "file": "api/user/user_id-PUT.json",
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
            "file": "api/item/hariko-GET.json",
            "request": {
              "method": "GET",
              "uri": {
                "path": "/api/item/hariko",
                "template": "/api/item/{item_id}",
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
            "file": "api/item/deco-GET.json",
            "request": {
              "method": "GET",
              "uri": {
                "path": "/api/item/deco",
                "template": "/api/item/{item_id}",
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
            "file": "api/item/item_id-GET.json",
            "request": {
              "method": "GET",
              "uri": {
                "path": "/api/item/:item_id",
                "template": "/api/item/{item_id}",
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
        ],
        warnings: [
          {
            "code": 5,
            "message": "unexpected header block, expected a group, resource or an action definition, e.g. '# Group <name>', '# <resource name> [<URI>]' or '# <HTTP method> <URI>'",
            "location": [
              {"index": 686, "length": 7}
            ]
          },
          {
            "code": 6,
            "message": "action is missing a response",
            "location": [
              {"index":693,"length":26}
            ]
          }
        ]
      });
    });
  });
});
