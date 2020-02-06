const gulp = require('gulp');
const Docker = require('dockerode');
const tar = require('gulp-tar');
const foal = require('gulp-foal')();
const options = require('../gulp-config');

gulp.task('copy', () => {
    return gulp.src('DockerFile').pipe(gulp.dest('dist'));
});

gulp.task('tar', ['copy'], () => {
    return gulp.src('./dist/**').pipe(tar('build.tar')).pipe(gulp.dest('.'));
});

foal.task('docker', (param) => {
    console.log('---param---');
    const version = param ? param : options.version;
    let imageName = options.dockerOptions.imageDomain + '/' + options.name + ':' + version;
    console.log(imageName);
    let docker = new Docker({
        host: options.dockerOptions.dockerHost,
        port: parseInt(options.dockerOptions.dockerPort)
    });
    docker.buildImage('./build.tar', {
        t: imageName,
        dockerfile: 'DockerFile'
    }, function (err, response) {
        if (err) {
            console.log(err);
        }
        response.pipe(process.stdout, {
            end: true
        });
        response.on('end', function () {
            let image = docker.getImage(imageName);
            console.log(image);
            image.history(function (e, res) {
                if (e) {
                    // cb(err);
                    console.log(e);
                }
            });
            image.push({
                tag: version
            },
                function (e, res) {
                    if (e) {
                        console.log(e);
                        // cb(err);
                    }
                    res.pipe(process.stdout, {
                        end: true
                    });
                    res.on('end', function () {
                        image.remove();
                    });
                },
                options.dockerOptions.auth
            );
        });
        // cb(err);
    });
});
const docker = (version) => {
    foal.run(foal.docker(version));
}

module.exports = {
    docker
}
