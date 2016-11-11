require.config({
    deps: ['app'],
    paths: {
        //'knockout.command': "/xyz/assets/js/kolite/knockout.command",
        //'knockout.activity': "/xyz/assets/js//kolite/knockout.activity",
        //'knockout.validation': "/xyz/assets/js/knockout.validation/dist/knockout.validation.min",
        //'knockout.mapping': "/xyz/assets/js/knockout.mapping/build/output/knockout.mapping-latest",
    },
    shim: {
        //'knockout.mapping': {
        //    exports: 'komapping'
        //}
    }
});

define('jquery', [], function () {
    return jQuery;
});

define('knockout', [], function () {
  return ko;
});
define('komapping', [], function () {
  return ko.mapping;
});
