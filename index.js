const exec = require('child_process').exec,
	  fs = require('fs'),
	  Promise = require("bluebird");


function TakeScreenshot(options, cb) {
	if(!options.output) return cb("Please write output file.");
	if(!options.input) return cb("Please write input file.");

	if(options.input.indexOf('"') != -1 || options.output.indexOf('"') != -1) {
		return cb('Video name must not contain ""');
	}

	var promise_input = new Promise(function(resolve, reject) {
		fs.exists(options.input, function(bool_input) {
			if(!bool_input) {
				reject('Input source does not exist: ' + options.input);
			} else {
				resolve();
			}
		});
	});


	var promise_output = function() {
		var promise = new Promise(function(resolve, reject) {
			fs.exists(options.output, function(bool_output) {
				if(bool_output) {
					reject('Output source exists: ' + options.output);
				} else {
					resolve();
				}
			});
		});

		return promise;
	}


	var promise_create = function() {
		var promise = new Promise(function(resolve, reject) {
			exec('ffmpeg -i "' + options.input + '" -ss '+ (options.time || "00:00:00.001 ") + ' -vframes 1 ' + (options.width?"-filter:v scale=" + options.width + ":-1":"") +' "' + options.output +  '" -threads 0 -y',(err, stdout, stderr) => {
			  if (err) { return cb(err); }

        fs.exists(options.output, function(bool) {
          if(bool) {
            resolve();
          } else {
            cb('Invalid time. Time must not be bigger than video duration, time example: 00:00:00.001');
          }
        })
			});
		});

		return promise;
	}


	var promise_done = function(stdout) {
		var promise = new Promise(function(resolve, reject) {
			cb(null, stdout || 'Success!');
		});

		return promise;
	}

	var promise_error = function(err) {
		cb(err);
	}


	promise_input
	.then(promise_output)
	.then(promise_create)
	.then(promise_done)
	.catch(promise_error);
}

module.exports = TakeScreenshot;
