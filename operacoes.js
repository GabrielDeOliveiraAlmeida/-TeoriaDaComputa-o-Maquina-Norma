function somar(regA, regB, manter, regAux){ 
	if(manter == 'undefined') manter = false;

	while(true){
		if(regB.isValueZero()) break;

			if(regB.isSignalZero() && regA.isSignalZero()){
			regA.addOne();
		}else if(regB.isSignalZero() && !regA.isSignalZero()){
			regA.subOne();	
			if(regA.isValueZero())
				regA.changeSignal();

		}else if(!regB.isSignalZero() && regA.isSignalZero()){
			if(regA.isValueZero()){
				regA.addOne();
				regA.changeSignal();
			}else
				regA.subOne();	
		}else if(!regB.isSignalZero() && !regA.isSignalZero()){
			regA.addOne();
		}

		regB.valor--;	
		
		if(manter){ //Se necessario manter o valor do Registrador B
			regAux.addOne();
		}
	}
	//Devolver valor ao Registrador B...
	if(manter){
		while(true){
			if(regAux.isValueZero()) break;
			regAux.subOne();
			regB.addOne();					
		}
	}else if(!regB.isSignalZero()){
		regB.sinal--;
	}

	

}



function multiplicacao(regA, regB){
	let regC = new Registrador();
	let regD = new Registrador();
	let regAux = new Registrador();
	if(regA.sinal == 1){
		regAux.sinal++;
	}

	somar(regC, regA, false);
	
	while(true){

		if(regC.isValueZero()) break;
		somar(regA, regB, true, regD);
		regC.subOne();
	}

	if(!regAux.isSignalZero() && !regB.isSignalZero()){
		regA.sinal=0;
	}else if(!regAux.isSignalZero()){
		regA.sinal++;
	}
	console.log("sinal de A" + regA.sinal);

}


function divisao(regA, regB){
	let regAux = new Registrador();
	let regC = new Registrador();

	regB.changeSignal();
	if(!regA.isSignalZero()){
		regA.sinal = 0;
	}
	if(regB.isSignalZero()){
		regB.sinal=1;
	}

	while(true){
		if(regA.isValueZero()) break;
		if(!regA.isSignalZero()) break;
		somar(regA, regB, true, regAux);
	}

	regB.changeSignal();

	if(regA.isValueZero()){
		console.log("Divisivel");
	}else{
		somar(regA, regB, true, regAux);
		console.log("Nao divisivel");
	}
}

function restoDivisao(regA, regB){
	let regAux = new Registrador();
	let regC = new Registrador();

	somar(regC, regB, true, regAux);

	regC.print();


	//Tratar A negativo
	if(!regA.isSignalZero()){
		if(!regB.isSignalZero()){
			regB.changeSignal();
		} 
		while(true){
			if(regA.isValueZero()) break;
			if(regA.isSignalZero()) break;
			somar(regA, regB, true, regAux);
		}

	//Tratar A positivo 
	}else{
		if(regB.isSignalZero()){
			regB.changeSignal();
		}
		while(true){
			if(regA.isValueZero()) break;
			if(!regA.isSignalZero()) break;
			somar(regA, regB, true, regAux);
		}

		//Se B positivo
		if(!regC.isSignalZero()){
			return;
		}

	}


	//Verificar sinal
	if(!regC.isSignalZero()){
		regA.changeSignal();
		somar(regA, regB, true, regAux);
	}else{
		regB.changeSignal();
		somar(regA, regB, true, regAux);
	}

}

function fatorial(regA){
	if(regA.isValueZero()){
		regA.addOne();
		return;
	}
	let regB = new Registrador();
	let regC = new Registrador();

	if(!regA.isSignalZero()){
		console.log("Sinal negativo!");
		return;
	}
	somar(regB, regA, true, regC);
	regB.print();
	while(true){
		regB.subOne();
		if(regB.isValueZero()) break;
		multiplicacao(regA, regB);	
	}	
}


function potencia(regA, regB){
	/**
	 * A^B
	 * Atribuir ao registrador E o valor de B,
	 * Resetar B para atribuir o valor de A, logo na multiplicacao teremos
	 * A*a*...
	 * C e D são utilizados para realizar a multiplicação
	 */
	if(!regB.isSignalZero()){
		regA.reset();
		return;
	}
	let regC = new Registrador();
	let regD = new Registrador();

	somar(regD, regB, true, regC);
	regD.subOne();
	regB.reset();
	somar(regB, regA, true, regC);
	regA.print("Registrador A");	
	while(true){
		if(regD.isValueZero()) break;
		multiplicacao(regA,regB);	
		regD.subOne();
	}	
}


function testes(regA, regB){
	let regAux = new Registrador();
	
	regB.changeSignal();

	somar(regA, regB, true, regAux);
	
	if(regA.isValueZero())
		console.log("A<=B");
	else if(!regA.isSignalZero())
		console.log("A<B");
	else console.log("A > B");
}


function primo(regA){
	regB = new Registrador();
	regC = new Registrador();
	regD = new Registrador();
	regE = new Registrador();

	regE.atribuicao(1,1);

	somar(regB, regA, true, regC);
	regB.subOne();

	while(true){
		somar(regE, regB, true, regD);
		if(regE.isValueZero()) break;
		else{
			regE.reset();
			regE.subOne();
		}
		somar(regC, regA, true, regD);
		divisao(regC, regB);
		if(regC.isValueZero()){
			console.log("Não Primo");
			return;	
		}
		regB.subOne(); 
		regC.reset();
	}
	console.log("Primo");
}
