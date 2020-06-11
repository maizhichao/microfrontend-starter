const exec = require("child_process").exec;

module.exports = function(script) {
  return {
    apply: compiler => {
      compiler.plugin("after-emit", (compilation, callback) => {
        console.log(`\n--------------\nRunning command: ${script}`);
        exec(script, (err, stdout, stderr) => {
          if (err) {
            console.error(err);
            return;
          }
          if (stdout) process.stdout.write(stdout);
          if (stderr) process.stderr.write(stderr);
        });
        console.log(`--------------\n`);
        callback();
      });
    }
  };
};
