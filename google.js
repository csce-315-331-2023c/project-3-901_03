const passport=require('passport');
const Profile=require('passport-google-oauth20').Profile;
const Strategy=require('passport-google-oauth20').Strategy;
const VerifyCallback=require('passport-google-oauth20').VerifyCallback;

passport.use(
  new Strategy(
    {
      clientID: "732182815623-sk2dkmlj3etia46d4a0e2vr57l3pplv6.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/api/auth/google/redirect",
      scope: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.force-ssl',
      ],
    },
    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {
      console.log(accessToken);
      console.log(profile);
      done(null, { googleProfile: profile});
    }
  )
);

passport.serializeUser(function(user, done) {
  console.log("serializeUser: ");  
  console.log(user);  
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log("deserializeUser: ");  
  console.log(user);    
  done(null, user);
});
