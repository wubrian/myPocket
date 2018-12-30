$(document).ready(function() {  
    //clicking on the button
    
      $(".commentbtn").on('click', function(event) {
        $(event.target).parent().parent().parent().parent().find('section.comment').toggle("slow");
        $(event.target).parent().parent().parent().parent().find('textarea').focus();
        // $("#cmtcontent").focus();
      });
    
 
    //count characters in the textarea and display on bottom
    $("textarea").on('keyup', function(event) {
      const textareaContent = $(this).val();
      const textLimit = 150;
      const charactersRemaining = textLimit - textareaContent.length;
      const counter = $(this).parent().children(".counter");
      const errorClass = 'errorCounter';
  
      counter.text(charactersRemaining);
      if(charactersRemaining < 0) {
        counter.addClass(errorClass);
      } else {
        counter.removeClass(errorClass);
      }
    });

    //post a new tweet
    function postTweet() {
      var $send = $('#submit-comment');
      $send.submit(function (event) {
        event.preventDefault();
        var data = $(this).serialize();
        var content = $('#cmtcontent').val();
        console.log(content.length);
        if(content.length === 0) {
          $(".alert-danger").slideUp();
          $(".alert-warning").slideDown();
        } else if(content.length > 140){
          $(".alert-warning").slideUp();
          $(".alert-danger").slideDown();
        } else {
          $(".alert-danger").slideUp();
          $(".alert-warning").slideUp();
          $.ajax('/comment', {
            type: 'POST',
            data: data
          })
          .then(function () {
            $("#submit-comment").get(0).reset();
            $(".counter").text("150");
          });
        }
      });
    };
    postTweet();
  });