
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import dotenv from 'dotenv';
import UserModel from '../models/userModel';

dotenv.config();

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        // Check if user exists with Google ID
        let user = await UserModel.findByGoogleId(profile.id);
        
        if (!user && profile.emails && profile.emails.length > 0) {
          // If no user found with Google ID, try to find by email
          user = await UserModel.findByEmail(profile.emails[0].value);
          
          if (!user) {
            // Create new user if no existing user found
            user = await UserModel.createOrUpdateOAuthUser({
              name: profile.displayName || (profile.name ? `${profile.name.givenName} ${profile.name.familyName}` : 'Google User'),
              email: profile.emails[0].value,
              provider: 'google',
              providerId: profile.id,
            });
          } else {
            // Update existing user with Google ID
            user = await UserModel.updateUser(user.id, {
              googleId: profile.id
            });
          }
        }
        
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

// Configure GitHub OAuth strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        // Check if user exists with GitHub ID
        let user = await UserModel.findByGithubId(profile.id);
        
        if (!user && profile.emails && profile.emails.length > 0) {
          // If no user found with GitHub ID, try to find by email
          user = await UserModel.findByEmail(profile.emails[0].value);
          
          if (!user) {
            // Create new user if no existing user found
            user = await UserModel.createOrUpdateOAuthUser({
              name: profile.displayName || profile.username || 'GitHub User',
              email: profile.emails[0].value,
              provider: 'github',
              providerId: profile.id,
            });
          } else {
            // Update existing user with GitHub ID
            user = await UserModel.updateUser(user.id, {
              githubId: profile.id
            });
          }
        }
        
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
