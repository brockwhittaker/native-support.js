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
        buildSupport: function (some, none, naming) {
            var ALL = utils.support.ALL,
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

            return {
                flags: map,
                errors: errors,
                naming: naming
            };
        },

        // this wraps the native functions in a function that runs a custom callback
        // before deploying the native function.
        // the native functions are also saved in `utils.native[parent][prop]` so
        // that I can access and use them while the proxy function is still generating
        // the proxy function.
        proxy: function (parent, prop, naming, callback) {
            var __native = parent[prop];

            parent[prop] = function () {
                callback(naming);
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
                var support = naming.prop ? compatTable[naming.parent][naming.prop] : compatTable[naming.parent];
                var buildObject = utils.buildSupport(support.SOME || {}, support.NONE || {}, naming);

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

            addPrototype("Array.prototype", Array.prototype, callback);
            addPrototype("Object", Object, callback);
        },

        // this prints the results of a `buildObject` in a way that is readable
        // through the console.
        print: (function () {
            var str = {
                // print out a list of browsers that are not supported with a given
                // feature.
                NONE: function (data, feature, list) {
                    data.NONE = utils.native["Array.prototype"].map.call(data.NONE, function (o) {
                        return utils.browsers[o];
                    });

                    list[list.length - 1] = "and " + list[list.length - 1];

                    if (list.length > 0) {
                        return "The `" + feature + "` feature is is incompatible with " +
                               utils.native["Array.prototype"].join.call(data.NONE, ", ") + ".";
                    }
                }
            };

            // return an instance of the print function that doesn't instantiate
            // the `str` variable every time.
            return function (buildObject) {
                var data = {
                    NONE: []
                };

                for (var x in buildObject.flags) {
                    if (buildObject.flags[x] === utils.support.NONE) {
                        utils.native["Array.prototype"].push.call(data.NONE, x);
                    }
                }


                var line = str.NONE(data, buildObject.naming.parent + "." + buildObject.naming.prop, data.NONE);
                if (line) {
                    console.log(line);
                }
            }
        }())
    };

    var prototype = {
        init: utils.init,
        reporting: {
            custom: function (list) {
                for (var x in utils.reporting) {
                    utils.reporting[x] = 0;
                }

                for (var x = 0; x < list.length; x++) {
                    utils.reporting[list[x]] = 1;
                }

                return prototype;
            },
            remove: function (list) {
                for (var x = 0; x < list.length; x++) {
                    utils.reporting[list[x]] = 0;
                }

                return prototype;
            },
            add: function (list) {
                for (var x = 0; x < list.length; x++) {
                    utils.reporting[list[x]] = 1;
                }

                return prototype;
            }
        }

    };

    return prototype;
}());
