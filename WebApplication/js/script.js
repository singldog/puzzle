(function () {
    function game() {
        var name,minute,second,diff,pause=0,backsrc,t;
        var arr=[];
		var s=0,sw=500,sh=500,x=0,y=0;
        this.init = function () {
            read();
            $("#end").hide();
            $(".file").change(function () {
                var fr = new FileReader();
                var file = this.files[0];
                if(file.type!='image/jpeg'){
                    alert("Image is wrong");
                    return;
                }else{
                    fr.readAsDataURL(file);
                    fr.onload = function () {
                        backsrc = this.result;
                        applyback();
                        return;
                    }
                }
            })
            $("#button").click(function () {
                name = $("#name").val();
                $('.big-image').fadeIn();
                if(name==""||backsrc==null){
                    alert("please input info");
                }else{
                    $("#playername").text(name);
                    diff = $("select option:selected").val();
                    $("#start").fadeOut();
                    makegame();
                    t = setInterval(time,1000);
                }
            })
            $(window).keydown(function (e) {
                var deg = $(".box-shadow").attr('data-deg')*1;
                if(e.keyCode==37){
                    deg-=90;
                }else if(e.keyCode==39){
                    deg+=90;
                }
                $(".box-shadow").css("transform",'rotate('+deg+'deg)');
                $(".box-shadow").attr("data-deg",deg);
            })
            $(".btn-pause").click(function () {
                if(pause==0){
                    pause=1;
                    $(this).text("RESUME");
                    $(".paused").fadeIn();
                    $("#puzzle,#puzzleDestination").fadeOut();
                    clearInterval(t);
                }else{
                    pause=0;
                    t = setInterval(time,1000);
                    $(this).text("PAUSE");
                    $(".paused").fadeOut();
                    $("#puzzle,#puzzleDestination").fadeIn();
                }
            })
            $(".btn-restart").click(function () {
                if(pause==1){
                    $(".btn-pause").text("PAUSE");
                    $(".paused").fadeOut();
                    $("#puzzle,#puzzleDestination").fadeIn();
                }
                clearInterval(t);
                $(".minute").text("00");
                $(".second").text("00");
                $("#end").fadeOut();
                $(".big-image").fadeOut();
                $(".puzzle-box").remove();
                $("#start").fadeIn();
            })
        }
        function bindEvents() {
            $("#puzzle .puzzle-box").mousedown(function () {
                if($(this).hasClass("big")){
                    $(this).removeClass("big");
                    $(this).find(".back-needed").removeClass("box-shadow");
                }else{
                    $(".big").removeClass("big");
                    $(".box-shadow").removeClass("box-shadow");
                    $(this).addClass("big");
                    $(this).find(".back-needed").addClass("box-shadow");
                }
            })
            $("#puzzle .puzzle-box").draggable({
                revert:true,
                snap:".puzzle-box",
                start:function () {
                    if($(this).hasClass("big")){
                        $(this).removeClass("big");
                    }
                    if(!$(this).find(".back-needed").hasClass("box-shadow")){
                        $(this).find(".back-needed").addClass("box-shadow");
                    }
                },
                stop:function () {
                    var d = $(this).find(".back-needed");
                    var deg = d.attr("data-deg")*1;
                    var bdeg = d.attr("data-bdeg")*1;
                    if(deg!=bdeg){
                        var c = (bdeg-deg)%360;
                        if(c==-270){
                            c=90;
                        }else if(c==270){
                            c=-90;
                        }
                        bdeg = deg+c;
                        d.css("transform","rotate("+bdeg+"deg)");
                        d.attr("data-deg",bdeg);
                        d.attr("data-bdeg",bdeg);
                    }
                    d.removeClass("box-shadow");

                }
            })
            $("#puzzleDestination .puzzle-box").droppable({
                hoverClass:"hover",
                drop:function (events,ui) {
                    var d = ui.draggable.find('.back-needed');
                    var deg = d.attr("data-deg");
                    var bdeg = d.attr("data-bdeg");
                    var index1 = d.attr("data-index");
                    var index2 = $("#puzzleDestination .puzzle-box").index(this);
                    if(deg%360==0 && index1==index2){
                        d.appendTo(this);
                        d.removeClass("box-shadow");
                        gameover();
                    }
                }
            })
        }
        function gameover() {
            if($("#puzzle .puzzle-box .back-needed").length==0){
                clearInterval(t);
                localStorage.removeItem("res");
                $("#end").fadeIn();
                $(".big-image").fadeOut();
                adddata();
                localStorage.tbody = $("#tbody").html();
            }
        }
        function adddata() {
            var d;
            if(diff==1){
                d="EASY";
            }else{
                d="HARD";
            }
            if($("#tbody tr").length<=2){
                $("#tbody tr:last-of-type .td").text(3);
                $("#tbody tr:nth-of-type(1) .td").text(2);
            }else{
                $("#tbody tr:last-of-type").remove();
                $("#tbody tr:last-of-type .td").text(3);
                $("#tbody tr:nth-of-type(1) .td").text(2);
            }
            var tr = "<tr><td class='td'>1</td><td>"+d+"</td><td>"+name+"</td><td>"+minute+":"+second+"</td></tr>";
            $(tr).prependTo("#tbody");
        }
        function fill() {
            var c = diff*1+1;
            var side = parseInt(500/c);
            for(var i = 0;i<c*c;i++){
                var div = "<div class='puzzle-box' style='width:"+side+"px;height:"+side+"px'></div>";
                $(div).appendTo("#puzzle");
                $(div).appendTo("#puzzleDestination");
            }
        }
        function time() {
            minute = $(".minute").text()*1;
            second = $(".second").text()*1;
            second++;
            if(second==60){
                minute++;
                second="00";
            }else if(second<10){
                second = "0"+second;
            }
            if(minute<10){
                minute = "0"+minute;
            }
            $(".minute").text(minute);
            $(".second").text(second);
            save();
        }
        function image() {
            var img = new Image();
            img.onload = function () {
                var width = this.width;
                var height = this.height;
                if(width>height){
                    sw = (500/height)*width;
                    x = (sw-500)/2;
                    $(".big-image").css("background-size",sw+"px "+sh+"px");
                }else{
                    sh = (500/width)*height;
                    y = (sh-500)/2;
                    $(".big-image").css("background-size",sw+"px "+sh+"px");
                }

                var c = diff*1+1;
                var side = parseInt(500/c);
                for(var i=0;i<c*c;i++){
					setTimeout(test,10);
                }

            }
            img.src = backsrc;
            s=0;
            arr=[];
        }
		
		function test(){
            console.log("a");
            var c = diff*1+1;
            var side = parseInt(500/c);
			var div = $("<div class='puzzle-block back-needed'></div>");
			var deg = parseInt(Math.random()*4)*90;
			div.css({
				"background-size":sw+"px "+sh+"px",
				"background-position":(-x-s%c*side)+"px "+(-y-parseInt(s/c)*side)+"px",
				"transform":"rotate("+deg+"deg)"
			})
			div.attr("data-index",s);
			div.attr("data-deg",deg);
			div.attr("data-bdeg",deg);
            arr.push(div);
            s++;
            if(s==c*c){
                arr.sort(function () {
                    return 0.5-Math.random();
                })
                arr.forEach(function (e,i) {
                    var b = $("#puzzle .puzzle-box").eq(i);
                    e.appendTo(b);
                })
            }
		}
        function makegame() {
            fill();
            image();
            bindEvents();
        }
        function applyback() {
            $("#back").remove();
            var d ="<style id='back'>.back-needed{background-image:url("+backsrc+")}</style>";
            $(d).appendTo("body");
        }
        function save() {
            localStorage.res = true;
            localStorage.minute = minute;
            localStorage.second = second;
            localStorage.diff = diff;
            localStorage.backsrc = backsrc;
            localStorage.name = name;
            localStorage.tbody = $("#tbody").html();
            localStorage.html = $("body").html();
            localStorage.pause = pause;
        }
        function read() {;
            $("#tbody").html(localStorage.tbody);
            if(localStorage.res){
                name = localStorage.name;
                minute = localStorage.minute;
                second = localStorage.second;
                diff = localStorage.diff;
                backsrc = localStorage.backsrc
                $("body").html(localStorage.html);
                pause = localStorage.pause;
                $(".puzzle-box").css("left","0px");
                $(".puzzle-box").css("top","0px");
                $(".box-shadow").removeClass("box-shadow");
                $(".hover").removeClass("hover");
                t = setInterval(time,1000);
                bindEvents();
            }
        }
    }
    
    
    var game;
    $(function () {
        game = new game();
        game.init();
    })
})();