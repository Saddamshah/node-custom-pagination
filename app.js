const express = require('express');
const app = express();
const fetch = require('node-fetch');
const data = require('./data');


// Midalware
app.use(express.json());


// List all the data
app.get('/records', (req, res) => {
    res.json(data)
});

app.get('/api/managed-records', async (req, res) => {
    let response = await fetch('http://localhost:4040/records')
        .then(response => response.json())
        .catch(err => console.log(err))
        
   
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let records = JSON.parse(JSON.stringify(response.data))

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};
    results.ids = []
    results.open = []
    results.closedCount = 0;
    results.nextPage = null;
    results.previousPage = null;
    results.limit = limit;

    

    if (endIndex < records.length) {     
        results.nextPage = page + 1;
    }
    
    if (startIndex > 0) {     
        results.previousPage = page - 1;
    } 

    allRecords = records = records.slice(startIndex, endIndex);
    
    for (let i = 0; i < allRecords.length; i++){
        let record = allRecords[i];
        results.ids.push(record.id)

        if (record.disposition === 'open') {
            results.open.push(record)
        }

        if (record.disposition === 'closed') {
            results.closedCount ++;
        }
        
    }
   
    res.json(results)

});



// PORT
const PORT = process.env.PORT || 4040;
app.listen(PORT, console.log(`Server is running on ${PORT}`));