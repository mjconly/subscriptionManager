var idx;
var comp = [];
var maxCount;

//build a "card" for invalid streamer
function build404Card(){
    $(".listStreamers li").each(function(){
        $pos = $(this).find(".streamname").text();
        if ($.inArray($pos, comp) === -1){
          console.log("Putting in blank ")
          //bad link logo
          $logo = "https://i.vimeocdn.com/portrait/8413190_300x300"
          $followers = "0"
          $url = "https://www.youtube.com/watch?v=XqZsoesa55w"
          $name = $pos
          $game = "Stream does not exist";

          $htmlname = "<h3>Display Name: "+$name+"</h3>"
          $htmlgame = "<h3>Streaming: "+$game+"</h3>"
          $htmllogo = "<img class='img-fluid'  src='"+$logo+"'>"
          $htmlurl = "<a href='"+$url+"' target='_blank'><h3>Doo Doo Doo</h3></a>"
          $htmlfollowers = "<h3>Followers: "+$followers+"</h3>"

          $delButton = "<a class='btn btn-danger delete-article' href='#' data-id="+
          $pos +">Unsubscribe</a>"

          // $main = "<div display:inline-block>" +
          // "<div display:inline-block>" + $htmllogo + "</div>" +
          // "<div text-align: left>" + $htmlname + $htmlgame + $htmlurl + $htmlfollowers + "</div>" +
          // $delButton + "</div>"

          $main = "<div class='container'>" +
                    "<div class='row'>" +
                      "<div class='col'>" +
                          $htmllogo +
                      "</div>" +
                      "<div class='col'>" +
                        "<div class='row'>" +
                          $htmlname +
                        "</div>" +
                        "<div class='row'>" +
                          $htmlgame +
                        "</div>" +
                        "<div class='row'>" +
                          $htmlurl +
                        "</div>" +
                        "<div class='row'>" +
                          $htmlfollowers +
                        "</div>" +
                        "<div class='row'>" +
                          $delButton +
                        "</div>"
                      "</div>"
                    "</div>"
                  "</div>"

          $(this).append($main);

          //attach "unsubscribe" button to card
          $(".delete-article").on("click", function(e){
            $target = $(e.target);
            const id = $target.attr("data-id")
            console.log(id);
            $.ajax({
              type:'DELETE',
              url: "/articles/"+id,
              success: function(response){
                window.location.href="/users/userhome";
              },
              error: function(err){
                console.log(err);
              }
            });
          });
      }
    });
}

//Build a "card" with streamer info
function buildStreamerCard(json, pos){
  $(".listStreamers li").each(function(){
      if ($(this).find(".streamname").text() === pos){
        $logo = json.logo;
        $followers = json.followers;
        $url = json.url;
        $name = json.display_name;
        $game = json.game;

        $htmlname = "<h3>Display Name: "+$name+"</h3>"
        $htmlgame = "<h3>Streaming: "+$game+"</h3>"
        $htmllogo = "<img class='img-fluid'  src='"+$logo+"'>"
        $htmlurl = "<a href='"+$url+"' target='_blank'><h3>View Stream</h3></a>"
        $htmlfollowers = "<h3>Followers: "+$followers+"</h3>"

        $delButton = "<a class='btn btn-danger delete-article' href='#' data-id="+
        pos +">Unsubscirbe</a>"
        //switched from $name to pos


        $main = "<div class='container'>" +
                  "<div class='row'>" +
                    "<div class='col-6'>" +
                        $htmllogo +
                    "</div>" +
                    "<div class='col'>" +
                      "<div class='row'>" +
                        $htmlname +
                      "</div>" +
                      "<div class='row'>" +
                        $htmlgame +
                      "</div>" +
                      "<div class='row'>" +
                        $htmlurl +
                      "</div>" +
                      "<div class='row'>" +
                        $htmlfollowers +
                      "</div>" +
                      "<div class='row'>" +
                        $delButton +
                      "</div>"
                    "</div>"
                  "</div>"
                "</div>"

        $(this).append($main);


        //attach "Unsubscirbe" button to card
        $(".delete-article").on("click", function(e){
          $target = $(e.target);
          const id = $target.attr("data-id")
          $.ajax({
            type:'DELETE',
            url: "/articles/"+id,
            success: function(response){
              window.location.href="/users/userhome";
            },
            error: function(err){
              console.log(err);
            }
          });
        });

    }
  });
}


function updateBlanks(count){
  if (count === maxCount){
    build404Card();
  }
}


$(document).ready(function(){

  idx = 0;
  maxCount = $(".listStreamers li").length;


  $(".listStreamers li").each(function(){
      $tag = $(this).find(".streamname").text();
      //promise to build cards after twitch get request
      $.getJSON("https://api.twitch.tv/kraken/channels/" + $tag +
      "?client_id=9xrx1gabc0dlit7k0m5xvnq7uz8o3c&callback=?")

      .done(function(data){
        $displayName = data.display_name;
        comp.push($displayName)
        buildStreamerCard(data, $displayName);
        idx += 1;
        updateBlanks(idx);
      })

      .fail(function(d, status, err){
        console.log(d)
        console.log(status)
        console.log(err)
        idx += 1;
        updateBlanks(idx);
      })
    })
});
