/**
@Author: Edinson Tique
@Name: QCVideo Pluggin
@Versión: 1.3
@Year: 2017
@Contact: www.fb.com/QueCodigoPG
@Libraries: jQuery y jQueryUI
**/
(function ($){
	jQuery.fn.QCVideo_config = function(options_user){
		/* Vaariables del sistema */
		var $this = jQuery(this), /* Convertimos a jQuery */
		video,
		ctn_div,
		stateOn,
		percentage,
		startBuffer,
		maxduration,
		updateVolume,
		currentBuffer,
		get = getGET(),
		QCVideoData = true,
		data = $this.attr("data"),
		video = $this.attr("data-src"),
		width = $this.attr("data-width"),
		titleQC = $this.attr("data-title"),
		height = $this.attr("data-height"),
		posterQC = $this.attr("data-poster"),
		cdn = "http://localhost/proyectos/video/";

		options_default = {
			mod : "video",
			embed : null,
			top : null,
			theme : "QCTheme",
		};

		console.log("QCVideo V1.3");

		opciones = jQuery.extend(options_default, options_user);

		if(QCVideoData = "QCVideo"){
			console.log("QCVideo Load");
			load();
		}

		function load(){
			/* Validamos la barra de titulo */
			if(titleQC === undefined){
				if(opciones.top === "title" || opciones.top === "complet"){
					opciones.top = "share";
				}
			}
			/* Cargamos estilos */
			if(opciones.theme === undefined || opciones.theme === "QCTheme"){
				$("head").append('<link rel="stylesheet" href="'+cdn+'css/QCTheme.css">');
			}else if(opciones.theme === "MowantTheme"){
				$("head").append('<link rel="stylesheet" href="'+cdn+'css/MowantTheme.css">');
			}
			/* Verificamos que el video sea compatible */
			if(checkQCvideo() === true){
				/* Definimos tamaños */
				if(opciones.mod === "video"){
					if(width === undefined){
						width = "640px";
						height = "360px";
					}else{
						width = width+'px';
						height = height+'px';
					}
				}else if(opciones.mod === "embed"){
					console.log("mod");
					$("body").addClass("QCVideo-embed");
					width = "100%";
					height = "100%";
				}
				/* Validamos url para current time */
				if(get["time"] != undefined){
					video = video + '#t=' + get["time"];
				}

				init();
				initFunct();
			}else{
				console.log("QCVideo Error video");
				if(opciones.mod === "video"){
					if(width === undefined){
						width = "640px";
						height = "360px";
					}else{
						width = width+'px';
						height = height+'px';
					}
				}else if(opciones.mod === "embed"){
					$("body").addClass("QCVideo-embed");
					width = "100%";
					height = "100%";
				}
				$(this).replaceWith( '<div id="content-video" class="content-video" style="width: '+width+'; height: '+height+'"></div>');
				$("#content-video").html('<div id="error-wrapper"><div id="page"><div class="row"><div class="main"><div class="box"><span class="fa-stack fa-lg"><i class="fa fa-file-video-o fa-stack-1x"></i><i class="fa fa-ban fa-stack-2x text-danger"></i></span><br> Este video no se encuentra disponible o esta malo :( <br /><a style="color: #337ab7; background-color: transparent;text-decoration: none;transition: all 300ms linear 0s;font-size: 15px;" href="http://www.quecodigo.com">&copy; Que Codigo!</a></div></div></div></div></div>');
			}
		}

		function init(){
			console.log("QCVideo init");
			/* Creamos los elementos */
			$this.replaceWith( '<div id="content-video" class="content-video" style="width: '+width+'; height: '+height+'"></div>');
			$("#content-video").append('<div class="share-info"><div class="container"><div class="header"><div class="share-text"></div><i id="shared-close" class="qc-icon qc-close"></i></div><div class="content"><div class="title"><span>Compartir video</span><div class="social"><ul><li class="qc-icon qc-facebook"></li><li class="qc-icon qc-twitter"></li><li class="qc-icon qc-google-plus"></li></ul></div></div></div></div></div>');
			$("#content-video").append('<div class="mejs-overlay-play"><a class="mejs-overlay-button"><button style="display: block;" class="ytp-large-play-button ytp-button"><svg width="100%" viewBox="0 0 68 48" version="1.1" height="100%"><path fill-opacity="0.81" fill="#1f1f1e" d="m .66,37.62 c 0,0 .66,4.70 2.70,6.77 2.58,2.71 5.98,2.63 7.49,2.91 5.43,.52 23.10,.68 23.12,.68 .00,-1.3e-5 14.29,-0.02 23.81,-0.71 1.32,-0.15 4.22,-0.17 6.81,-2.89 2.03,-2.07 2.70,-6.77 2.70,-6.77 0,0 .67,-5.52 .67,-11.04 l 0,-5.17 c 0,-5.52 -0.67,-11.04 -0.67,-11.04 0,0 -0.66,-4.70 -2.70,-6.77 C 62.03,.86 59.13,.84 57.80,.69 48.28,0 34.00,0 34.00,0 33.97,0 19.69,0 10.18,.69 8.85,.84 5.95,.86 3.36,3.58 1.32,5.65 .66,10.35 .66,10.35 c 0,0 -0.55,4.50 -0.66,9.45 l 0,8.36 c .10,4.94 .66,9.45 .66,9.45 z" class="ytp-large-play-button-bg"></path><path fill="#fff" d="m 26.96,13.67 18.37,9.62 -18.37,9.55 -0.00,-19.17 z"></path><path fill="#ccc" d="M 45.02,23.46 45.32,23.28 26.96,13.67 43.32,24.34 45.02,23.46 z"></path></svg></button></a></div>');
			$("#content-video").append('<video src="'+ video + '" preload="auto" poster="' + posterQC + '" id="reproductor-QCV"></video>');
		
			if(opciones.top === null || opciones.top === "share"){
				$("#content-video").append('<div class="top-gradient"></div><div class="top"><div class="share"><a><i class="qc-icon qc-share"></i></a></div></div>');
			}else if(opciones.top === "title"){
				$("#content-video").append('<div class="top-gradient"></div><div class="top"><div class="title"><div class="text"><a><span>' + titleQC + '</span></a></div></div></div>');
			}else if(opciones.top === "complet"){
				$("#content-video").append('<div class="top-gradient"></div><div class="top"><div class="title"><div class="text"><a><span>' + titleQC + '</span></a></div></div><div class="share"><a id="shared-video"><i class="qc-icon qc-share"></i></a></div></div>');
			}
			$("#content-video").append('<div class="menu" id="barra-menu"><div class="progress"><div class="progress-bar"><div class="bar-padding"></div><div class="progress-list"><div class="scrubber" id="update-progress"><div class="progress" id="progress"><span class="scrom-slide"></span><span id="seek-tooltip"></span></div><div class="loaded" id="loaded"></div></div></div></div></div><div class="controls"><div class="left"><a id="boton_player"><i class="qc-icon qc-play"></i></a><a class="volume"><i class="qc-icon qc-volume-up"></i><div class="slider"><span class="knob"></span></div></a><div class="duration"><a id="played">00:00 </a><a> | </a><a id="durtimetext"> 00:00</a></div></div><div class="right"><!--a>&nbsp;</a--><a id="cog"><i class="qc-icon qc-cog"></i></a><a id="completa"><i class="qc-icon qc-fullscreen"></i></a></div></div></div>');
			$("#content-video").append('<div class="context-menu-list"><ul><li data-action = "first">First thing</li><li data-action = "second">Second thing</li><li data-action = "third">Third thing</li></ul></div>');
			console.log("QCVideo Create");
		}

		function initFunct(){
			console.log("QCVideo functions");
			/* Establecemos elemento */
			video = $("#reproductor-QCV");
			/* Cargamos el video */
			video[0].load();
			setTimeout(startBuffer, 500);
			/* Acciones shared Buttons */
			$("#content-video").on("click", "#shared-video", function(e){
				e.preventDefault();
				$(".share-info").show();
			});
			$("#content-video").on("click", "#shared-close", function(e){
				e.preventDefault();
				$(".share-info").hide();
			});
			/* Funciones Barra del menú */
			$("#content-video").mouseover(function(){
				if(video[0].paused == false) {
					$("#barra-menu").show();
				}
			});
			$("#content-video").mouseout(function(){
				if(video[0].paused == false) {
					$("#barra-menu").hide();
				}
			});
			/* Funciones Current Time */
			//video.bind('load', function(){
				var activityTimeout = null;
				$("#content-video").mousemove(function(event){
					if (activityTimeout) {
						clearTimeout(activityTimeout);
						if(video[0].paused == false) {
							$("#barra-menu").show();
						}
					}
					activityTimeout = setTimeout(
						function(){
							if(video[0].paused == false) {
								$("#barra-menu").hide();
							}
						}, 3000);
				});
			//});
			/* Carga los datos iniciales */
			video.bind('loadeddata', function(){
				updateVolume(0, 0.7);
				var tiempoTotal = Math.floor(video[0].duration);
				var durmins = Math.floor(video[0].duration / 60);
				var dursecs = Math.floor(video[0].duration - durmins * 60);
				if(dursecs < 10) {
					dursecs = "0"+dursecs;
				}
				if(durmins < 10) {
					durmins = "0"+durmins;
				}
				if(durmins === "Infinity" || dursecs === "NaN"){
					durmins = "En Vivo";
					dursecs = "";
				}

				if (Math.floor(tiempoTotal)/60>=60) {
					var h = Math.floor(tiempoTotal / 3600);
					tiempoTotal = tiempoTotal - h * 3600;
					var m = Math.floor(tiempoTotal / 60);
					var s = Math.floor(tiempoTotal % 60);
					if(h.toString().length<2){h='0'+h;}
					if(m.toString().length<2){m='0'+m;}
					if(s.toString().length<2){s='0'+s;}
					$('#played').html("<span class='active'>00:00:00</span>");
					$('#durtimetext').html("<span class='active'>" + h + ":" + m + ":" + s + "</span>");
				} else {
					var m = Math.floor(tiempoTotal / 60);
					var s = Math.floor(tiempoTotal % 60);
					if(m.toString().length<2){m='0'+m;}
					if(s.toString().length<2){s='0'+s;}
					$('#played').html("<span class='active'>00:00</span>");
					$('#durtimetext').html("<span class='active'>" + m + ":" + s + "</span>");
				}
				//$('#durtimetext').html("<span class='resz'>" + durmins + ":" + dursecs + "</span>");
			});
			/* Actualiza los datos para la barra */
			video.bind('timeupdate', function(){
				var tiempoActual = Math.floor(video[0].currentTime);
				var tiempoTotal = Math.floor(video[0].duration);
				var porcentaje = tiempoActual/tiempoTotal*100;

				if (Math.floor(tiempoTotal)/60>=60) {
					var h = Math.floor(tiempoActual / 3600);
					tiempoActual = tiempoActual - h * 3600;
					var m = Math.floor(tiempoActual / 60);
					var s = Math.floor(tiempoActual % 60);
					if(h.toString().length<2){h='0'+h;}
					if(m.toString().length<2){m='0'+m;}
					if(s.toString().length<2){s='0'+s;}
					$('#played').html("<span class='active'>" + h + ":" + m + ":" + s + "</span>");          
				} else {
					var m = Math.floor(tiempoActual / 60);
					var s = Math.floor(tiempoActual % 60);
					if(m.toString().length<2){m='0'+m;}
					if(s.toString().length<2){s='0'+s;}
					$('#played').html("<span class='active'>" + m + ":" + s + "</span>");
				}

				$('#progress').width(porcentaje+'%');
			});
			/* Cambiar estado de tiempo */
			$(".progress").mousemove(function(event){
				$("#content-video").on("click",'.progress',function(event){
					var maxduration = video[0].duration;
					var x = event.pageX;
					var position = x - $(this).offset().left;
					var percentage = 100 * position / $(this).width();
					if(percentage > 100) {
						percentage = 100;
					}
					if(percentage < 0) {
						percentage = 0;
					}
					$('#progress').css('width',percentage+'%');
					video[0].currentTime = maxduration * percentage / 100;
				});
			});
			/* Función al finalizar el video */
			video.on('ended', function(){
				$('#boton_player').html('<i class="qc-icon qc-replay"></i>');
				$("#barra-menu").show();
				$(".mejs-overlay-button").show();
				$("#content-video").css({"cursor": ""});
			});
			/* Función de cambio al reproducir */
			video.bind('played', function(){
				video[0].play();
				$('#boton_player').html('<i class="qc-icon qc-pause"></i>');
				return false;
			});
			/* Boton grande de play */
			$("#content-video").on("click", ".mejs-overlay-button", function(e){
				e.preventDefault();
				$("#boton_player").click();
			});
			/* Boton play */
			$("#content-video").on("click",'#boton_player',function(e){
				e.preventDefault();
				if(video[0].paused == false){
					video[0].pause();
					$('#boton_player').html('<i class="qc-icon qc-play"></i>');
					$('#progress').css('width','0%');
					$(".mejs-overlay-button").show();
					return false;
				}else{
					video[0].play();
					$('#boton_player').html('<i class="qc-icon qc-pause"></i>');
					$(".mejs-overlay-button").hide();
					return false;
				}
			});
			/* Función de cambio al pausar */
			video.bind('paused', function(){
				if(!stateOn()) {
					video[0].pause();
					$('#boton_player').html('<i class="qc-icon qc-play"></i>');
					return false;
				}
			});
			/* Cambio de volumen guardado */
			video.on('volumechange',function(){
				localStorage.setItem('volume',video[0].volume);
				updateVolume(0, (localStorage.getItem('volume')||1));
				video.trigger('volumechange');
			});
			/* Función de cambio de volumen */
			video.on('volumechange', function(e){
				var position = e.pageX - $(this).offset().left;
				var percentage = 100 * position / $(this).width();
				$('.volumenBar').css('width', percentage+'%');
			});
			/* Cambiar volumen al arrastrar */
			var volumeDrag = false;
			$('.slider').on('mousedown', function(e) {
				volumeDrag = true;
				video[0].muted = false;
				$(".volume i").removeClass("qc-volume-off");
				updateVolume(e.pageX);
			});
			$(document).on('mouseup', function(e) {
				if(volumeDrag) {
					volumeDrag = false;
					updateVolume(e.pageX);
				}
			});
			$(document).on('mousemove', function(e) {
				if(volumeDrag) {
					updateVolume(e.pageX);
				}
			});
			/* Cambio de volumen al dar click */
			$("#content-video").on("click",'.volume i',function(event){
				event.preventDefault();
				if(video[0].volume > 0){
					updateVolume(0, 0);
					$(this).removeClass("qc-volume-up");
					$(this).addClass("qc-volume-off");
				}else {
					updateVolume(0, 1);
					$(this).removeClass("qc-volume-off");
					$(this).addClass("qc-volume-up");
				}
			});
			/* Boton pantalla completa */
			$("#content-video").on("click",'#completa',function(e){
				e.preventDefault();
				function launchFullScreen(element) {
					if(element.requestFullScreen) {
						element.requestFullScreen();
					} else if(element.mozRequestFullScreen) {
						element.mozRequestFullScreen();
					} else if(element.webkitRequestFullScreen) {
						element.webkitRequestFullScreen();
					}
				}
				function cancelFullscreen() {
					if(document.cancelFullScreen) {
						document.cancelFullScreen();
					} else if(document.mozCancelFullScreen) {
						document.mozCancelFullScreen();
					} else if(document.webkitCancelFullScreen) {
						document.webkitCancelFullScreen();
					}
				}

				cancelFullscreen();
				launchFullScreen(document.getElementById("content-video"));

				var isiPhone = navigator.userAgent.toLowerCase().indexOf("iphone");
				var isiPad = navigator.userAgent.toLowerCase().indexOf("ipad");
				var isiPod = navigator.userAgent.toLowerCase().indexOf("ipod");

				if(isiPhone > -1 || isiPad > -1 || isiPod > -1){
					launchFullScreen(document.getElementById("reproductor-QCV"));
				}
			});
			/* Salir de pantalla completa con ESC */
			document.addEventListener("keydown", function (e) {
				if (e.keyCode == 32) {
					$("#boton_player").click();
					if($('#barra-menu').is(":hidden")){
						$('#barra-menu').show();
						$("#content-video").css({"cursor":""});
					}
				}
			});
			console.log('QCVideo Finish');
		}

		stateOn = function(){
			if(!video.paused === true){
				return true;
			}else{
				return false;
			}
		}

		startBuffer = function(){
			maxduration = video[0].duration;
			currentBuffer = video[0].buffered.end(0);
			percentage = 100 * currentBuffer / maxduration;
			$('#loaded').animate({
				width: percentage+"%"
			});

			if(currentBuffer < maxduration) {
				setTimeout(startBuffer, 500);
			}
		}

		updateVolume = function(x, vol) {
			var volume = $('.slider');
			var percentage;

			if(vol) {
				percentage = vol * 100;
			}
			else {
				var position = x - volume.offset().left;
				percentage = 100 * position / volume.width();
			}
			
			if(percentage > 100) {
				percentage = 100;
			}
			if(percentage < 0) {
				percentage = 0;
			}
			
			$('.knob').css('width',percentage+'%');	
			video[0].volume = percentage / 100;

			if(video[0].volume == 0){
				$('.volume i').removeClass('qc-volume-up').addClass('qc-volume-off');
			}
			else if(video[0].volume > 0.5){
				$('.volume i').removeClass('qc-volume-off').addClass('qc-volume-up');
			}
			else{
				$('.volume i').removeClass('qc-volume-off').addClass('qc-volume-up');
			}
			
		};

		function checkQCvideo() {
			var formato = document.createElement("video"), ext;
			if (formato.canPlayType) {
				/* Establecemos el ext variable a cualquier formato de archivo compatible con el navegador */
				if(ext = 
				(!!formato.canPlayType && "" != formato.canPlayType('video/ogg') ? "ogv" :
					(!!formato.canPlayType && "" != formato.canPlayType('video/mp4') ? "mp4" :
						(!!formato.canPlayType && "" != formato.canPlayType('video/mp4') ? "m4v" :
							(!!formato.canPlayType && "" != formato.canPlayType('video/webm') ? "webm" :
								false
							)
						)
					)
				)){
					return true;
				}else{
					return false;
				}
			}else{
				return false;
			}
		}

		function getGET(){
			var url= location.search.replace("?", "");
			var arrUrl = url.split("&");
			var urlObj={};   
			for(var i=0; i<arrUrl.length; i++){
				var x= arrUrl[i].split("=");
				urlObj[x[0]]=x[1]
			}
			return urlObj;
		}
	}
})(jQuery);