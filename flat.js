var FlatCube = function(containerId, size, down, topPosition){
	var WHITE="#ffffff", YELLOW="#ffff00" , GREEN="#009900" , BLUE="#000099", RED="#cc0000", ORANGE="#ff8000", CLEAR = "#000000";
	var colors = [GREEN,RED,WHITE,ORANGE,BLUE,YELLOW];


	this.container = document.getElementById(containerId);

	while(this.container.firstChild){
		this.container.removeChild(this.container.firstChild);
	}

	this.container.style.position = 'absolute';

	this.container.style.top = topPosition + 'px'; 
	
	if(down){
		this.container.style.left = '15px'; 
	} else {
		this.container.style.left = size + 30 + 15 + 'px'; // canvas.left + canvas.width + gap
	}


	this.faceSize = size/3 || 100;

	this.container.style.width = (this.faceSize*3)+'px';
	
	var flatHeight;
	if (down) {
		flatHeight = (this.faceSize * 4.75) + 'px'; 
	} else {
		flatHeight = (this.faceSize * 4.75) + 'px'; 
	}
	this.container.style.height = flatHeight;


	this.faces = [];

	var tops = [0, 1, 1, 1, 2, 3];
	var lefts = [1, 0, 1, 2, 1, 1];

	for(var i=0; i<6; i++){
		this.faces.push(new FlatFace(this, this.faceSize, tops[i]*this.faceSize, lefts[i]*this.faceSize, colors[i]));
	}
	this.faces.forEach(function(face){
		this.container.appendChild(face.container);
	}, this);

	this.message = document.createElement('div');
	this.message.className = 'rc-message';
	this.message.style.position = 'absolute';
	this.message.style.left = this.faceSize/8 + 'px';
	this.message.style.top = this.faceSize*4.03 + 'px';
	this.message.style.fontSize = this.faceSize/9 + 'px';
	this.container.appendChild(this.message);

	this.picker = new FlatColorPicker(colors, this.faceSize/4);
	this.picker.container.style.right = 0;
	this.picker.container.style.left = 0;
	this.picker.container.style.bottom  = 0;
	this.container.appendChild(this.picker.container);
};

FlatCube.prototype.getState = function() {
	
	var me = this;
	var result = "";
	var cubicles = ["UF", "UR", "UB", "UL", "DF", "DR", "DB", "DL", "FR", "FL", "BR", "BL", "UFR", "URB", "UBL", "ULF", "DRF", "DFL", "DLB", "DBR"]
	var colorToFace = {};

	var getFaceColor = function(c, direction){
		return result;
	}
	
	faceNames.forEach(function(face){
		colorToFace[me.faces[faceToIndex[face]]].stickers[5].getColor() = face;
	});
	
	cubicles.forEach(function(cubicle){
		var c = me.getCubie(cubicle);
		var cubieName = "";
		lucid.array.forEach(cubicle.split(''), function(face){
			var color = getFaceColor(c, faceToDirection[face]);
			cubieName += colorToFace[color];
		});
		result += cubieName + " ";
	})
	
	return result.trim();
}

FlatCube.prototype.update = function() {
	if(this.message.firstChild){
		this.message.removeChild(this.message.firstChild);
	}
	if(this.cube){
		this.cube.updateColors();
		if(!this.cube.isSolvable()){
			this.message.appendChild(document.createTextNode(this.cube.solver.currentState));
		}
	}
};

FlatCube.prototype.setColors = function(top, front, right, colors){
	var stickers = this.getStickers(top, front, right);
	colors.forEach(function(color, i){
		color && stickers[i] && stickers[i].setColor(color);
	});
}

FlatCube.prototype.getColors = function(top, front, right){
	return this.getStickers(top,front,right).map(function(sticker){
		return sticker && sticker.color;
	});
}

FlatCube.prototype.getStickers = function(top, front, right){
	var faceToIndex = {
		'B':0,
		'L':1,
		'U':2,
		'R':3,
		'F':4,
		'D':5,
	};
	var FRONT=4, TOP=1, BOTTOM=2, LEFT=0, RIGHT=5, BACK=3; 
	
	var me = this;
	var colors = [null,null,null,null,null,null];
	var getColor = function(face, sticker){
		return me.faces[face].stickers[sticker];
	}

	numFaces = Math.abs(top)+Math.abs(front)+Math.abs(right);
	if(numFaces == 3){
		if(top == 1 && right == 1 && front == 1){
			colors[TOP] = getColor(2,8);
			colors[FRONT] = getColor(4,2);
			colors[RIGHT] = getColor(3,6);
		}
		else if(top == 1 && right == 1 && front == -1){
			colors[TOP] = getColor(2,2);
			colors[RIGHT] = getColor(3,0);
			colors[BACK] = getColor(0,8);
		}
		else if(top == 1 && right == -1 && front == 1){
			colors[TOP] = getColor(2,6);
			colors[FRONT] = getColor(4,0);
			colors[LEFT] = getColor(1,8);
		}
		else if(top == 1 && right == -1 && front == -1){
			colors[TOP] = getColor(2,0);
			colors[BACK] = getColor(0,6);
			colors[LEFT] = getColor(1,2);
		}
		else if(top == -1 && right == 1 && front == 1){
			colors[FRONT] = getColor(4,8);
			colors[RIGHT] = getColor(3,8);
			colors[BOTTOM] = getColor(5,2);
		}
		else if(top == -1 && right == 1 && front == -1){
			colors[RIGHT] = getColor(3,2);
			colors[BACK] = getColor(0,2);
			colors[BOTTOM] = getColor(5,8);
		}
		else if(top == -1 && right == -1 && front == 1){
			colors[FRONT] = getColor(4,6);
			colors[LEFT] = getColor(1,6);
			colors[BOTTOM] = getColor(5,0);
		}
		else if(top == -1 && right == -1 && front == -1){
			colors[BACK] = getColor(0,0);
			colors[LEFT] = getColor(1,0);
			colors[BOTTOM] = getColor(5,6);
		}
	}
	else if(numFaces == 2){
		if(top == 1){
			if(front == 1){
				colors[FRONT] = getColor(4,1);
				colors[TOP] = getColor(2,7);
			}
			else if(front == -1){
				colors[BACK] = getColor(0,7);
				colors[TOP] = getColor(2,1);
			}
			else if(right == 1){
				colors[RIGHT] = getColor(3,3);
				colors[TOP] = getColor(2,5);
			}else if(right == -1){
				colors[LEFT] = getColor(1,5);
				colors[TOP] = getColor(2,3);
			}
		}
		else if(top == -1){
			if(front == 1){
				colors[FRONT] = getColor(4,7);
				colors[BOTTOM] = getColor(5,1);
			}
			else if(front == -1){
				colors[BACK] = getColor(0,1);
				colors[BOTTOM] = getColor(5,7);
			}
			else if(right == 1){
				colors[RIGHT] = getColor(3,5);
				colors[BOTTOM] = getColor(5,5);
			}else if(right == -1){
				colors[LEFT] = getColor(1,3);
				colors[BOTTOM] = getColor(5,3);
			}
		}
		else if(front == 1){
			if(right==1){
				colors[FRONT] = getColor(4,5);
				colors[RIGHT] = getColor(3,7);
			}else if(right==-1){
				colors[FRONT] = getColor(4,3);
				colors[LEFT] = getColor(1,7);
			}
		}
		else if(front == -1){
			if(right==1){
				colors[BACK] = getColor(0,5); 
				colors[RIGHT] = getColor(3,1);
			}else if(right==-1){
				colors[BACK] = getColor(0,3);
				colors[LEFT] = getColor(1,1);
			}
		}
	}
	else if(numFaces == 1){
		//center
		if(top==1)
			colors[TOP] = getColor(2,4);
		else if(top== -1)
			colors[BOTTOM] = getColor(5,4);
		else if(front==1)
			colors[FRONT] = getColor(4,4);
		else if(front== -1)
			colors[BACK] = getColor(0,4);
		else if(right == 1)
			colors[RIGHT] = getColor(3,4);
		else if(right == -1)
			colors[LEFT] = getColor(1,4);
	}
	return colors;
}

FlatCube.prototype.getColor = function() {
	return this.picker.getColor();
};

var FlatFace = function(cube, size, top, left, color){
	this.container = document.createElement('div');
	this.container.style.position = 'absolute';
	this.container.style.width = size + 'px';
	this.container.style.height = size + 'px';
	this.container.style.top = top + 'px';
	this.container.style.left = left + 'px';
	this.cube = cube;
	this.stickers = [];
	var tops = [0, 0, 0, 1, 1, 1, 2, 2, 2];
	var lefts = [0, 1, 2, 0, 1, 2, 0, 1, 2];
	for(var i=0; i<9; i++){
		var sticker = new FlatSticker(size/3, tops[i]*size/3, lefts[i]*size/3, color);
		this.stickers.push(sticker);
		this.container.appendChild(sticker.container);
	}

	var me = this;
	this.stickers.forEach(function(sticker){
		sticker.container.onclick = function(){
			if(me.cube.getColor()){
				sticker.setColor(me.cube.getColor());
				me.cube.update();
			}
		}
	}, this);
};

var FlatSticker = function(size, top, left, color){
	this.container = document.createElement('div');
	this.container.className = 'rc-sticker';
	this.container.style.width = (size-2) + 'px';
	this.container.style.height = (size-2) + 'px';
	// this.container.style.border = '1px solid black'; // Controlado por CSS
	this.container.style.position = 'absolute';
	this.container.style.top = top + 'px';
	this.container.style.left = left + 'px';

	this.setColor(color);
};

FlatSticker.prototype.setColor = function(color) {
	this.color = color;
	this.container.style.backgroundColor = color;
};

var FlatColorPicker = function(colors, size){
	var me = this;
	size*=1.5;
	this.container = document.createElement('div');
	this.container.className = 'rc-color-picker';
	this.container.style.position = 'absolute';
	this.container.style.height = (size*1.5) + 'px';
	
	this.container.onclick = function(){me.setSelection(-1)}
	this.size = size;
	this.colors = colors;

	this.choices = [];
	var tops = [0,0,0,0,0,0];
	var lefts = [0,1,2,3,4,5];
	for(var i=0; i<6; i++){
		this.choices.push(new FlatSticker(size, .25*size, .25*size + 1.29*lefts[i]*size, colors[i]))
		this.choices[this.choices.length-1].container.style.cursor = 'pointer';
		this.choices[this.choices.length-1].container.className += ' rc-picker-choice';
		
		this.choices[this.choices.length-1].container.style.setProperty('--size', size + 'px');
	}
	this.choices.forEach(function(choice, i){
		this.container.appendChild(choice.container);
		choice.container.onclick = function(e){
			me.setSelection(i);
			e.stopPropagation();
		}
	}, this);
};

FlatColorPicker.prototype.setSelection = function(index) {
	this.selection = index;
	this.choices.forEach(function(choice, i){
		// Controlado por CSS
		choice.container.classList.toggle('selected', i === index);
	}, this);
};

FlatColorPicker.prototype.getColor = function(){
	return this.selection < 0 ? '' : this.colors[this.selection];
}

// ======================================================
//   DICIONÁRIO DE MOVIMENTOS EM PORTUGUÊS PARA LEIGOS
// ======================================================
var HUMAN_FACE_MAP = {
	'U': { name: 'CIMA / TOPO', color: '#ffffff', textColor: '#111', ptColor: 'Branca' },
	'D': { name: 'BASE / BAIXO', color: '#ffff00', textColor: '#111', ptColor: 'Amarela' },
	'F': { name: 'FRENTE', color: '#000099', textColor: '#fff', ptColor: 'Azul' },
	'B': { name: 'ATRÁS', color: '#009900', textColor: '#fff', ptColor: 'Verde' },
	'L': { name: 'ESQUERDA', color: '#cc0000', textColor: '#fff', ptColor: 'Vermelha' },
	'R': { name: 'DIREITA', color: '#ff8000', textColor: '#111', ptColor: 'Laranja' }
};

function parseMoveDetails(move, cube) {
	if (!move) return null;
	var faceLetter = move.charAt(0).toUpperCase();
	var faceInfo = HUMAN_FACE_MAP[faceLetter] || { name: faceLetter, color: '#334155', textColor: '#fff', ptColor: '' };
	
	var color = faceInfo.color;
	if (cube && typeof cube.getFaceColor === 'function') {
		try {
			var dynamicColor = cube.getFaceColor(faceLetter);
			if (dynamicColor) color = dynamicColor;
		} catch (e) {}
	}

	var isLightBg = (color === '#ffffff' || color === '#ffff00' || color === '#ff8000' || color.toLowerCase() === '#fff');
	var textColor = isLightBg ? '#111111' : '#ffffff';

	var rotationTitle = '';
	var instruction = '';
	var icon = '';

	if (move.endsWith('2')) {
		rotationTitle = 'Giro 180° (Meia Volta)';
		instruction = 'Olhe para a face <strong>' + faceInfo.name + '</strong> e dê <strong>meia volta 🔄 (180°)</strong> em qualquer direção.';
		icon = '🔄';
	} else if (move.endsWith("'")) {
		rotationTitle = 'Anti-Horário ↺ (90°)';
		instruction = 'Olhe para a face <strong>' + faceInfo.name + '</strong> e gire <strong>ANTI-HORÁRIO ↺</strong> (para a esquerda).';
		icon = '↺';
	} else {
		rotationTitle = 'Horário ↻ (90°)';
		instruction = 'Olhe para a face <strong>' + faceInfo.name + '</strong> e gire <strong>HORÁRIO ↻</strong> (para a direita, como o relógio).';
		icon = '↻';
	}

	return {
		move: move,
		faceLetter: faceLetter,
		faceName: faceInfo.name,
		ptColor: faceInfo.ptColor,
		color: color,
		textColor: textColor,
		isLightBg: isLightBg,
		rotationTitle: rotationTitle,
		instruction: instruction,
		icon: icon
	};
}

var RubiksCubeControls = function(id, cube, width, controlsTop){
	var me = this;

	this.cube = cube;

	this.container = document.getElementById(id);
	this.container.style.position = 'absolute';
	// this.container.style.border = '1px solid black'; // Controlado por CSS

	this.buttons = {};

	this.cube.addUpdateCallback(function(){
		for(var face in me.buttons){
			var color = me.cube.getFaceColor(face.substr(0,1));
			me.buttons[face].style.borderColor = color; 
		}
	});

	var addButton = function(name, background){
		var color = me.cube.getFaceColor(name.substr(0,1));
		var button = document.createElement('div');
		button.className = 'rc-button rc-move-button'; 

		me.buttons[name] = button;
		me.container.appendChild(button);

		button.addEventListener('click', function(){
			me.cube.makeMove(name);
		});
		button.setAttribute('name',name);
		button.style.borderColor = color; 
		button.style.borderStyle = 'solid'; 
		button.style.position = 'absolute';
		button.style.backgroundImage = background;
		button.style.backgroundRepeat = 'no-repeat';
		button.style.backgroundPosition = 'center';
		button.style.backgroundSize = '62% 62%';

	}

    var clock90 = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='%23ffffff' d='M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z'/%3E%3C/svg%3E\")";
    var counter90 = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='%23ffffff' d='M48.5 224H40c-13.3 0-24-10.7-24-24V72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8H48.5z'/%3E%3C/svg%3E\")";
    var clock180 = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAABSxJREFUeJztmUtMG1cUhv/xi3fGU8DITYqLaUFRBYlwUaUUhS6ANV04W7qCJd3BDrojK6ruYGOq7vCi2TZGggVUReEZlwUUbEJauaVJxlOw8aN4urDHDGZs5nHHIHU+6Qozc+499/z3dWYGMDAwMDAwMDAwMPhfQpXJjwvAF7nyYe5vMbYAHAJYypVt/bqlLzSAUQCbAHgNJQxgGlkRleLTFIFKaAATAFhoC1yq+CBfCF+uTlkZhT6BF5ZpZIUuhk9kWxZcABahf+CFS6NXoi++Ajvd6UV5Rr1YGRL1pTB43QUY0iEgNcUH6eB1FeC2BH9d0YXeWxDYjQngws2u+RsXYPEWBEVMAIvC4EdROo2VwxaAZ8imuVFkU10Xsinyw1z7gxp96AINbVPfB/lZHMlskhgTKjuwCeCBSp80gB9V+iUqgNrR96F0yioXteITE2BUhWMfKeconuSUTQClj7SbIDPygLbgiQjgUuFU7ZovRGvwRAQYUuiQ1NQnETwRAZR2xHUDPnUVYFGBs00C/qYV+CuLAEqcTZBwWE5MhNtbItye7pAWIEq4Pd2R811AyToq13cGYpCeAaTO/7JBWgA74fZ0h7QAD7U2QFGU22yx9plMZg8p+4rqmuHWju6Dzp4BvrmtY01sK2fNbkJ+YM8AfJn7zbR2dK/V0IxbuBk9jqwf7QX7kX2yLIRpvOuacba0e4ULMY4NhXc2nmQy5+uFxiaT2dPU7J5qvNfSJ7Y/2guOp5MJv3DNWlHpvd/9eF5cN5U4Y3fXlz/leT4kZwYcyrARGETuIai6jh4WBw8AdofTY7ZYpUaKaW7rCIiDB4AamnG3dT0KFI6uyWT2tHU9CoiDF+zvdz+er6iuGc77bGjyAsD+9ur4y+XnVCS867dVVjFVtXe8gLwlsCTDRszXAJCInS7IrVBdRw/bHU7JKWyrrGLqnffGxNdaPumat1VWMcXaa+/6fIaiKHex+2L0EoDOZM7XgyuB1v3t1fHrKtD1jkvT+OXy8/ci4d38NBbPDGtFpbdwWe38stgf3tl4Km6z1l4/DADRN3/5AeCjB59NdfYM8M6Wdm8qccaenf7jB+QJsA1ly8AOYA4AeJ4PJc/iV9avFqy2iksje7QX7D//N71wwr4Zjx5H8r5qacYDAOlkwr+7sTIS49gQkBVsb+Pnfp7nQ4D8t8JzACYV9HMQ2eeCb+QYc2+PF4T1XEMz7s6egXfi+6/3grMlquc31HQqIbW5IhmPzR4EX0i2IfcYnJNpJ0b2q+34CVcqQJxyrOz9RClyBXgFZSJsQcH3A8bhnCp13+n6eKzUfS0oSYQmZdoJwXNyjCmKcn/Q1pE/tmIcG9rfXh3/+/dwftTtDqdHfLSRRIkArwB8e42NouABQDiPBUK/rvXHT7inkcPf+oWNCwDuMA19V2trR2kqPIniJ4Li4KXgef5iU0tebGoWq63YuZ+/brVVFs0NiqFUAA7Sm5vq4NOpZEj8f+Nd14zZYu2rrqPHxMnRKceuS9k3t3UEzBZrXx3TMCVlfx1KP44C2bzgK1xsippGPp1M+GMcGxKSG2dLu7cwJQaA0+jbWSl7u8PpsTucgWL216H2afB7ZPcDItM+vLPxJJU4kzzDAWB3Y2VESFzU2JfCrKyrl/gJwAyAZCkjPpMJpRLx9+n6Js/rveBs/IT77ooNz0fe/fnHAkVR7po7F2lujGNDB8EXI6nEQ9a7Etx615hURTlNpktbj6TYaUeg7XaGxgYGBgYGBgY5PgPHc4RtaXi8ysAAAAASUVORK5CYII=)";

	addButton('L',clock90);
	addButton('R',clock90);
	addButton('U',clock90);
	addButton('D',clock90);
	addButton('F',clock90);
	addButton('B',clock90);
	addButton('L\'',counter90);
	addButton('R\'',counter90);
	addButton('U\'',counter90);
	addButton('D\'',counter90);
	addButton('F\'',counter90);
	addButton('B\'',counter90);

	this.solveButton = document.createElement('div');
	this.solveButton.className = 'rc-button rc-solve-button';
	this.solveButton.appendChild(document.createTextNode('Resolver'));
	this.solveButton.addEventListener('click', function(){
		me.progress.display = '';
		me.cube.solve(function(data){
			setProgress(data);
		});
		me.setSolution('');
	});
	
	this.solveSlowButton = document.createElement('div');
	this.solveSlowButton.className = 'rc-button rc-solve-slow-button';
	this.solveSlowButton.appendChild(document.createTextNode('Passo a Passo'));
	this.solveSlowButton.addEventListener('click', function(){
		me.cube.getSolutionAsync(function(solution){me.setSolution(solution);},function(data){
			setProgress(data);
		});
	});

	function setProgress(data){
		me.progress.style.width = data*100 + '%';
		if(data == 1){
			me.progress.style.width = '0%';
		}
	}

	this.solutionMoves = [];
	this.currentStepIndex = 0;
	this.isAutoPlaying = false;
	this.autoPlayInterval = null;
	this.autoPlaySpeed = 1500;

	this.overlay = document.createElement('div');
	this.overlay.className = 'rc-overlay';
	this.overlay.style.display = 'none';

	var playerWrap = document.createElement('div');
	playerWrap.className = 'step-player-inner';
	playerWrap.style.cssText = 'display:flex;flex-direction:column;justify-content:space-between;height:100%;width:100%;';

	// 1. Header do Player
	var header = document.createElement('div');
	header.className = 'step-player-header';
	header.innerHTML = 
		'<div class="step-player-title-wrap">' +
			'<i class="fas fa-puzzle-piece"></i>' +
			'<span>Passo a Passo</span>' +
		'</div>' +
		'<div class="step-player-counter" id="stepCounterBadge">Passo 1 de 1</div>' +
		'<button class="step-player-close" id="stepBtnClose" title="Fechar passo a passo">' +
			'<i class="fas fa-times"></i> Fechar' +
		'</button>';
	playerWrap.appendChild(header);

	// 2. Barra de Progresso
	var progressTrack = document.createElement('div');
	progressTrack.className = 'step-progress-track';
	var progressFill = document.createElement('div');
	progressFill.className = 'step-progress-fill';
	progressFill.id = 'stepProgressBar';
	progressTrack.appendChild(progressFill);
	playerWrap.appendChild(progressTrack);

	// 3. Card Principal do Passo
	var mainCard = document.createElement('div');
	mainCard.className = 'step-main-card';
	mainCard.id = 'stepMainCard';

	var moveBadge = document.createElement('div');
	moveBadge.className = 'step-move-badge';
	moveBadge.id = 'stepMoveBadge';

	var detailsBox = document.createElement('div');
	detailsBox.className = 'step-details';
	detailsBox.innerHTML = 
		'<div class="step-face-name" id="stepFaceName">Face ...</div>' +
		'<div class="step-rotation-title" id="stepRotationTitle">...</div>' +
		'<div class="step-instruction" id="stepInstruction">...</div>';

	mainCard.appendChild(moveBadge);
	mainCard.appendChild(detailsBox);
	playerWrap.appendChild(mainCard);

	// 3b. Card de Conclusão (após finalizar o último passo)
	var completedCard = document.createElement('div');
	completedCard.className = 'step-completed-card';
	completedCard.id = 'stepCompletedCard';
	completedCard.style.display = 'none';
	completedCard.innerHTML = 
		'<div class="step-completed-icon">🏆</div>' +
		'<div class="step-completed-title">Cubo Resolvido!</div>' +
		'<div class="step-completed-desc">Parabéns! Todos os passos da solução foram concluídos com sucesso.</div>' +
		'<button class="step-act-btn btn-next" id="stepBtnFinish" style="margin-top:6px;max-width:180px;">' +
			'<i class="fas fa-check"></i> Concluir' +
		'</button>';
	playerWrap.appendChild(completedCard);

	// 4. Barra de Ações Interativas
	var actions = document.createElement('div');
	actions.className = 'step-player-actions';
	actions.id = 'stepActions';

	var btnPrev = document.createElement('button');
	btnPrev.className = 'step-act-btn btn-prev';
	btnPrev.id = 'stepBtnPrev';
	btnPrev.innerHTML = '<i class="fas fa-chevron-left"></i> Voltar';

	var btnAuto = document.createElement('button');
	btnAuto.className = 'step-act-btn btn-auto';
	btnAuto.id = 'stepBtnAuto';
	btnAuto.innerHTML = '<i class="fas fa-play"></i> Auto (1.5s)';

	var btnNext = document.createElement('button');
	btnNext.className = 'step-act-btn btn-next';
	btnNext.id = 'stepBtnNext';
	btnNext.innerHTML = 'Avançar <i class="fas fa-chevron-right"></i>';

	actions.appendChild(btnPrev);
	actions.appendChild(btnAuto);
	actions.appendChild(btnNext);
	playerWrap.appendChild(actions);

	this.overlay.appendChild(playerWrap);

	// Listeners do Player
	header.querySelector('#stepBtnClose').addEventListener('click', function(){
		me.closeStepPlayer();
	});
	completedCard.querySelector('#stepBtnFinish').addEventListener('click', function(){
		me.closeStepPlayer();
	});
	btnPrev.addEventListener('click', function(){
		me.prevMove();
	});
	btnAuto.addEventListener('click', function(){
		me.toggleAutoPlay();
	});
	btnNext.addEventListener('click', function(){
		me.nextMove();
	});

	// Stub para retrocompatibilidade
	this.stepButton = document.createElement('div');
	this.stepButton.style.display = 'none';

	this.scrambleButton = document.createElement('div');
	this.scrambleButton.className = 'rc-button rc-scramble-button';
	this.scrambleButton.appendChild(document.createTextNode('Embaralhar'));
	this.scrambleButton.addEventListener('click', function(){
		me.setSolution(''); 
		me.cube.scramble();
	});

	// Botão Reiniciar
	this.resetButton = document.createElement('div');
	this.resetButton.className = 'rc-button rc-reset-button';
	this.resetButton.appendChild(document.createTextNode('Reiniciar'));
	this.resetButton.addEventListener('click', function(){
		window.location.reload();
	});

	this.progress = document.createElement('div');
	this.progress.className = 'rc-progress';
	this.progress.style.position = 'absolute';
	this.progress.style.top = 0;
	this.progress.style.left = 0;
	this.progress.style.bottom = 0;
	this.progress.style.width = '0%';

	this.container.appendChild(this.scrambleButton);
	this.container.appendChild(this.resetButton);
	this.container.appendChild(this.overlay);
	this.container.appendChild(this.progress);
	this.container.appendChild(this.solveButton);
	this.container.appendChild(this.solveSlowButton);
	if(width){
		this.setWidth(width, controlsTop);
	}
}

RubiksCubeControls.prototype.getInverseMove = function(move) {
	if (!move) return '';
	if (move.endsWith('2')) return move;
	if (move.endsWith("'")) return move.slice(0, -1);
	return move + "'";
};

RubiksCubeControls.prototype.setSolution = function(solution) {
	this.stopAutoPlay();
	if (solution && typeof solution === 'string' && solution.trim().length > 0) {
		this.solutionMoves = solution.trim().split(/\s+/).filter(function(m){ return m.length > 0; });
		this.currentStepIndex = 0;
		this.solution = this.solutionMoves;
		this.overlay.style.display = 'flex';
		this.updateStepPlayer();
	} else {
		this.solutionMoves = [];
		this.currentStepIndex = 0;
		this.solution = [];
		this.overlay.style.display = 'none';
	}
};

RubiksCubeControls.prototype.updateStepPlayer = function() {
	var total = this.solutionMoves.length;
	var idx = this.currentStepIndex;

	var mainCard = this.overlay.querySelector('#stepMainCard');
	var completedCard = this.overlay.querySelector('#stepCompletedCard');
	var actionsBar = this.overlay.querySelector('#stepActions');
	var counterBadge = this.overlay.querySelector('#stepCounterBadge');
	var progressBar = this.overlay.querySelector('#stepProgressBar');

	if (!mainCard || !completedCard) return;

	if (idx >= total && total > 0) {
		mainCard.style.display = 'none';
		actionsBar.style.display = 'none';
		completedCard.style.display = 'flex';
		if (counterBadge) counterBadge.textContent = '100% Concluído';
		if (progressBar) progressBar.style.width = '100%';
		this.stopAutoPlay();
		return;
	}

	mainCard.style.display = 'flex';
	actionsBar.style.display = 'flex';
	completedCard.style.display = 'none';

	var percent = Math.round((idx / total) * 100);
	if (counterBadge) {
		counterBadge.textContent = 'Passo ' + (idx + 1) + ' de ' + total + ' (' + percent + '%)';
	}
	if (progressBar) {
		progressBar.style.width = ((idx / total) * 100) + '%';
	}

	var move = this.solutionMoves[idx];
	var info = parseMoveDetails(move, this.cube);

	var moveBadge = this.overlay.querySelector('#stepMoveBadge');
	var faceNameEl = this.overlay.querySelector('#stepFaceName');
	var rotTitleEl = this.overlay.querySelector('#stepRotationTitle');
	var instEl = this.overlay.querySelector('#stepInstruction');

	if (moveBadge && info) {
		moveBadge.style.backgroundColor = info.color;
		moveBadge.style.color = info.textColor;
		moveBadge.style.borderColor = info.isLightBg ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.7)';
		moveBadge.innerHTML = 
			'<span class="step-move-badge-letter">' + info.move + '</span>' +
			'<span class="step-move-badge-icon">' + info.icon + '</span>';
	}

	if (faceNameEl && info) {
		var ptLabel = info.ptColor ? ' (' + info.ptColor + ')' : '';
		faceNameEl.innerHTML = '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + info.color + ';margin-right:6px;border:1px solid rgba(255,255,255,0.6);vertical-align:middle;"></span>Face ' + info.faceName + ptLabel;
	}

	if (rotTitleEl && info) {
		rotTitleEl.textContent = info.rotationTitle;
	}

	if (instEl && info) {
		instEl.innerHTML = info.instruction;
	}

	var btnPrev = this.overlay.querySelector('#stepBtnPrev');
	var btnNext = this.overlay.querySelector('#stepBtnNext');
	if (btnPrev) {
		btnPrev.disabled = (idx === 0);
	}
	if (btnNext) {
		btnNext.innerHTML = (idx === total - 1) 
			? 'Finalizar <i class="fas fa-check"></i>' 
			: 'Avançar <i class="fas fa-chevron-right"></i>';
	}
};

RubiksCubeControls.prototype.nextMove = function() {
	if (this.currentStepIndex < this.solutionMoves.length) {
		var move = this.solutionMoves[this.currentStepIndex];
		this.cube.makeMove(move);
		this.currentStepIndex++;
		this.updateStepPlayer();
	}
};

RubiksCubeControls.prototype.prevMove = function() {
	if (this.currentStepIndex > 0) {
		this.stopAutoPlay();
		this.currentStepIndex--;
		var move = this.solutionMoves[this.currentStepIndex];
		var inv = this.getInverseMove(move);
		this.cube.makeMove(inv);
		this.updateStepPlayer();
	}
};

RubiksCubeControls.prototype.toggleAutoPlay = function() {
	if (this.isAutoPlaying) {
		this.stopAutoPlay();
	} else {
		this.startAutoPlay();
	}
};

RubiksCubeControls.prototype.startAutoPlay = function() {
	var me = this;
	if (this.currentStepIndex >= this.solutionMoves.length) {
		this.currentStepIndex = 0;
	}
	this.isAutoPlaying = true;
	var btnAuto = this.overlay.querySelector('#stepBtnAuto');
	if (btnAuto) {
		btnAuto.innerHTML = '<i class="fas fa-pause"></i> Pausar';
		btnAuto.classList.add('active-playing');
	}
	this.autoPlayInterval = setInterval(function(){
		if (me.currentStepIndex < me.solutionMoves.length) {
			me.nextMove();
		} else {
			me.stopAutoPlay();
		}
	}, this.autoPlaySpeed);
};

RubiksCubeControls.prototype.stopAutoPlay = function() {
	this.isAutoPlaying = false;
	if (this.autoPlayInterval) {
		clearInterval(this.autoPlayInterval);
		this.autoPlayInterval = null;
	}
	var btnAuto = this.overlay.querySelector('#stepBtnAuto');
	if (btnAuto) {
		btnAuto.innerHTML = '<i class="fas fa-play"></i> Auto (1.5s)';
		btnAuto.classList.remove('active-playing');
	}
};

RubiksCubeControls.prototype.closeStepPlayer = function() {
	this.stopAutoPlay();
	this.setSolution('');
};

RubiksCubeControls.prototype.updateStepButton = function() {
	this.updateStepPlayer();
};

RubiksCubeControls.prototype.setWidth = function(width, controlsTop) {
	var controlsHeight = Math.max(Math.round(width * 15 / 28), 230);
	this.container.style.width = (width-2) + 'px';
	this.container.style.height = (controlsHeight - 2) + 'px';
	this.container.style.left = '15px';
	this.container.style.top = controlsTop + 'px';

	var buttonWidth = width/8;
	var current = 0;
	for(var name in this.buttons){
		this.buttons[name].style.width = (buttonWidth-2) + 'px';
		this.buttons[name].style.height = (buttonWidth-2) + 'px';
		this.buttons[name].style.left = buttonWidth*2/7 + 9/7*buttonWidth*(current < 6 ? current : current - 6) + 'px';
		this.buttons[name].style.top = width/28 + (current < 6 ? 0 : (buttonWidth + width/28)) + 'px';
		current++;
	}

	function styleSolve(button, left, bottom){
		button.style.position = 'absolute';
		button.style.bottom = (bottom || width*3/28) + 'px';
		button.style.left = left + 'px';
		button.style.width = buttonWidth*25/7 - 2 + 'px';
		button.style.height = buttonWidth/2 + 'px';
		button.style.lineHeight = buttonWidth/2 + 'px';
		button.style.textAlign = 'center';
		button.style.fontSize = buttonWidth/3+'px';
	}

	styleSolve(this.solveButton, width/28);
	styleSolve(this.solveSlowButton, width*29/56);
	styleSolve(this.scrambleButton, width/28, width/58);
	styleSolve(this.resetButton, width*29/56, width/58);

	if(!this.solutionMoves || this.solutionMoves.length == 0){
		this.overlay.style.display = 'none';
	}
	this.overlay.style.position = 'absolute';
	this.overlay.style.left = 0;
	this.overlay.style.right = 0;
	this.overlay.style.top = 0;
	this.overlay.style.bottom = 0;
};
