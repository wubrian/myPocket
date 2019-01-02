$(document).ready(function() {
   
   
   // $.ajax({
   //    method: "GET",
   //    url: "/api/users"
   //  }).done((users) => {
   //    for(user of users) {
   //      $("<div>").text(user.name).appendTo($("body"));
   //    }
   //  });;

     //add a new like
     $('.likes').on('click', function (event) {
      const urlValue = $(event.target).data().url;
      event.preventDefault();
      console.log($(event.target).data())
      // var inputText = $(this).serialize().slice(5);
      // var content = $(event.target).children().val();
        
        $.ajax('/likes', {
          type: 'POST',
          data: {
            attribute: urlValue
          },
          dataType: "json"
        })
        .done(function (event) {
          alert(hello)
          console.log($(event.target))
          $("#submit-comment").get(0).reset();
          $(".counter").text("150");
        });
      
    });

    function createTile(tileData){
      let $tile = $('<main>').addClass('container');
      let $div = $('<div>').addClass('row');
      let $div2 = $('<div>').addClass('col-lg-4');
      let $figure = $('<figure>').addClass('thisfig');
  
      //append image, figcaption to our figure declared above
  
      $('<img>').attr({src:'#', alt:'sample8'}).appendTo($figure);
  
      let $figcaption = $('<figcaption>');
      let $h2 = $('<h2>').text('#');
      $('<span>').text('#').appendTo($h2);
  
      $h2.appendTo($figcaption);
  
      $('<p>').text('#').appendTo($figcaption);
  
      //div3 caontaining 3 <a> tags to be appendedTo our figcaption
      let $div3 = $('<div>').addClass('icons');
      $('<a>').addClass('ion-ios-home').attr('href', '#').appendTo($div3);
      $('<a>').addClass('ion-email-unread').attr('href', '#').appendTo($div3);
      $('<a>').addClass('ion-ios-star').attr('href', '#').appendTo($div3);
  
      $div3.appendTo($figcaption);
  
      $figcaption.appendTo($figure);
 
      $figure.appendTo($div2);
      $div2.appendTo($div);
      $div.appendTo($tile);
    }  
  
})
