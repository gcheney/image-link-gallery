/*
 * Custom scripts for image-gallery
 */
(function($, W, D)
{ 
    var JQUERY = {};

    JQUERY.UTIL =
    {
        imgLinkHover : function()
        {
            // add image transition on hover
            // now done in angular 
            $('.image-hover').on('mouseenter mouseleave', function(evt) {
                 if (evt.type == 'mouseenter') {
                     $(this).addClass('transition');
                 } else  {
                     $(this).removeClass('transition');
                 }
            });
        },
        formatImageDate: function() 
        {
            // format the date for image details page
            // now done in angular
            var datetext = $('#date').text();
            var date = new Date(datetext);
            
            var monthNames = [ "January", "February", "March", "April", "May", "June",
                              "July", "August", "September", "October", "November", "December" ];
            var d = date.getDate();
            var m = monthNames[date.getMonth()];
            var y = date.getFullYear();
            
            var formattedDate = d + ' ' + m + ' ' + y;
            $('#date').text(formattedDate);
        },
        setupLightbox: function() 
        {
            // hide lightbox initalliy
            $('#lightbox').hide();
    
            $('.lightbox-trigger').click(function(e) {
                e.preventDefault();

                //Get img link href for lightbox
                var href = $(this).attr("href");
                $('#lightbox-content').html('<img src="' + href + '" />');
                $('#lightbox').show('slow');	
            });

            //Click anywhere on the page to get rid of lightbox window
            $('#lightbox').on('click', function() { 
                $('#lightbox').hide('fast');
            });
        }
    };
        
    $(D).ready(function($) {
        //JQUERY.UTIL.imgLinkHover();
        //JQUERY.UTIL.formatImageDate();
        //JQUERY.UTIL.setupLightbox();
    });
    
})(jQuery, window, document);