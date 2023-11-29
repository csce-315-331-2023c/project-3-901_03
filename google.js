const passport=require('passport');
const Profile=require('passport-google-oauth20').Profile;
const Strategy=require('passport-google-oauth20').Strategy;
const VerifyCallback=require('passport-google-oauth20').VerifyCallback;

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
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
