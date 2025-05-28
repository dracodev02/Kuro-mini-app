module.exports = {
    apps: [
      {
        name: "kuro-mini-app",
        script: "npm",
        args: "start",
        cwd: "./",
        watch: true,
        ignore_watch: ["node_modules"],
      },
    ],
  };