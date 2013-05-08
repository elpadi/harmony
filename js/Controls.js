define(['lib/dom'], function(dom) {
	
	function Controls(harmony, $container) {
		this.harmony = harmony;
		this.$container = $container;
		this.$clearButton = $container.find('.harmony__clear-button');
		this.$saveButton = $container.find('.harmony__save-button');
		this.$foregroundColor = $container.find('.color-selector__foreground');

		this.setEventHandlers();
	}

	Controls.prototype = {
		harmony: null,
		$container: null,
		$foregroundColor: null,
		$backgroundColor: null,
		$clearButton: null,
		$saveButton: null,
		
		setEventHandlers: function() {
			this.$clearButton.on('click', dom.events.preventDefault(this.harmony.bind(this.harmony.clear)));
			this.$saveButton.on('click', dom.events.preventDefault(this.harmony.bind(this.harmony.save)));
		},
		/*
		init: function() {
			var option, space, separator, color_width = 15, color_height = 15;

			this.container = document.createElement("div");
			this.container.className = 'gui';
			this.container.style.position = 'absolute';
			this.container.style.top = '0px';
			
			this.foregroundColor = document.createElement("canvas");
			this.foregroundColor.style.marginBottom = '-3px';
			this.foregroundColor.style.cursor = 'pointer';
			this.foregroundColor.width = color_width;
			this.foregroundColor.height = color_height;
			this.container.appendChild(this.foregroundColor);
			
			space = document.createTextNode(" ");
			this.container.appendChild(space);

			this.backgroundColor = document.createElement("canvas");
			this.backgroundColor.style.marginBottom = '-3px';
			this.backgroundColor.style.cursor = 'pointer';
			this.backgroundColor.width = color_width;
			this.backgroundColor.height = color_height;
			this.container.appendChild(this.backgroundColor);

			space = document.createTextNode(" ");
			this.container.appendChild(space);		
			
			this.selector = document.createElement("select");

			this.container.appendChild(this.selector);

			space = document.createTextNode(" ");
			this.container.appendChild(space);
			
			this.save = document.createElement("span"); //getElementById('save');
			this.save.className = 'button';
			this.save.innerHTML = 'Save';
			this.container.appendChild(this.save);
			
			space = document.createTextNode(" ");
			this.container.appendChild(space);
			
			this.clear = document.createElement("Clear");
			this.clear.className = 'button';
			this.clear.innerHTML = 'Clear';
			this.container.appendChild(this.clear);

			separator = document.createTextNode(" | ");
			this.container.appendChild(separator);

			this.about = document.createElement("About");
			this.about.className = 'button';
			this.about.innerHTML = 'About';
			this.container.appendChild(this.about);
		},

		addOption: function(title) {
			var option = document.createElement("option");
			option.id = this.selector.childNodes.length;
			option.innerHTML = title.toUpperCase();
			this.selector.appendChild(option);
		},
		
		setForegroundColor: function( color ) {
			var context = this.foregroundColor.getContext("2d");
			context.fillStyle = 'rgb(' + color[0] + ', ' + color[1] +', ' + color[2] + ')';
			context.fillRect(0, 0, this.foregroundColor.width, this.foregroundColor.height);
			context.fillStyle = 'rgba(0, 0, 0, 0.1)';
			context.fillRect(0, 0, this.foregroundColor.width, 1);
		},
		
		setBackgroundColor: function( color ) {
			var context = this.backgroundColor.getContext("2d");
			context.fillStyle = 'rgb(' + color[0] + ', ' + color[1] +', ' + color[2] + ')';
			context.fillRect(0, 0, this.backgroundColor.width, this.backgroundColor.height);
			context.fillStyle = 'rgba(0, 0, 0, 0.1)';
			context.fillRect(0, 0, this.backgroundColor.width, 1);		
		}
		*/
	};

	return Controls;

});
