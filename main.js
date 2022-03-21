const express = require("express")
const app = express();
const port = 3888;
const redisConn = require("./src/redis")
const appController = require("./src/service/AppController")
const redisClient = redisConn.client
app.use(express.json());

app.get('/', async (req, res) => {
    return res.send("here")
});

app.post("/fee", async (req, res) => {
    let feeSpec = await appController.processFeeConfigurations(req.body.FeeConfigurationSpec);
    feeSpec = JSON.stringify(feeSpec.finalConfig);
    let specMatcher = JSON.stringify(feeSpec.specMatcher);
    await redisClient.set("spec", feeSpec)
    await redisClient.set("matcher", specMatcher)
    return res.send("ok");
})

app.post("/compute-transaction-fee", async (req, res) => {
    let feeSpec = await redisClient.get("spec");
    feeSpec = JSON.parse(feeSpec);
    transactionSpec = await appController.computeFeeConfig(req.body);
    if (!transactionSpec) return res.status(404).send({
        "Error": "No fee configuration for USD transactions."
    })
    let neededSpec = feeSpec.filter(e =>
        e.locale == transactionSpec.locale ||
        e.locale == "*").filter(e =>
        e.type == transactionSpec.type ||
        e.type == "*")
    if (neededSpec.length) {
        let ratings = [];
        for (let i = 0; i < neededSpec.length; i++) {
            const element = neededSpec[i];
            let rate = 0;
            if (element.locale == transactionSpec.locale) rate = rate + 1
            if (element.type == transactionSpec.type) rate = rate + 1
            if (transactionSpec.property.includes(element.property)) rate = rate + 4
            if (element.property == "*") rate = rate +3
            ratings[i] = rate
        }
        ratings.indexOf(Math.max(...ratings))
        return res.send(await appController.computeFee(neededSpec[ratings.indexOf(Math.max(...ratings))], req.body.Customer.BearsFee, req.body.Amount))
    } else {
        return res.status(404).send({
            "Error": "No suitable spec avaliable"
        })
    }

})








app.listen(port, async () => {
    redisConn.client.on("connect", () => {
        console.log("redis connected")
    })

    redisConn.client.on('error', (err) => {
        console.log("Error" + err);
    })
    console.log('app running on port :>> ', port);
    await redisClient.connect()
});