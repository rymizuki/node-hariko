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
