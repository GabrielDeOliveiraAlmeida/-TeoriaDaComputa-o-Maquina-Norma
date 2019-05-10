function HistoryLog(input){
    this.expression = input;
    this.lista = [{
      expression: input,
      state: {},
    } ]; 
    this.pointer = 0;
    this.time =-1;
    this.found = false;
    this.emptyLabel = 'ϵ';
  }
  
  HistoryLog.prototype.getRead= function(){
    return this.expression[this.pointer];
  }

  HistoryLog.prototype.addTime = function(){
      this.time++;
  }

  HistoryLog.prototype.clone = function(input){
      var log = new HistoryLog(input);
      log.lista = this.lista;
      log.pointer = this.pointer;
      log.time = this.time;
      log.found = this.found;
      return log;
  }

  HistoryLog.prototype.tapeFunction = function(state){
    this.expression[this.pointer] = state.write;
    switch(state.direction){
        case 'L':
            this.pointer--;
            if(this.pointer<0){
                this.pointer++;
                this.expression.unshift(this.emptyLabel);
            }
            break;
        case 'R':
            this.pointer++;
            if(this.pointer > this.expression.length ){
                this.expression.push(this.emptyLabel);
            }
            break;
    }
    this.lista.push({expression: this.expression.toString() ,state: state});
  }