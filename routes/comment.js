$(document).ready(function() {  
    //clicking on the button
    $("commentbtn").on('click', function(event) {
      $(".comment").toggle("slow");
      $("textarea").focus();
    });
  });