$(document).ready(function() {  
    $(".ratebtn").on('click', function(event) {
      $(event.target).parent().parent().parent().parent().find('div.rating').toggle("slow");
    });

  //post a new rating
    $('.star5').on('click',function (event) {
      const urlValue = $(event.target).data().url;
      event.preventDefault();
        $.post('/rating', {
            attribute: urlValue
          },
        function () {

        });
    });

    $('.star4').on('click',function (event) {
        const urlValue = $(event.target).data().url;
        event.preventDefault();
          $.post('/rating', {
              attribute: urlValue
            },
          function () {
              
          });
      });

      $('.star3').on('click',function (event) {
        const urlValue = $(event.target).data().url;
        event.preventDefault();
          $.post('/rating', {
              attribute: urlValue
            },
          function () {
              
          });
      });

      $('.star2').on('click',function (event) {
        const urlValue = $(event.target).data().url;
        event.preventDefault();
          $.post('/rating', {
              attribute: urlValue
            },
          function () {
              
          });
      });

      $('.star1').on('click',function (event) {
        const urlValue = $(event.target).data().url;
        event.preventDefault();
          $.post('/rating', {
              attribute: urlValue
            },
          function () {
              
          });
      });
});