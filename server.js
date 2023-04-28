const express = require("express");
const cors = require("cors");
const bots = require("./src/botsData");
const { shuffle } = require("./src/shuffle");
const path = require("path");
const Rollbar = require("rollbar");
const rollbar = new Rollbar({
	accessToken: "6e84aff94c4f4b69bcfb0d209dbca7e8",
	captureUncaught: true,
	captureUnhandledRejections: true,
});

const playerRecord = {
	wins: 0,
	losses: 0,
};
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
	rollbar.log("Someone accessed the home page!!");
	res.status(200).sendFile(path.join(__dirname, "./public/index.html"));
});

// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
	robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
	robots
		.map(({ attacks }) =>
			attacks.reduce((total, { damage }) => total + damage, 0)
		)
		.reduce((total, damage) => total + damage, 0);

// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
	const compAttack = calculateTotalAttack(compDuo);
	const playerHealth = calculateTotalHealth(playerDuo);
	const playerAttack = calculateTotalAttack(playerDuo);
	const compHealth = calculateTotalHealth(compDuo);

	return {
		compHealth: compHealth - playerAttack,
		playerHealth: playerHealth - compAttack,
	};
};

app.get("/api/robots", (req, res) => {
	try {
		res.status(200).send(botsArr);
	} catch (error) {
		rollbar.error("Error getting bots!");
		console.error("ERROR GETTING BOTS", error);
		res.sendStatus(400);
	}
});

app.get("/api/robots/shuffled", (req, res) => {
	try {
		let shuffled = shuffle(bots);
		rollbar.info("Bots Info", shuffled);
		res.status(200).send(shuffled);
	} catch (error) {
		rollbar.critical("ERROR GETTING SHUFFLED BOTS");
		console.error("ERROR GETTING SHUFFLED BOTS", error);
		res.sendStatus(400);
	}
});

app.post("/api/duel", (req, res) => {
	rollbar.log("someone is dueling!");
	try {
		const { compDuo, playerDuo } = req.body;

		const { compHealth, playerHealth } = calculateHealthAfterAttack({
			compDuo,
			playerDuo,
		});

		// comparing the total health to determine a winner
		if (compHealth > playerHealth) {
			playerRecord.losses += 1;
			res.status(200).send("You lost!");
		} else {
			playerRecord.losses += 1;
			res.status(200).send("You won!");
		}
	} catch (error) {
		console.log("ERROR DUELING", error);
		res.sendStatus(400);
	}
});

app.get("/api/player", (req, res) => {
	try {
		res.status(200).send(playerRecord);
	} catch (error) {
		console.log("ERROR GETTING PLAYER STATS", error);
		res.sendStatus(400);
	}
});

app.listen(4000, () => {
	console.log(`Listening on 4000`);
});
