String.prototype.padLeft = function(len, pad) {
	len = len === undefined ? 1 : len;
	pad = pad === undefined ? ' ' : pad;
	str = this;

	while (str.length < len) {
		str = pad + str;
	}
	return str;
};
var dataChecker = {
	"vowelRegex"	: /^[AEIOU]*$/gi,
	"consonantRegex": /^([B-DF-HJ-NP-TV-Z]|Ñ)*$/gi,
	"clearRegex"	: /\b(DAS|DA|DEL|DER|DE|DIE|DI|DD|LAS|LA|LOS|EL|LES|LE|MAC|MC|VAN|VON|Y)\s+/g,
	"charValueVerifyCurp" : {
		'.': 0,
		'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
		'A':10, 'B':11, 'C':12, 'D':13, 'E':14, 'F':15, 'G':16, 'H':17, 'I':18, 'J':19,
		'K':20, 'L':21, 'M':22, 'N':23, 'Ñ':24, 'O':25, 'P':26, 'Q':27, 'R':28, 'S':29,
		'T':30, 'U':31, 'V':32, 'W':33, 'X':34, 'Y':35, 'Z':36
	},
	"charValuesRfc"	: {
		" ":"00", "0":"00", "1":"01", "2":"02", "3":"03", "4":"04", "5":"05", "6":"06", "7":"07", "8":"08",
		"9":"09", "&":"10", "A":"11", "B":"12", "C":"13", "D":"14", "E":"15", "F":"16", "G":"17", "H":"18",
		"I":"19", "J":"21", "K":"22", "L":"23", "M":"24", "N":"25", "O":"26", "P":"27", "Q":"28", "R":"29",
		"S":"32", "T":"33", "U":"34", "V":"35", "W":"36", "X":"37", "Y":"38", "Z":"39", "Ñ":"40"
	},
	"valuesCodesRfc" : {
		 0:"1",  1:"2",  2:"3",  3:"4",  4:"5",  5:"6",  6:"7",  7:"8",  8:"9",  9:"A",
		10:"B", 11:"C", 12:"D", 13:"E", 14:"F", 15:"G", 16:"H", 17:"I", 18:"J", 19:"K",
		20:"L", 21:"M", 22:"N", 23:"P", 24:"Q", 25:"R", 26:"S", 27:"T", 28:"U", 29:"V",
		30:"W", 31:"X", 32:"Y", 33:"Z"
	},
	"charValueVerifyRfc" : {
		"0": 0,	"1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
		"A":10, "B":11, "C":12, "D":13, "E":14, "F":15, "G":16, "H":17, "I":18, "J":19,
		"K":20, "L":21, "M":22, "N":23, "&":24, "O":25, "P":26, "Q":27, "R":28, "S":29,
		"T":30, "U":31, "V":32, "W":33, "X":34, "Y":35, "Z":36, " ":37, "Ñ":38
	},
	"inconvenient_curp"	: [
		'BACA','BAKA','BUEI','BUEY','CACA','CACO','CAGA','CAGO','CAKA','CAKO',
		'COGE','COGI','COJA','COJE','COJI','COJO','COLA','CULO','FALO','FETO',
		'GETA','GUEI','GUEY','JETA','JOTO','KACA','KACO','KAGA','KAGO','KAKA',
		'KAGO','KAKA','KAKO','KOGE','KOGI','KOJA','KOJE','KOJI','KOJO','KOLA',
		'KULO','LILO','LOCA','LOCO','LOKA','LOKO','MAME','MAMO','MEAR','MEAS',
		'MEON','MIAR','MION','MOCO','MOKO','MULA','MULO','NACA','NACO','PEDA',
		'PEDO','PENE','PIPI','PITO','POPO','PUTA','PUTO','QULO','RATA','ROBA',
		'ROBE','ROBO','RUIN','SENO','TETA','VACA','VAGA','VAGO','VAKA','VUEI',
		'VUEY','WUEI','WUEY'
	],
	"inconvenient_rfc"	: [
		'BUEI','BUEY','CACA','CACO','CAGA','CAGO','CAKA','COGE','COJA','COJE',
		'COJI','COJO','CULO','FETO','GUEY','JOTO','KACA','KACO','KAGA','KAGO',
		'KAKA','KAGO','KOGE','KOJO','KULO','MAME','MAMO','MEAR','MEON','MION',
		'MULA','PEDA','PEDO','PENE','PUTA','PUTO','QULO','RATA','RUIN'
	],
	"filterName"	: function (name, also_enie) {
		name = name.trim().toUpperCase();
		if (also_enie) {
			name = name.replace(/(Ñ)/g,'X');
		}
		name = name.replace(dataChecker.clearRegex,'');
		return name.trim();
	},
	"quitarAcentos" : function (name) {
		name = name.replace('Á','A').replace('É','E').replace('Í','I').replace('Ó','O').replace('Ú','U');
		name = name.replace('á','a').replace('é','e').replace('í','i').replace('ó','o').replace('ú','u');
		return name;
	},
	"isVowel"		: function (character) {
		return character.match(dataChecker.vowelRegex);
	},
	"isConsonant"	: function (character) {
		return character.match(dataChecker.consonantRegex);
	},
	"getBirthDate"	: function (string) {
		var date_substr = string.substring(4,10);
		var day = parseInt(date_substr.substring(4));
		var month = parseInt(date_substr.substring(2,4)) - 1;
		var year = parseInt(date_substr.substring(0,2));
		var current_date = new Date();
		var currentYear = current_date.getFullYear().toString();
		if (parseInt(currentYear.substring(2)) > year) {
			year = currentYear.substring(0,2) + year.toString().padLeft(2,'0');
		} else {
			year = (parseInt(currentYear.substring(0,2)) - 1) * 100 + year;
		}
		return new Date(year, month, day);

	},
	"getSex"		: function (curp) {
		var sex_letter = curp.substring(10,11);
		if (sex_letter == 'H') {
			return 1;
		} else if (sex_letter == 'M') {
			return 2;
		} else if (sex_letter == 'X') {
			return 9;
		} else {
			return 0;
		}
	},
	"getFirstOf"	: function (name, offset, val_fnc) {
		for (var i = offset; i < name.length; i++) {
			if (val_fnc(name.charAt(i))) {
				return name.charAt(i);
			}
		}
		return '';
	},
	"generaCurp"	: function (ape_paterno, ape_materno, nombres, fecha_nacimiento, sexo,  estado) {
		ape_paterno = dataChecker.quitarAcentos(dataChecker.filterName(ape_paterno, true));
		ape_materno = dataChecker.quitarAcentos(dataChecker.filterName(ape_materno, true));
		nombres = dataChecker.quitarAcentos(dataChecker.filterName(nombres, true));
		// alert(nombres);

		var curp = "";
		var sexStr = 'X';
		if (sexo == 1) {
			sexStr = 'H';
			nombres = nombres.replace(/^(JOS(É|E)|J\.|J)(\s)+/gi,'');
		} else if (sexo == 2) {
			sexStr = 'M';
			nombres = nombres.replace(/^(MAR(Í|I)A|MA\.|MA|M\.|M)(\s)+/gi,'');
		}
		var first_word_ape_paterno = ape_paterno;
		if (first_word_ape_paterno.indexOf(' ') !== -1) {
			first_word_ape_paterno = ape_paterno.substring(0,ape_paterno.indexOf(' ')).trim();
		}
		var first_word_ape_materno = ape_materno;
		if (first_word_ape_materno.indexOf(' ') !== -1) {
			first_word_ape_materno = ape_materno.substring(0,ape_materno.indexOf(' ')).trim();
		}
		var first_word_nombres = nombres;
		if (first_word_nombres.indexOf(' ') !== -1) {
			first_word_nombres = nombres.substring(0,nombres.indexOf(' ')).trim();
		}
		var inner_vowel = dataChecker.getFirstOf(first_word_ape_paterno,1,dataChecker.isVowel);
		curp += first_word_ape_paterno.charAt(0);
		curp += inner_vowel != '' ? inner_vowel : 'X';
		curp += ape_materno.length > 0 ? ape_materno.charAt(0) : 'X';
		curp += nombres.charAt(0);
		if (dataChecker.inconvenient_curp.indexOf(curp) != -1) {
			curp = curp.replaceAt(1,'X');
		}

		curp += fecha_nacimiento.getFullYear().toString().substr(2);
		curp += fecha_nacimiento.getMonth() < 9 ? '0' + (fecha_nacimiento.getMonth()+1) : fecha_nacimiento.getMonth()+1;
		curp += fecha_nacimiento.getDate() < 10 ? '0' + (fecha_nacimiento.getDate()) : fecha_nacimiento.getDate();
		curp += sexStr;
		curp += estado;
		var inner_cons = dataChecker.getFirstOf(first_word_ape_paterno,1,dataChecker.isConsonant)
		curp += inner_cons != '' ? inner_cons : 'X';
		inner_cons = dataChecker.getFirstOf(first_word_ape_materno,1,dataChecker.isConsonant);
		curp += inner_cons != '' ? inner_cons : 'X';
		inner_cons = dataChecker.getFirstOf(first_word_nombres,1,dataChecker.isConsonant);
		curp += inner_cons != '' ? inner_cons : 'X';

		curp += '..';
		// var j = 18, suma_curp = 0;
		// for (var i = 0; i < curp.length; i++) {
		// 	suma_curp += (dataChecker.charValueVerifyCurp[curp.charAt(i)] * j--);
		// }
		// curp += Math.abs(suma_curp % 10 - 10) % 10;
		return curp.toUpperCase();
	},
	"generaRfc"		: function (ape_paterno, ape_materno, nombres, fecha_nacimiento) {

		ape_paterno = dataChecker.quitarAcentos(ape_paterno).toUpperCase().replace('.','');
		ape_materno = dataChecker.quitarAcentos(ape_materno).toUpperCase().replace('.','');
		nombres = dataChecker.quitarAcentos(nombres).toUpperCase().replace('.','');

		ape_paterno_f = dataChecker.filterName(ape_paterno);
		ape_materno_f = dataChecker.filterName(ape_materno);
		nombres_f = dataChecker.filterName(nombres);
		// console.log('Nombre:'+nombres+', ApePat:' + ape_paterno + ', ApeMat:' + ape_materno);

		var suma_str = 0;
		var calc_str = "0";
		if (ape_paterno.length > 0) {
			for(var i = 0; i < ape_paterno.length; i++) {
				calc_str += dataChecker.charValuesRfc[ape_paterno.charAt(i)];
			}
			for (var i = 1; i < calc_str.length; i++) {
				suma_str += parseInt(calc_str.charAt(i-1) + calc_str.charAt(i)) * parseInt(calc_str.charAt(i));
			}
		}
		// console.log(suma_str);
		calc_str = "0";
		if (ape_materno.length > 0) {
			for(var i = 0; i < ape_materno.length; i++) {
				calc_str += dataChecker.charValuesRfc[ape_materno.charAt(i)];
			}
			for (var i = 1; i < calc_str.length; i++) {
				suma_str += parseInt(calc_str.charAt(i-1) + calc_str.charAt(i)) * parseInt(calc_str.charAt(i));
			}
		}
		// console.log(suma_str);
		calc_str = "0";
		for(var i = 0; i < nombres.length; i++) {
			calc_str += dataChecker.charValuesRfc[nombres.charAt(i)];
		}
		for (var i = 1; i < calc_str.length; i++) {
			suma_str += parseInt(calc_str.charAt(i-1) + calc_str.charAt(i)) * parseInt(calc_str.charAt(i));
		}
		// console.log(suma_str);
		var last_three_digits = suma_str % 1000;
		// alert(nombres);

		var rfc = "", inner_vowel = "";
		nombres_f = nombres_f.replace(/^(JOS(É|E))(\s)+/g,'');
		nombres_f = nombres_f.replace(/^(MAR(Í|I)A)(\s)+/g,'');
		if (ape_paterno_f != "" && ape_materno_f != "") {
			inner_vowel = dataChecker.getFirstOf(ape_paterno_f,1,dataChecker.isVowel);
			rfc += ape_paterno_f.charAt(0);
			rfc += inner_vowel != '' ? inner_vowel : 'X';
			rfc += ape_materno_f.length > 0 ? ape_materno_f.charAt(0) : 'X';
			rfc += nombres_f.charAt(0);
			rfc = rfc.toUpperCase();
		} else if (ape_paterno_f != "") {
			inner_vowel = dataChecker.getFirstOf(ape_paterno_f,1,dataChecker.isVowel);
			rfc += ape_paterno_f.charAt(0);
			rfc += inner_vowel != '' ? inner_vowel : 'X';
			// inner_vowel = dataChecker.getFirstOf(nombres_f,1,dataChecker.isVowel);
			rfc += nombres_f.charAt(0);
			rfc += nombres_f.charAt(1);
		} else if (ape_materno_f != "") {
			inner_vowel = dataChecker.getFirstOf(ape_materno_f,1,dataChecker.isVowel);
			rfc += ape_materno_f.charAt(0);
			rfc += inner_vowel != '' ? inner_vowel : 'X';
			// inner_vowel = dataChecker.getFirstOf(nombres_f,1,dataChecker.isVowel);
			rfc += nombres_f.charAt(0);
			rfc += nombres_f.charAt(1);
		}
		if (dataChecker.inconvenient_rfc.indexOf(rfc) != -1) {
			rfc = rfc.replaceAt(3,'X');
		}
		rfc += fecha_nacimiento.getFullYear().toString().substr(2);
		rfc += fecha_nacimiento.getMonth() < 9 ? '0' + (fecha_nacimiento.getMonth()+1) : fecha_nacimiento.getMonth()+1;
		rfc += fecha_nacimiento.getDate() < 10 ? '0' + (fecha_nacimiento.getDate()) : fecha_nacimiento.getDate();

		rfc += dataChecker.valuesCodesRfc[Math.floor(last_three_digits / 34)];
		rfc += dataChecker.valuesCodesRfc[last_three_digits % 34];

		var j = 13, suma_rfc = 0;
		for (var i = 0; i < rfc.length; i++) {
			suma_rfc += (dataChecker.charValueVerifyRfc[rfc.charAt(i)] * j--);
		}
		var residuo_verificador = suma_rfc % 11;
		if (residuo_verificador > 0) {
			residuo_verificador = 11 -residuo_verificador;
			if (residuo_verificador === 10) {
				rfc += 'A';
			} else {
				rfc += residuo_verificador;
			}
		} else {
			rfc += '0';
		}
		return rfc;
	},
	"verificaCurp"	: function(curp) {
		// Params cleanup
		curp = curp.trim().toUpperCase();
		// Length validation
		if (curp.length !== 18) {
			return false;
		}
		// Exhaust validation
		var last_digit = curp.charAt(17);
		var j = 18;
		var suma_curp = 0;
		var should_digit = '0';
		for (var i = 0; i < 17; i++) {
			suma_curp += (dataChecker.charValueVerifyCurp[curp.charAt(i)] * j--);
		}
		// console.log(suma_curp);
		// should_digit = ((10 - suma_curp % 10) % 10).toString();
		should_digit = (Math.abs(suma_curp % 10 - 10) % 10).toString();
		return (should_digit === last_digit);
	},
	"verificaRfc"	: function(rfc , homologado_required) {
		// Params cleanup
		rfc = rfc.trim().toUpperCase();
		// Length validation
		if (!homologado_required && rfc.length === 10) {
			return true;
		}
		if (rfc.length !== 13) {
			return false;
		}
		// Exhaust validation
		var last_char = rfc.charAt(12);
		var should_char = '0';
		var j = 13
		var suma_rfc = 0;
		for (var i = 0; i < 12; i++) {
			suma_rfc += (dataChecker.charValueVerifyRfc[rfc.charAt(i)] * j--);
		}
		var residuo_verificador = suma_rfc % 11;
		if (residuo_verificador > 0) {
			residuo_verificador = 11 - residuo_verificador;
			if (residuo_verificador === 10) {
				should_char = 'A';
			} else {
				should_char = residuo_verificador.toString();
			}
		} else {
			should_char = '0';
		}
		return (last_char === should_char);
	}
};

module.exports = dataChecker;