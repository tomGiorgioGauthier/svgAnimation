'use strict';
const fs = require('fs');

const path = require('path');
const port = 8000;


let express = require('express');
const { exit } = require('process');
let app = express();

app.use(express.static(path.join(__dirname, '/js')));
app.use(express.static(path.join(__dirname, '/paths')));
app.use('/parsedPaths/', express.static(path.join(__dirname, '/parsedPaths')));
app.use('/stylesheets/', express.static(path.join(__dirname, '/stylesheets')));
app.set('view engine', 'ejs');

const getPaths = async () => {
    return await new Promise(async (resolve, reject) => {
        let paths = {};
        try {
            const svgsPath = './paths';
            const files = await fs.promises.readdir(svgsPath);
            for (const file of files) {
                let pathTxt = fs.readFileSync(svgsPath + '/' + file, 'utf8');
                const pattern = /<path[^>]+d="([^"]*)"/;
                const match = pathTxt.match(pattern);
                if(match)  {
                    pathTxt = match[1];
                    pathTxt = pathTxt.replace(/\t/g, '').replace(/\n/g, ' ');
                    let newFileName = file.replace('.svg', '');
                    paths[newFileName] = pathTxt;
                }
                
            }
            const data = JSON.stringify(paths);
            await fs.promises.writeFile('parsedPaths/paths.json', data, err => {
                console.log('JSON data is saved.')
                if (err) {
                    throw err
                }
            })
            resolve(paths);
        }
        catch (e) {
            console.error("We've thrown! Whoops!", e);
        }
    });
};

app.get('/', async (req, res) => {
    const filePath = './parsedPaths/paths.json';
    try {
        let pathData = await new Promise ( resolve => { 
            fs.readFile(filePath, async (err, data) => {
                if (err) {
                    data = await getPaths();
                }
                resolve(data);
            })
        });
        res.render(__dirname + '/index', {
            pathData: pathData,
        });
    } catch (err) {
        console.log(err)
    }
});

app.listen(port);
console.log('listening on port ' + port);