/*
License: The MIT License (MIT) 
Author: Ezequiel Calderara
Web: http://ironicnet.github.io/Vigilant/
Repository: https://github.com/ironicnet/Vigilant
Version: 0.1
 */
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
  abbr+=ev.keyIdentifier.indexOf('+')==-1 ? ev.keyIdentifier : String.fromCharCode(ev.which);
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