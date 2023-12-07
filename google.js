const passport=require('passport');
const Profile=require('passport-google-oauth20').Profile;
const Strategy=require('passport-google-oauth20').Strategy;
const VerifyCallback=require('passport-google-oauth20').VerifyCallback;

passport.use(
  new Strategy(
    {
      clientID: "732182815623-uaa3b18u5b86ipthrjgf2u7c76p6fk6e.apps.googleusercontent.com",
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
