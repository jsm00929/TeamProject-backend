import { google } from 'googleapis';

export async function fetchToken() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_SIGNUP_REDIRECT_URI,
  );
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    response_type: 'code',
    redirect_uri: 'http:localhost:8080/api/auth/signup/google',
    scope: scopes,
    include_granted_scopes: true,
  });
}
