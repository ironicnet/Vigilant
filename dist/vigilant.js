function Vigilant()
{
  var self = this;
  self.activeReporter =null;
  self.reportOnlyActive = false;
  self.reporters = [];
  self.watchEvents = [];
  self.broadcast = function(data) { };
  return self;
}
function Reporter(name)
{
  var self = this;
  self.name = name;
  self.currentChain = [];
  self.handlesChain = false;
  self.accepts= ['keypress', 'keydown', 'keyup'];
  self.markAsActive = function () {};
  return self;
}

function Mission(name)
{
  var self = this;
  self.name =  name;
  self.requiresChain = null;
  self.success = function() {};
  self.chainDrop = function () {};
  return self;
}
Vigilant.prototype.getReporterIndex = function(reporterName)
{
  for(var i=0; i<this.reporters.length; i++)
  {
    if (this.reporters[i]==reporterName) return i;
  }
  return -1;
}
Vigilant.prototype.setActiveReporter = function(reporterIndex)
{
  var reporter = this.reporters[reporterIndex];
  
  this.activeReporter = reporter;
  reporter.markAsActive();
}
Vigilant.prototype.handleKeyDown = function(e) {this.notifyReporter('keydown', e)}
Vigilant.prototype.handleKeyUp = function(e) {this.notifyReporter('keyup', e)}
Vigilant.prototype.handleKeyPress = function(e) {this.notifyReporter('keypress', e)}
Vigilant.prototype.notifyReporter = function(eventName, ev)
{
  if(this.watchEvents.length===0||this.watchEvents.indexOf(eventName)>-1)
  {
    if(this.reportOnlyActive)
    {
        if (this.activeReporter && this.activeReporter.accepts.indexOf(eventName)>=0)
          this.activeReporter.report(eventName, this.getKeyAbbr(ev));
    }
    else
    {
      for(var i=0; i<this.reporters.length; i++)
      {
        var reporter = this.reporters[i];
        if (reporter.accepts.indexOf(eventName)>=0)
          reporter.report(eventName, this.getKeyAbbr(ev));
      }
    }
    this.broadcast(this.getKeyAbbr(ev));
  }
}
Vigilant.prototype.getKeyAbbr = function(ev, distinctAltKeys, includeEventType)
{
  if(!includeEventType) includeEventType=false;
  if(!distinctAltKeys) distinctAltKeys = false;
  var abbr=''
  if (ev.altGraphKey) abbr += !distinctAltKeys ? 'a' : 'g';
  if (ev.altKey) abbr +='a';
  if (ev.ctrlKey) abbr +='c'
  if (ev.shiftKey) abbr+='s';
  if (abbr.length>0) abbr+='+';
  
  if(includeEventType)
  {
  }
  var keyCode = "";
  if (!ev.keyIdentifier)
  {
	  var charCode = ev.which || ev.charCode || ev.keyCode || 0
	  keyCode = this.fromKeyCode(charCode);
	  debugger;
  } else
  {
	keyCode = ev.keyIdentifier.indexOf('+')==-1 ? ev.keyIdentifier : String.fromCharCode(ev.which);
  }
  if (ev.type=='keyup')
  {
	keyCode = keyCode.toUpperCase();
  }
  abbr += keyCode;
  return abbr;
}

Vigilant.prototype.watch = function(target)
{
  
  if (this.watchEvents.length===0 || this.watchEvents.indexOf("keydown")>-1)
    target.onkeydown = this.handleKeyDown.bind(this);
  if (this.watchEvents.length===0 || this.watchEvents.indexOf("keyup")>-1)
    target.onkeyup = this.handleKeyUp.bind(this);
  if (this.watchEvents.length===0 || this.watchEvents.indexOf("keypress")>-1)
    target.onkeypress = this.handleKeyPress.bind(this);
}
Reporter.prototype.clearChain = function(eventName, data)
{
  this.currentChain = [];
}
Reporter.prototype.report = function(eventName, data)
{
  if(this.handlesChain)   this.currentChain.push(data);
  var anyMatched = false;
  
  for(var i=0; i<this.missions.length;i++)
  {
    var mission = this.missions[i];
    if (this.handlesChain && mission.requiresChain)
    {
      var allMatching = true;
      for(var c=0; c<this.currentChain.length;c++)
      {
        allMatching = allMatching && (this.currentChain[c]==mission.requiresChain[c]);
        if(!allMatching) break;
      }
      if(allMatching)
      {
        anyMatched = true;
        if(this.currentChain.length==mission.requiresChain.length)
        {
          this.clearChain();
          mission.success();
        }
      }
    }
    else
    {
      if (mission.expectingData == data)
      {
        anyMatched = true;
        mission.success();
      }
    }
  }
  if (!anyMatched) 
  {
    if (this.onchaindropped) this.onchaindropped(this.currentChain, data);
    this.clearChain();
  }
  else
  {
    if (this.onpath) this.onpath(this.currentChain, data);
  }
}
Vigilant.prototype.fromKeyCode =function (n) {
if( 47<=n && n<=90 ) return unescape('%'+(n).toString(16));
if( 96<=n && n<=105) return 'NUM '+(n-96);
if(112<=n && n<=135) return 'F'+(n-111);

if(n==3)  return 'Cancel'; //DOM_VK_CANCEL
if(n==6)  return 'Help';   //DOM_VK_HELP
if(n==8)  return 'Backspace';
if(n==9)  return 'Tab';
if(n==12) return 'NUM 5';  //DOM_VK_CLEAR
if(n==13) return 'Enter';
if(n==16) return 'Shift';
if(n==17) return 'Ctrl';
if(n==18) return 'Alt';
if(n==19) return 'Pause|Break';
if(n==20) return 'CapsLock';
if(n==27) return 'Esc';
if(n==32) return 'Space';
if(n==33) return 'PageUp';
if(n==34) return 'PageDown';
if(n==35) return 'End';
if(n==36) return 'Home';
if(n==37) return 'Left';
if(n==38) return 'Up';
if(n==39) return 'Right';
if(n==40) return 'Down';
if(n==42) return '*'; //Opera
if(n==43) return '+'; //Opera
if(n==44) return 'PrntScrn';
if(n==45) return 'Insert';
if(n==46) return 'Delete';

if(n==91) return 'WIN';
if(n==92) return 'WINR';
if(n==93) return 'WINM';
if(n==106) return '*';
if(n==107) return '+';
if(n==108) return 'Separator'; //DOM_VK_SEPARATOR
if(n==109) return '-';
if(n==110) return '.';
if(n==111) return '/';
if(n==144) return 'NumLock';
if(n==145) return 'ScrollLock';

//Media buttons (Inspiron laptops) 
if(n==173) return 'ToggleMute';
if(n==174) return 'VolumeDown';
if(n==175) return 'VolumeUp';
if(n==176) return 'Next';
if(n==177) return 'Previous';
if(n==178) return 'Stop';
if(n==179) return 'Pause';

if(n==182) return 'MyPc';
if(n==183) return 'Calc';
if(n==186) return ';';
if(n==187) return '=';
if(n==188) return ',';
if(n==189) return '-';
if(n==190) return '.';
if(n==191) return '/';
if(n==192) return '\'';
if(n==219) return '[';
if(n==220) return '\\';
if(n==221) return ']';
if(n==222) return '\'' ;
if(n==224) return 'CMD';
if(n==229) return 'IME';

if(n==255) return 'Custom'; //Dell Home button (Inspiron laptops)

return null;
}