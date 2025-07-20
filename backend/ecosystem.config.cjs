module.exports = {
  apps: [
    {
      name: "apiserver",
      script: "./index.js",
      cwd: "/home/ubuntu/actions-runner/_work/renters/renters/Backend",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
