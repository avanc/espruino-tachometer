var circumference = 2.11;
var pin = B3;

var counter = 0;
var last_time=0;
var RPM=0;
var deadmantimer;

var f = new (require("FlashEEPROM"))();



setDeepSleep(1);
pinMode(pin, 'input_pullup');


E.on('init', readCounter);


var w=setWatch(function(e) {
  if (e.time<last_time+0.05) return;

  deadman();
  
  RPM = 60 / (e.time - last_time);
  last_time=e.time;
  counter++;
  },
  pin,
  {repeat: 'true', edge:'falling'}
);


function deadman() {
  if (deadmantimer === undefined) {
    deadmantimer=setTimeout(function() {
      deadmantimer=undefined;
      if ( (getTime()-last_time) > 60.0 ) {
        storeCounter();
      }
      else {
        deadman();
      }
    }, 6000);
  }
}


function storeCounter(){
  digitalWrite(LED1, 1);
  f.write(1, counter);
}

function readCounter(){
  counter=f.read(1, counter)[0];
}


function getDistance() {
  return counter * circumference;
}

function getVelocity(){
  if ( (getTime()-last_time) > 4.0 ) {
    return 0.0;
  }
  
  return RPM * 60 * circumference / 1000.0;
}