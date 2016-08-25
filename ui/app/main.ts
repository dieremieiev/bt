namespace BT {
  angular.module("BT", ["ngMaterial", "ngMdIcons"])
    .controller("AppController", ["$http", "$timeout", "$mdToast", BT.AppController])
}
