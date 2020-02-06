var package = require('../package.json');
// var util = require('gulp-util');
// util.log(util.colors.green(pack.name), ':', util.colors.yellow(pack.version));

module.exports = {
	name: package.name,
	version: package.version,
	author: package.author,
	sonerScannerMirror: 'http://172.22.24.51:8081/nexus/content/sites/gs-assets/sonar-scanner/',
	sonarOptions: {
		host: {
			url: 'http://172.22.3.61:10083' // http://172.22.24.25:9000
		},
		token: 'd21a54051303158055518f1eb5ee81bca3774120',
		options: {
			'sonar.projectKey': package.name,
			'sonar.projectName': package.name,
			'sonar.sources': 'src',
			'sonar.sourceEncoding': 'UTF-8',
			'sonar.exclusions': 'node_modules/**,tests/**,lib-cov/**,public/pms-user-manual/**,public/themes/**,public/tinymce/**,src/assets/**,src/themes/**,src/typings/**'
		}
	},
	dockerOptions: {
		imageDomain: '172.22.3.4/pms',
		dockerHost: 'http://172.22.24.179',
		dockerPort: 2375,
		auth: {
			username: 'robot$pms',
			// 一个月后密码会过期，需要重新创建机器人账号
			password: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODE2Njk4OTgsImlhdCI6MTU3OTA3Nzg5OCwiaXNzIjoiaGFyYm9yLXRva2VuLWlzc3VlciIsImlkIjo0LCJwaWQiOjMsImFjY2VzcyI6W3siUmVzb3VyY2UiOiIvcHJvamVjdC8zL3JlcG9zaXRvcnkiLCJBY3Rpb24iOiJwdWxsIiwiRWZmZWN0IjoiIn0seyJSZXNvdXJjZSI6Ii9wcm9qZWN0L3Btcy9yZXBvc2l0b3J5IiwiQWN0aW9uIjoicHVsbCIsIkVmZmVjdCI6IiJ9LHsiUmVzb3VyY2UiOiIvcHJvamVjdC8zL3JlcG9zaXRvcnkiLCJBY3Rpb24iOiJwdXNoIiwiRWZmZWN0IjoiIn0seyJSZXNvdXJjZSI6Ii9wcm9qZWN0L3Btcy9yZXBvc2l0b3J5IiwiQWN0aW9uIjoicHVzaCIsIkVmZmVjdCI6IiJ9XX0.TQA1pZpws7a1LwCKyRBh5SJT-5h6dPnS_6q1ik8MTXLqx02OugBZLLhpr23B2xPYg7YRejHgvoCjIA8FjtKBQJP3QPMXpvv9HvIpca8kp8mt3DQ_rLoJ5SNrAilX9t-SEcXcOQ5twF-S8_HMJA4ZJ2bVRjcNAAYb-aFRKpKgvdhXxqkYrCK_o4Xa8dI_KfcXrwBbdIpD1QgiTYIMFTvfF7QSRkoVZZjKFdwdyPqp1Cdi3eZgen4135vCOsFilu3RdUg14-vraEefN0OpLSBurGPAFu9ki-l8c9dJZbiCfrXubhvB0L1EkTvKA195MGKV0Cwt-CybN6gLsY2FvZ8loWFVExo7J0X0cTWYAUX64n6gc0nJuuYnM2in-U_dEx6ro2nnU_jwyS819yU_vkDe4k72MMGlkHA4aUe8X62MvrSXSPLwwl-KEWgVciH87ID4SLOg0N_-R-o3PbYFR_-gzwP7g6ytFcQqnC4i6UtmA6kyxxw_7d894E28ciHPoKAeZu91Pi50xFiSx9b7-nK65Yg6_vTcyyWVakWtwTzaEdyxabC7TwXWJvP3EGelB5FUveXAm6W9x6mowY4iOuGzI2JQ0cloIX8XmW-NrrQCaCHHjlmNMOsDyN4HGg89G10EZFJeTUvW8ya_T5kwVJvqn9dUi2kGqBKsb9Ev6uszJxg',
			email: 'admin@example.com',
			serveraddress: 'http://172.22.3.4'
		}
	}
};
