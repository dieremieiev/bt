namespace BT {
  angular.module("BT", ["ngMaterial", "ngMdIcons"])
    .controller("AppController", ["$http", "$mdToast", "$timeout", BT.AppController])
}
