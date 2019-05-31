function AFND(useDefaults) {
  "use strict";
  this.transitions = {};
  this.startState = useDefaults ? 'start' : null;
  this.acceptStates = useDefaults ? ['accept'] : [];
  this.history;
  this.i;
}



$(function () {
  "use strict";

  AFND.prototype.transition = function (state, inputRead) {
    var retVal = (this.transitions[state]) ? this.transitions[state][inputRead] : null;
    return !retVal ? null : retVal;
  };

  AFND.prototype.deserialize = function (json) {
    console.log(json);
    this.transitions = json.transitions;
    this.startState = json.startState;
    this.acceptStates = json.acceptStates;
    return this;
  };

  AFND.prototype.serialize = function () {
    return {
      transitions: this.transitions,
      startState: this.startState,
      acceptStates: this.acceptStates
    };
  };


  AFND.prototype.loadFromString = function (JSONdescription) {
    var parsedJSON = JSON.parse(JSONdescription);
    return this.deserialize(parsedJSON);
  };
  AFND.prototype.saveToString = function () {
    return JSON.stringify(this.serialize());
  };

  AFND.prototype.addTransition = function (stateA, tr, tr2, tr3) {
    if (!this.transitions[stateA]) {
      this.transitions[stateA] = {};
    }
    if (!this.transitions[stateA][tr.inputRead]) {
      this.transitions[stateA][tr.inputRead] = [];
    }
    this.transitions[stateA][tr.inputRead].push({
      tr1: tr,
      tr2: tr2,
      tr3: tr3
    });
    console.log(this.transitions);
    return this;
  };

  AFND.prototype.hasTransition = function (stateA, tr, tr2,tr3) {
    if (this.transitions[stateA] && this.transitions[stateA][tr.inputRead]) {
      for (var i = 0; i < this.transitions[stateA][tr.inputRead].length; i++) {
    
        if (this.transitions[stateA][tr.inputRead][i].tr1.direction == tr.direction &&
          this.transitions[stateA][tr.inputRead][i].tr1.inputWrite == tr.inputWrite &&
          this.transitions[stateA][tr.inputRead][i].tr1.final == tr.final && 
          this.transitions[stateA][tr.inputRead][i].tr2.direction == tr2.direction &&
          this.transitions[stateA][tr.inputRead][i].tr2.inputRead == tr2.inputRead &&
          this.transitions[stateA][tr.inputRead][i].tr2.inputWrite == tr2.inputWrite &&
          this.transitions[stateA][tr.inputRead][i].tr2.final == tr2.final &&
          this.transitions[stateA][tr.inputRead][i].tr3.direction == tr3.direction &&
          this.transitions[stateA][tr.inputRead][i].tr3.inputRead == tr3.inputRead &&
          this.transitions[stateA][tr.inputRead][i].tr3.inputWrite == tr3.inputWrite &&
          this.transitions[stateA][tr.inputRead][i].tr3.final == tr3.final) return true;
      }
    }
    return false;
  };

  AFND.prototype.getTransition = function (stateA, tr, tr2,tr3) {
    if (this.transitions[stateA] && this.transitions[stateA][tr.inputRead]) {
      for (var i = 0; i < this.transitions[stateA][tr.inputRead].length; i++) {
    
        if (this.transitions[stateA][tr.inputRead][i].tr1.direction == tr.direction &&
          this.transitions[stateA][tr.inputRead][i].tr1.inputWrite == tr.inputWrite &&
          this.transitions[stateA][tr.inputRead][i].tr1.final == tr.final && 
          this.transitions[stateA][tr.inputRead][i].tr2.direction == tr2.direction &&
          this.transitions[stateA][tr.inputRead][i].tr2.inputRead == tr2.inputRead &&
          this.transitions[stateA][tr.inputRead][i].tr2.inputWrite == tr2.inputWrite &&
          this.transitions[stateA][tr.inputRead][i].tr2.final == tr2.final &&
          this.transitions[stateA][tr.inputRead][i].tr3.direction == tr3.direction &&
          this.transitions[stateA][tr.inputRead][i].tr3.inputRead == tr3.inputRead &&
          this.transitions[stateA][tr.inputRead][i].tr3.inputWrite == tr3.inputWrite &&
          this.transitions[stateA][tr.inputRead][i].tr3.final == tr3.final) return i;
      }
    }
    return -1;
  };

  AFND.prototype.removeTransition = function (stateA, input, stateB) {
    var text =[];
    var text2 = [];
    var text3 = [];
    text[0] = input.charAt(1);
    text[1] = input.charAt(3);
    text[2] = input.charAt(5);
    text2[0] = input.charAt(8);
    text2[1] = input.charAt(10);
    text2[2] = input.charAt(12);
    text3[0] = input.charAt(15);
    text3[1] = input.charAt(17);
    text3[2] = input.charAt(19);
    tr ={inputRead: text[0], inputWrite: text[1], direction: text[2], final: stateB};
    tr2 ={inputRead: text2[0], inputWrite: text3[1], direction: text2[2], final: stateB};
    tr3 ={inputRead: text3[0], inputWrite: text2[1], direction: text3[2], final: stateB};

    if (this.hasTransition(stateA, tr, tr2, tr3)) {
      var pos = this.getTransition(stateA, tr, tr2, tr3);
      this.transitions[stateA][text[0]].splice(this.transitions[stateA][text[0]][pos], 1);
    }
    return this;
  };

  AFND.prototype.setStartState = function (state) {
    this.startState = state;
    return this;
  };

  AFND.prototype.addAcceptState = function (state) {
    this.acceptStates.push(state);
    return this;
  };
  AFND.prototype.removeAcceptState = function (state) {
    var stateI = -1;
    if ((stateI = this.acceptStates.indexOf(state)) >= 0) {
      this.acceptStates.splice(stateI, 1);
    }
    return this;
  };

  AFND.prototype.accepts = function (input, input2, input3) {
    return (this.stepInit(input, input2, input3));
  };
  AFND.prototype.stepInit = function (input, input2, input3) {
    if (input == "") input = 'ϵ';
    if (input2 == "") input2 = 'ϵ';
    if (input3 == "") input3 = 'ϵ';
    this.i = 1;
    console.log("Executando Turing Machine '" + input + "'  '"+ input2 + "'   " + input3 + "'");
    var hist = new MultiHistoryLog(input.split(""), input2.split(""), input3.split(""));
  
    this.history = this.step(hist, this.startState);
    console.log("RESULT: " + this.history.found + "  Count " + this.history.contador);
    return this.history;
  };

  AFND.prototype.step = function (log, state) {
    var char = log.getRead1();
    var char2 = log.getRead2();
    var char3 = log.getRead3();

    var states;
 
    try {
      states = this.transitions[state][char];
    } catch (e) {
      return log;
    }
    for (var currentState in states) {
      console.log("Leitura 1 = " + char + ", 2= "+ char2 + ", 3= "+ char3);
      if(char2 != states[currentState].tr2.inputRead ||
        char3 != states[currentState].tr3.inputRead)
          return log;
      console.log("LEITURA OK, next step");

      var expr1 = log.getExpression1();
      var expr2 = log.getExpression2();
      var expr3 = log.getExpression3();

      console.log("EXPRESSAO1 = " +expr1.join("") + " EXPRESSAO2 = " +expr2.join("") + " EXPRESSAO3 = " +expr3.join(" "));
      var newLog = log.clonar(expr1, expr2, expr3);

      newLog.fita(char, states[currentState].tr1, 1);
      newLog.fita(char2, states[currentState].tr2, 2);
      newLog.fita(char3, states[currentState].tr3, 3);

      var resultLog = this.step(newLog, states[currentState].tr1.final);
      resultLog.addContador();
      var lista= resultLog.getLista();
      if (this.isFinal(lista[lista.length - 1].state.final)) {
        console.log("State final is here");
        resultLog.setFound(true);
        return resultLog;
      }
    }

    try {
      if (this.isFinal(states[currentState - 1].final)) {
        resultLog.setFound(true);
      }
    } catch (e) {
      //Nada
    }
    return log;
  }

  AFND.prototype.isFinal = function (wanted) {
    for (var i = 0; i < this.acceptStates.length; i++) {
      if (this.acceptStates[i] == wanted) {
        return true;
      }
    }
    return false;
  }

  // AFND.prototype.status = function () {
  //   var log = this.history.lista;
  //   for (var i = 1; i < log.length; i++) {
  //     var conteudo = log[i - 1].expression;
  //     var char = log[i].read;
  //     var state = log[i].state.final;
  //     var write = log[i].state.write;
  //     var direction = log[i].state.direction;
  //     console.log("Tape content: " + conteudo + " Move to State: " + state +
  //       " Transitions (" + char + " | " + write + " | " + direction + " ) ---> " + log[i].expression);
  //   }
  // };


  AFND.prototype.stepByStep = function (id, i) {
    if(id == 1){
      var log = this.history.getLista();
    }else if(id == 2){
      var log = this.history.getLista2();
    }else{
      var log = this.history.getLista3();
    }
    if (i >= log.length) return null;
    var conteudo = log[i - 1].expression;
    var char = log[i].read;
    var state = log[i].state.final;
    var write = log[i].state.inputWrite;
    var direction = log[i].state.direction;
    console.log("Tape " + id +" --> content: " + conteudo + " Move to State: " + state +
      " Transitions (" + char + " | " + write + " | " + direction + " ) ---> " + log[i].expression);
    return log[i];
  };

  AFND.prototype.firstStep = function (id) {
    if(id == 1){
      var log = this.history.getLista();
    }else if(id == 2){
      var log = this.history.getLista2();
    }else{
      var log = this.history.getLista3();
    }
    return log[0];
  }

  AFND.prototype.getFound = function () {
    return this.history.found;
  }
});