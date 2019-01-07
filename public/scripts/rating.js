$(document).ready(function() {  
    $(".ratebtn").on('click', function(event) {
      $(event.target).parent().parent().parent().parent().find('div.rating').toggle("slow");
    });

  //post a new rating
    $('.rating').on('click',function (event) {
      const urlValue = $(this).attr("data-url");
      var ratingValue = 0;

      if($(event.target).text() === "5 stars"){
        ratingValue = 5;
      } else if ($(event.target).text() === "4 stars"){
        ratingValue = 4;
      } else if ($(event.target).text() === "3 stars"){
        ratingValue = 3;
      } else if ($(event.target).text() === "2 stars"){
        ratingValue = 2;
      } else if ($(event.target).text() === "1 star"){
        ratingValue = 1;
      }
      event.preventDefault();
        $.post('/rating', {
            attribute: urlValue,
            rating: ratingValue,
          },
        function () {
           //to be continued...
           location.reload();
        });
    }); 
});