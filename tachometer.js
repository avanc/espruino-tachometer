var circumference = 2.11;
var pin = BTN;

var counter = 0;
var last_counter=0;
var last_time=0;
var velocity=0;

setDeepSleep(1);

var w=setWatch(function(e) {
  counter++;
  },
  pin,
  {repeat: 'true', edge:'rising'}
);

function getDistance() {
  return counter * circumference;
}

var i=setInterval(function(){
  var current_time=getTime();
  var current_counter=counter;
  velocity=(current_counter-last_counter)*circumference/(current_time-last_time);
  last_time=current_time;
  last_counter=current_counter;
}, 2000);