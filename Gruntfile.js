    module.exports = function(grunt) {
	    "use strict";
	    grunt.loadNpmTasks("grunt-bower-task");
	    grunt.loadNpmTasks("grunt-contrib-less");
grunt.loadNpmTasks("grunt-contrib-watch");
	    grunt.initConfig({
	        bower: {
	            install: {
	                options: {
						targetDir: "app/lib",
	                    layout: "byType",
	                    install: true,
	                    verbose: true,
	                    cleanTargetDir: false,
	                    cleanBowerDir: true
	                }
	            }
	        },
	   	 less: {
			devel: {
					files: {
					  "public/css/style.css": "less/style.less"
					}
				}
			},
		watch: {
				less: {
					files: ["less/*.less"],
					tasks: ["less"],
					options: {
						spawn: false,
					},
				},
			}
	    });
	}