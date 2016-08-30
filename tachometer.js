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
  console.log(counter + '\n');
  },
  pin,
  {repeat: 'true', edge:'falling'}
);


setWatch(function(e) {
  if ( (e.time-e.lastTime)>1.5 ) {
    storeCounter();
  }
  },
  BTN,
  {repeat: true, edge:'falling'}
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
  pulse(LED1, 1000);
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


function pulse(led, duration) {
  var inc=100.0 / duration / 2.0;
  var val=0.0;
  
  var int=setInterval(function() {
    val+=inc;
    if (val > 1.0) {
      val = 1.0;
      inc=-inc;
    } else if (val < 0.0) {
      val = 0.0;
      clearInterval(int);
    }
    
    
    analogWrite(led, val, {soft:true});
  },100);
}

