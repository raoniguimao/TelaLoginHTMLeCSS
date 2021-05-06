class Validator {
	constructor() {
		this.validations = [
			'data-required',
			'data-min-length',
			'data-max-length',
			'data-email-validate',
			'data-only-letters',
			'data-equal',
			'data-password-validate',
			'data-checked',
		];
	}

	// iniciar a validação de todos os campos
	validate(form) {
		let retorno = true;

		// resgata todas as validações
		let currentValidations = document.querySelectorAll('form .error-validation');
		if (currentValidations.length > 0) {
			// limpa as validações já existentes
			this.cleanValidations(currentValidations);
		}

		// pegar todos os inputs
		let inputs = form.getElementsByTagName('input');

		// transforma a coleção em array
		let inputsArray = [...inputs];

		// loop nos inputs e validação mediante o que for encontrado
		inputsArray.forEach(function (input) {
			// para cada validação existente
			for (let i = 0; this.validations.length > i; i++) {
				let validationAtual = this.validations[i];

				// verifica se a validação atual existe no input
				if (input.getAttribute(validationAtual) != null) {
					// limpando a string para virar um método
					let method = validationAtual.replace('data-', '').replace('-', '');

					// valor do input
					let value = input.getAttribute(validationAtual);

					if (retorno) {
						// invocar o método
						retorno = this[method](input, value);
					}
					else {
						// invocar o método
						this[method](input, value);
					}
				}
			}
		}, this);

		return retorno;
	}

	// verifica se um input tem um número mínimo de caracteres
	minlength(input, minValue) {

		let inputLength = input.value.length;

		let errorMessage = `O campo precisa ter, pelo menos, ${minValue} caracteres`;

		if (inputLength < minValue) {
			return this.printMessage(input, errorMessage);
		}
		return true;
	}

	// verifica se o input está preenchido
	required(input) {
		let inputValue = input.value;
		if (inputValue === "") {
			let errorMessage = `Este campo é obrigatório`;
			return this.printMessage(input, errorMessage);
		}
		return true;
	}

	// verifica se o tamanho máximo do campo está sendo respeitado
	maxlength(input, maxValue) {
		let inputLength = input.value.length;

		let errorMessage = `O campo precisa ter menos que ${maxValue} caracteres`;

		if (inputLength > maxValue) {
			return this.printMessage(input, errorMessage);
		}
		return true;
	}

	// valida emails
	emailvalidate(input) {
		let re = /\S+@\S+\.\S+/;

		let email = input.value;

		let errorMessage = "Insira um e-mail no padrão email@email.com";

		if (!re.test(email)) {
			return this.printMessage(input, errorMessage);
		}
		return true;
	}

	// valida somente letras
	onlyletters(input) {
		let re = /^[A-Za-z]+$/;
		let inputValue = input.value;
		let errorMessage = "Este campo não aceita números nem caracteres especiais";

		if (!re.test(inputValue)) {
			return this.printMessage(input, errorMessage);
		}
		return true;
	}

	// verifica se 2 campos são iguais
	equal(input, inputName) {
		let inputToCompare = document.getElementsByName(inputName)[0];
		let errorMessage = `Este campo precisa estar igual ao ${inputName}`;

		if (input.value != inputToCompare.value) {
			return this.printMessage(input, errorMessage);
		}
		return true;
	}

	// valida campo de senha
	passwordvalidate(input) {
		// explodir a string em array
		let charArr = input.value.split("");

		let upperCase = 0;
		let numbers = 0;

		for (let i = 0; charArr.length > i; i++) {
			if (charArr[i] === charArr[i].toUpperCase() && isNaN(parseInt(charArr[i]))) {
				upperCase++;
			}
			else if (!isNaN(parseInt(charArr[i]))) {
				numbers++;
			}
		}

		if (upperCase == 0 || numbers == 0) {
			let errorMessage = "A senha precisa de um caractere maiúsculo e um número";
			return this.printMessage(input, errorMessage);
		}
		return true;
	}

	checked(input) {
		if (!input.checked) {
			let errorMessage = "É necessário marcar o aceite aos termos de uso para efetivar seu registro";
			return this.printMessage(input, errorMessage);
		}
		return true;
	}

	// método para imprimir mensagens de erro na tela
	printMessage(input, msg) {
		let inputParent = input.parentNode;

		let errorsQty = input.parentNode.querySelector('.error-validation');
		if (errorsQty === null) {
			let template = document.querySelector('.error-validation').cloneNode(true);
			template.textContent = msg;
			template.classList.remove('template');

			inputParent.appendChild(template);
		}
		else {
			let errP = inputParent.querySelector('.error-validation');
			errP.textContent += "; " + msg;
		}
		return false;
	}

	// limpa as validações da tela
	cleanValidations(validations) {
		validations.forEach(el => el.remove());
	}
}

let form = document.getElementById("register-form");
let submit = document.getElementById("btn-submit");

let validator = new Validator();

// evento que dispara as validações
submit.addEventListener('click', function (e) {
	e.preventDefault();

	// validator.validate(form)
	if (validator.validate(form)) {
		form.submit();
	}
});