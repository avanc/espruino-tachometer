var circumference = 2.11;
var pin = B3;

var counter = 0;
var last_time=0;
var RPM=0;

setDeepSleep(1);
pinMode(pin, 'input_pullup');


var w=setWatch(function(e) {
  if (e.time<last_time+0.05) return;
  RPM = 60 / (e.time - last_time);
  last_time=e.time;
  counter++;
  },
  pin,
  {repeat: 'true', edge:'falling'}
);

function getDistance() {
  return counter * circumference;
}

function getVelocity(){
  if ( (getTime()-last_time) > 4.0 ) {
    return 0.0;
  }
  
  return RPM * 60 * circumference / 1000.0;
}