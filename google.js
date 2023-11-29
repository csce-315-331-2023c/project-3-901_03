const passport=require('passport');
const Profile=require('passport-google-oauth20').Profile;
const Strategy=require('passport-google-oauth20').Strategy;
const VerifyCallback=require('passport-google-oauth20').VerifyCallback;

passport.use(
  new Strategy(
    {
      clientID: "732182815623-en9h03k46oi28j7g8kl9d8c1okg7ksrf.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "https://project3-sweet-paris-901-03-c0hs.onrender.com/api/auth/google/redirect",
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
