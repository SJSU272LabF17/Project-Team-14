 /**
 * module dependencies for passport configuration
 */
const passport = require('passport');
const GitHubStrategy = require('passport-facebook').Strategy;

const GITHUB_CLIENT_ID = require('../config/credentials').GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = require('../config/credentials').GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = require('../config/credentials').GITHUB_CALLBACK_URL;

// controllers
const getUser = require('./entities/user/controller').getUser;
const signInViaGithub = require('./entities/user/controller').signInViaGithub;


const passportConfig = (app) => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    getUser(id).then(
      (user) => { done(null, user); },
      (error) => { done(error); }
    );
  });

  
  passport.use(new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK_URL,
      profileFields: ['id', 'displayName','emails','link','photos']
      //scope: 'user:email',
      //scope: 'email:email',
    },
    (accessToken, refreshToken, gitProfile, done) => {
      signInViaGithub(gitProfile).then(
        (user) => { console.log('got the user'); done(null, user); },
        (error) => { console.log('something error occurs'); done(error); }
      );
    }
  ));
};

module.exports = passportConfig;
