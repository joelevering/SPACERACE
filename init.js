angular.module("spaceRace", [])
  .controller("gameController", ['$interval', function gameController($interval){
    var gc = this;

    var Enemy = function() {
      this.health = 10;
      this.name = "Enemy"
    };

    gc.bulletCount = 0;
    gc.soldierCount = 0;
    gc.resources = 0;
    gc.currentTarget = new Enemy();

    gc.villagesDestroyed = 0;


    gc.shootBullets = function(numberOfBullets) {
      gc.bulletCount += numberOfBullets;
      gc.currentTarget.health -= numberOfBullets;
      handleAndCheckDeath();
    }

    gc.recruitSoldier = function() {
      gc.soldierCount += 1;
      gc.resources -= 10;
    }

    gc.showSoldierButton = function() {
      return (gc.soldierCount > 0 || gc.resources >= 10);
    }

    gc.disableSoldierButton = function() {
      return (gc.resources < 10);
    }

    function handleAndCheckDeath() {
      if (gc.currentTarget.health <= 0) {
        overkillAmount = gc.currentTarget.health * -1
        gc.currentTarget = new Enemy();
        gc.currentTarget.health -= overkillAmount;
        gc.resources += 10;
        gc.villagesDestroyed += 1;
        handleAndCheckDeath(); // In case overkillAmount is >= new targetHealth
      }
    }

    var timer = $interval(function () {
      gc.shootBullets(gc.soldierCount);
    }, 1000, 0);
}]);
