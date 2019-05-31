function MultiHistoryLog(input, input2, input3) {
    this.hist1 = new HistoryLog(input);
    this.hist2 = new HistoryLog(input2);
    this.hist3 = new HistoryLog(input3);
    this.found = false;
    this.contador = 0;
}

MultiHistoryLog.prototype.setFound= function (algo) {
    this.found = algo;
}

MultiHistoryLog.prototype.addContador= function (algo) {
    this.contador++;
}

MultiHistoryLog.prototype.getRead1 = function () {
    return this.hist1.getRead();
}
MultiHistoryLog.prototype.getRead2 = function () {
    return this.hist2.getRead();
}
MultiHistoryLog.prototype.getRead3 = function () {
    return this.hist3.getRead();
}

MultiHistoryLog.prototype.getExpression1 = function () {
    return this.hist1.getExpression();
}
MultiHistoryLog.prototype.getExpression2 = function () {
    return this.hist2.getExpression();
}
MultiHistoryLog.prototype.getExpression3 = function () {
    return this.hist3.getExpression();
}

MultiHistoryLog.prototype.clonar = function (input, input2, input3) {
    var log =  new MultiHistoryLog(input, input2, input3);
    log.hist1 = this.hist1.clone(input);
    log.hist2 = this.hist2.clone(input2);
    log.hist3 = this.hist3.clone(input3);
    return log;
}

MultiHistoryLog.prototype.getLista= function () {
    return this.hist1.getLista();
}
MultiHistoryLog.prototype.getLista2= function () {
    return this.hist2.getLista();
}
MultiHistoryLog.prototype.getLista3= function () {
    return this.hist3.getLista();
}

MultiHistoryLog.prototype.fita = function (char, state, qual) {
    switch (qual) {
        case 1:
            this.hist1.tapeFunction(char, state);
            break;
        case 2:
            this.hist2.tapeFunction(char, state);
            break;
        case 3:
            this.hist3.tapeFunction(char, state);
            break;
    }

}