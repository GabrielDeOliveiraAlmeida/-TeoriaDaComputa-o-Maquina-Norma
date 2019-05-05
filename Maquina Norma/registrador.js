class Registrador{
	constructor(){
		this.sinal = 0;
		this.valor = 0;
	}


	atribuicao(sinal, n){
		this.sinal = sinal;
		while(this.valor < n)
			this.valor++; 
	}

	valueZero(){
		while(true){
			if(this.valor == 0 ) break;
			this.valor--;
		}
	}



	reset(){
		this.valor = 0;
	}

	addOne(){
		this.valor++;
		// if(this.sinal == 0){
		// 	this.valor++;
		// }else{
		// 	this.valor--;
		// 	if(this.valor ==0 ){
		// 		this.sinal--;
		// 	}
		// }
	}

	subOne(){
		this.valor--;
		// if(this.sinal == 0){
		// 	if(this.valor == 0){
		// 		this.sinal++;	
		// 		this.valor++;
		// 	}else{
		// 		this.valor--;
		// 	}
		// }else{
		// 	this.valor++;
		// }
		
	}

	print(msg){
		console.log(msg + " => " + '(' + this.sinal +' , ' +this.valor+')');
	}


	isSignalZero(){
		if(this.sinal == 0) return true;
		else return false;
	}
	
	isValueZero(){
	if(this.valor == 0)	return true;
	else	return false;
	}

	changeSignal(){
		if(this.sinal == 0){
			this.sinal++;
		}else{
			this.sinal--;
		}
	}

}