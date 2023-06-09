const fs = require("fs")
const promptin = require("prompt")

// Load the configuration file
const configPath = "../../Functions-request-config.js"
const savePath = "Functions-request-config.js"
let requestConfig = require(configPath)

task("userInput", "Update the args field in the configuration")
  .addParam("newvalue", "The new value for args")
  .setAction(async (taskArgs) => {
    // Access the value passed as the "newvalue" parameter
    const newValue = taskArgs["newvalue"]

    // Update the args field in the configuration
    requestConfig.args = [newValue]
    requestConfig.source = fs.readFileSync("./promptHuggingFace.js").toString()
    // Set the sensitive values from environment variables
    requestConfig.walletPrivateKey = process.env.PRIVATE_KEY //Is this a security issue?

    requestConfig.secrets = { openaiKey: process.env.OPENAI_KEY }

    // Generate the modified configuration as a string
    const configContent = `module.exports = ${JSON.stringify(requestConfig, null, 2)};\n`

    // Save the modified configuration to the file
    fs.writeFileSync(savePath, configContent)

    console.log("Args field updated:", requestConfig.args)
    console.log("Configuration file saved at", savePath)

    // Clear the module cache to force a fresh load of the modified file
    delete require.cache[require.resolve(configPath)]

    // Reload the modified configuration
    requestConfig = eval(configContent)

    // Perform any other necessary actions
  })
