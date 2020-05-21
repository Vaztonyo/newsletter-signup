const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html');
});

app.post('/', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const subscriberData = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    
    const jsonData = JSON.stringify(subscriberData);
    const apiUrl = 'https://us18.api.mailchimp.com/3.0/lists/38106fd928';
    const options = {
        method: 'POST',
        auth: 'vaztonyo:c78519816f3071b43c39f5db20602d8e-us18'
    }

    const request =  https.request(apiUrl, options , (response) => {

        const getStatus = response.statusCode;

        if (getStatus === 200) {
            res.sendFile(__dirname + "/public/success.html");    
        } else {
            res.sendFile(__dirname + "/public/failure.html");    
        }

        response.on('data', (data) => {
            console.log(JSON.parse(data));
        })
    });

    // request.write(jsonData);
    request.end();
});

app.post('/failure', (req, res) => {
    res.redirect('/')
})

app.listen(PORT, () => {
    console.log("Server running on port: " + PORT);
});
