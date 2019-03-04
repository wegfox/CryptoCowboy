var sqlite3 = require("sqlite3").verbose();

var log = require('./loggingModule').logger();

var database = null;

//	*********************************************************
//	Database Method Template
//	*********************************************************

function execute(task)
{
	return new Promise((resolve, reject) =>
	{
		log.debug("Connecting to database");

		database = new sqlite3.Database("./database/cryptocowboy.db", (err) =>
		{
			if (err)
			{
				log.error(err.message);
				reject(err.message);
			}
		});

		let result = null;
		database.serialize(() =>
		{
			log.debug("Executing database task.");
			result = task();
			log.debug(`DB => execute() task results: ${result}`);
		});

		database.close((err) =>
		{
			if (err)
			{
				log.error(err.message);
				reject(err.message);
			}
			log.debug("Closed the database connection.");
			resolve(result);
		});
	});
}

/*
	return new Promise((resolve, reject) => {


	});
*/


//	*********************************************************
//	Create Database Tables (If they don't already exist)
//	*********************************************************

//	TODO: Create tables with general purpose functions.
exports.createTables = () =>
{
	log.debug("Create Tables");
	return execute(() => 
	{
		log.debug("Creating database tables if they do not already exist.");

		database.run("CREATE TABLE IF NOT EXISTS Account(username, password, settings)")
			.run("CREATE TABLE IF NOT EXISTS Settings(version, portNumber, readLogLines)")
			.run("CREATE TABLE IF NOT EXISTS Wallets(address, secret, nickname)")
			.run("CREATE TABLE IF NOT EXISTS Bots(walletAddress, baseCurrency, watchedCurrency, id)");
	});
};

//	*********************************************************
//	Load User Settings from Database
//	*********************************************************

exports.loadSettings = () =>
{
	return execute(() => 
	{
		log.debug("Loading all settings from database");

		return readEntireTable("Settings");
	});
};

//	*********************************************************
//	Load All Wallets from Database
//	*********************************************************

exports.loadWallets = () =>
{
	return execute(async () =>
	{
		log.debug("DB: Loading all wallets from database");

		let wallets = await readEntireTable("Wallets");

		//	Scrub secret key for security
		wallets.forEach(function (wallet)
		{
			delete wallet.secret;
		});
		return wallets;
	});
};


exports.addWallet = (address, secret, nickname, callback) =>
{
	return execute(async () =>
	{
		log.verbose(`Adding wallet: "${address}" to wallets table.`);

		var query = "INSERT INTO wallets (address, secret, nickname) VALUES (?, ?, ?)";
		var parameters = [address, secret, nickname];

		database.run(query, parameters, function (err)
		{
			if (err)
			{
				return console.log(err.message);
			}
			// get the last insert id
			log.verbose(`A row has been inserted with rowid ${this.lastID}`);
			callback();
		});
	});
};


//	*********************************************************
//	General Purpose Functions
//	*********************************************************

function readEntireTable(table)
{
	return new Promise((resolve, reject) =>
	{
		log.debug(`DB: Reading entire table: ${table}`);

		let query = `SELECT * FROM "${table}"`;

		database.all(query, [], (err, rows) =>
		{
			if (err)
			{
				reject(err);
				throw err;
			}

			//log.debug("Rows: " + JSON.stringify(rows));
			resolve(rows);	//	array
		});
	});
}




exports.deleteWallet = function (address, callback)
{
	if (address == null)
	{
		address = "";
	}
	return execute(async () =>
	{
		log.verbose(`Deleting ${address}`);

		var query = `DELETE FROM wallets WHERE address=?`;
		var parameters = [address];

		database.run(query, parameters, function (err)
		{
			if (err)
			{
				return console.log(err.message);
			}
			// get the last insert id
			log.verbose(`A row has been deleted`);
			callback();
		});
	});
};



function deleteItem(table, column, value, callback)
{
	log.verbose(`Deleting ${value}`);
	var query = `DELETE FROM ${table} WHERE ${column}=?`;
	var parameters = [value];

	database.run(query, parameters, function (err)
	{
		if (err)
		{
			return console.log(err.message);
		}
		// get the last insert id
		log.verbose(`A row has been deleted`);
		callback();
	});
}

/*	connect(() =>
	{
		database.serialize(() =>
		{
			addWallet(address, secret, nickname, () =>
			{
				disconnect(() =>
				{
					callback();
				});
			});
		});
	});
	*/

/*
Promise.all([exports.ProConnect(), exports.ProConnect2()]).then(() =>
{
	//	Everything finished
});
*/


/*
Promise.raise([exports.ProConnect(), exports.ProConnect2()]).then(() =>
{
	//	At least 1 finished
});
*/


/*
function verifyLogin(username, password, callback)
{
	log.verbose(`Verifying user credentials`);

	let query = `SELECT username FROM accounts WHERE accounts.username = "${username}" AND accounts.password = "${password}"`;
	database.all(query, [], (err, rows) =>
	{
		if (err)
		{
			callback(false);
			throw err;
		}
		//console.log(rows);
		rows.forEach((row) =>
		{
			log.info(row.username + " successful login");
		});
		callback(true);
	});
}

function readWallets(callback)
{
	let query = "SELECT address, nickname FROM wallets";
	database.all(query, [], (err, rows) =>
	{
		if (err)
		{
			throw err;
		}

		rows.forEach((row) =>
		{

		});

		callback(rows);
	});
}

function addWallet(address, secret, nickname, callback)
{
	log.verbose(`Adding wallet: "${address}" to wallets table.`);

	var query = "INSERT INTO wallets (address, secret, nickname) VALUES (?, ?, ?)";
	var parameters = [address, secret, nickname];

	database.run(query, parameters, function (err)
	{
		if (err)
		{
			return console.log(err.message);
		}
		// get the last insert id
		log.verbose(`A row has been inserted with rowid ${this.lastID}`);
		callback();
	})
}

function readAll(table, callback)
{
	log.verbose(`Reading entire table ${table}`);
	let query = `SELECT * FROM "${table}"`;
	database.all(query, [], (err, rows) =>
	{
		if (err)
		{
			throw err;
		}

		rows.forEach((row) =>
		{
			console.log(row);
			console.log(rows[row]);
		});

		let table = {};
		for (var key in rows)
		{
			table.key = rows[key];
		}

		callback(table);
	});
}

function updateVersion(version)
{
	log.verbose(`Adding version: ${version} to setting table.`);
	var sql = "INSERT INTO settings (version) VALUES (?)";
	var parameters = [version];

	database.run(sql, parameters, function (err)
	{
		if (err)
		{
			return console.log(err.message);
		}
		// get the last insert id
		log.verbose(`A row has been inserted with rowid ${this.lastID}`);
	})
}

function updateData(table, setColumn, setValue, whereColumn, whereValue)
{
	log.verbose("Updating data");

	var query = null;
	if (whereColumn == null || whereValue == null)
	{
		query = `UPDATE ${table} SET ${setColumn} = "${setValue}"`;
	}
	else
	{
		query = `UPDATE ${table} SET ${setColumn} = "${setValue}" WHERE ${whereColumn} = "${whereValue}"`;
	}
	//var parameters = [address, secret, nickname];
	//var parameters = [];

	database.run(query, function (err)
	{
		if (err)
		{
			return console.log(err.message);
		}
		// get the last insert id
		console.log(`A row has been inserted with rowid ${this.lastID}`);
	})
}


function addUser(username, password)
{
	log.verbose(`Adding user: "${username}" to accounts table.`);
	var sql = "INSERT INTO accounts (username, password) VALUES (?, ?)";
	var parameters = [username, password];

	database.run(sql, parameters, function (err)
	{
		if (err)
		{
			return console.log(err.message);
		}
		// get the last insert id
		log.verbose(`A row has been inserted with rowid ${this.lastID}`);
	})
}

function deleteItem(table, column, value, callback)
{
	log.verbose(`Deleting ${value}`);
	var query = `DELETE FROM ${table} WHERE ${column}=?`;
	var parameters = [value];

	database.run(query, parameters, function (err)
	{
		if (err)
		{
			return console.log(err.message);
		}
		// get the last insert id
		log.verbose(`A row has been deleted`);
		callback();
	})
}



function getWalletSecret(address)
{
	log.verbose("Searching for wallet secret key");
	let sql = `SELECT secret FROM wallets WHERE wallets.address = "${address}"`;
	database.all(sql, [], (err, rows) =>
	{
		if (err)
		{
			throw err;
		}
		//console.log(rows);
		rows.forEach((row) =>
		{
			console.log(row.secret);
		});
	});
}
*/



//	*********************************************************
//	User Login
//	*********************************************************
/*
exports.login = function (username, password, callback)
{
	connect(() =>
	{
		database.serialize(() =>
		{
			verifyLogin(username, password, () =>
			{
				disconnect(() =>
				{
					callback();
				});
			});
		});
	});
};
*/


//	*********************************************************
//	Load wallets
//	*********************************************************
/*
exports.importDatabaseWallets = function (callback)
{
	log.debug("Importing database wallets");

	connect(() =>
	{
		database.serialize(() =>
		{
			readWallets((Wallets) =>
			{
				CryptoCowboy.setWallets(Wallets, () =>
				{
					CryptoCowboy.getWallets((wallets) =>
					{
						disconnect(() =>
						{
							callback(wallets);
						});
					});
				});
			});
		});
	});
};

*/



//	*********************************************************
//	Add new wallet
//	*********************************************************
/*
exports.addDatabaseWallet = function (address, secret, nickname, callback)
{
	log.verbose("Importing database wallets");

	connect(() =>
	{
		database.serialize(() =>
		{
			addWallet(address, secret, nickname, () =>
			{
				disconnect(() =>
				{
					callback();
				});
			});
		});
	});
};



*/
/*
var sql = "INSERT INTO accounts(username) VALUES(?)";
var parameters = ["Brietoe"];

//db.get('SELECT (? + ?) sum', [a, b], (err, row) => {

database.serialize(() =>
{
	database.run("CREATE TABLE accounts(username password)")
		.run(sql, parameters, function (err)
		{
			if (err)
			{
				return console.log(err.message);
			}
			// get the last insert id
			console.log(`A row has been inserted with rowid ${this.lastID}`);
		})
		.each(`SELECT username FROM accounts`, (err, row) =>
		{
			if (err)
			{
				throw err;
			}
			console.log(row.username);
		});
});
*/