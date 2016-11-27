# ffmpeg-screen

## Take Screenshot for ffmpeg.

```
npm i ffmpeg-screen --save
```

### Options
* input - full input directory to video file.
* output - full output directory to new image file.
* time - time to make screenshot, default: 00:00:00.001.
* width - image width (height is calculating automatically), default: video width.
* callback


Working example.
```
const Screen = require('ffmpeg-screen');

var options = {
	input: "input.mp4",
	output: "thumbc.png",
	width: 800,
	time: "00:00:00.001"
};

Screen(options, function(err) {
	if (err) {
		console.log(err);
	}

	// ...
});

```
