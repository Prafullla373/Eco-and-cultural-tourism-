import axios from "axios";
import fs from 'fs';

const logStream = fs.createWriteStream("api_test_output.txt", { flags: 'w' });
function log(msg) {
    console.log(msg);
    logStream.write(JSON.stringify(msg, null, 2) + "\n");
}

const testApi = async () => {
    try {
        const res = await axios.get("http://localhost:5000/api/explore");
        log(`Status: ${res.status}`);
        log(`Count: ${res.data.length}`);
        if (res.data.length > 0) {
            const first = res.data[0];
            log({
                name: first.name,
                mapLocation: first.mapLocation,
                coordinates: first.coordinates
            });
        }
    } catch (error) {
        log(`API Error: ${error.message}`);
    }
};

testApi();
