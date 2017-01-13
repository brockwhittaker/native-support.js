#NativeSupport.js

NativeSupport.js is a small library for running before your code executes to determine if any JavaScript functions you are using are going to have browser compatibility issues.

##How It works
This library primarily uses the Proxy Pattern to intercept all calls to the Array and Object prototypes in order to front-run the execution and deploy a callback in time. This library supports the majority of the `Array.prototype` and `Object` methods and will provide useful information on their compatibility with other browsers.

##How To Use This
This is a pretty simple library to use – with only a few public functions. This declares a global variable `NativeSupport` and has three top level properties:

1. `init`: This runs the proxy function to replace all native functions, essentially "starting" the detection.
2. `reporting`: This is an object with three methods for letting users choose the browsers that they are interested in detecting. This browser list can be swapped out at any time before or after the initialization.
3. `silence`: This is an attribute that allows users to toggle the output of the application and only collect errors in the `errors` object.

##NativeSupport.reporting

The `NativeSupport.reporting` object has three methods for choosing browsers you are interested in tracking. By default, all browsers are shown, but that may get very messy if you are not interested in tracking incompatibility issues with IE7 for example. A list of all browsers supported right now is:

- Chrome
- FireFox
- IE7
- IE8
- IE9
- IE10
- IE11
- Edge 12
- Edge 13
- Safari 9
- Safari 10

The three methods are:

1. `custom`: This allows you to define in an array the list of browsers you would like to support.
2. `add`: This allows you to add a particular browser that is not already in the selected list.
3. `remove`: This allows you to remove a particular browser that you no longer want to support.

##Example

Here is an example below where we want to drop support for IE7, and IE8, but keep everything else:

```JavaScript
// that's it!
NativeSupport
    // If we don't care about supporting IE7 or IE8 we can use the `.reporting.remove`
    // method to silence them from reporting.
    .reporting.remove(["IE7", "IE8"])
    // run and replace native functions.
    .init();

// set the instance to be silent and not produce console statements.
NativeSupport.silence = true;
```

###Output

Output comes both in the form of console logs along with the `NativeSupport.errors` object where they are collected. The logs should look similar to:

```
No Support:
The `Array.prototype.includes` feature is is incompatible with IE7, IE8, IE9, IE10, IE11, Edge 12, Edge 13.
```

Errors are collected in the `errors` map and indexed by `NONE` and `SOME` and further indexed by the browser in which they occurred in.

##Issues
It appears currently as the Chrome Dev Tools will use the builtins in JavaScript when using the console. This means that if you create an object in the console it will throw a bunch of incompatibility statements. The workaround for this is to prevent throwing any errors in which stem from two processes identified as being Chrome in the regex `/getCompletions|InjectedScript/`. A better solution to this would be great!
