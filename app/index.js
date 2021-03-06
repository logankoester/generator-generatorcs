(function() {
  var GeneratorGeneratorGruntCoffee, GitHubApi, extractGeneratorName, github, githubUserInfo, path, util, yeoman,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  util = require('util');

  yeoman = require('yeoman-generator');

  GitHubApi = require('github');

  github = new GitHubApi({
    version: '3.0.0'
  });

  extractGeneratorName = function(_, appname) {
    var match, slugged;
    slugged = _.slugify(appname);
    match = slugged.match(/^generator-(.+)/);
    if (match && match.length === 2) {
      return match[1].toLowerCase();
    } else {
      return slugged;
    }
  };

  githubUserInfo = function(name, cb) {
    return github.user.getFrom({
      user: name
    }, function(err, res) {
      if (err) {
        throw err;
      }
      return cb(JSON.parse(JSON.stringify(res)));
    });
  };

  module.exports = GeneratorGeneratorGruntCoffee = (function(_super) {
    __extends(GeneratorGeneratorGruntCoffee, _super);

    function GeneratorGeneratorGruntCoffee(args, options) {
      yeoman.generators.Base.apply(this, arguments);
      this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
      this.currentYear = (new Date()).getFullYear();
      this.on('end', function() {
        if (!options['skip-install']) {
          return this.npmInstall();
        }
      });
    }

    GeneratorGeneratorGruntCoffee.prototype.askFor = function() {
      var done, generatorName, prompts;
      done = this.async();
      generatorName = extractGeneratorName(this._, this.appname);
      console.log(this.yeoman);
      prompts = [
        {
          name: 'githubUser',
          message: 'Would you mind telling me your username on Github?',
          "default": 'someuser'
        }, {
          name: 'generatorName',
          message: 'What\'s the base name of your generator?',
          "default": generatorName
        }
      ];
      return this.prompt(prompts, (function(_this) {
        return function(props) {
          _this.githubUser = props.githubUser;
          _this.generatorName = props.generatorName;
          _this.appname = "generator-" + _this.generatorName;
          return done();
        };
      })(this));
    };

    GeneratorGeneratorGruntCoffee.prototype.userInfo = function() {
      var done;
      done = this.async();
      return githubUserInfo(this.githubUser, function(res) {
        this.realname = res.name;
        this.email = res.email;
        this.githubUrl = res.html_url;
        return done();
      });
    };

    GeneratorGeneratorGruntCoffee.prototype.projectfiles = function() {
      this.template('_package.json', 'package.json');
      this.template('editorconfig', '.editorconfig');
      this.template('travis.yml', '.travis.yml');
      this.template('README.md');
      return this.template('_Gruntfile.coffee', 'Gruntfile.coffee');
    };

    GeneratorGeneratorGruntCoffee.prototype.gitfiles = function() {
      this.copy('gitattributes', '.gitattributes');
      return this.copy('gitignore', '.gitignore');
    };

    GeneratorGeneratorGruntCoffee.prototype.app = function() {
      this.mkdir('src');
      this.mkdir('src/app');
      this.mkdir('src/app/templates');
      return this.template('src/app/index.coffee');
    };

    GeneratorGeneratorGruntCoffee.prototype.copyTemplates = function() {
      this.copy('editorconfig', 'src/app/templates/editorconfig');
      this.copy('travis.yml', 'src/app/templates/travis.yml');
      this.copy('src/app/templates/_package.json', 'src/app/templates/_package.json');
      return this.copy('src/app/templates/_bower.json', 'src/app/templates/_bower.json');
    };

    GeneratorGeneratorGruntCoffee.prototype.tests = function() {
      this.mkdir('src');
      this.mkdir('src/test');
      this.template('src/test/test-load.coffee', 'src/test/test-load.coffee');
      return this.template('src/test/test-creation.coffee', 'src/test/test-creation.coffee');
    };

    return GeneratorGeneratorGruntCoffee;

  })(yeoman.generators.Base);

}).call(this);
