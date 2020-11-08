//module pattern with the help of IIFE

//BUDGET CONTROLLER
var budgetController = (function () {
   //function constructors

   var Expense = function (id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
      this.percentage = -1;
   };

   //prototypes for expenses
   Expense.prototype.calcPercen = function (totIncome) {
      if (totIncome > 0)
         this.percentage = Math.round((this.value / totIncome) * 100);
      else this.percentage = -1;
   };

   Expense.prototype.getPercen = function () {
      return this.percentage;
   };

   var Income = function (id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
   };

   //object to hold all the info in corresponding data structures
   var data = {
      allitems: {
         exp: [],
         inc: [],
      },
      totals: {
         exp: 0,
         inc: 0,
      },
      budget: 0,
      percentage: -1,
   };

   //public function to calcuate  the totals
   var calculateTotal = function (type) {
      var sum = 0;

      data.allitems[type].forEach(function (cur) {
         sum += cur.value;
      });

      data.totals[type] = sum;
   };

   return {
      addItem: function (type, des, val) {
         var newItem, ID;

         //id = last id + 1

         //create new id
         if (data.allitems[type].length > 0)
            ID = data.allitems[type][data.allitems[type].length - 1].id + 1;
         else ID = 0;

         //create new item based on 'inc' or 'exp' type
         if (type === "exp") newItem = new Expense(ID, des, val);
         else if (type === "inc") newItem = new Income(ID, des, val);

         //push it on to the data structure
         data.allitems[type].push(newItem);

         //return the new element
         return newItem;
      },
      testing: function () {
         console.log(data);
      },
      calculateBudget: function () {
         // calculate total income and expenses
         calculateTotal("inc");
         calculateTotal("exp");

         //calculate  the budget
         data.budget = data.totals.inc - data.totals.exp;

         //calculate the percentage
         if (data.totals.inc > 0)
            data.percentage = Math.round(
               (data.totals.exp / data.totals.inc) * 100
            );
      },
      getBudget: function () {
         return {
            budget: data.budget,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp,
            percentage: data.percentage,
         };
      },
      calculatePercentage: function () {
         data.allitems.exp.forEach(function (cur) {
            cur.calcPercen(data.totals.inc);
         });
      },
      getPercentage: function () {
         var percentages = data.allitems.exp.map(function (cur) {
            return cur.getPercen();
         });

         return percentages;
      },
      deleteItem: function (type, id) {
         //let id = 6
         // [1,2,4,5,6] -> so 6's index is 4

         var ids;

         //array of ids
         ids = data.allitems[type].map(function (cur) {
            return cur.id;
         });

         //finding the index of the id in the ids array
         var index = ids.indexOf(id);

         if (index !== -1) data.allitems[type].splice(index, 1);
      },
   };
})();

//UI CONTROLLER
var UIController = (function () {
   var DOMstrings = {
      inputType: ".add__type",
      inputDescription: ".add__description",
      inputValue: ".add__value",
      inputBtn: ".add__btn",
      incomeContainer: ".income__list",
      expensesContainer: ".expenses__list",
      budgetLabel: ".budget__value",
      incomeLabel: ".budget__income--value",
      expenseLabel: ".budget__expenses--value",
      percentageLabel: ".budget__expenses--percentage",
      container: ".container",
      expensePercLabel: ".item__percentage",
      dateLabel: ".budget__title--month",
   };

   var formatNumber = function (num, type) {
      /*
         RULES:-
         1. + or - before numbers
         2. exactly 2 decimal points
         3. comma seperating the thousands
      */

      var num, numsplit, int, dec;

      num = Math.abs(num);
      num = num.toFixed(2); //num mutates to string object

      numsplit = num.split(".");

      int = numsplit[0];
      if (int.length > 3)
         int =
            int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3); //adding commas

      dec = numsplit[1];

      return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
   };

   return {
      getInput: function () {
         return {
            type: document.querySelector(DOMstrings.inputType).value,
            description: document.querySelector(DOMstrings.inputDescription)
               .value,
            value: parseFloat(
               document.querySelector(DOMstrings.inputValue).value
            ),
         };
      },

      getDOMstrings: function () {
         return DOMstrings;
      },

      addItemList: function (obj, type) {
         var html, newHtml, element;

         //create HTML string containing placeholders
         if (type === "inc") {
            element = DOMstrings.incomeContainer;
            html =
               '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
         } else if (type === "exp") {
            element = DOMstrings.expensesContainer;
            html =
               '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
         }

         //replace the placeHolders with some actual data
         newHtml = html.replace("%id%", obj.id);
         newHtml = newHtml.replace("%description%", obj.description);
         newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

         //Insert the HTML into the DOM
         document
            .querySelector(element)
            .insertAdjacentHTML("beforeend", newHtml);
      },

      deleteItem: function (itemID) {
         var el = document.getElementById(itemID);
         var parent = el.parentNode;

         //we cannot delete the element which we gave currently access to , we can only delete it's child.
         parent.removeChild(el);
      },

      displayPercentages: function (percentages) {
         var fields = document.querySelectorAll(DOMstrings.expensePercLabel); //node list

         var nodeListForEach = function (list, callback) {
            for (var i = 0; i < list.length; i++) callback(list[i], i); //passed current element, index no.
         };

         nodeListForEach(fields, function (cur, index) {
            if (percentages[index] > 0)
               cur.textContent = percentages[index] + "%";
            else cur.textContent = "---";
         });
      },

      clearFields: function () {
         var fields,
            fieldArr = [];

         fields = document.querySelectorAll(
            DOMstrings.inputDescription + ", " + DOMstrings.inputValue
         ); //list of elements with these class names

         fieldArr = Array.prototype.slice.call(fields); //converting the list into array of elements

         //loop
         fieldArr.forEach(function (cur, index, array) {
            cur.value = "";
         });

         //resetting the focus
         fieldArr[0].focus();
      },
      updateBudget: function (obj) {
         var type;

         if (obj.budget > 0) type = "inc";
         else type = "exp";

         document.querySelector(
            DOMstrings.budgetLabel
         ).textContent = formatNumber(obj.budget, type);
         document.querySelector(
            DOMstrings.incomeLabel
         ).textContent = formatNumber(obj.totalInc, "inc");
         document.querySelector(
            DOMstrings.expenseLabel
         ).textContent = formatNumber(obj.totalExp, "exp");
         if (obj.percentage > 0)
            document.querySelector(DOMstrings.percentageLabel).textContent =
               obj.percentage + "%";
         else
            document.querySelector(DOMstrings.percentageLabel).textContent =
               "---";
      },
      displayMonth: function () {
         var now, year, months, month;
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
            "September",
            "October",
            "November",
            "December",
         ];
         month = now.getMonth();
         year = now.getFullYear();

         document.querySelector(DOMstrings.dateLabel).textContent =
            months[month] + " " + year;
      },
   };
})();

//GLOBAL CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {
   var setUpEventListener = function () {
      var DOM = UICtrl.getDOMstrings();

      //on click event handler
      document
         .querySelector(DOM.inputBtn)
         .addEventListener("click", ctrlAddItem);

      //on enter event handler
      document.addEventListener("keypress", function (event) {
         if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
         }
      });

      //delete event handler
      document
         .querySelector(DOM.container)
         .addEventListener("click", crtlDeleteItem); //event dangling
   };

   var updatePercentage = function () {
      // 1.calculate the percentage
      budgetCtrl.calculatePercentage();
      // 2.read the percentage from the budget controller
      var percen = budgetCtrl.getPercentage();
      // 3.update the UI with new percentages
      UICtrl.displayPercentages(percen);
   };

   var updateBudget = function () {
      // 1. calculate the budget
      budgetCtrl.calculateBudget();
      // 2. return the budget
      var budget = budgetCtrl.getBudget();
      // 3. display the budget on the UI
      UICtrl.updateBudget(budget);
   };

   var ctrlAddItem = function () {
      var input, newItem;
      // 1. get the field input data
      input = UICtrl.getInput();

      if (input.description !== "" && !isNaN(input.value)) {
         // 2. add the item to the budget controller
         newItem = budgetCtrl.addItem(
            input.type,
            input.description,
            input.value
         );
         //budgetCtrl.testing();
         // 3. add the item to the UI
         UICtrl.addItemList(newItem, input.type);
         // 4.clearing the input  fields
         UICtrl.clearFields();
         // 5.updating the budget
         updateBudget();
         // 6. calculate and update the percentages
         updatePercentage();
      }
   };

   var crtlDeleteItem = function (event) {
      var itemID, splitID, type, ID;

      //access to target through event bubling , target here -> icon
      itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; //DOM traversal

      if (itemID) {
         splitID = itemID.split("-");
         type = splitID[0];
         ID = parseInt(splitID[1]);

         // 1. delete the item from the data structure
         budgetCtrl.deleteItem(type, ID);

         // 2. delete the item from UI
         UICtrl.deleteItem(itemID);

         // 3. update and show the new budget
         updateBudget();

         // 4. calculate and update the percentages
         updatePercentage();
      }
   };

   return {
      init: function () {
         console.log("its up and running bro..");
         UICtrl.updateBudget({
            //resetting the budget UI
            budget: 0,
            totalInc: 0,
            totalExp: 0,
            percentage: -1,
         });
         UICtrl.displayMonth();
         setUpEventListener();
      },
   };
})(budgetController, UIController);

controller.init();
