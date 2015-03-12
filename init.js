var spaceRace = angular.module("spaceRace", ['ngCookies']);

spaceRace.factory("Enemy", function(){
  var Enemy = function(attributes) {
    this.health = attributes.health;
    this.maxHealth = attributes.maxHealth;
    this.name = attributes.name;
    this.factory = attributes.factory;
  };

  return(Enemy);
});

var enemySoldierFactory = spaceRace.factory("EnemySoldier", ['Enemy', function(Enemy){
  return {
    build: function() {
      return new Enemy({maxHealth: 10, health: 10, name: "Enemy Soldier", factory: this})
    }
  }
}]);

spaceRace.controller("gameController", ['$scope', '$interval', '$cookieStore', 'EnemySoldier', function gameController($scope, $interval, $cookieStore, EnemySoldier){
  var gc = this;
  var versionNumber = 1

  $scope.gameData = {
    bulletCount: 0,
    soldierCount: 0,
    resources: 0,
    villagesDestroyed: 0
  }

  gc.currentTarget = EnemySoldier.build();


  gc.shootBullets = function(numberOfBullets) {
    $scope.gameData.bulletCount += numberOfBullets;

    if (numberOfBullets > gc.currentTarget.maxHealth) {
      numberOfBullets -= gc.currentTarget.health; // Finish off first target

      var targetsKilled = Math.floor(numberOfBullets/gc.currentTarget.maxHealth) + 1;
      var bulletsRemaining = (numberOfBullets % gc.currentTarget.maxHealth);

      $scope.gameData.resources += (10 * targetsKilled);
      $scope.gameData.villagesDestroyed += (targetsKilled);

      gc.currentTarget = gc.currentTarget.factory.build();
      gc.currentTarget.health -= bulletsRemaining;
    } else if (numberOfBullets >= gc.currentTarget.health){
      var bulletsRemaining = numberOfBullets - gc.currentTarget.health;

      $scope.gameData.resources += 10;
      $scope.gameData.villagesDestroyed += 1;

      gc.currentTarget = gc.currentTarget.factory.build();
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
