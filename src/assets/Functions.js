// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

    function scrollFunction() 
    {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
          document.getElementById("myBtn").style.display = "block";
      } else {
          document.getElementById("myBtn").style.display = "none";
      }
    }

    // When the user clicks on the button, scroll to the top of the document
    function topFunction() 
    {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }

    
      
           // create the module scotchApp
           var scotchApp=angular.module('scotchApp', []);
          
                // create the controller and inject $scope
      
                scotchApp.controller('mainController', ['$scope',function($scope) {
                  
                  $scope.x; // saves the id of the selected album, to view its photos
                  $scope.receivers= []; // Contains the  user albums

                  $scope.getdetails = function (x) {
                    testAPI2();
                    $scope.x=x;
                  }

                  $scope.HideButton = function () {

                    var x = document.getElementById("myButton");
                    // Hide the 'Check your albums' button once clicked
                    if (x.style.display === "none") {
                        x.style.display = "block";
                    } else {
                        x.style.display = "none";
                    }
                  }
                 
                    console.log("Currently in the Controller");
                  
                  //The Facebook SDK 
                  (function(d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) return;
                    js = d.createElement(s); js.id = id;
                    js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.10&appId=145346452882980';
                    fjs.parentNode.insertBefore(js, fjs);
                  }(document, 'script', 'facebook-jssdk'));
      
                  (function(d, s, id){
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) {return;}
                    js = d.createElement(s); js.id = id;
                    js.src = "//connect.facebook.net/en_US/sdk.js";
                    fjs.parentNode.insertBefore(js, fjs);
                  }(document, 'script', 'facebook-jssdk'));        
      
                  window.fbAsyncInit = function() {
                    FB.init({
                      appId      : '145346452882980',
                      cookie     : true,
                      xfbml      : true,
                      version    : 'v2.8'
                    });
      
                    FB.getLoginStatus(function(response) {
                        statusChangeCallback(response);
                    });
                  };
      
                  //Checks user status (connected or not) and shows the needed elements
                  function statusChangeCallback(response){
                    if(response.status === 'connected'){
                      console.log('Logged in and authenticated');
                      setElements(true);
                      if(document.getElementById('feed'))
                         $scope.testAPI();
                      else if(document.getElementById('feed2'))
                         $scope.testAPI2();
                    } else {
                      console.log('Not authenticated');
                      setElements(false);
                    }
                  }
      
                  // This function selects all the user's informations and albums and displays them
                  $scope.testAPI= function(){
                    FB.api('me/?fields=name,id,email,birthday,location', function(response) {
                      if(response && !response.error){
                        buildProfile(response);
                      } 
                    });
                    FB.api('me/albums?fields=name,picture,id&type=uploaded&limit=100', function(response){
                        if(response && !response.error){
                          $scope.buildFeed(response);
                        }
                      });
                  }
                    // This function selects all the user's selected album photos informations (Name, source, id)
                  function testAPI2(){
                    FB.api('me/?fields=name,id,email,birthday,location', function(response) { 
                      FB.api($scope.x + '/photos?fields=name,source,id&type=uploaded&limit=5000', function(response){
                        if(response && !response.error){
                          buildFeed2(response);
                        }
                      });
                    })
                  }
                  
                    // Facebook Profile which contains the user's personal informations (Id, Name, Email, Birthday, and location)
                  function buildProfile(user){
                    let profile = ` <div class="profile">
                      <h3>${user.name}</h3>
                      <ul class="list-group">
                        <li class="list-group-item">User ID: ${user.id}</li>
                        <li class="list-group-item">User name: ${user.name}</li>
                        <li class="list-group-item">Email: ${user.email}</li>
                        <li class="list-group-item">User birthday: ${user.birthday}</li>
                        <li class="list-group-item">User location: ${user.location.name}</li>
                      </ul>
                      </div>
                    `;
      
                    document.getElementById('profile').innerHTML = profile;
                  }
      
                  
                  // Facebook FIRST feed which contains the user's albums
                 $scope.buildFeed= function(feed){
                    let output = '';

                    for(let i in feed.data){
                      if(feed.data[i].name){
                        $scope.receivers[i]= {name: feed.data[i].name, 
                                          image: feed.data[i].picture.data.url,
                                          id: feed.data[i].id};
                        console.log($scope.receivers[i]); 
                      }
                    }
                  }
      
                    // Facebook SECOND feed which contains the user's album photos
                  function buildFeed2(feed){
                    let output = '<div class="column">';
                   
                    for(let i in feed.data){
                      if(feed.data[i].id){
                        output += `
                         
                        <div class="hovering">
                            <a href="${feed.data[i].source}" download>
                                <img class="image" src="${feed.data[i].source}">
                                  <div class="text">Click To Download</div>
                            </a>
                          </div>
                        `;
                      }
                    }
                    output += '</div>';
                    document.getElementById('feed2').innerHTML = output;
                    document.getElementById('feed2').style.display = 'block'; //Shows the feed in case it was deactivated
                  }
      
                  
                    // checks the user login condition, if he's logged in, he can see the feed, 
                    // if not; he can only see the heading and the login button option
                  function setElements(isLoggedIn){
                    if(isLoggedIn){
                      document.getElementById('profile').style.display = 'block';
                      document.getElementById('feed').style.display = 'block';     
                      document.getElementById('feed2').style.display = 'block';  
                      document.getElementById('fb-btn').style.display = 'none';
                      document.getElementById('heading').style.display = 'none';
                    } else {
                      document.getElementById('profile').style.display = 'none';
                      document.getElementById('feed').style.display = 'none';
                      document.getElementById('fb-btn').style.display = 'block';
                      document.getElementById('heading').style.display = 'block';
                    }
                  }

                  // Hides the feed sections in case the user clicks on 'Home' in the header
                  $scope.Home = function(){                   
                      document.getElementById('feed').style.display = 'none';      
                      document.getElementById('feed2').style.display = 'none';  
                  }
                        }]);

                       
                         