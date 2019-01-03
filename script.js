<a-scene embedded arjs="sourceType: webcam;" screenshot="width: 640; height: 320" >
        <a-entity camera="active: true" look-controls wasd-controls position="0 0 0" data-aframe-default-camera></a-entity>
    </a-scene>

<a-scene embedded arjs="sourceType: webcam;" screenshot="width: 640; height: 320" >
        <a-entity camera="active: true" position="0 0 0" data-aframe-default-camera></a-entity>
    </a-scene>



html2canvas(document.body).then(function(canvas) {
              var base64image = canvas.toDataURL("image/png");
              var a  = document.createElement('a');
              a.href = base64image;
              a.download = 'screenshot-' + document.title.toLowerCase() + '-' + Date.now() + '.png';
              a.click();
          });



/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
$.getScript(['https://unpkg.com/merge-images', 'https://cdn.jsdelivr.net/npm/interactjs@1.3.4/dist/interact.min.js'], function(){

var dataURL = '';
document.querySelector("button").addEventListener("click", function(e){
/*var scr = document.querySelector("a-scene").components.screenshot.getCanvas('perspective');
//scr.resize(400,300);
//scr.saveCapture();

//read image from scr canvas
var img = document.getElementById('myImg');
var dataURL = '';
scr.toBlob(function (blob) {
  dataURL = URL.createObjectURL(blob);
  img.setAttribute('src', dataURL);

}, 'image/png');

//loan modal to displaying the screenshoot
var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];
modal.style.display = "block";
span.onclick = function() { 
  modal.style.display = "none";
}

//save screenshoot
document.getElementById("save").addEventListener("click", function(e){
  var a  = document.createElement('a');
  a.href = dataURL;
  a.download = 'screenshot-' + document.title.toLowerCase() + '-' + Date.now() + '.png';
  a.click();
});*/

/*html2canvas(document.querySelector("a-scene")).then(canvas => {
  var base64image = canvas.toDataURL("image/png");

// Open the image in a new window
//window.open(base64image , "_blank");
  console.log(base64image);
});*/

// first get the image of the ascene layer canvas
let aScene = document.querySelector("a-scene").components.screenshot.getCanvas("perspective");
// then get the video layer canvas
let frame = captureVideoFrame("video", "png");
// resize the ascene to the video scene
aScene = resizeCanvas(aScene, frame.width, frame.height);
// then merge the two base64 image using https://github.com/lukechilds/merge-images
var img = document.getElementById('myImg');
mergeImages([frame.dataUri, aScene]).then(b64 => {
  dataURL = b64;
});
img.setAttribute('src', dataURL);

//loan modal to displaying the screenshoot
var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];
modal.style.display = "block";
span.onclick = function() { 
  modal.style.display = "none";
}

});

//save screenshoot
document.getElementById("save").addEventListener("click", function(e){
  var a  = document.createElement('a');
  a.href = dataURL;
  a.download = 'screenshot-' + document.title.toLowerCase() + '-' + Date.now() + '.png';
  a.click();
});

function resizeCanvas(origCanvas, width, height) {
let resizedCanvas = document.createElement("canvas");
let resizedContext = resizedCanvas.getContext("2d");

resizedCanvas.height = height;
resizedCanvas.width = width;

if (width > height) {
    // Landscape
    resizedContext.drawImage(origCanvas, 0, 0, width, height);
} else {
    // Portrait
    var scale = height / width;
    var scaledHeight = origCanvas.width * scale;
    var scaledWidth = origCanvas.height * scale;
    var marginLeft = ( origCanvas.width - scaledWidth) / 2;
    resizedContext.drawImage(origCanvas, marginLeft, 0, scaledWidth, scaledHeight);
}

return resizedCanvas.toDataURL();
}

function captureVideoFrame(video, format, width, height) {
if (typeof video === 'string') {
    video = document.querySelector(video);
}

format = format || 'jpeg';

if (!video || (format !== 'png' && format !== 'jpeg')) {
    return false;
}

var canvas = document.createElement("CANVAS");

canvas.width = width || video.videoWidth;
canvas.height = height || video.videoHeight;
canvas.getContext('2d').drawImage(video, 0, 0);
var dataUri = canvas.toDataURL('image/' + format);
var data = dataUri.split(',')[1];
var mimeType = dataUri.split(';')[0].slice(5)

var bytes = window.atob(data);
var buf = new ArrayBuffer(bytes.length);
var arr = new Uint8Array(buf);

for (var i = 0; i < bytes.length; i++) {
    arr[i] = bytes.charCodeAt(i);
}

var blob = new Blob([ arr ], { type: mimeType });
return { blob: blob, dataUri: dataUri, format: format, width: canvas.width, height: canvas.height };
};


interact('.resize_drag')
.draggable({
  onmove: window.dragMoveListener,
  restrict: {
    restriction: 'parent',
    elementRect: { top: 1, left: 0, bottom: 1, right: 1 }
  },
})
.resizable({
  // resize from all edges and corners
  edges: { left: true, right: true, bottom: true, top: true },

  // keep the edges inside the parent
  restrictEdges: {
    outer: 'parent',
    endOnly: true,
  },

  // minimum size
  restrictSize: {
    min: { width: 100, height: 50 },
  },

  inertia: true,
})
.on('resizemove', function (event) {
  var target = event.target,
      x = (parseFloat(target.getAttribute('data-x')) || 0),
      y = (parseFloat(target.getAttribute('data-y')) || 0);

  // update the element's style
  target.style.width  = event.rect.width + 'px';
  target.style.height = event.rect.height + 'px';

  // translate when resizing from top or left edges
  x += event.deltaRect.left;
  y += event.deltaRect.top;

  target.style.webkitTransform = target.style.transform =
      'translate(' + x + 'px,' + y + 'px)';

  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
  target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
});

  });