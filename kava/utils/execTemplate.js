const { exec } = require("child_process");

exec("bash exec.sh", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});