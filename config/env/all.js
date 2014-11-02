'use strict';

module.exports = {
    app: {
        title: 'Mean Gulp',
        description: 'Full-stack Javascript with Mongodb, Express, AnugularJS and Node.  Built using Gulp',
        keywords: 'mongodb, express, angularjs, node, mongoose, gulp'
    },
    port: process.env.PORT || 3000,
    templateEngine: 'swig',
    sessionSecret: 'MEANGULP',
    sessionCollection: 'sessions',
    assets: {
		lib: {
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js'
			]
		},
		css: [
			'public/components/**/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/components/*/*.js',
			'public/components/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/components/*/tests/*.js'
		]
	}
};
