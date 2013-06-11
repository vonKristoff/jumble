/**
* Jumble jQuery plug-in
* Text Colour Truffle Shuffle
*
* @author Jean-Christophe Nicolas <mrjcnicolas@gmail.com>
* @homepage http://bite-software.co.uk/jumble/
* @version 1
* @license MIT http://opensource.org/licenses/MIT
* @date 22-05-2013
*/
(function($) {


var Plugin = function(me,rgb,rgb2,brightness,satuation){

	this.el = me;
	this.col = rgb;
	this.rgb2 = (rgb2)? rgb2 : false;
	this.bright = (brightness)? true : false;
	this.satuation = (satuation)? true : false;

	this.num = me.html().length;
	this.pin = ~~(Math.random()*1000);

	this.init();
}
Plugin.prototype.init = function(){

	var i = 0, p = this.pin;
	var chars = $.map(this.el.text().split(''), function(l) {
		i++;
  		return '<span class="'+p+'jumble_'+ i +'">' + l + '</span>';
	});
	this.el.html(chars.join('')); 

	this.format();

}

Plugin.prototype.format = function(){

	for(var i=1;i<=this.num;i++){

		var colour = this.swatch();
		this.el.children('.'+this.pin+'jumble_'+i).css('color',colour);
	}

}
Plugin.prototype.swatch = function(){
	
	var colour;
	if(!this.col){
		colour = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);	
	}else{
		var hsl = this.hsl(this.col); 
		colour = 'rgb(' + this.filter(hsl) + ')';
	}
	return colour;
}

Plugin.prototype.filter = function(hsl){

	var HSL = hsl,
		l = hsl[2], r = l/2,
		lightness = l;

	if(this.bright){

		if(l<30){
			lightness = l + Math.random()*l;
		}else if(l>70){
			lightness = l - Math.random()*l;
		}else{
			lightness = l - r + Math.random()*l;
		}
	}

	//var	lightness = (this.bright)? ~~( l/2 - (l/2) + Math.random()*l/1.5) : l,
	var hue = hsl[0],
	 	sat = hsl[1];
	 	
	if(this.rgb2){

		var hsl2 = this.hsl(this.rgb2),
			r1 = hsl[0],
			r2 = hsl2[0];
		
		function randomRange(from,to){
		    return ~~(Math.random()*(to-from+1)+from);
		}
		hue = randomRange(r1,r2);

	}
	if(this.satuation){
		sat = ~~(Math.random()*100);
	}

	HSL[0] = hue;
	HSL[1] = sat;
	HSL[2] = lightness;

	return this.rgb(HSL);
}

$.fn.jumble = function(rgb,rgb2,brightness,satuation,time){

	var el = $(this);

	var anim = (time)? time : false;

	$(this).each(function(i){
		var me = $(this),
			play = true;
		if( isMobile.any() ) play = false;
		
		if(anim && play){
			setInterval(function(){		
				var jumble = new Plugin(me,rgb,rgb2,brightness,satuation);	
			},anim);	
		}else{
			var jumble = new Plugin(me,rgb,rgb2,brightness,satuation);		
		}
	})
	
	return el;	
}


Plugin.prototype.colourFilter = function(){

	var col = this.colours;
	
	col.c1 = this.colstep(col.c1);
	col.c1.push(col.alpha);
	col.c2 = this.colstep(col.c2);
	col.c2.push(col.alpha);
	col.shade = this.colstep(col.shade);
	col.shade.push(col.alpha);
}
Plugin.prototype.colstep = function(col){
	
	var hsl = this.hsl(col),
		wheel = this.colours.wheel,
		hue = (360 * wheel);

	hsl[0] = hsl[0] - (~~(Math.random()*hue/2)) + (~~(Math.random()*hue/2));
	hsl[1] = wheel * 100;
	hsl[2] = 30 * this.colours.light;
	return this.rgb(hsl);
}
Plugin.prototype.hsl = function(rgb){

	var r1 = rgb[0] / 255;
	var g1 = rgb[1] / 255;
	var b1 = rgb[2] / 255;
	var maxColor = Math.max(r1,g1,b1);
	var minColor = Math.min(r1,g1,b1);
	//Calculate L:
	var L = (maxColor + minColor) / 2 ;
	var S = 0;
	var H = 0;
	if(maxColor != minColor){
	    //Calculate S:
	    if(L < 0.5){
	        S = (maxColor - minColor) / (maxColor + minColor);
	    }else{
	        S = (maxColor - minColor) / (2.0 - maxColor - minColor);
	    }
	    //Calculate H:
	    if(r1 == maxColor){
	        H = (g1-b1) / (maxColor - minColor);
	    }else if(g1 == maxColor){
	        H = 2.0 + (b1 - r1) / (maxColor - minColor);
	    }else{
	        H = 4.0 + (r1 - g1) / (maxColor - minColor);
	    }
	}

	L = L * 100;
	S = S * 100;
	H = H * 60;
	if(H<0){
	    H += 360;
	}

	var result = [H, S, L];
	return result;
	
}
Plugin.prototype.rgb = function(hsl){
	var h = hsl[0];
	var s = hsl[1];
	var l = hsl[2];
	
	var m1, m2, hue;
	var r, g, b;
	s /=100;
	l /= 100;
	if (s == 0)
		r = g = b = (l * 255);
	else {
		if (l <= 0.5)
			m2 = l * (s + 1);
		else
			m2 = l + s - l * s;
		m1 = l * 2 - m2;
		hue = h / 360;
		r = this.hue2rgb(m1, m2, hue + 1/3);
		g = this.hue2rgb(m1, m2, hue);
		b = this.hue2rgb(m1, m2, hue - 1/3);
	}
	return [Math.round(r), Math.round(g), Math.round(b)];
}
Plugin.prototype.hue2rgb = function(m1, m2, hue) {
	var v;
	if (hue < 0)
		hue += 1;
	else if (hue > 1)
		hue -= 1;

	if (6 * hue < 1)
		v = m1 + (m2 - m1) * hue * 6;
	else if (2 * hue < 1)
		v = m2;
	else if (3 * hue < 2)
		v = m1 + (m2 - m1) * (2/3 - hue) * 6;
	else
		v = m1;

	return 255 * v;
};

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

})(jQuery);