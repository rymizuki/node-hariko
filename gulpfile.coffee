gulp = require('gulp')

gulp.task 'lib', ->
  jshint  = require('gulp-jshint')
  stylish = require('jshint-stylish')
  gulp.src([ './lib/*.js', './lib/**/*.js' ])
    .pipe jshint(
    )
    .pipe jshint.reporter(stylish)

gulp.task 'test', ['lib'], ->
  mocha = require('gulp-mocha')
  gulp.src('test/**/*.js', {read: false})
    .pipe mocha(
      ui:       'bdd'
      reporter: 'spec'
    )

gulp.task 'watch', ->
  gulp.watch(['lib/*.js', 'lib/**/*.js'], ['lib'])
  gulp.watch('test/**/*.js', ['test'])

gulp.task 'default', ['watch']
