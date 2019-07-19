$(document).ready(function () {
    // Initialize the Firebase
    var firebaseConfig = {
        apiKey: "AIzaSyD9rXSz6avji4ARjAS0R0LKWGWNIZsFmmY",
        authDomain: "traintimefinal.firebaseapp.com",
        databaseURL: "https://traintimefinal.firebaseio.com",
        projectId: "traintimefinal",
        storageBucket: "traintimefinal.appspot.com",
        messagingSenderId: "992012568712",
        appId: "1:992012568712:web:ef9775b585afc986"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();


    // Send the data to the firebase once the submit button has been clicked 
    $('#add-train-btn').on('click', function (event) {
        event.preventDefault();

        var name = $('#train-name-input').val().trim();
        var destination = $('#destination-input').val().trim();
        var start = $('#start-input').val().trim();
        var frequency = $('#frequency-input').val().trim();

        let train = {
            name,
            destination,
            start,
            frequency
        }
        database.ref("/trainList").push(train);
    })

    database.ref("/trainList").on('child_added', function (snapshot) {
        let train = snapshot.val();
        var StartHour = parseInt(train.start.slice(0, 2));
        var StartMinutes = parseInt(train.start.slice(-2));
        var CurrentHour = parseInt(moment().hours());
        var CurrentMinutes = parseInt(moment().minutes());

        console.log('Start Hour' + StartHour);
        console.log('Start Minutes' + StartMinutes);

        console.log('Current Hour' + CurrentHour);
        console.log('Current Minutes' + CurrentMinutes);
        // Time Length
        var hourDiff;
        var minutesDiff;
        var timeDiff;
        // Time away
        var timeAway
        var ArrivialMinutes
        // arrivialTime
        var arrivialTime;

        hourDiff = CurrentHour - StartHour;
        minutesDiff = CurrentMinutes - StartMinutes;
        timeDiff = hourDiff * 60 + minutesDiff;

        console.log(timeDiff);
        timeAway = parseInt(train.frequency) - timeDiff % (parseInt(train.frequency));
        console.log(timeAway);
        ArrivialMinutes = CurrentMinutes + timeAway;
        if (timeAway < 10) {
            timeAway = '0' + timeAway;
        }
        if (ArrivialMinutes >= 60) {
            CurrentHour = CurrentHour + 1;
            ArrivialMinutes = ArrivialMinutes - 60;
        }
        if (ArrivialMinutes < 10) {
            ArrivialMinutes = '0' + ArrivialMinutes;
        }
        arrivialTime = CurrentHour + ':' + ArrivialMinutes;

        let trainHTML = `
<tr>
<td scope="col">${train.name}</td>
<td scope="col">${train.destination}</td>
<td scope="col">${train.frequency}</td>
<td scope="col">${arrivialTime}</td>
<td scope="col">${timeAway} minutes</td>
</tr>
`;

        $("#train-table tbody").append(trainHTML);


    })
})