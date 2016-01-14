$(document).ready(function(){

$('#yes').click(function() {
						 $('#load').animate({
											opacity: 0,
											height: 0
											},2000);
						 });
$('#yes').click(function() {
						 $('#yes').css("display","none");
						 });

$(function() {  
               var $mug = $('#mug');
		
		    var tempslider = $('#tempslider'),  
        tooltiptemp = $('.temptooltip');  
  
			
    tooltiptemp.hide();  
  
    tempslider.slider({  
        range: "min",  
        min: 1,  
        value: 10,
		max: 20,
		step: 1, 
		
        start: function(event,ui) {  
          tooltiptemp.fadeIn('fast');  
        },  
  
  
        slide: function(event, ui) {    
  
            tooltiptemp.css('left', value).text(ui.value);   
			
            var value = tempslider.slider('value'), 
                volume = $('.volume');   
  
            if(value <=3) {   
                tooltiptemp.html("Iced");  
                $mug.html("<img src='iced.png' alt='coffee mug' />");
            }   
            else if (value >3 && value <=6) {  
                tooltiptemp.html("Warm");
                $mug.html("<img src='steam1.png' alt='coffee mug' />");
            }   
            else if (value >6 && value<=10) {  
                tooltiptemp.html("Hot");
                $mug.html("<img src='steam2.png' alt='coffee mug' />");
			}
            else if (value > 10 && value <=15) {  
                tooltiptemp.html("Dangerously Hot");   
                $mug.html("<img src='steam3.png' alt='coffee mug' />");
            }   
            else if (value >15)  {  
                tooltiptemp.html("Proceed with Caution");   
                $mug.html("<img src='steam4.png' alt='coffee mug' />");  
            };  
  
        },  
  
        stop: function(event,ui) {  
          tooltiptemp.fadeOut('fast');  
        },  
    });  
  
});  

$(function() {  
  
  var $coffee = $('#coffee');
  
    var slider = $('#slider'),  
        tooltip = $('.tooltip');
		
  
    tooltip.hide();  
  
    slider.slider({  
        range: "min",  
        min: 1,
        value: 3,
		max: 20,
		step: 1,  
  
        start: function(event,ui) {  
          tooltip.fadeIn('fast');  
        },  
  
        slide: function(event, ui) {  
  
            var value = slider.slider('value'), 
                volume = $('.volume');   
  
            tooltip.css('left', value).text(ui.value);  
  
            if(value < 3) {   
                tooltip.html("Black"); 
				$coffee.html('<img src="coffee1.png" alt="coffee">'); 
            }   
            else if (value >= 3 && value <= 7) {  
                tooltip.html("With Milk");   
				$coffee.html('<img src="coffee2.png" alt="coffee">');
            }   
            else if (value > 7 && value <= 11) {  
                tooltip.html("With Milk");   
				$coffee.html('<img src="coffee3.png" alt="coffee">');
            }   
            else if (value > 11 && value <= 15) {  
                tooltip.html("With Milk");   
				$coffee.html('<img src="coffee4.png" alt="coffee">');
            }   
            else if (value > 15) {  
                tooltip.html("Mostly Milk");     
				$coffee.html('<img src="coffee5.png" alt="coffee">');
            };  
  
        },  
  
        stop: function(event,ui) {  
          tooltip.fadeOut('fast');  
        },  
    });  
  
});  
	
// Sugar Input Count
var count = 0;
$('#suginp').html(count);

		$('#larrow').click(function() {
			if (count>0){
			$('#suginp').css("font-size","36px");
			count--;
			$('#suginp').html(count);
			}
		});
		
		$('#rarrow').click(function() {
		if(count<6){
			count++;
			$('#suginp').html(count);
		} else if (count = 6) {
			$('#suginp').css("font-size","9px");
			$('#suginp').html("Would you<br />like some <br />coffee with<br />that sugar?");}
		});
});