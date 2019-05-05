
var transitions;
var startState;
var acceptStates;

function abrir(){
      var a = document.getElementById("filein");
      a.click();
}

function convertJSON(xml){

	transitions = {};
	acceptStates = [];

	var node = xml.getElementsByTagName("type")[0];
	node.childNodes[0].nodeValue;

	for(var i = 0; i< xml.getElementsByTagName("state").length; i++){

		node = xml.getElementsByTagName("state")[i];

		if(node.getElementsByTagName("initial")[0]){
			startState = ('q'+node.getAttribute("id"));
		}; 
		if(node.getElementsByTagName("final")[0]){
			acceptStates.push('q'+node.getAttribute("id"));
		}; 
	};

	for(var i = 0; i< xml.getElementsByTagName("transition").length; i++){

		node = xml.getElementsByTagName("transition")[i];

		var stateA = 'q'+node.getElementsByTagName("from")[0].childNodes[0].nodeValue; 
		var stateB = 'q'+node.getElementsByTagName("to")[0].childNodes[0].nodeValue; 
		var character = node.getElementsByTagName("read")[0].childNodes[0].nodeValue; 

		if (!transitions[stateA]) {transitions[stateA] = {}}; 
		if (!transitions[stateA][character]) {transitions[stateA][character] = []} ;
		transitions[stateA][character].push(stateB);
	};

	return (serializeJSON());
}

function serializeJSON() {
      // Converte para um formato serializado

      let model = {};

      model.type = 'AFND';
      model.afnd = {transitions: transitions, startState: startState, acceptStates: acceptStates};
      model.states = {};
      model.transitions = [];
      $.each(model.afnd.transitions, function(stateA, transition) {
      	model.states[stateA] = {};
      	$.each(transition, function(character, states) {
      		
      		$.each(states, function(index, stateB) {
      			model.states[stateB] = {};
      			model.transitions.push({stateA:stateA, label:(character || emptyLabel), stateB:stateB});
      		});
      	});
      });
      var i = 1;
      $.each(model.states, function(index) {

      	if(model.afnd.acceptStates.includes(index)){
      		model.states[index].isAccept = true;
      	};
      	model.states[index].top = 55 + i *51;
      	model.states[index].left = 55 + i * 71;
      	i++;
      });
      model.states[startState] =  {};
 
      return model;
  }

/*
node = xml.getElementsByTagName("state")[0];
node.getElementsByTagName("y")[0].childNodes[0].nodeValue);

xml.getElementsByTagName("state").length // numero de tag states
*/