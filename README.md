# jsontographql

jsontographql helps in converting json to graphql schema in most cases. In the final output some tweeks may be required.

## Installation 

`npm install jsontographql`

### Usage

```sh
const {convertToSchema} = require("jsontographql");
const fs = require("fs");
const output = convertToSchema({
    Events : [
        {
            Tickets : {
                name : "Ticket 1",
                seats : [313,131,31,313,131,331,31,3,13,13,1312]
            }
        }
    ]
});
fs.writeFile("./example/sample.js", output, function(){ console.log("schema file created.") });```
