angular.module("spaceRace", ['ngCookies'])
  .controller("gameController", ['$scope', '$interval', '$cookieStore', function gameController($scope, $interval, $cookieStore){
    var gc = this;
    var versionNumber = 1

    var enemyConstructor = function() {
      var constructor = this;

      var Enemy = function() {
        this.maxHealth = 10;
        this.health = 10;
        this.name = "Enemy";
        this.constructor = constructor;
      };

      constructor.build = function() {
        return new Enemy();
      }
    }

    $scope.gameData = {
      bulletCount: 0,
      soldierCount: 0,
      resources: 0,
      villagesDestroyed: 0
    }

    gc.currentTarget = (new enemyConstructor).build();


    gc.shootBullets = function(numberOfBullets) {
      $scope.gameData.bulletCount += numberOfBullets;

      if (numberOfBullets > gc.currentTarget.maxHealth) {
        numberOfBullets -= gc.currentTarget.health; // Finish off first target

        var targetsKilled = Math.floor(numberOfBullets/gc.currentTarget.maxHealth) + 1;
        var bulletsRemaining = (numberOfBullets % gc.currentTarget.maxHealth);

        $scope.gameData.resources += (10 * targetsKilled);
        $scope.gameData.villagesDestroyed += (targetsKilled);

        gc.currentTarget = gc.currentTarget.constructor.build();
        gc.currentTarget.health -= bulletsRemaining;
      } else if (numberOfBullets >= gc.currentTarget.health){
        var bulletsRemaining = numberOfBullets - gc.currentTarget.health;

        $scope.gameData.resources += 10;
        $scope.gameData.villagesDestroyed += 1;

        gc.currentTarget = gc.currentTarget.constructor.build();
        gc.currentTarget.health -= bulletsRemaining;
      } else {
        gc.currentTarget.health -= numberOfBullets;
      }
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

    function autoSave() {
      $cookieStore.put('version', versionNumber);
      $cookieStore.put('gameData', $scope.gameData);
      $cookieStore.put('timestampSeconds', secondsSinceEpoch());
    }

    function secondsSinceEpoch() {
      return new Date() / 1000;
    }

    function secondsSinceLastLogin() {
      var lastLoginTimestamp = $cookieStore.get('timestampSeconds');

      if (lastLoginTimestamp) {
        return Math.round( secondsSinceEpoch() - lastLoginTimestamp );
      } else {
        return 1;
      }
    }

    function updateGameData(secondsPassed) {
      gc.shootBullets($scope.gameData.soldierCount * secondsPassed);
    }

    var timer = $interval(function () {
      updateGameData(1);

      autoSave();
    }, 1000, 0);

    var init = function() {
      if($cookieStore.get('version') === versionNumber) {
        $scope.gameData = $cookieStore.get('gameData');

        updateGameData(secondsSinceLastLogin());
      }
    }

    init();
}]);
