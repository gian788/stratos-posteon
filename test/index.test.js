var should = require('should');
var path = require('path');

var posteon = require('../lib/index');
var fakeProvider = require('./fakeProvider')();

describe('Render', function() {

  it('set', function(done) {
    posteon.set('test', true);
    posteon.options.test.should.be.equal(true);
    done();
  });

  it('get', function(done) {
    posteon.get('test').should.be.equal(true);
    done();
  });

  it('addFilter', function(done) {
    posteon.addFilter('test', function () {
      return 'TEST';
    });
    done();
  });

  it('addFilters', function(done) {
    posteon.addFilter({
      test: function () {
        return 'TEST';
      }
    });
    done();
  });

  it('loadFilters', function(done) {
    posteon.loadFilters(path.join(__dirname, 'filters'), function (err) {
      should.not.exist(err);
      done();
    });
  });

  it('init', function(done) {
    posteon.init({
      testInit: 2,
      dbs: {
        mongoDB: {
          uri: 'mongodb://localhost/mailer-dev',
          debug: false,
          options: {},
        },
      },
      queue: {
        lockTime: 60 * 1000,
      },
    });
    posteon.options.testInit.should.be.equal(2);
    done();
  });

	it('send', function(done) {
    posteon.addProvider(fakeProvider);

    var options = {
      provider: {
        name: fakeProvider.name,
        apiKey: ''
      },
      to: {name: 'John', email: 'john@dra.it', data: {name: 'John'}},
      from: {name: 'Stratos', email: 'dev@digitalrockers.it'},
      render: {
        layout: {
          type: 'file',
          dir: path.join(__dirname, './templates/'),
          name: 'layout',
        },
        template: {
          type: 'file',
          dir: path.join(__dirname, './templates/'),
          name: 'test'
        },
        renderEngine: 'ejs'
      }
    };
    posteon.send(options, function (err, response) {
      should.not.exist(err);
      response.should.be.instanceOf(Object);
      response.should.have.property('status').equal('queued');
      done();
    });
	});

  it('send', function(done) {
    posteon.addProvider(fakeProvider);
    var options = {
      provider: {
        name: fakeProvider.name,
        apiKey: ''
      },
      to: {name: 'John', email: 'john@dra.it', data: {name: 'John'}},
      from: {name: 'Stratos', email: 'dev@digitalrockers.it'},
      render: {
        layout: {
          type: 'file',
          dir: path.join(__dirname, './templates/'),
          name: 'layout',
        },
        template: {
          type: 'file',
          dir: path.join(__dirname, './templates/'),
          name: 'test'
        },
        renderEngine: 'ejs'
      }
    };
    posteon.send(options, function (err, response) {
      should.not.exist(err);
      response.should.be.instanceOf(Object);
      response.should.have.property('status').equal('queued');
      done();
    });
	});
});
