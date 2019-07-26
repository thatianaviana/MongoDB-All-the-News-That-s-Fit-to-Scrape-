// $(document).ready(function(){



//     // Grab the articles as a json and display on screen
//     function displayArticles(){
//       $.getJSON("/articles", function(data) {
//         // For each one
//         for (var i = 0; i < data.length; i++) {

//           // Display the apropos information on the page
//           var panelDiv = $("<div>")
//           panelDiv.attr("id", data[i]._id)
//           panelDiv.addClass("panel panel-default")

//           var panelHeading = $("<div class='panel-heading' ></div>")

//           var panelTitle = $("<h3 class='panel-title' ></h3>")


//           var newATag = $("<a class='article-title'>");
//           newATag.attr("target", "_blank")
//           newATag.attr("href", data[i].url)
//           newATag.text(data[i].headline)

//           panelTitle.append(newATag)
//           panelHeading.append(panelTitle)
//           panelDiv.append(panelHeading)

//           panelDiv.append(data[i].summary)

//            // if the article is saved
//           if (data[i].isSaved){

//           //create a delete button
//             panelTitle.append("<button data-id='" + data[i]._id + "' class='btn btn-warning delete-button'>" + "Delete Article" + "</button>");
//             // create a note button
//             panelTitle.append("<button data-id='" + data[i]._id + "' class='btn btn-success note-button'>" + "Article Notes" + "</button>");
//             // append to the div with id saved-articles (in saved page)
//             $("#saved-articles").append(panelDiv)
//           }
//           // if it is not saved
//           else{      

//           //create a save button
//             panelTitle.append("<button data-id='" + data[i]._id + "' class='btn btn-primary save-button'>" + "Save Article" + "</button>");
//             // append to the div with id articles (in index page)
//             $("#articles").append(panelDiv)

//           }

//         }
//       });
//     }


//     // on page load
//     displayArticles();


//     // Whenever someone clicks the article notes tag
//     $(document).on("click", ".note-button", function() {

//       // Save the id from the button
//       var thisId = $(this).attr("data-id");
//       console.log(thisId)

//       // Now make an ajax call for the Article
//       $.ajax({
//         method: "GET",
//         url: "/articles/" + thisId
//       })
//         // With that done, add the note information to the modal
//       .then(function(data) {
//         console.log(data);

//         $("#noteModalLabel").empty()
//         $("#noteModalBody").empty()
//         $("#noteModalLabel").append(data.headline +"<br> <textarea class='form-control' id='titleinput' rows='2' placeholder='Note Title'></textarea>")
//         $("#noteModalBody").append("<textarea class='form-control' id='bodyinput' rows='6' placeholder='Note Body'></textarea>")

//         //grab the id of the button and give the save button(in the modal) a data attr of the id
//         $("#savenote").attr("data-id", data._id)

//         // If there's already a note in the article
//         if (data.note) {
//           // Place the title of the note in the title input
//           $("#titleinput").val(data.note.title);
//           // Place the body of the note in the body textarea
//           $("#bodyinput").val(data.note.body);
//         }

//         $("#noteModal").modal("show");

//       });
//     });



//     // When you click the savenote button
//     $(document).on("click", "#savenote", function() {
//       // Grab the id associated with the article from the submit button
//       var thisId = $(this).attr("data-id");

//       console.log(thisId)
//       console.log($("#titleinput").val())

//       // Run a POST request to change the note, using what's entered in the inputs
//       $.ajax({
//         method: "POST",
//         url: "/articles/" + thisId,
//         data: {
//           // Value taken from title input
//           title: $("#titleinput").val(),
//           // Value taken from note textarea
//           body: $("#bodyinput").val()
//         }
//       })
//         // With that done
//       .then(function(data) {
//           // Log the response
//         console.log(data);

//       });

//       // Also, remove the values entered in the input and textarea for note entry
//       $("#titleinput").val("");
//       $("#bodyinput").val("");
//     });

//     // when scrape button is clicked
//     $(document).on("click", "#scrape-button", function(){
//       $.ajax({
//         method: "GET",
//         url: "/scrape" 

//       }).then(function(data) {
//         // Log the response
//         console.log("hello")
//         console.log(data);

//         // load the articels onto the page
//         displayArticles()

//         $("#scrapeModalLabel").text("You successfully scraped new articles")
//         $("#scrapeModalBody").text("Woohoo!")

//         $("#scrapeModal").modal("show");

//       });
//     });


//     $(document).on("click", ".save-button", function(){
//       console.log(this)

//       var id = ($(this).attr("data-id"));
//       $.ajax({
//         method: "PUT",
//         url: "/articles/" + id

//       })
//         // With that done
//         .then(function(data) {
//           // Log the response
//           console.log(data);

//           // remove the saved article from the index page
//           $("#" + id).remove();

//         });
//     });


//     $(document).on("click", ".delete-button", function(){
//       console.log(this)

//       var id = ($(this).attr("data-id"));
//       $.ajax({
//         method: "DELETE",
//         url: "/articles/" + id

//       }).then(function(data) {
//         // Log the response
//         console.log("hello")
//         console.log(data);

//        // remove the article (from the saved page)
//         $("#" + id).remove();

//       });
//     });


//   })


$(document).on("click", "#scrape-button", function () {

    db.get("/scrape", function (req, res) {
        // Make a request via axios to grab the HTML body from the site of your choice
        axios.get("https://www.washingtonpost.com/politics/courts-law/?utm_term=.07af283b5e7a").then(function (response) {

            // Load the HTML into cheerio and save it to a variable
            // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
            var $ = cheerio.load(response.data);
            // Select each element in the HTML body from which you want information.
            // NOTE: Cheerio selectors function similarly to jQuery's selectors,
            // but be sure to visit the package's npm page to see how it works
            $("div.PromoMedium-title").each(function (i, element) {

                var headline = $(element).children().text();

                // var link = $(element).find("a").attr("href"); //both versions worked

                var link = $(element).children().attr("href");

                // Save these results in an object that we'll push into the results array we defined earlier
                db.scrapeData.push({
                    headline: headline,
                    link: link
                });
            });


            // }).then(function(data) {
            //   // Log the response
            //   console.log("hello")
            //   console.log(data);

            //   // load the articels onto the page
            //   displayArticles()

            //   $("#scrapeModalLabel").text("You successfully scraped new articles")
            //   $("#scrapeModalBody").text("Woohoo!")

            //   $("#scrapeModal").modal("show");

            // });
        });
    });
});