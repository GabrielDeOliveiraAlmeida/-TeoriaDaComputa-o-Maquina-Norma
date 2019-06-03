
var transitions;
var startState;
var acceptStates;
var emptyLabel = 'ϵ';

function abrir() {
	var a = document.getElementById("filein");
	a.click();
}

function convertJSON(xml) {

	transitions = {};
	acceptStates = [];

	var node = xml.getElementsByTagName("type")[0];
	node.childNodes[0].nodeValue;

	for (var i = 0; i < xml.getElementsByTagName("state").length; i++) {

		node = xml.getElementsByTagName("state")[i];

		if (node.getElementsByTagName("initial")[0]) {
			startState = ('q' + node.getAttribute("id"));
		};
		if (node.getElementsByTagName("final")[0]) {
			acceptStates.push('q' + node.getAttribute("id"));
		};
	};

	for (var i = 0; i < xml.getElementsByTagName("transition").length; i++) {

		node = xml.getElementsByTagName("transition")[i];

		var stateA = 'q' + node.getElementsByTagName("from")[0].childNodes[0].nodeValue;
		var stateB = 'q' + node.getElementsByTagName("to")[0].childNodes[0].nodeValue;

		var tr = [];
		
		for (tape = 0; tape < 3; tape++) {
			var inputRead = (node.getElementsByTagName("read")[tape].childNodes.length) ?
				node.getElementsByTagName("read")[tape].childNodes[0].nodeValue : emptyLabel;
			var inputWrite = (node.getElementsByTagName("write")[tape].childNodes.length) ?
				node.getElementsByTagName("write")[tape].childNodes[0].nodeValue : emptyLabel;
			var inputRLS = node.getElementsByTagName("move")[tape].childNodes[0].nodeValue;

			tr.push({ final: stateB, inputRead: inputRead, inputWrite: inputWrite, direction: inputRLS });
		}


		if (inputRead == null) {
			console.log("aqui é nulo");
		}

		if (!this.transitions[stateA]) { this.transitions[stateA] = {}; }
		if (!this.transitions[stateA][tr[0].inputRead]) { this.transitions[stateA][tr[0].inputRead] = []; }
		this.transitions[stateA][tr[0].inputRead].push({ tr1: tr[0], tr2: tr[1], tr3: tr[2] });

		

	};

	return (serializeJSON());
}

function serializeJSON() {
	// Converte para um formato serializado

	let model = {};

	model.type = 'AFND';
	model.afnd = { transitions: this.transitions, startState: this.startState, acceptStates: this.acceptStates };
	model.states = {};
	model.transitions = [];
	$.each(model.afnd.transitions, function (stateA, transition) {
		model.states[stateA] = {};
		$.each(transition, function (character, states) {
			$.each(states, function (index, state) {
				model.states[state.tr1.final] = {};
				model.transitions.push({
					transition:{
					  stateA: stateA,
					  stateB: state.tr1.final
					},
					tr1: {
					  read: (state.tr1.inputRead || emptyLabel),
					  write: state.tr1.inputWrite,
					  direction: state.tr1.direction,
					},
					tr2: {
					  read: (state.tr2.inputRead || emptyLabel),
					  write: state.tr2.inputWrite,
					  direction: state.tr2.direction,
					},
					tr3:{
					  read: (state.tr3.inputRead || emptyLabel),
					  write: state.tr3.inputWrite,
					  direction: state.tr3.direction,
					}
				  });
			});
		});
	});
	var i = 1;
	$.each(model.states, function (index) {

		if (model.afnd.acceptStates.includes(index)) {
			model.states[index].isAccept = true;
		};
		model.states[index].top = 55 + i * 51;
		model.states[index].left = 55 + i * 71;
		i++;
	});
	model.states[startState] = {};
	console.log(model);
	return model;
}

/*
node = xml.getElementsByTagName("state")[0];
node.getElementsByTagName("y")[0].childNodes[0].nodeValue);

xml.getElementsByTagName("state").length // numero de tag states
*/