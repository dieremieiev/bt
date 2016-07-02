namespace BT {
  angular.module("BT", [ "ngMaterial", "ngMdIcons" ])
    .controller("AppController", [ "$mdToast", "$timeout", BT.AppController ])
}
