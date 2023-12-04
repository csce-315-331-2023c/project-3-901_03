const passport=require('passport');
const Profile=require('passport-google-oauth20').Profile;
const Strategy=require('passport-google-oauth20').Strategy;
const VerifyCallback=require('passport-google-oauth20').VerifyCallback;

passport.use(
  new Strategy(
    {
      clientID: "732182815623-sk2dkmlj3etia46d4a0e2vr57l3pplv6.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "https://project3-sweet-paris-901-03-c0hs.onrender.com/api/auth/google/redirect",
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
