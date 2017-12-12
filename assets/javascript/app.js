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
//var trainEndPoint = database.ref("/trainList")
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

    if (trainName != "" && trainDest != "" && trainStart != "" && trainFreq != "") {

        var newTrain = {
            name: trainName,
            dest: trainDest,
            start: trainStart,
            freq: trainFreq,
            key: database.ref().push().key
        };

        console.log(newTrain.name);
        console.log(newTrain.key);

        database.ref().child(newTrain.key).set(newTrain);
        //database.ref().push(newTrain);


    } else {
        alert("You must complete all fields to add a train.");
    }
    // Clear the input fields in preparation for new user entries
    $("#nameInput").val("");
    $("#destInput").val("");
    $("#startInput").val("");
    $("#freqInput").val("");


});
// var updateTrains = function () {

database.ref().on("child_added", function (snapshot) {
    //database.ref().on("child_added", function (childSnapshot, prevChildKey) {
    console.log(snapshot.val().name);

    var currentTrain = snapshot.val();
    // var trainKey = snapshot.key;

    console.log(currentTrain);
    //console.log(trainKey);

    // First Time (pushed back 1 year to make sure it comes before current time)
    var trainStartConverted = moment.unix(currentTrain.start, "hh:mm").subtract(1, "years");
    console.log(trainStartConverted);

    // Current Time
    var currentTime = moment();
    console.log(currentTime);
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(trainStartConverted), "minutes");
    console.log(moment(trainStartConverted, "minutes"));
    console.log("DIFFERENCE IN TIME: " + diffTime);
    console.log("FREQUENCY: " + currentTrain.freq);

    // Time apart (remainder)
    var tRemainder = diffTime % currentTrain.freq;
    console.log(tRemainder);

    // Minutes Until next Train
    var tMinutesTilTrain = currentTrain.freq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTilTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTilTrain, "minutes");
    console.log("ARRIVAL TIME: " + nextTrain.format("h:mm a"));


    // Add the new train info to the table
    // $(".table").append(`<tr><td>${currentTrain.name}</td><td>${currentTrain.dest}</td><td>${currentTrain.freq}</td><td>${moment(nextTrain).format("hh:mm")}</td><td>${tMinutesTilTrain}</td></tr>`);

    $("#trainTable > tbody").append("<tr><td>" +
        currentTrain.name + "</td><td>" +
        currentTrain.dest + "</td><td>" +
        currentTrain.freq + "</td><td>" +
        moment(nextTrain).format("h:mm a") + "</td><td>" +
        tMinutesTilTrain + "</td><td><button class='btn btn-default delTrain'>Remove</button></td></tr>");

    $(".delTrain").attr("data-key", currentTrain.key);

});


//When the user clicks a remove button:
$("#trainTable").on("click", ".delTrain", function () {
    var myKey = $(this).attr("data-key");
    console.log(myKey);
    //remove child from firebase
    database.ref().child(myKey).remove();
    // remove row from table
    $(this).parent().parent().remove();

});


// function pageRefresh() {
//     dataRefresh();
// }
var autoRefresh = setInterval(dataRefresh, 60000);
// setTimeout(autoRefresh, 1000 * 60);

function dataRefresh() {
    $("#trainTable > tbody").empty();

    database.ref().once("value", function (childSnapshot) {
    //    console.log("Refreshed: ", childSnapshot.val());
        console.log("Each Child: ", childSnapshot.val());
        for(var train in childSnapshot.val()){
            var currentTrain = childSnapshot.val()[train];
            var trainStartConverted = moment.unix(currentTrain.start, "hh:mm").subtract(1, "years");
            var currentTime = moment();
            var diffTime = moment().diff(moment(trainStartConverted), "minutes");
            var tRemainder = diffTime % currentTrain.freq;
            var tMinutesTilTrain = currentTrain.freq - tRemainder;
            var nextTrain = moment().add(tMinutesTilTrain, "minutes");


            $("#trainTable > tbody").append("<tr><td>" +
            currentTrain.name + "</td><td>" +
            currentTrain.dest + "</td><td>" +
            currentTrain.freq + "</td><td>" +
            moment(nextTrain).format("h:mm a") + "</td><td>" +
            tMinutesTilTrain + "</td><td><button class='btn btn-default delTrain'>Remove</button></td></tr>");

            $(".delTrain").attr("data-key", currentTrain.key);
        }
    //  $("#trainTable > tbody").children.eq(3).text(moment(nextTrain).format("h:mm a"));
    //  $("#trainTable > tbody").children.eq(4).text(tMinutesTilTrain);


        


    });
};

//dataRefresh();