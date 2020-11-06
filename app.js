//module pattern with the help of IIFE

//BUDGET CONTROLLER
var budgetController = (function () {
   //function constructors

   var Expense = function (id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
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
         if (type === "exp") newItem = new Expense(type, des, val);
         else if (type === "inc") newItem = new Income(type, des, val);

         //push it on to the data structure
         data.allitems[type].push(newItem);

         //return the new element
         return newItem;
      },
      testing: function () {
         console.log(data);
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
   };
   return {
      getInput: function () {
         return {
            type: document.querySelector(DOMstrings.inputType).value,
            description: document.querySelector(DOMstrings.inputDescription)
               .value,
            value: document.querySelector(DOMstrings.inputValue).value,
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
               '<div class="item clearfix" id="%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
         } else if (type === "exp") {
            element = DOMstrings.expensesContainer;
            html =
               '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
         }

         //replace the placeHolders with some actual data
         newHtml = html.replace("%id%", obj.id);
         newHtml = newHtml.replace("%description%", obj.description);
         newHtml = newHtml.replace("%value%", obj.value);

         //Insert the HTML into the DOM
         document
            .querySelector(element)
            .insertAdjacentHTML("beforeend", newHtml);
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
   };

   var ctrlAddItem = function () {
      var input, newItem;
      // 1. get the field input data
      input = UICtrl.getInput();
      // 2. add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      budgetCtrl.testing();
      // 3. add the item to the UI
      UICtrl.addItemList(newItem, input.type);
      // 4. calculate the budget
      // 5. display the budget on the UI
   };

   return {
      init: function () {
         console.log("its working bro..");
         setUpEventListener();
      },
   };
})(budgetController, UIController);

controller.init();
