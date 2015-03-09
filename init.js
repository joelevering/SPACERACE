angular.module("spaceRace", [])
  .controller("gameController", ['$interval', function gameController($interval){
    var gc = this;

    gc.bulletCount = 0;
    gc.soldierCount = 0;
    gc.resources = 0;
    gc.currentTargetHealth = 10;

    gc.villagesDestroyed = 0;

    gc.shootBullets = function(numberOfBullets) {
      gc.bulletCount += numberOfBullets;
      gc.currentTargetHealth -= numberOfBullets;
      handleAndCheckDeath();
    }

    gc.recruitSoldier = function() {
      gc.soldierCount += 1;
      gc.resources -= 10;
    }

    function handleAndCheckDeath() {
      if (gc.currentTargetHealth <= 0) {
        overkillAmount = gc.currentTargetHealth * -1
        gc.currentTargetHealth = 10 - overkillAmount;
        gc.resources += 10;
        gc.villagesDestroyed += 1;
        handleAndCheckDeath(); // In case overkillAmount is >= new targetHealth
      }
    }

    var timer = $interval(function () {
      gc.shootBullets(gc.soldierCount);
    }, 1000, 0);
}]);
