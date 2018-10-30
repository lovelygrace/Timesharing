
//User class
function User (id, time, waiting) {
  this.id = id
  this.time = time
  this.wait = waiting
}

function Resource (id, ind) {
  this.id = id;
  this.index = ind;
  this.currUser = 0;
  this.status = "";
  this.usersList = [];
  this.totalUsers = 0;
  this.totalTime = 0;
}

window.setInterval(() => {
  // console.log(mp.started);
	if (mp.started)
  		mp.updateTime();
}, 1000);

var mp = new Vue({
  el: "#app",
  data: {
    resIds: [],
    userIds: [],
    resourceList: [],
    started: false,
    maxNum: 5,
  },
  methods: {

    start: function () {
      this.setResourceIds(); //set the ids of the resources
      this.setUserIds();
      this.setUsers();
      this.numUsers();
      this.started = true;
    },

    numUsers: function () {
      for (let i = 0; i < this.resourceList.length; i++) {
        this.resourceList[i].totalUsers = this.resourceList[i].usersList.length;
      }
    },

    randomize: function () {
      rand = Math.floor((Math.random() * this.maxNum) + 1);
      return rand;
    },

    reset: function() {
      location.reload();
    },

    setResourceIds: function () {
      let num = this.randomize();
      while (this.resIds.length != num) {
        let res = this.randomize();
        if (this.resIds.includes(res) != true) {
          this.resIds.push(res);
        }
      }
      this.resIds.sort(function(a, b){return a-b});
      for (let i = 0; i < this.resIds.length; i++) {
        let r = new Resource(this.resIds[i], i);
        // r.currUser.id = 0;
        this.resourceList.push(r);
      }
      return;
    },

    setUserIds: function () {
      let num = this.randomize();
      while (this.userIds.length != num) {
        let user = this.randomize();
        if (this.userIds.includes(user) != true) {
          this.userIds.push(user);
        }
      }
      return;
    },

    setUserResIds: function (num) {
      userResIds = [];
      // console.log("NUM  ISSS: " + num);
      // console.log("the resource idsss: " + this.resIds);
      // console.log("the length is: " + this.resIds.length + "::::::" +  this.resourceList.length);
      while (userResIds.length != num) {
        let index = Math.floor((Math.random() * num) + 0);
        // console.log("INDEX SELECTED IN RANDOM: " + index);
        let resSamp = this.resIds[index];
        // console.log();
        // console.log("RESOURCE SELECTED: " + resSamp);
        if (userResIds.includes(resSamp) != true && resSamp != undefined) {
          // console.log("RESOURCE PUSHED: " + resSamp);
          userResIds.push(resSamp);
        }
      }
      userResIds.sort(function(a, b){return a-b});
      // console.log("THE RESOURCE IDS PER USERRRRR: " + userResIds);
      return userResIds;
    },

    getResource: function (id) {
      for (let i = 0; i < this.resIds.length; i++) {
        if (id == this.resIds[i]) {
          return i;
        }
      }
    },

    setUsers: function () {
      // console.log("number of users: " + this.userIds.length);
      this.userIds.sort(function(a, b){return a-b});
      for (let i = 0; i < this.userIds.length; i++) {
        let resPerUser = Math.floor((Math.random() * this.resourceList.length) + 1);
        // console.log("THE NUMBER OF RESOURCES PER USERRRRR: " + resPerUser);
        let resListPerUser = this.setUserResIds(resPerUser);
        var currWaitTime = 0;
        var prevWaitTime = 0;
        var prevUseTime = 0;
        // console.log("THE RESOURCES OF THE USER: " + resListPerUser);
        console.log("for user: " + this.userIds[i] + "  index: " + i);
        // console.log("number of resources: " + resListPerUser.length + "::::::" + resPerUser);
        for (let j = 0; j < resListPerUser.length; j++) {
          resourceId = resListPerUser[j];
          let ind = this.getResource(resourceId);
          // let time = Math.floor((Math.random() * this.maxNum) + 1);
          let time = this.randomize();
          currWaitTime = prevUseTime + prevWaitTime;
          if (currWaitTime < this.resourceList[ind].totalTime) {
    				currWaitTime = this.resourceList[ind].totalTime;
    			}
          user = new User(this.userIds[i], time, currWaitTime);
          this.resourceList[ind].usersList.push(user);
          this.resourceList[ind].totalTime = time + currWaitTime;
          prevWaitTime = currWaitTime;
          prevUseTime = time;
        }
      }
      return;
    },


    updateTime: function () {
      var cell = $('.body-row'); 
      for (let i = 0; i < this.resourceList.length; i++) {
        for (let j = 0; j < this.resourceList[i].usersList.length; j++) {
          if (this.resourceList[i].usersList[j].wait == 0) {
            // cell.css({'background' : '#3aafa942'}); 
            this.resourceList[i].currUser = this.resourceList[i].usersList[j];
            // if (this.resourceList[i].status != '') {
              this.resourceList[i].usersList[j].time--;
            // }
            this.resourceList[i].status = "User   " + this.resourceList[i].currUser.id;
            if (this.resourceList[i].usersList[j].time == 0) {
              this.resourceList[i].status = "";
              // this.resourceList[i].currUser = 0;
              this.resourceList[i].usersList.shift();
              j--;
            }
          } else {
            // this.resourceList[i].status = "Waiting for User " + this.resourceList[i].usersList[j].id
            // if (this.resourceList[i].currUser == 0) {
            //   this.resourceList[i].status = "waiting...";
            // }
            this.resourceList[i].usersList[j].wait--;
          }
        }

        if (this.resourceList[i].usersList.length == 0) {
          this.resourceList[i].status = "FREE";
          // cell.css({'background' : 'blue'}); 
        }

        if (this.resourceList[i].totalTime > 0) {
          this.resourceList[i].totalTime--;
        }
      }
    },

  }
});

