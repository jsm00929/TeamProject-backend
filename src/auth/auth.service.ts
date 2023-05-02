import { AppError } from '../types/AppError';
import { ErrorMessages } from '../types/ErrorMessages';
import { GoogleLoginCodeQuery } from './dtos/inputs/google_login_code.query';
import { google } from 'googleapis';
import axios from 'axios';
// import { OAuth2Client } from 'google-auth-library';
import { usersRepository } from '../users/users.repository';
import { HttpStatus } from '../types/HttpStatus';

export const authService = {
  //async signup(user, ) {},
  //async login() {},
  async googleSignup() {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_SIGNUP_REDIRECT_URI,
    );
    //Google OAuth2 API, v2
    // https://www.googleapßs.com/auth/userinfo.email	기본 Google 계정 이메일
    // https://www.googleapis.com/auth/userinfo.profile	내 개인정보(공개로 설정한 개인정보 전부 포함) 보기

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
    return authorizationUrl;
  },

  async googleSignupRedirect(code: string) {
    // code로 token 받아옴...
    // access_type = offline일때만 refresh token 발급
    const {
      data: { access_token, refresh_token },
    } = await axios({
      method: 'post',
      url: 'https://oauth2.googleapis.com/token',
      params: {
        code: code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_SIGNUP_REDIRECT_URI,
        grant_type: 'authorization_code',
      },
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });
    // 받아온 토큰으로 유저 정보 가져옴...
    const {
      data: { email, name, picture },
    } = await axios({
      method: 'post',
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      headers: { Authorization: `${access_token}` },
    });

    const user = await usersRepository.findUser(email);
    if (user) {
      throw AppError.create({
        message: ErrorMessages.DUPLICATE_EMAIL,
        status: HttpStatus.CONFLICT,
      });
    }

    const createdUser = await usersRepository.createUserWithoutPassword({
      email,
      name,
    });

    return createdUser;
  },
  // async googleLogin() {

  // }
};
