gulp = require('gulp')

gulp.task 'test', ->
  mocha = require('gulp-mocha')
  gulp.src('test/**/*.js', {read: false})
    .pipe mocha(
      ui:       'bdd'
      reporter: 'spec'
    )

gulp.task 'watch', ->
  gulp.watch('test/**/*.js', ['test'])

gulp.task 'default', ['watch']
