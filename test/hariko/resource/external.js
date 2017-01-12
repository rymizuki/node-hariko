var expect  = require('expect.js'),
    sinon   = require('sinon'),
    subvert = require('require-subvert')(__dirname);
var fs = require('fs');

describe('resource/external', function () {
  var external;
  beforeEach(function () {
    external = subvert.require('../../../lib/hariko/resource/external');
  });
  afterEach(function () {
    subvert.cleanUp();
  });
  describe('.filename(method, uriObject)', function () {
    describe('when give `GET /api/path/{to}{?page}`', function () {
      it('should be `api/path/to?page-GET.json`', function () {
        var filename = external.filename('GET', {
          template: '/api/path/{to}{?page}',
          path:     '/api/path/:to',
          queries: ['page']
        });
        expect(filename).to.be.eql('api/path/to?page-GET.json')
      })
    });
    describe('when give `POST /api/path/`', function () {
      it('should be `api/path/index-POST.json`', function () {
        var filename = external.filename('POST', {
          template: '/api/path/',
          path:     '/api/path/',
          queries: []
        });
        expect(filename).to.be.eql('api/path/index-POST.json');
      });
    });
    describe('when give `POST /api/path/to?page=1`', function () {
      it('should be `/api/path/to?page=1`', function () {
        var filename = external.filename('GET', {
          template: '/api/path/{to}{?page}',
          path:     '/api/path/to',
          queries: [{name: 'page', value: 1}]
        });
        expect(filename).to.be.eql('api/path/to?page=1-GET.json')
      });
    });
  });

  describe('.save(destribution, entries)', function () {
    it('should be write json files', function () {
      external.save('test/.output', [
        {file: 'api/app-GET.json', response: {data: {"message": "hello api."}}},
        {file: 'api/user/index-GET.json', response: {data: {"message": "hello world."}}},
        {file: 'api/multiple-GET.json', response: {data: {"message": "first."}}},
        {file: 'api/multiple-GET.json', response: {data: {"message": "second."}}},
      ]);
      expect(fs.readFileSync('test/.output/api/app-GET.json').toString())
        .to.be.eql('{\n    message: "hello api."\n}');
      expect(fs.readFileSync('test/.output/api/user/index-GET.json').toString())
        .to.be.eql('{\n    message: "hello world."\n}');
      expect(fs.readFileSync('test/.output/api/multiple-GET.json').toString())
        .to.be.eql('{\n    message: "first."\n}');
    });
  });

  describe('.read(destribution, entry)', function () {
    it('should be read json file', function () {
      var data = external.read('test/fixture/', {
        file: "api/app-GET.json"
      });
      expect(data).to.be.eql({
        status: 200,
        message: 'hello world'
      })
    });
  });
});
