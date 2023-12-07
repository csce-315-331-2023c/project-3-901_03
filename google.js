const passport=require('passport');
const Profile=require('passport-google-oauth20').Profile;
const Strategy=require('passport-google-oauth20').Strategy;
const VerifyCallback=require('passport-google-oauth20').VerifyCallback;

passport.use(
  new Strategy(
    {
      clientID: "732182815623-en9h03k46oi28j7g8kl9d8c1okg7ksrf.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "https://p3-sp.onrender.com/api/auth/google/redirect",
      scope: [
        'email',
        'profile',
      ],
    },
    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {
      done(null, { googleProfile: profile});
    }
  )
);

passport.serializeUser(function(user, done) { 
  done(null, user);
});

passport.deserializeUser(function(user, done) {   
  done(null, user);
});
