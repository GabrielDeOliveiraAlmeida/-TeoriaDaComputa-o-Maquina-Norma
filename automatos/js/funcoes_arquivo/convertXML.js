
function convertXML(model){

	console.log(model);

	var name = 'file.jff';
	

	//var a = document.getElementById("convertXMLdownload");


	//criando o obj XML
	var parser = new DOMParser()
	var xml  = parser.parseFromString('<?xml version="1.0" encoding="utf-8" standalone="no"?><structure></structure>', "application/xml");
	//-----

	console.log('opa');
	var newElement

	newElement = xml.createElement("type"); //cria um novo node 
	xml.getElementsByTagName("structure")[0].appendChild(newElement);//aplica o novo node criado em um outro
	xml.getElementsByTagName("type")[0].appendChild(xml.createTextNode('fa')); //atributo em um node

	newElement = xml.createElement("automaton");
	xml.getElementsByTagName("structure")[0].appendChild(newElement);

	var i = 0;
//=====================state==================================
	$.each(model.states,function(state){
		
		if(state === 'q0'){
			model.states[state].top = 55;
			model.states[state].left = 55;
			model.states[state].startState = true;
			console.log(model.states[state]);
		};
		console.log(i);
		newElement = xml.createElement("state");
		newElement.setAttribute("id",state.slice(1));
		newElement.setAttribute("name",state);
		xml.getElementsByTagName("automaton")[0].appendChild(newElement);

		newElement = xml.createElement("x");
		newElement.appendChild(xml.createTextNode(model.states[state].top + i * 51));
		xml.getElementsByTagName("state")[i].appendChild(newElement);
		newElement = xml.createElement("y");
		newElement.appendChild(xml.createTextNode(model.states[state].left + i * 71));
		xml.getElementsByTagName("state")[i].appendChild(newElement);
		
		if(model.states[state].isAccept){
			newElement = xml.createElement("final"); //  final
			xml.getElementsByTagName("state")[i].appendChild(newElement);
		}else if(model.states[state].startState){
			newElement = xml.createElement("initial"); //initial 
			xml.getElementsByTagName("state")[i].appendChild(newElement);
			
		}
		i++;
		

	});

	//=====================state==================================
	i = 0;
	//=====================transition==================================
	$.each(model.transitions,function(index){
		console.log(model.transitions[index]);
		newElement = xml.createElement("transition");
		xml.getElementsByTagName("automaton")[0].appendChild(newElement);

		newElement = xml.createElement("from");
		newElement.appendChild(xml.createTextNode(model.transitions[index].stateA.slice(1)));
		xml.getElementsByTagName("transition")[i].appendChild(newElement);

		newElement = xml.createElement("to");
		newElement.appendChild(xml.createTextNode(model.transitions[index].stateB.slice(1)));
		xml.getElementsByTagName("transition")[i].appendChild(newElement);

		newElement = xml.createElement("read");
		newElement.appendChild(xml.createTextNode(model.transitions[index]['label']));
		xml.getElementsByTagName("transition")[i].appendChild(newElement);
		i++;

	});
	//=====================transition==================================
	

	var str  = new XMLSerializer().serializeToString(xml);	
	console.log(str);

	var blob = new Blob([str],{type: "application/xml"});
	var url = URL.createObjectURL(blob);
	console.log(url);
	decisao = confirm("Deseja fazer o download do arquivo?");
	var a = document.createElement('a');
	if(decisao){
		a.href = url;
		a.download = name;
		a.click();
	}
};


/*
xml.createElement("type") cria uma tag
xml.getElementsByTagName("type")[0].setAttribute("bla","bla") cria um atributo na tag
xml.createTextNode("AFND") cria um valor dentro da tag
xml.createComment("AFND") cria comentario

<structure>
	<type>fa</type>&#13;
	<automaton>&#13;
		<!--The list of states.-->&#13;
		<state id="0" name="q0">&#13;
			<x>122.0</x>&#13;
			<y>56.0</y>&#13;
			<initial/>&#13;
		</state>&#13;
		<state id="1" name="q1">&#13;
			<x>308.0</x>&#13;
			<y>131.0</y>&#13;
			<final/>&#13;
		</state>&#13;
		<state id="2" name="q2">&#13;
			<x>431.0</x>&#13;
			<y>149.0</y>&#13;
		</state>&#13;
		<state id="3" name="q3">&#13;
			<x>435.0</x>&#13;
			<y>228.0</y>&#13;
			<final/>&#13;
		</state>&#13;
		<!--The list of transitions.-->&#13;
		<transition>&#13;
			<from>0</from>&#13;
			<to>1</to>&#13;
			<read>a</read>&#13;
		</transition>&#13;
		<transition>&#13;
			<from>0</from>&#13;
			<to>1</to>&#13;
			<read>b</read>&#13;
		</transition>&#13;
		<transition>&#13;
			<from>0</from>&#13;
			<to>2</to>&#13;
			<read>a</read>&#13;
		</transition>&#13;
		<transition>&#13;
			<from>2</from>&#13;
			<to>3</to>&#13;
			<read>c</read>&#13;
		</transition>&#13;
	</automaton>&#13;
</structure>

	
*/