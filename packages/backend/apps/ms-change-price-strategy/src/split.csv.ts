const csvSplitStream = require('csv-split-stream');

const path_ = '../../'
// @ts-ignore
const fs = require('fs')

csvSplitStream.split(

    fs.createReadStream(path_+'_350с.spbe.csv'),
    {
        lineLimit: 2_500_000
    },
    (index) => fs.createWriteStream(path_+`output-${index}.csv`)
)
    .then(csvSplitResponse => {
        console.log('csvSplitStream succeeded.', csvSplitResponse);
    }).catch(csvSplitError => {
        console.log('csvSplitStream failed!', csvSplitError);
    });