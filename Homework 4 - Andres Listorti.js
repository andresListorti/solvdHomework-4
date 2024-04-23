/*
// Homework 4
// Deadline: 26 April
//
//
// Task 1: Object Property Manipulation
// Create an object called person with the following properties and values:
//
// firstName: "John"
// lastName: "Doe"
// age: 30
// email: "john.doe@example.com"
//
// Use property descriptors to make all properties of the person object read-only and non-writable, so their values cannot be changed directly.
// Implement a method called updateInfo on the person object that takes a new info object as an argument. The info object should contain updated values for any of the properties (e.g., { firstName: "Jane", age: 32 }). Ensure that this method adheres to the read-only property descriptor set earlier.
// Create a new property called address on the person object with an initial value of an empty object. Make this property non-enumerable and non-configurable.
//
//
// Task 2: Object Property Enumeration and Deletion
// Create a new object called product with the following properties and values:
//
// name: "Laptop"
// price: 1000
// quantity: 5
//
// Use property descriptors to make the price and quantity properties non-enumerable and non-writable.
// Implement a function called getTotalPrice that takes the product object as an argument and returns the total price (calculated as price * quantity). Ensure that the function accesses the non-enumerable properties directly using the Object.getOwnPropertyDescriptor method.
// Implement a function called deleteNonConfigurable that takes an object and a property name as arguments. The function should delete the specified property from the object if it exists. If the property is non-configurable, throw an error with an appropriate message.
//
//
// Task 3: Object Property Getters and Setters
// Create an object called bankAccount with the following properties and values:
// balance: 1000 (default value)
// Use a getter to define a property called formattedBalance, which returns the balance with a currency symbol (e.g., "$1000").
// Use a setter to define a property called balance, which updates the account balance and automatically updates the corresponding formattedBalance value.
// Implement a method called transfer on the bankAccount object that takes two bankAccount objects and an amount as arguments. The method should transfer the specified amount from the current account to the target account. Ensure that the balance and formattedBalance properties of both accounts are updated correctly.
//
//
// Task 4: Advanced Property Descriptors
// Implement a function called createImmutableObject that takes an object as an argument and returns a new object with all its properties made read-only and non-writable using property descriptors. The function should handle nested objects and arrays recursively.
// Use the createImmutableObject function to create an immutable version of the person object from Task 1.
//
//
// Task 5: Object Observation
// Implement a function called observeObject that takes an object and a callback function as arguments. The function should return a proxy object that wraps the original object and invokes the callback function whenever any property of the object is accessed or modified.
// Use the observeObject function to create a proxy for the person object from Task 1. The callback function should log the property name and the action (get or set) performed on the object.
//
//
// Task 6: Object Deep Cloning
// Implement a function called deepCloneObject that takes an object as an argument and returns a deep copy of the object. The function should handle circular references and complex nested structures. Do not use JSON methods.
//
//
// Task 7: Object Property Validation
// Implement a function called validateObject that takes an object and a validation schema as arguments. The schema should define the required properties, their types, and any additional validation rules. The function should return true if the object matches the schema, and false otherwise. You can choose any schema you want.
*/

////// Task 1: Object Property Manipulation
//
const person = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    email: "john.doe@example.com",
  };
  Object.keys(person).forEach((key) => {
    Object.defineProperty(person, key, {
      writable: false,
      configurable: false,
    });
  });
  Object.defineProperty(person, "updateInfo", {
    value: function (info) {
      Object.keys(info).forEach((key) => {
        if (person.hasOwnProperty(key)) {
          throw new Error(`Cannot update read-only property: ${key}`);
        }
      });
  
      Object.assign(person, info);
    },
    writable: false,
    configurable: false,
  });
  Object.defineProperty(person, "address", {
    value: {},
    enumerable: false,
    configurable: false,
  });
  //
  //
  // Task 2: Object Property Enumeration and Deletion
  const product = {
    name: "Laptop",
    price: 1000,
    quantity: 5,
  };
  Object.defineProperty(product, "price", {
    enumerable: false,
    writable: false,
    configurable: false,
  });
  Object.defineProperty(product, "quantity", {
    enumerable: false,
    writable: false,
    configurable: false,
  });
  function getTotalPrice(product) {
    const priceDescriptor = Object.getOwnPropertyDescriptor(product, "price");
    const quantityDescriptor = Object.getOwnPropertyDescriptor(
      product,
      "quantity"
    );
    const price = priceDescriptor.value;
    const quantity = quantityDescriptor.value;
    return price * quantity;
  }
  function deleteNonConfigurable(obj, propertyName) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, propertyName);
    if (descriptor && !descriptor.configurable) {
      throw new Error(`Cannot delete non-configurable property: ${propertyName}`);
    }
    delete obj[propertyName];
  }
  //
  //
  // Task 3: Object Property Getters and Setters
  //
  const bankAccount = {
      _balance: 1000,
      get formattedBalance() {
        return `$ ${this._balance}`;
      },
      set balance(amount) {
        this._balance = amount;
      },
      transfer(targetAccount, amount) {
        if (amount <= this._balance) {
          this._balance -= amount;
          targetAccount._balance += amount;
        } else {
          console.log("Insufficient balance.");
        }
      }
    };
  //
  //
  // 
  // Task 4: Advanced Property Descriptors
  //
  function createImmutableObject(obj) {
    if (typeof obj !== "object" || obj === null) {
        return obj;
    }
    const immutableObj = {};
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            immutableObj[key] = createImmutableObject(obj[key]);
            Object.defineProperty(immutableObj, key, {
                writable: false,
                configurable: false
            });
        }
    }
    return immutableObj;
  }
  //
  //
  // Task 5: Object Observation
  //
  function observeObject(obj, callback) {
    const handler = {
      get(target, prop) {
        callback(prop, "get");
        return target[prop];
      },
      set(target, prop, value) {
        callback(prop, "set");
        target[prop] = value;
        return true;
      },
    };
    return new Proxy(obj, handler);
  }
  //
  //
  // Task 6: Object Deep Cloning
  function deepCloneObject(obj) {
    const clonedObj = {};
    const visited = new Map();
  
    function clone(value) {
      if (typeof value === 'object' && value !== null) {
        if (visited.has(value)) {
          return visited.get(value);
        }
  
        const clonedValue = Array.isArray(value) ? [] : {};
  
        visited.set(value, clonedValue);
  
        Object.keys(value).forEach((key) => {
          clonedValue[key] = clone(value[key]);
        });
  
        return clonedValue;
      }
  
      return value;
    }
  
    return clone(obj);
  }
  //
  //
  // Task 7: Object Property Validation
  function validateObject(obj, schema) {
    for (const property in schema) {
      if (schema.hasOwnProperty(property)) {
        if (!obj.hasOwnProperty(property)) {
          if (schema[property].required) {
            return false;
          }
          continue;
        }
  
        const value = obj[property];
        const type = typeof value;
  
        if (schema[property].type && type !== schema[property].type) {
          return false;
        }
  
        if (schema[property].validation && !schema[property].validation(value)) {
          return false;
        }
      }
    }
  
    return true;
  }
  //
  //
  //
  //
  // Examples:
  // Task 1: Object Property Manipulation
  console.log("// Testing - Task 1: Object Property Manipulation");
  console.log(person.firstName); // Output: "John"
  // Error:
  // person.firstName = "Jane"; // Error: Cannot assign to read only property 'firstName' of object '<Object>'
  console.log(person.firstName); // Output: "John"
  // Error:
  // person.updateInfo({ firstName: "Jane", age: 32 }); // Error(`Cannot update read-only property: ${key}`);
  console.log(person.firstName); // Output: "Jane"
  console.log(person.age); // Output: 32
  console.log(Object.keys(person)); // Output: ["firstName", "lastName", "age", "email"]
  console.log(person.address); // Output: {}
  person.address = { street: "123 Main St" }; // Error: Cannot assign to read only property 'address' of object '<Object>'
  console.log(person.address); // Output: {}
  //
  //
  // Task 2: Object Property Enumeration and Deletion
  console.log(
    "// Testing - Task 2: Object Property Enumeration and Deletion"
  );
  console.log("Total Price:", getTotalPrice(product)); // Output: Total Price: 5000
  
  console.log("Name:", product.name); // Output: Name: Laptop
  deleteNonConfigurable(product, "name"); // Deleting a configurable property
  console.log("Name:", product.name); // Output: Name: undefined
  console.log(JSON.stringify(product, null, 2)); // Output: {}
  console.log("Price:", product.price); // Output: Price: 1000
  console.log("Quantity:", product.quantity); // Output: Quantity: 5
  // Error:
  // deleteNonConfigurable(product, "price"); // Deleting a non-configurable property - Output: Error: Cannot delete non-configurable property: price
  //
  // Task 3: Object Property Getters and Setters
  console.log(
      "// Testing - Task 3: Object Property Getters and Setters"
    );
  const account1 = Object.create(bankAccount);
  const account2 = Object.create(bankAccount);
  console.log(account1.formattedBalance); // Output: $1000
  console.log(account2.formattedBalance); // Output: $1000
  account1.transfer(account2, 500);
  console.log(account1.formattedBalance); // Output: $500
  console.log(account2.formattedBalance); // Output: $1500
  //
  // Task 4: Advanced Property Descriptors
  console.log(
    "// Testing - Task 4: Advanced Property Descriptors"
  );
  const immutablePerson = createImmutableObject(person);
  console.log(immutablePerson.firstName); // Output: John
  immutablePerson.firstName = "Jane"; // This assignment will be ignored in strict mode or throw an error in non-strict mode
  console.log(immutablePerson.firstName); // Output: John
  //
  // Task 5: Object Observation
  console.log(
    "// Testing - Task 5: Object Observation"
  );
  const proxyPerson = observeObject(person, (prop, action) => {
    console.log(`Property name is "${prop}" and the action was "${action}" - on the object.`); // Output: Property name is "firstName" and the action was "get" - on the object.
  });
  console.log(proxyPerson.firstName); // Output: John
  //
  // Task 6: Object Deep Cloning
  console.log(
    "// Testing - Task 6: Object Deep Cloning"
  );
  const obj = {
    prop1: 'value1',
    prop2: {
      nestedProp1: 'nestedValue1',
      nestedProp2: {
        deeplyNestedProp: 'deeplyNestedValue',
      },
    },
  };
  obj.circularRef = obj;
  const clonedObj = deepCloneObject(obj);
  console.log(clonedObj); /* Output: 
  <ref *1> {
    prop1: 'value1',
    prop2: {
      nestedProp1: 'nestedValue1',
      nestedProp2: { deeplyNestedProp: 'deeplyNestedValue' }
    },
    circularRef: [Circular *1]
  }*/
  //
  // Task 7: Object Property Validation
  console.log(
    "// Testing - Task 7: Object Property Validation"
  );
  const obj2 = {
    name: 'Andres',
    age: 42,
    email: 'andres@example.com',
  };
  
  const schema = {
    name: { type: 'string', required: true },
    age: { type: 'number', required: true },
    email: {
      type: 'string',
      required: true,
      validation: (value) => value.includes('@'),
    },
    address: { type: 'object', required: false },
  };
  console.log(validateObject(obj2, schema)); // Output: true