var User = require("../models/user.js");
var bcrypt = require("bcrypt");
var localStorage = require('localStorage');

// Login
const login = (loginData, res) => {
  console.log("login function involked in function login")
  User.find({
    email: loginData.username.trim(),
  }).then((result) => {
    // console.log("result:", result)
    if (result.length == 0) {
      console.log("No such user")
    }
    else {
      bcrypt.compare(loginData.password.trim(), result[0].password).then(function (passwordResult) {
        if (passwordResult == true) {
          console.log("user found");
          localStorage.setItem('currentUser', JSON.stringify(result[0]));
          // getUsersList(res);
          res.render('admin-view');
        }
      });
    }
  }, (error) => {
    console.log("error while login")
  });
}
// Change User Status
const changeUserStatus = (req, res) => {
  console.log('Change status function is invoked')
  return new Promise((resolve, reject) => {
    var userId = req.body.userId;
    User.find({
      _id: userId
    })
      .lean(true)
      .then((user) => {
        // console.log('User found: ', user);
        var userData = user[0];
        // console.log('propergy : ', userData.hasOwnProperty('isEnabled'))
        if (userData && userData.hasOwnProperty('isEnabled')) {
          userData.isEnabled = !userData.isEnabled;
        } else {
          userData.isEnabled = false;
        }
        // console.log("uerData", userData);
        User.update({ _id: userId },
          userData, function (err, numberAffected, rawResponse) {
            console.log("rawResponse:", rawResponse);
            console.log("numberAffected:", numberAffected);
            if (err) {
              reject(err);
            } else {
              resolve(userData);
            }
          })
      })
  });

}

// Display Users list
const getUsersList = (res) => {
  var currentUser = JSON.parse(localStorage.getItem('currentUser'));
  User.find({ _id: { $ne: currentUser._id } })
    .then((users) => {
      // console.log("users:", users)
      res.render("admin", { users: users })
    }, (error) => {
      console.log("error while login", error)
    })
}
const viewUser = (userId) => {
  console.log('view user *****')
  return new Promise((resolve, reject) => {
    User.find({ _id: userId })
      .then((user) => {
        console.log("user:", user)
        if (user.length) {
          resolve(user[0]);
        }
        else {
          reject(null);
        }
      }, (error) => {
        reject(null);
      })
  })

}
module.exports = {
  login,
  changeUserStatus,
  viewUser,
  getUsersList
}