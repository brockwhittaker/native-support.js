var NativeSupport = (function () {
    "use strict";

    var compatTable = {
        "Array.prototype": {
            concat: {
                NONE: ["IE7", "IE8"]
            },
            copyWithin: {
                NONE: ["IE7", "IE8", "IE9", "IE10", "IE11"]
            },
            entries: {
                NONE: ["IE7", "IE8", "IE9", "IE10", "IE11"]
            },
            every: {
                NONE: ["IE7", "IE8"]
            },
            filter: {
                NONE: ["IE7", "IE8"]
            },
            find: {
                NONE: ["IE7", "IE8", "IE9", "IE10", "IE11"]
            },
            findIndex: {
                NONE: ["IE7", "IE8", "IE9", "IE10", "IE11"]
            },
            forEach: {
                NONE: ["IE7", "IE8"]
            },
            includes: {
                NONE: ["IE7", "IE8", "IE9", "IE10", "IE11", "E12", "E13"]
            },
            indexOf: {
                NONE: ["IE7", "IE8"]
            },
            isArray: {
                NONE: ["IE7", "IE8"]
            },
            join: {},
            keys: {
                NONE: ["IE7", "IE8", "IE9", "IE10", "IE11"]
            },
            lastIndexOf: {
                NONE: ["IE7", "IE8"]
            },
            map: {
                NONE: ["IE7", "IE8"]
            },
            pop: {},
            push: {},
            reduce: {
                NONE: ["IE7", "IE8"]
            },
            reduceRight: {
                NONE: ["IE7", "IE8"]
            },
            reverse: {},
            shift: {},
            slice: {},
            some: {
                NONE: ["IE7", "IE8"]
            },
            sort: {},
            splice: {},
            toLocaleString: {},
            toSource: {
                NONE: ["IE7", "IE8", "IE9", "IE10", "IE11", "E12", "E13", "C", "S9", "S10"]
            },
            toString: {},
            unshift: {},
            values: {
                NONE: ["IE7", "IE8", "IE9", "IE10", "IE11", "C", "S9", "S10"],
            }
        },
        Object: {
            assign: {
                NONE: ["IE7", "IE8", "IE9", "IE10", "IE11"]
            },
            create: {
                NONE: ["IE7", "IE8"]
            },
            defineProperties: {
                NONE: ["IE7", "IE8"]
            },
            defineProperty: {
                NONE: ["IE7"],
                SOME: {
                    IE8: "Only supported with DOM objects and non-standard behavior."
                }
            },
            entries: {
                NONE: ["IE7", "IE8", "IE9", "IE10", "IE11", "E12", "E13", "S9", "S10"],
                SOME: {
                    C: "Behind a flag."
                }
            },
            freeze: {
                NONE: ["IE7", "IE8"]
            },
            getOwnPropertyDescriptor: {
                NONE: ["IE7"]
            },
            getOwnPropertyDescriptors: {
                NONE: ["IE7", "IE8", "IE9", "IE10", "S9"]
            },
            getOwnPropertyNames: {
                NONE: ["IE7", "IE8"],
                SOME: {
                    FF: "Prior to FF28 `Object.getOwnPropertyNames` did not see unresolved `Error` properties."
                }
            },
            getOwnPropertySymbols: {
                NONE: ["IE7", "IE8", "IE9", "IE10", "IE11"]
            },
            getPrototypeOf: {
                NONE: ["IE7", "IE8"]
            },
            is: {
                NONE: ["IE7", "IE8", "IE9", "IE10", "IE11"]
            },
            isExtensible: {
                NONE: ["IE7", "IE8"]
            },
            isFrozen: {
                NONE: ["IE7", "IE8"]
            },
            isSealed: {
                NONE: ["IE7", "IE8"]
            },
            keys: {
                NONE: ["IE7", "IE8"]
            },
            preventExtensions: {
                NONE: ["IE7", "IE8"],
                SOME: {
                    IE9: "ES2015 behavior for non-object argument."
                }
            },
            hasOwnProperty: {},
            isPrototypeOf: {},
            propertyIsEnumerable: {},
            toLocaleString: {},
            toSource: {
                NONE: ["IE7", "IE8", "IE9", "IE10", "IE11", "E12", "E13", "C", "S9", "S10"]
            },
            toString: {},
            unwatch: {
                NONE: ["IE7", "IE8", "IE9", "IE10", "IE11", "E12", "E13", "C", "S9", "S10"]
            },
            valueOf: {},
            seal: {
                NONE: ["IE7", "IE8"]
            },
            setPrototypeOf: {
                NONE: ["IE7", "IE8", "IE9", "IE10"]
            },
            values: {
                NONE: ["IE7", "IE8", "IE9", "IE10", "IE11", "S9", "S10"]
            }
        }
    };

    var store = {
        errors: {
            SOME: {},
            NONE: {}
        },
        silence: false
    };

    var utils = {
        native: {},

        // support flags that should be only referenced -- not hard coded in
        // case they need to change.
        //
        // ALL (0)  : There are no compatibility issues.
        // SOME (1) : There may be some missing features or bugs
        //            but generally is implemented.
        // NONE (2) : The feature does not exist at all.
        support: {
            ALL: 0,
            SOME: 1,
            NONE: 2
        },

        memoizeBuildObject: (function () {
            var map = {};

            return function (parent, prop, value) {
                if (!value && map[parent] && map[parent][prop]) {
                    return map[parent][prop];
                } else if (value) {
                    if (!map[parent]) {
                        map[parent] = {};
                    }

                    map[parent][prop] = value;
                    return value;
                }
            };
        }()),

        // a maintained list of browsers that we track compatibility with.
        browsers: {
            C: "Chrome",
            FF: "FireFox",
            IE7: "IE7",
            IE8: "IE8",
            IE9: "IE9",
            IE10: "IE10",
            IE11: "IE11",
            E12: "Edge 12",
            E13: "Edge 13",
            E14: "Edge 14",
            S9: "Safari 9",
            S10: "Safari 10"
        },

        // this is a user preference sheet for whether or not we care about
        // reporting for a particular browser.
        reporting: {
            C:      1,  FF:     1,
            IE7:    1,  IE8:    1,
            IE9:    1,  IE10:   1,
            IE11:   1,  E:      1,
            S9:     1,  S10:    1
        },

        // this takes an Array of "None" and object of "SOME" and maps it to a
        // standard output format where there is a map of support and a map of
        // errors that align.
        buildSupport: function (naming) {
            var buildObject = this.memoizeBuildObject(naming.parent, naming.prop);

            if (!buildObject) {
                var support = naming.prop ? compatTable[naming.parent][naming.prop] : compatTable[naming.parent];
                var some = support.SOME || {},
                    none = support.NONE || {};

                var ALL = utils.support.ALL,
                    // start out by assuming that all browsers have full support of
                    // the particular property until proven otherwise.
                    map = {
                        C:      ALL,    FF:     ALL,
                        IE7:    ALL,    IE8:    ALL,
                        IE9:    ALL,    IE10:   ALL,
                        IE11:   ALL,    E:      ALL,
                        S9:     ALL,    S10:    ALL
                    },
                    errors = {},
                    x;

                for (x in (some || {})) {
                    map[x] = utils.support.SOME;
                    errors[x] = some[x];
                }

                for (var x = 0; x < none.length; x++) {
                    map[none[x]] = utils.support.NONE;
                }

                // for all browsers that you are not interested in tracking, they
                // should just validate as passing ALL tests so that they do not
                // throw any errors.
                for (var browser in utils.reporting) {
                    if (utils.reporting[browser] === 0) {
                        map[browser] = ALL;
                    }
                }

                return this.memoizeBuildObject(naming.parent, naming.prop, {
                    flags: map,
                    errors: errors,
                    naming: naming
                });
            } else {
                return this.memoizeBuildObject(naming.parent, naming.prop);
            }
        },

        // this wraps the native functions in a function that runs a custom callback
        // before deploying the native function.
        // the native functions are also saved in `utils.native[parent][prop]` so
        // that I can access and use them while the proxy function is still generating
        // the proxy function.
        proxy: function (parent, prop, naming, callback) {
            var __native = parent[prop];

            parent[prop] = function () {
                try { var a = {}; a.debug(); } catch(ex) {
                    if (!/getCompletions|InjectedScript/mg.test(ex.stack)) {
                        callback(naming);
                    }
                }
                return __native.apply(this, arguments);
            };

            parent[prop].__native = __native;

            if (!utils.native[naming.parent]) {
                utils.native[naming.parent] = {};
            }
            utils.native[naming.parent][naming.prop] = __native;
        },

        // this is the initializer function that searches through each of the
        // properties in the support list to bind to the native functions a proxy
        // function.
        init: function () {
            var callback = (function (naming, support) {
                var buildObject = utils.buildSupport(naming);

                utils.print(buildObject);
            }).bind(this);

            var addPrototype = function (prototype, parent, callback) {
                for (var x in compatTable[prototype]) {
                    utils.proxy(parent, x, {
                        parent: prototype,
                        prop: x
                    }, callback);
                }
            };

            // go through all properties in 'Array.prototype' and 'Object'.
            addPrototype("Array.prototype", Array.prototype, callback);
            addPrototype("Object", Object, callback);
        },

        // this prints the results of a `buildObject` in a way that is readable
        // through the console.
        print: (function () {
            var str = {
                // print out a list of browsers that are not supported with a given
                // feature.
                NONE: function (data, feature) {
                    var list = data.NONE;

                    data.NONE = utils.native["Array.prototype"].map.call(data.NONE, function (o) {
                        return utils.browsers[o];
                    });

                    list[list.length - 1] = "and " + list[list.length - 1];

                    if (list.length > 0) {
                        return "The `" + feature + "` feature is is incompatible with " +
                               utils.native["Array.prototype"].join.call(data.NONE, ", ") + ".";
                    }
                },
                SOME: function (data, feature) {
                    // because Object.keys is being replaced by the proxy function,
                    // we will get an infinite call stack while it is being replaced
                    // and it will trigger false warnings if we use it in code, so
                    // we will count the keys ourselves instead.
                    var issues = utils.native["Array.prototype"].map.call(data.SOME, function (o) {
                        return "\t - " + o.browser + ": " + o.error;
                    });

                    // if more than one key return output.
                    if (issues.length > 0) {
                        var str = "Some issues present with `" + feature + "`:\n";

                        return str + issues.join("\n");
                    }
                }
            };

            // return an instance of the print function that doesn't instantiate
            // the `str` variable every time.
            return function (buildObject) {
                var data = {
                    NONE: [],
                    SOME: []
                };

                for (var x in buildObject.flags) {
                    if (buildObject.flags[x] === utils.support.NONE) {
                        utils.native["Array.prototype"].push.call(data.NONE, x);
                    } else if (buildObject.flags[x] == utils.support.SOME) {
                        utils.native["Array.prototype"].push.call(data.SOME, { browser: x, error: buildObject.errors[x] });
                    }
                }


                var prop = buildObject.naming.parent + "." + buildObject.naming.prop;

                var line = (function () {
                    var NONE = str.NONE(data, prop);
                    var SOME = str.SOME(data, prop);

                    if (NONE) {
                        NONE = "%cNo Support:\n%c" + NONE;
                    }
                    if (SOME) {
                        SOME = "%cSome Support:\n%c" + SOME;
                    }
                    return SOME ? NONE + "\n\n" + SOME : NONE;
                }());

                if (line) {
                    for (var x = 0; x < data.NONE.length; x++) {
                        if (!store.errors.NONE[data.NONE[x]]) {
                            store.errors.NONE[data.NONE[x]] = { prop: prop, count: 0 };
                        }

                        store.errors.NONE[data.NONE[x]].count++;
                    }

                    if (!store.silence) {
                        console.log(line);
                    }
                }
            }
        }())
    };

    // an object of publicly accessible functions for users to run.
    var prototype = {

        // add the initializer to public functions.
        init: utils.init,

        // create a reference to 'store.errors' to track a list of all errors
        // being generated by the browser.
        errors: store.errors,

        // an object for ways to manipulate the list of browsers that will
        // report incompatibility.
        reporting: {

            // a setter for creating a custom list of browsers to support.
            // this by default sets all browsers not in the list to '0' (no report)
            // and all browsers in the list to '1' (report).
            custom: function (list) {
                for (var x in utils.reporting) {
                    utils.reporting[x] = 0;
                }

                for (var x = 0; x < list.length; x++) {
                    utils.reporting[list[x]] = 1;
                }

                return prototype;
            },

            // this plucks browsers currently in the report list and gives them
            // a flag of '0', which silences errors.
            remove: function (list) {
                for (var x = 0; x < list.length; x++) {
                    utils.reporting[list[x]] = 0;
                }

                return prototype;
            },

            // this adds browsers to the report list by giving them a flag of '1'.
            add: function (list) {
                for (var x = 0; x < list.length; x++) {
                    utils.reporting[list[x]] = 1;
                }

                return prototype;
            }
        }
    };

    // This allows for errors to be kept on browsers you are interested
    // in, however it won't actually print them to a console.
    Object.defineProperty(prototype, "silence", {
        set: function (value) {
            return store.silence = !!value;
        },
        get: function () {
            return store.silence
        }
    })

    return prototype;
}());
