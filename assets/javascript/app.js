// Initialize Firebase
// Make sure to match the configuration to the script version number in the HTML
// (Ex. 3.0 != 3.7.0)
var config = {
    apiKey: "AIzaSyAx1F8fxXerfQLICaB-7Ggt__Wp21KGdgI",
    authDomain: "my-first-project-20a1d.firebaseapp.com",
    databaseURL: "https://my-first-project-20a1d.firebaseio.com",
    projectId: "my-first-project-20a1d",
    storageBucket: "my-first-project-20a1d.appspot.com",
    messagingSenderId: "265108912232"
  };
  firebase.initializeApp(config);
  
  // Assign the reference to the database to a variable named 'database'
  //var database = ...
  var database = firebase.database();

  // Initial Values




  // Whenever a user clicks the submit button
$("#addTrainBtn").on("click", function (event) {
    // Prevent form from submitting
    event.preventDefault();
  
    // Get the input values
    var trainName = $("#nameInput").val().trim();
    var trainDest = $("#destInput").val().trim();
    //var trainStart = moment($("#startInput").val().trim().subtract(1, "years"), "HH:mm").format("X");
    var trainStart = moment($("#startInput").val().trim(), "HH:mm").subtract(1, "years").format("X");
    var trainFreq = $("#freqInput").val().trim();
  
    // Log the values to the console
    console.log(`Train Name: ${trainName}`);
    console.log(`Train Dest: ${trainDest}`);
    console.log(`Train Start: ${trainStart}`);
    console.log(`Frequency: ${trainFreq}`);

    var newTrain = {
        name: trainName,
        dest: trainDest,
        start: trainStart,
        freq: trainFreq
    };

    database.ref().push(newTrain);

    
    // Clear the input fields in preparation for new user entries
    $("#nameInput").val("");
    $("#destInput").val("");
    $("#startInput").val("");
    $("#freqInput").val("");
});
    database.ref().on("child_added", function(childSnapshot, prevChildKey) {
        console.log(childSnapshot.val().name);

        var currentTrain = childSnapshot.val();

         // First Time (pushed back 1 year to make sure it comes before current time)
        var trainStartConverted = moment.unix(currentTrain.start, "hh:mm").subtract(1, "years");
        console.log(trainStartConverted);

        // Current Time
        var currentTime = moment();

        console.log(currentTime);
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        console.log(moment(trainStartConverted, "minutes"));
        var diffTime = moment().diff(moment(trainStartConverted), "minutes");

        console.log("DIFFERENCE IN TIME: " + diffTime);

        console.log("FREQUENCY: " + currentTrain.freq);

        // Time apart (remainder)
        var tRemainder = diffTime % currentTrain.freq;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = currentTrain.freq - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + nextTrain.format("hh:mm"));
            

        // var monthsWorked = moment(currentTrain.start).toNow();
        // console.log(monthsWorked);

// Add the new employee info to the table
$(".table").append(`<tr><td>${currentTrain.name}</td><td>${currentTrain.dest}</td><td>${currentTrain.freq}</td><td>${moment(nextTrain).format("hh:mm")}</td><td>${tMinutesTillTrain}</td></tr>`
);
    });
    