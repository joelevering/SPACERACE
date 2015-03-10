angular.module("spaceRace", ['ngCookies'])
  .controller("gameController", ['$scope', '$interval', '$cookieStore', function gameController($scope, $interval, $cookieStore){
    var gc = this;
    var versionNumber = 1

    var Enemy = function() {
      this.health = 10;
      this.name = "Enemy"
    };

    $scope.gameData = {
      bulletCount: 0,
      soldierCount: 0,
      resources: 0,
      villagesDestroyed: 0
    }

    gc.currentTarget = new Enemy();



    gc.shootBullets = function(numberOfBullets) {
      $scope.gameData.bulletCount += numberOfBullets;
      gc.currentTarget.health -= numberOfBullets;
      handleAndCheckDeath();
    }

    gc.recruitSoldier = function() {
      $scope.gameData.soldierCount += 1;
      $scope.gameData.resources -= 10;
    }

    gc.showSoldierButton = function() {
      return ($scope.gameData.soldierCount > 0 || $scope.gameData.resources >= 10);
    }

    gc.disableSoldierButton = function() {
      return ($scope.gameData.resources < 10);
    }

    function handleAndCheckDeath() {
      if (gc.currentTarget.health <= 0) {
        overkillAmount = gc.currentTarget.health * -1
        gc.currentTarget = new Enemy();
        gc.currentTarget.health -= overkillAmount;
        $scope.gameData.resources += 10;
        $scope.gameData.villagesDestroyed += 1;
        handleAndCheckDeath(); // In case overkillAmount is >= new targetHealth
      }
    }

    function autoSave() {
      $cookieStore.put('version', versionNumber);
      $cookieStore.put('gameData', $scope.gameData);
    }

    var timer = $interval(function () {
      gc.shootBullets($scope.gameData.soldierCount);

      autoSave();
    }, 1000, 0);

    var init = function() {
      if($cookieStore.get('version') === versionNumber) {
        $scope.gameData = $cookieStore.get('gameData');
      }
    }

    init();
}]);
