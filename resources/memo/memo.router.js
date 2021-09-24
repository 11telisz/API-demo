import {Router} from "express";
import fsPromise from "fs.promises";
import fs from 'fs';
import {Buffer} from 'buffer';
import express from "express";
//Gotta give express a name
const app = express();


const router = Router();
// let memoList = [];

//Learn to write to a file and call from that
//let memoList = {list:[]};
//JSON.stringify(memoList)

// This creates an object that is our current Log.txt, this will be over written with our post command
//Since our list already contains an array of data we no longer need to use "let memoList =[]"
//Using readFileSync we are forcing our response variable to be created or 'initialized'
const response = fs.readFileSync("Log.txt", "utf-8", (err, data) => {
    if (err) throw err;

    //Here we are creating an object logFile that will contain our data
    //Remember our data was Stringified in our previous function to create our data
    //So we will need to parse that data back into JSON using express
    let logFile = app.json(data);
    // console.log(logFile);


    //Now we can return our data
    return logFile;
});

//Now we need to parse our response created above into something we can use IE JSON
let memoList = JSON.parse(response);






router.post("/", (req, res) =>{

    //Here we are creating an object that contains the request information provided
    //in this case our object will have a field of message that will only contain
    //the req and search for the body and grab just the message. req.body.message

    const memo = {
        id: new Date().getTime(),
        message: req.body.message
    };

    //Here we are taking our memoList Array, that is our file that was written to disc
    //that we defined up top
    //and pushing a new memo into it
    memoList.push(memo);

    //Now we need to stringify out data so we can save it to a disc.
    //we can only write specific types of data to a disc so we must make it a string
    const logFile = JSON.stringify(memoList);
    // console.log(logFile);

    //Now we take our stringified data and write it to our disc as the name "Log.txt"
    fs.writeFile("Log.txt", logFile,err => {
        if (err) {
            console.log(err);
            return
        };
    });

    res.send({
        message: "Created"
    });
});

router.get("/", (req, res) =>{
    // console.log(req.params);

    // let memolist = response;
    //
    // console.log(memolist);

    // console.log(req.params);


    //by changing our search from the req.params.id we can make it a field that the user can provide
    //we just need to search for a different part of our request, in this case we can have the user
    //input a field named "id" with the value of the memo id we want.
    const memo = memoList.find((memo) =>{
        return memo.id == req.body.id
    });

    //The response will be am object with the specific memo requested buy the user
    res.send({
        memo: memo
    });




});

router.get("/:id", (req, res) =>{
    console.log(req.params);

    //This object is created by finding a specific memo by the id, but the user must specify that in the path
    //or URL field of the API IE: api/memo/"requested id" or api/memo/1632510587790
    const memo = memoList.find((memo) =>{
        return memo.id == req.params.id
    });

    //This returns the selected memo to the user as specified in the path
    res.send({
        memo: memo
        });

});

router.put("/:id", (req, res) =>{


    const memo = memoList.find((memo) =>{
        return memo.id == req.params.id
    });

    memo.message = req.body.message;


    res.send({
        message: "Put up!!"
    });
});

router.delete("/:id", (req, res) =>{
    const index = memoList.findIndex((memo) =>{
        return memo.id == req.params.id
    });

    memoList.splice(index, 1);
    res.send({
        message: "deleted"
    });

});

export default router;

