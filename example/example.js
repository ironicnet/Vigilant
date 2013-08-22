var reporter = new Reporter('Eze');
reporter.accepts= ['keyup'];
reporter.handlesChain = true;
reporter.missions = [
  {
  name: 'Konami',
  requiresChain: ['Up','Up','Down','Down', 'Left', 'Right', 'Left', 'Right','A','B'],
  success: function() { Success(this, document.getElementById('div1'))},
  chainDrop: function () {return true},
},
  {
  name: 'Single Key',
  expectingData: 'P',
  success: function() { Success(this, document.getElementById('div2'))},
  chainDrop: function () {return true},
},
  {
  name: 'Single Key with Three Modifiers',
  expectingData: 'as+C',
  success: function() { Success(this, document.getElementById('div3'))},
  chainDrop: function () {return true},
},
  {
  name: 'Chain withModifiers',
  requiresChain: ['J','s+H'],
  success: function() { Success(this, document.getElementById('div4'))},
  chainDrop: function () {return true},
},
];
var reporter2 = new Reporter('Eze 2');
reporter2.accepts= ['keyup'];
reporter2.handlesChain = true;
reporter2.missions = [
  {
  name: 'Konami',
  requiresChain: ['Up','Up','Down','Down', 'Left', 'Right', 'Left', 'Right','A','B'],
  success: function() { Success(this, document.getElementById('div1B'))},
  chainDrop: function () {return true},
},
  {
  name: 'Single Key',
  expectingData: 'P',
  success: function() { Success(this, document.getElementById('div2B'))},
  chainDrop: function () {return true},
},
  {
  name: 'Single Key with Three Modifiers',
  expectingData: 'as+C',
  success: function() { Success(this, document.getElementById('div3B'))},
  chainDrop: function () {return true},
},
  {
  name: 'Chain withModifiers',
  requiresChain: ['J','s+H'],
  success: function() { Success(this, document.getElementById('div4B'))},
  chainDrop: function () {return true},
},
];


reporter.onpath = function (path, data)
{
  console.log(path, data);
var output = document.getElementById("reporterData");
output.innerHTML = path;

}
reporter.onchaindropped = function (path, data)
{
  console.log(path, data);
  var output = document.getElementById("reporterData");
  output.innerHTML = 'Chain Dropped By "' + data + '" Lost chain: ' + path;

}

var vigilant = new Vigilant();
vigilant.reporters.push(reporter);
vigilant.reporters.push(reporter2);
vigilant.reportOnlyActive = false;
vigilant.setActiveReporter(vigilant.getReporterIndex(reporter));
vigilant.watchEvents = ['keyup']
vigilant.broadcast = function (currentData)
{
  var broadcaster = document.getElementById('broadcasting');
  broadcaster.innerHTML = currentData.toString();
  console.log('Handled broadcast',broadcaster.outerHTML, currentData);
}
vigilant.watch(window);

function Success(mission, div)
{
  console.log(mission);
  div.innerHTML ='Mission "' + mission.name + '" Successfull';
  div.classList.remove("pending")
  div.classList.add("success")
}