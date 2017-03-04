import findScore from "./findScore";
const request = require("browser-request");

document.addEventListener("DOMContentLoaded", function() {
  const startElm = document.getElementById("start");
  const stopElm = document.getElementById("stop");

  const beerElm = document.getElementById("beer-base");
  const awaElm = document.getElementById("beer-awa");

  const scoreElm = document.getElementById("score");
  const rankElm = document.getElementById("rank");

  const render = () => {
    beerElm.style.height = `${Manager.beer}px`;
    awaElm.style.height = `${Manager.awa}px`;
    awaElm.style.bottom = `${Manager.beer}px`;
  };

  const Manager = {
    intervalId: null,
    __awaAmount: 0,
    __beerAmount: 0
  };

  Object.defineProperties(Manager, {
    "awa": {
      set: function(n) {
        Manager.__awaAmount = n;
        render(Manager);
      },
      get: function() {
        return Manager.__awaAmount;
      }
    },
    "beer": {
      set: function(n) {
        Manager.__beerAmount = n;
        render(Manager);
      },
      get:  function() {
        return Manager.__beerAmount;
      }
    }
  });

  const addBeer = () => {
    let surplus = Manager.beer + Manager.awa - 1000;
    if(surplus > 0) {
      clearInterval(Manager.intervalId);
      Manager.intervalId = null;
      alert("ビールをこぼしてしまいました");
    }

    let addBeer = Math.random() * 7;
    let addAwa = Math.random() * 4;
    Manager.beer += addBeer;
    Manager.awa += addAwa;
  };

  startElm.addEventListener("click", () => {
    if(!Manager.intervalId) {
      Manager.beer = 0;
      Manager.awa = 0;
      Manager.intervalId = setInterval(addBeer, 80);
      scoreElm.textContent = "";
    }
  });

  stopElm.addEventListener("click", () => {
    if(Manager.intervalId) {
      clearInterval(Manager.intervalId);
      Manager.intervalId = null;
      let beer = parseInt(Manager.beer);
      let awa = parseInt(Manager.awa);
      request(
        {
          method: "POST",
          uri: "./input",
          body: JSON.stringify({
            beer: beer,
            awa: awa
          }),
          json: true
        },
        function() {
          let frame = rankElm.firstElementChild
          frame.contentWindow.location.reload();
          setTimeout(function() {
            findScore(frame.contentWindow.document.getElementsByTagName("table")[0].tBodies[0], awa, beer);
          }, 1000);
        }
      );
      scoreElm.textContent = `${beer} mL : ${awa} mL`;
    }
  });
});
