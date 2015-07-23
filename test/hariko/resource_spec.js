var expect  = require('expect.js'),
    sinon   = require('sinon'),
    subvert = require('require-subvert')(__dirname);

describe('harikoResource', function () {
  var external;
  beforeEach(function () {
    external = {
      read: sinon.stub(),
      save: sinon.stub()
    };
    subvert.subvert('../../lib/hariko/resource/external', external);
  });
  afterEach(function () {
    external = null;
  });

  var harikoResource;
  beforeEach(function () {
    harikoResource = subvert.require('../../lib/hariko/resource');
  });
  afterEach(function () {
    subvert.cleanUp();
    harikoServer = null;
  });

  describe('default options', function () {
    describe('when options.output is ture', function () {
      it('should be set options.output is `.hariko-cache`', function () {
        var resource = harikoResource.create(['./test/fixture/output.md'], {output: true});
        expect(resource.options.output).to.be.eql('.hariko-cache');
      });
    });
    describe('when options.output is `\'\'`', function () {
      it('should be set options.output is `.hariko-cache`', function () {
        var resource = harikoResource.create(['./test/fixture/output.md'], {output: ''});
        expect(resource.options.output).to.be.eql('.hariko-cache');
      });
    });
    describe('when options.output typeof string', function () {
      it('should be options.output is specified', function () {
        var resource = harikoResource.create(['./test/fixture/output.md'], {output: './test/.output'});
        expect(resource.options.output).to.be.eql('./test/.output');
      });
    });
  });

  describe('.read()', function () {
    var resource;
    beforeEach(function () {
      resource = harikoResource.create(['./test/hariko/fixture/app.md']);
    });
    afterEach(function () {
      resource = null;
    });

    describe('when parse successful', function () {
      it('should be return data', function () {
        resource.read();
        expect(resource._data).to.be.eql([
          {
            "file": "api/app-GET.json",
            "request": {
              "method": "GET",
              "uri": {"path": "/api/app", "template": "/api/app", "queries": []}
            },
            "response": {
              "statusCode": 200,
              "headers": [{"name": "Content-Type", "value": "application/json"}],
              "body": "    {\n      \"status\": 200\n    }\n",
              "data": {"status": 200}
            }
          },
          {
            "file": "api/app-POST.json",
            "request": {
              "method": "POST",
              "uri": {"path": "/api/app", "template": "/api/app", "queries": []}
            },
            "response": {
              "statusCode": 200,
              "headers": [{"name": "Content-Type", "value": "application/json"}],
              "body": "    {\n      \"status\": 200\n    }\n",
              "data": {"status": 200}
            }
          },
          {
            "file": "api/app-PUT.json",
            "request": {
              "method": "PUT",
              "uri": {"path": "/api/app", "template": "/api/app", "queries": []}
            },
            "response": {
              "statusCode": 200,
              "headers": [{"name": "Content-Type", "value": "application/json"}],
              "body": "    {\n      \"status\": 200\n    }\n",
              "data": {"status": 200}
            }
          },
          {
            "file": "api/app-DELETE.json",
            "request": {
              "method": "DELETE",
              "uri": {"path": "/api/app", "template": "/api/app", "queries": []}
            },
            "response": {
              "statusCode": 200,
              "headers": [{"name": "Content-Type", "value": "application/json"}],
              "body": "    {\n      \"status\": 200\n    }\n",
              "data": {"status": 200}
            }
          }
        ]);
      });
      it('should be return empty warnings', function () {
        expect(resource._warnings).to.be.eql([]);
      });
    });
  });

  describe('.watch([cb])', function () {
    var resource;
    beforeEach(function () {
      resource = harikoResource.create(['./test/hariko/fixture/app.md']);
    });
    afterEach(function () {
      resource = null;
    });

    describe('when emited watcher event', function () {
      describe('without callback', function () {
        beforeEach(function () {
          sinon.stub(resource, 'read');
        });
        afterEach(function () {
          resource.read.restore();
        });
        it('should call `resource.read`', function () {
          resource.watch();
          resource.watcher.emit('all');
          expect(resource.read.calledOnce).to.be.ok();
          resource.watcher.close();
        });
      });
      describe('with callback', function () {
        var cb;
        beforeEach(function () {
          sinon.stub(resource, 'read');
          cb = sinon.stub();
        });
        afterEach(function () {
          resource.read.restore();
          cb = null
        });
        beforeEach(function () {
          resource.watch(cb);
          resource.watcher.emit('all');
        });
        afterEach(function () {
          resource.watcher.close();
        });

        it('should call `resource.read`', function () {
          expect(resource.read.calledOnce).to.be.ok();
        });
        it('should call callback', function () {
          expect(cb.calledOnce).to.be.ok();
        });
      });
    });
  });

  describe('.getEntry()', function () {
    var resource;
    beforeEach(function () {
      resource = harikoResource.create(['./test/hariko/fixture/entries.md']);
    });
    afterEach(function () {
      resource = null;
    });
    describe('resource has empty', function () {
      it('should be return undefined', function () {
        var entry = resource.getEntry({
          method: 'GET',
          path:   '/api/undefined',
          query:  {}
        })
        expect(entry).to.not.be.ok();
      });
    });
    describe('resource has only GET /api/app', function () {
      describe('request is GET /api/app', function () {
        it('should be return entry object', function () {
          var entry = resource.getEntry({
            method: 'GET',
            path:   '/api/app',
            query:  {}
          });
          expect(entry).to.be.eql({
            file: "api/app-GET.json",
            request: {
              method: 'GET',
              uri: {path: '/api/app', template: '/api/app', queries: []}
            },
            response: {
              statusCode: 200,
              headers: [{name: 'Content-Type', value: 'application/json'}],
              body: '    {\n      \"status\": 200\n    }\n',
              data: {status: 200}
            }
          });
        });
      });
    });
    describe('resource has only GET /api/user/:user_id', function () {
      describe('request is GET /api/user/1111', function () {
        it('should be return entry object', function () {
          var entry = resource.getEntry({
            method: 'GET',
            path:   '/api/user/1111',
            query:  {}
          });
          expect(entry).to.be.eql({
            file: "api/user/user_id-GET.json",
            request: {
              method: 'GET',
              uri: {path: '/api/user/:user_id', template: '/api/user/{user_id}', queries: []}
            },
            response: {
              statusCode: 200,
              headers: [{name: 'Content-Type', value: 'application/json'}],
              body: '    {}\n',
              data: {}
            }
          });
        });
      });
    });
    describe('resource has any requests', function () {
      describe('request found in examples', function () {
        it('should be return entry object', function () {
          var entry = resource.getEntry({
            method: 'GET',
            path:   '/api/item/',
            query:  {page: 2}
          });
          expect(entry).to.be.eql({
            file: "api/item/index?page=2-GET.json",
            request: {
              method: 'GET',
              uri: {path: '/api/item/', template: '/api/item/{?page}', queries: [{name: 'page', value: '2'}]}
            },
            response: {
              statusCode: 200,
              headers: [{name: 'Content-Type', value: 'application/json'}],
              body: '    {"page": 2}\n',
              data: {page: 2}
            }
          });
        });
      });
      describe('request not found in examples', function () {
        it('should be return entry object', function () {
          var entry = resource.getEntry({
            method: 'GET',
            path:   '/api/item/',
            query:  {page: 3}
          });
          expect(entry).to.be.eql({
            file: "api/item/index?page-GET.json",
            request: {
              method: 'GET',
              uri: {path: '/api/item/', template: '/api/item/{?page}', queries: ['page']}
            },
            response: {
              statusCode: 200,
              headers: [{name: 'Content-Type', value: 'application/json'}],
              body: '    {"page": 1}\n',
              data: {page: 1}
            }
          });
        });
      });
    });
  });

  describe('enable output mode', function () {
    describe('when read resouce', function () {
      it('should be save entries for options.output', function () {
        var resource = harikoResource.create(['./test/fixture/output.md'], {output: './test/.output'});
        expect(external.save.calledOnce).to.be.ok();
        expect(external.save.args[0][0]).to.be.eql('./test/.output');
        expect(external.save.args[0][1]).to.be.eql([
          {
            file: "output-GET.json",
            request: {
              method: "GET",
              uri: {path: "/output", template: "/output", queries: []}
            },
            response: {
              statusCode: 200,
              headers: [{name: 'Content-Type', value: 'text/plain'}],
              body: "Hello world\n",
              data: null
            }
          }
        ]);
      });
    });
    describe('when got entry', function () {
      var resource;
      beforeEach(function () {
        resource = harikoResource.create(['./test/fixture/output.md'], {output: './test/.output'});
      });
      afterEach(function () {
        resource = null;
      });
      beforeEach(function () {
        external.read.returns({status: 200});
      });
      it('should be read form options.output', function () {
        var entry = resource.getEntry({
          method: 'GET',
          path:   '/output',
          query:  {}
        });
        expect(external.read.calledOnce).to.be.ok();
        expect(external.read.args[0][0]).to.be.eql('./test/.output');
        expect(external.read.args[0][1]).to.be.eql(entry);
        expect(entry.response.data).to.be.eql({status: 200});
      });
    });
  });
});
