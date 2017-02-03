var sinon  = require('sinon'),
    expect = require('expect.js');
var Entries = require('../../lib/hariko/entries');

describe('Entries', function () {
  describe('.ensure', function () {
    it('should be save in class property', function () {
      var entries = new Entries();
      var rawData = [
        {
          file: 'api/app-GET.json',
          request: {
            method: 'GET',
            uri: {'path': '/api/app', 'template': '/api/app', 'queries': []}
          },
          response: {
            statusCode: 200,
            headers: [{'name': 'Content-Type', 'value': 'application/json'}],
            body: '    {\n      \'status\': 200\n    }\n',
            data: {'status': 200}
          }
        },
      ];
      entries.ensure(rawData);
      expect(entries.rows).to.be.equal(rawData);
    })
  });
  describe('.get', function () {
    describe('rejection', function () {
      var entries;
      var fixture;
      beforeEach(function () {
        fixture = [
          {
            file: 'api/file-GET.json',
            request: { method: 'GET', uri: {path: '/api/app', template: '/api/app', queries: []}},
          }
        ];
        entries = new Entries();
        entries.ensure(fixture);
      });
      describe('matching', function () {
        it('should be entry', function () {
          var entry = entries.get({ method: 'GET', path: '/api/app', query: {} });
          expect(entry).to.be.eql(fixture[0]);
        });
      });
      describe('non-matching method', function () {
        it('should be undefined', function () {
          var entry = entries.get({ method: 'POST', path: '/api/app', query: {} });
          expect(entry).to.be.eql(undefined);
        });
      });
      describe('non-matching path', function () {
        it('should be undefined', function () {
          var entry = entries.get({ method: 'GET', path: '/api/notfound', query: {} });
          expect(entry).to.be.eql(undefined);
        });
      });
    });
    describe('queries', function () {
      var entries;
      var fixture;
      beforeEach(function () {
        fixture = [
          { request: { method: 'GET', uri: { path: '/api/app', queries: [] }, } },
          { request: { method: 'GET', uri: { path: '/api/app', queries: [ 'a' ]}, } },
          { request: { method: 'GET', uri: { path: '/api/app', queries: [ {name: 'b', value: '1'}, {name: 'c', value: '2'} ]}, } },
          { request: { method: 'GET', uri: { path: '/api/app2', queries: ['a'] }, } },
        ];
        entries = new Entries();
        entries.ensure(fixture);
      });
      describe('not exists', function () {
        it('should be entry', function () {
          var entry = entries.get({ method: 'GET', path: '/api/app', query: {} });
          expect(entry).to.be.eql(fixture[0]);
        });
      });
      describe('perfect matched', function () {
        it('should be entry', function () {
          var entry = entries.get({ method: 'GET', path: '/api/app', query: {b: '1', c: '2'} });
          expect(entry).to.be.eql(fixture[2]);
        });
      });
      describe('partial matched', function () {
        it('should be entry', function () {
          var entry = entries.get({ method: 'GET', path: '/api/app', query: {b: '1'} });
          expect(entry).to.be.eql(fixture[2]);
        });
        it('should be entry', function () {
          var entry = entries.get({ method: 'GET', path: '/api/app', query: {b: '1', c: '5'} });
          expect(entry).to.be.eql(fixture[2]);
        });
      });
      describe('key matched', function () {
        it('should be entry', function () {
          var entry = entries.get({ method: 'GET', path: '/api/app', query: {a: '1'} });
          expect(entry).to.be.eql(fixture[1]);
        });
      });
      describe('non-matched', function () {
        it('should be entry', function () {
          var entry = entries.get({ method: 'GET', path: '/api/app2', query: {xxx: '1'} });
          expect(entry).to.be.eql(fixture[3]);
        });
      });
      describe('extra', function () {
        it('should be entry', function () {
          var entry = entries.get({ method: 'GET', path: '/api/app', query: {xxx: '1'} });
          expect(entry).to.be.eql(fixture[2]);
        });
      });
    });
  });
  describe('.raw', function () {
    it('should be retuns raw-data', function () {
      var entries = new Entries();
      var rawData = [
        {
          file: 'api/app-GET.json',
          request: {
            method: 'GET',
            uri: {'path': '/api/app', 'template': '/api/app', 'queries': []}
          },
          response: {
            statusCode: 200,
            headers: [{'name': 'Content-Type', 'value': 'application/json'}],
            body: '    {\n      \'status\': 200\n    }\n',
            data: {'status': 200}
          }
        },
      ];
      entries.ensure(rawData);
      expect(entries.raw()).to.be.equal(rawData);
    });
  });
})
