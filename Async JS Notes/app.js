/**********************************************
 * Asynchronous Javascript using callbacks, Promises and Async Await
 */

/***********************
 * Callback basics 
 
 const second = () => {
                setTimeout(() => {
                    console.log(" Async Hey there");

                }, 2000); 
            }
			const first = () => {
				console.log("Hey there");
                second(); 
                console.log('The end');
                first();  
			}; */

/***********************
 * CallBack Hell Lectures
 */

/*function getRecipe() {
				setTimeout(() => {
					const recipeID = [523, 883, 432, 974];
					console.log(recipeID);

					setTimeout(
						(id) => {
							const recipe = { title: "Fresh Tomato", publisher: "Simi" };
							console.log(`${id}: ${recipe.title}`);

							setTimeout(
								(publisher) => {
									const recipe2 = { title: "Italian Pizza", publisher: "Simi" };
									console.log(recipe2);
								},
								1500,
								recipe.publisher
							);
						},
						1500,
						recipeID[2]
					);
				}, 1500);
			}
			getRecipe();
            */

/*******************
 * PROMISES Lessons
 */

/* const getIDs = new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([523, 883, 432, 974]);
				}, 1500);
			});

			const getRecipe = (recID) => {
				return new Promise((resolve, reject) => {
					setTimeout(
						(ID) => {
							const recipe = { title: "Fresh Tomato pasta", publisher: "Simi" };
							resolve(`${ID}: ${recipe.title}`);
						},
						1500,
						recID
					);
				});
			};

			const getRelated = (publisher) => {
				return new Promise((resolve, reject) => {
					setTimeout(
						(pub) => {
							const recipe = { title: "Italian Pizza", publisher: "Simi" };
							resolve(`${pub}: ${recipe.title}`);
						},
						1500,
						publisher
					);
				});
			};

			getIDs
				.then((IDs) => {
					console.log(IDs);
					return getRecipe(IDs[2]);
				})
				.then((recipe) => {
					console.log(recipe);
                    return getRelated('Simi');
				})
                .then(recipe => {
                    console.log(recipe); 
                })
				.catch((error) => {
					console.log(error);
				});
                */

/******************
 * CONSUMING PROMISES using Async Await
 */

// const getIDs = new Promise((resolve, reject) => {
// 	setTimeout(() => {
// 		resolve([523, 883, 432, 974]);
// 	}, 1500);
// });

// const getRecipe = (recID) => {
// 	return new Promise((resolve, reject) => {
// 		setTimeout(
// 			(ID) => {
// 				const recipe = { title: "Fresh Tomato pasta", publisher: "Simi" };
// 				resolve(`${ID}: ${recipe.title}`);
// 			},
// 			1500,
// 			recID
// 		);
// 	});
// };

// const getRelated = (publisher) => {
// 	return new Promise((resolve, reject) => {
// 		setTimeout(
// 			(pub) => {
// 				const recipe = { title: "Italian Pizza", publisher: "Simi" };
// 				resolve(`${pub}: ${recipe.title}`);
// 			},
// 			1500,
// 			publisher
// 		);
// 	});
// };

// async function getRecipeAW() {
// 	const IDs = await getIDs;
// 	console.log(IDs);
// 	const recipe = await getRecipe(IDs[2]);
// 	console.log(recipe);
// 	const related = await getRelated("Simi");
// 	console.log(related);

// 	return recipe;
// }

// getRecipeAW().then((result) =>
// 	console.log(`${result} is the best ever!`)
// );

/*****************************
 * AJAX AND FETCH API - My first API call using fetch API.
 */

/*
function getWeather(woeid) {
	fetch(
		`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${woeid}/`
	)
		.then((result) => {
			// console.log(result);
			return result.json();
		})
		.then((data) => {
			// console.log(data);
			const today = data.consolidated_weather[0];
			console.log(
				`Temperatures in ${data.title} stay between ${today.min_temp} and ${today.max_temp}.`
			);
		})
		.catch((error) => {
			console.log(error);
		});
}

getWeather(2487956);
getWeather(44418);

async function getWeatherAW(woeid) {
	try {
		const result = await fetch(
			`https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${woeid}/`
		);
		const data = await result.json();
		const tomorrow = data.consolidated_weather[1];
		console.log(data);
		console.log(
			`Temperatures tommorow in ${data.title} stay between ${tomorrow.min_temp} and ${tomorrow.max_temp}.`
		);
		return data;
	} catch (error) {
		console.log(error);
	}
}
getWeatherAW(2487956);
let dataLondon;
getWeatherAW(44418).then((data) => {
	dataLondon = data;
	console.log(dataLondon);
});

*/

// My first 'successful' Promises/async await attempt.
function loginUser(email, password) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			console.log(`We have now gotten the email and password`);
			resolve([email, password]);
		}, 3000);
	});
}

function testEmail(email) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (email.includes("@")) {
				console.log(`${email} is valid`);
			} else {
				console.log(`${email} is invalid`);
			}

			resolve(email);
		}, 4000);
	});
}

async function userData() {
	try {
		const [userEmail, password] = await loginUser(
			"simeon.udoh45gmail.com", 
			12345
		);
		console.log(`The email is ${userEmail} and the password is ${password}`);
		const test = await testEmail(userEmail);
		console.log(test);
	} catch (error) {
		console.log(error);
	}
}

userData();
