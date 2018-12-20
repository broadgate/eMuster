module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [
        // First application
        {
            name: "EMUSTER",
            script: "./index.js",
            env: {
		        NODENV: "DEV"
            },
            env_dev: {
                NODENV: "DEV"
            },
            env_production: {
                NODENV: "PROD"
            },
        }
    ]
};
