const https = require("https");
const { writeFile } = require("fs");
const { readFile } = require("fs");

function getPeople() {
  const options = {
    hostname: "nc-leaks.herokuapp.com",
    path: "/api/people",
    method: "GET",
  };

  const request = https.request(options, (response) => {
    //console.log(`response status:`, response.statusCode);
    let body = "";
    response.on("data", (packet) => {
      body += packet.toString();
    });
    response.on("end", () => {
      // parse the JSON string back into an object, ready to be used..
      const parsedBody = JSON.parse(body);

      // do something with the body of the response
      const northcodersStaff = parsedBody.people.filter(
        (person) => person.job.workplace === "northcoders"
      );

      writeFile(
        "northcodersStaff.json",
        JSON.stringify(northcodersStaff),
        (err) => {
          if (err) throw err;
          //console.log("The file has been saved!");
        }
      );
    });
  });
  request.end();
}

function getInterests() {
  readFile("northcodersStaff.json", (err, people) => {
    if (err) throw err;
    const northcodersStaffParsed = JSON.parse(people.toString());
    const peopleInterests = [];

    northcodersStaffParsed.forEach((person) => {
      const options = {
        hostname: "nc-leaks.herokuapp.com",
        path: `/api/people/${person.username}/interests`,
        method: "GET",
      };

      const request = https.request(options, (response) => {
        //console.log(`response status:`, response.statusCode);
        let body = "";
        response.on("data", (packet) => {
          body += packet.toString();
        });
        response.on("end", () => {
          // parse the JSON string back into an object, ready to be used..
          const parsedBody = JSON.parse(body);
          peopleInterests.push(parsedBody.person);

          const peopleInterestsString = JSON.stringify(peopleInterests);

          writeFile("interests.json", peopleInterestsString, (err) => {
            if (err) throw err;
            //console.log("The file has been saved!");
          });
        });
      });
      request.end();
    });
  });
}

function getPets() {
  readFile("northcodersStaff.json", (err, people) => {
    if (err) throw err;
    const northcodersStaffParsed = JSON.parse(people.toString());
    const pets = [];

    northcodersStaffParsed.forEach((person) => {
      const options = {
        hostname: "nc-leaks.herokuapp.com",
        path: `/api/people/${person.username}/pets`,
        method: "GET",
      };

      const request = https.request(options, (response) => {
        //console.log(`response status:`, response.statusCode);
        let body = "";
        response.on("data", (packet) => {
          body += packet.toString();
        });
        response.on("end", () => {
          // parse the JSON string back into an object, ready to be used..
          const parsedBody = JSON.parse(body);
          //console.log(parsedBody.person);
          if (parsedBody.person !== undefined) {
            pets.push(parsedBody.person);
          }

          const petsString = JSON.stringify(pets);

          writeFile("pets.json", petsString, (err) => {
            if (err) throw err;
            //console.log("The file has been saved!");
          });
        });
      });
      request.end();
    });
  });
}

function scavengeForNcData() {
  getPeople();
  //not sure how to guarantee that the northcodersStaff.json
  //will be created before the below functions will try access it
  //so have hardcoded waiting times for each of them
  setTimeout(getInterests, 2000);
  setTimeout(getPets, 3000);
}

scavengeForNcData();
