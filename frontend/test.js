document.onload = function() {
    $.ajax({
        method: "POST",
        url: "some.php",
        data: { range: "medium", numberArtists: 10 }        
      }).done(result => {
        console.log(result);
      }).fail(err => {
        console.log("Something went wrong:" + err);
    });
}