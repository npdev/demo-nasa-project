const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const planets = require('./planets.schema');

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

//Streams Promises API#
// Added in: v15.0.0
// https://nodejs.org/api/stream.html#stream_streams_promises_api
function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true,
            }))
            .on('data', async (data) => {
                if (isHabitablePlanet(data)) {
                    await savePlanet(data);
                }
            })
            .on('error', (err) => {
                console.log(err);
                reject(err);
            })
            .on('end', async () => {
                const countPlanetsFound = (await getAllPlanets()).length;
                console.log(`${countPlanetsFound} habitable planets found!`);
                resolve();
            });
    });
}

async function getAllPlanets() {
    return await planets.find({}, {
        '__v': 0,
        '_id': 0,
    });
}

async function savePlanet(data) {
    try {
        return await planets.updateOne({
            keplerName: data.kepler_name,
        }, {
            keplerName: data.kepler_name,
        }, {
            upsert: true,
        });
    } catch (err) {
        console.error(`Error: save planet ${err}`);
    }
}



module.exports = {
    loadPlanetsData,
    getAllPlanets
};
