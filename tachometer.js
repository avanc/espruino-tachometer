var circumference = 2.11;
var pin = B3;

var counter = 0;
var last_time=0;
var RPM=0;
var deadmantimer;

var f = new (require("FlashEEPROM"))();

setDeepSleep(1);
pinMode(pin, 'input_pullup');


var w=setWatch(function(e) {
  if (e.time<last_time+0.05) return;

  deadman();
  
  RPM = 60 / (e.time - last_time);
  last_time=e.time;
  counter++;
  // console.log(counter + '\n');
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
  data= new Uint8Array(4);
  data_int = new Int32Array(data.buffer);
  data_int[0]=counter;
  f.write(1, data);
}

function readCounter(){
  data= f.read(1);
  if (data!==undefined) {
    data_int = new Int32Array(data.buffer);
    counter= data_int[0];
  }
}

E.on('init', readCounter);


function getDistance() {
  return counter * circumference;
}

function getVelocity(){
  if ( (getTime()-last_time) > 4.0 ) {
    return 0.0;
  }
  
  return RPM * 60 * circumference / 1000.0;
}