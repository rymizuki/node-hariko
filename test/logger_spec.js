var sinon   = require('sinon'),
    expect  = require('expect.js');
var dateformat = require('dateformat');

// set to no-color mode for colors.js
// SEE ALSO: https://github.com/Marak/colors.js
process.argv.push('--no-color');

var LEVELS = [
  'debug',
  'verbose',
  'info',
  'warn',
  'error'
];

describe('logger', function () {
  var logger;
  before(function () {
    logger = require('../lib/logger');
  });

  describe('.level', function () {
    describe('default level', function () {
      it('should be `info`', function () {
        expect(logger.level).to.be.eql('info');
      });
    });
    for (var i = 0; i < LEVELS.length; i++) {
      var level = LEVELS[i];
      describe('when set `'+level+'`', function () {
        it('should be `'+level+'`', function () {
          logger.level = level;
          expect(logger.level).to.be.eql(level);
        });
      });
    };
  });

  describe('.time', function () {
    describe('default time', function () {
      it('should be false', function () {
        expect(logger.time).to.be.eql(false);
      });
    });
    describe('when set true', function () {
      beforeEach(function () {
        logger.time = true;
      });
      describe('logger.time', function () {
        it('should be true', function () {
          logger.time = true;
          expect(logger.time).to.be.eql(true);
        });
      });
    });
    describe('when set false', function () {
      beforeEach(function () {
        logger.time = false;
      });
      describe('logger.time', function () {
        it('should be false', function () {
          logger.time = false;
          expect(logger.time).to.be.eql(false);
        });
      });
    });
  });

  describe('logger.format', function () {
    describe('logger.level is `info` and logger.time is false', function () {
      beforeEach(function () {
        logger.level = 'info';
        logger.time  = false;
      });
      it('should be `[INFO] message`', function () {
        expect(logger.format('info', ['hello world'])).to.be.eql([
            '[INFO] hello world',
        ]);
      });
    });
    describe('logger.level is `info` and logger.time is true', function () {
      var clock,
          now;
      beforeEach(function () {
        logger.level = 'info';
        logger.time  = true;
      });
      beforeEach(function () {
        now = new Date();
        clock = sinon.useFakeTimers(now.getTime());
      });
      afterEach(function () {
        now = void 0;
        clock.restore();
        clock = void 0;
      });
      it('should be `[HH:MM:ss:l][INFO] message`', function () {
        expect(logger.format('info', ['hello world'])).to.be.eql([
            '['+dateformat(now, 'HH:MM:ss:l')+'][INFO] hello world',
        ]);
      });
    });
  });

  for (var i = 0; i < LEVELS.length; i++) {
    var level = LEVELS[i];
    describe('.'+level+'()', function () {
      describe('when called', function () {
        beforeEach(function () {
          sinon.stub(logger, 'log');
        });
        afterEach(function () {
          logger.log.restore();
        });
        it('should be call logger.log', function () {
          logger[level]('hello world');
          expect(logger.log.calledOnce).to.be.ok();
        });
      });
    });
  }

  describe('.log(level, [arguments])', function () {
    beforeEach(function () {
      sinon.spy(console, 'log');
    });
    afterEach(function () {
      console.log.restore();
    });
    describe('when logger.level is `debug`', function () {
      beforeEach(function () {
        logger.level = 'debug';
      });
      ['debug', 'verbose', 'info', 'warn', 'error'].forEach(function (level) {
        it('should be output level `'+level+'`', function () {
          logger[level]('hello world');
          expect(console.log.calledOnce).to.be.ok();
        });
      });
    });
    describe('when call level=`verbose`', function () {
      beforeEach(function () {
        logger.level = 'verbose';
      });
      ['verbose', 'info', 'warn', 'error'].forEach(function (level) {
        it('should be output level `'+level+'`', function () {
          logger[level]('hello world');
          expect(console.log.calledOnce).to.be.ok();
        });
      });
    });
    describe('when call level=`info`', function () {
      beforeEach(function () {
        logger.level = 'info';
      });
      ['info', 'warn', 'error'].forEach(function (level) {
        it('should be output level `'+level+'`', function () {
          logger[level]('hello world');
          expect(console.log.calledOnce).to.be.ok();
        });
      });
    });
    describe('when call level=`warn`', function () {
      beforeEach(function () {
        logger.level = 'warn';
      });
      ['warn', 'error'].forEach(function (level) {
        it('should be output level `'+level+'`', function () {
          logger[level]('hello world');
          expect(console.log.calledOnce).to.be.ok();
        });
      });
    });
    describe('when call level=`error`', function () {
      beforeEach(function () {
        logger.level = 'error';
      });
      ['error'].forEach(function (level) {
        it('should be output level `'+level+'`', function () {
          logger[level]('hello world');
          expect(console.log.calledOnce).to.be.ok();
        });
      });
    });
  });
});
