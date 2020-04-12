/*************************
 * Budgety project setup - The Module pattern
 */

/************************
 * BudgetController Module
 */
let budgetController = (function() {
	let Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};

	Expense.prototype.calcPercentages = function(totalIncome) {
		if (totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {
			this.percentage = -1;
		}
	};

	Expense.prototype.getPercentage = function() {
		return this.percentage;
	};

	let Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	calculateTotal = function(type) {
		let sum = 0;
		data.allItems[type].forEach(function(current) {
			sum += current.value;
		});
		data.totals[type] = sum;
	};

	let data = {
		allItems: {
			exp: [],
			inc: []
		},

		totals: {
			exp: 0,
			inc: 0
		},

		budget: 0,
		percentage: -1
	};
	return {
		addItem: function(type, des, val) {
			let newItem, ID;

			// Create new unique ID
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			// Create new items based on 'inc' or 'exp' type.
			if (type === "exp") {
				newItem = new Expense(ID, des, val);
			} else {
				newItem = new Income(ID, des, val);
			}

			// Push to the data structure 'data'
			data.allItems[type].push(newItem);

			// Return the newly added Item;
			return newItem;
		},

		deleteItem: function(type, id) {
			let ids, index;
			// Using map to get an array of all ids of either inc or exp
			ids = data.allItems[type].map(function(current) {
				return current.id;
			});
			// get the index of the id
			index = ids.indexOf(id);

			if (index !== -1) {
				data.allItems[type].splice(index, 1);
			}
		},

		calculateBudget: function() {
			// calculate total income and expenses

			calculateTotal("exp");
			calculateTotal("inc");

			// calculate the budget - income - expenses

			data.budget = data.totals.inc - data.totals.exp;

			// calculate the percentage of income we spent.
			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
		},
		/* loop over the expense array and calculate the percentages using the calcPercentages() method in the expense prototype. */

		calulatePercentages: function() {
			data.allItems.exp.forEach(function(current) {
				current.calcPercentages(data.totals.inc);
			});
		},
		// loop over the array and use map to get the percentages and return it.
		getPercentages: function() {
			let allPerc = data.allItems.exp.map(function(current) {
				return current.getPercentage();
			});
			return allPerc;
		},

		getBudget: function() {
			return {
				budget: data.budget,
				percentage: data.percentage,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp
			};
		},

		testing: function() {
			console.log(data);
		}
	};
})();

/***********************
 * UI Controller Module
 */

let UIController = (function() {
	// assigning DOM classes as properties
	let DOMStrings = {
		inputType: ".add__type",
		inputDescription: ".add__description",
		inputValue: ".add__value",
		inputBtn: ".add__btn",
		incomeContainer: ".income__list",
		expensesContainer: ".expenses__list",
		budgetLabel: ".budget__value",
		incomeLabel: ".budget__income--value",
		expensesLabel: ".budget__expenses--value",
		percentageLabel: ".budget__expenses--percentage",
		container: ".container",
		expensesPercLabel: ".item__percentage",
		dateLabel: ".budget__title--month"
	};

	formatNumber = function(num, type) {
		let numSplit, int, dec;
		/* 
		+ or - before a number
		exactly 2 decimal points
		comma seperating thousands

		2310.4567 => 2,310.46
		2000 => 2000.00

		*/

		num = Math.abs(num);
		num = num.toFixed(2);
		numSplit = num.split(".");
		int = numSplit[0];
		if (int.length > 3) {
			int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3); // if 2310, output = 2,310
		}
		dec = numSplit[1];
		return (type === "exp" ? "-" : "+") + "" + int + "." + dec;
	};

	let NodeListForEach = function(list, callBack) {
		for (let i = 0; i < list.length; i++) {
			// call the function that is passed to this NodeListForEach Function
			callBack(list[i], i);
		}
	};

	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMStrings.inputType).value, // will be either inc or exp

				description: document.querySelector(DOMStrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
			};
		},

		addListItem: function(obj, type) {
			// Create DOM string with placeholder text

			let html, newHtml, element;

			if (type === "inc") {
				element = DOMStrings.incomeContainer;
				html =
					'<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === "exp") {
				element = DOMStrings.expensesContainer;
				html =
					'<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			// Replace the placeholder text with actual data

			newHtml = html.replace("%id%", obj.id);
			newHtml = newHtml.replace("%description%", obj.description);

			newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

			// Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
		},

		deleteListItem: function(selectorID) {
			let el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);
		},
		// Clear html inputs fields after it is added.
		clearFields: function() {
			let fields, fieldsArr;
			fields = document.querySelectorAll(
				DOMStrings.inputDescription + "," + DOMStrings.inputValue
			);

			//querySelectorAll returns a list
			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function(current, index, Array) {
				current.value = "";
			});

			fieldsArr[0].focus();
		},

		displayBudget: function(obj) {
			let type;
			obj.budget > 0 ? (type = "inc") : (type = "exp");
			document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(
				obj.budget,
				type
			);
			document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(
				obj.totalInc,
				"inc"
			);
			document.querySelector(
				DOMStrings.expensesLabel
			).textContent = formatNumber(obj.totalExp, "exp");

			if (obj.percentage > 0) {
				document.querySelector(DOMStrings.percentageLabel).textContent =
					obj.percentage + "%";
			} else {
				document.querySelector(DOMStrings.percentageLabel).textContent = "---";
			}
		},

		displayPercentages: function(percentages) {
			fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

			NodeListForEach(fields, function(current, index) {
				// Do something
				if (percentages[index] > 0) {
					current.textContent = percentages[index] + "%";
				} else {
					current.textContent = "---";
				}
			});
		},

		displayMonth: function() {
			let now, year, month, months;
			now = new Date();
			months = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"Septemper",
				"October",
				"November",
				"December"
			];
			month = now.getMonth();
			year = now.getFullYear();
			document.querySelector(DOMStrings.dateLabel).textContent =
				months[month] + ", " + year;
		},

		changedType: function() {
			let fields = document.querySelectorAll(
				DOMStrings.inputType +
					"," +
					DOMStrings.inputDescription +
					"," +
					DOMStrings.inputValue
			);

			NodeListForEach(fields, function(cur) {
				cur.classList.toggle('red-focus')
			});

			document.querySelector(DOMStrings.inputBtn).classList.toggle('red'); 
		},

		getDOMstrings: function() {
			return DOMStrings;
		}
	};
})();

/*******************
 * Global App Controller (For events)
 */

let controller = (function(budgetCtrl, UICtrl) {
	let setupEventListeners = function() {
		let DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

		document.addEventListener("keypress", function(event) {
			if (event.keyCode === 13 || event.which === 13) {
				ctrlAddItem();
			}
		});

		// Using event delegation on the parent container of expenses and income

		document
			.querySelector(DOM.container)
			.addEventListener("click", ctrlDeleteItem);

		document
			.querySelector(DOM.inputType)
			.addEventListener("change", UICtrl.changedType);
	};

	let updateBudget = function() {
		//1. Calculate the budget
		budgetCtrl.calculateBudget();
		//2. Return the budget
		let budget = budgetCtrl.getBudget();
		//3. Display the budget on the UI

		UICtrl.displayBudget(budget);
	};

	let updatePercentages = function() {
		let percentages;
		//1. Calculate the percentages
		budgetCtrl.calulatePercentages();
		//2. Read them from the budget controller
		percentages = budgetCtrl.getPercentages();

		//3. update the UI with the percentages
		UICtrl.displayPercentages(percentages);
	};

	let ctrlAddItem = function() {
		//1. get the field input data
		let input, newItem;
		input = UICtrl.getInput();

		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
			//2. Add the items to the budget  controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);
			//3. Add the item  to the UI
			UICtrl.addListItem(newItem, input.type);

			//4. Clear the fields
			UICtrl.clearFields();

			//5. Calculate and Update budget
			updateBudget();

			//6. Calculate and update percentages
			updatePercentages();
		}
	};

	let ctrlDeleteItem = function(event) {
		let itemID, splitID, type, ID;

		// Traversing the DOM and using the  target method
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		// Get a split the id of an income or expense item
		if (itemID) {
			splitID = itemID.split("-");
			type = splitID[0];
			ID = parseInt(splitID[1]);

			// Todo

			//1. delete the item from the data structure
			budgetCtrl.deleteItem(type, ID);

			//2. Delete the item from the UI
			UICtrl.deleteListItem(itemID);

			//3. Update and show the new budget
			updateBudget();

			//4. Calculate and update percentages
			updatePercentages();
		}
	};

	return {
		init: function() {
			console.log("Application has started");
			UICtrl.displayMonth();
			UICtrl.displayBudget({
				budget: 0,
				percentage: 0,
				totalInc: 0,
				totalExp: 0
			});
			setupEventListeners();
		}
	};
})(budgetController, UIController);

controller.init();
