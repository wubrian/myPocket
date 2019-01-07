$(document).ready(function() {  

  //post a new url
    $('#createbtn').on('click', function (event) {
      event.preventDefault();
      const imagelink = $(this).parent().find('#imagelink').val();
      const weblink = $(this).parent().find('#weblink').val();
      const category = $(this).parent().find('#category').val();
      console.log(imagelink);
      console.log(weblink);
      console.log(category);

      $.post('/create', {
          title: weblink,
          image: imagelink,
          category: category
      },
    function () {
      location.reload();
    });
      
    });
});