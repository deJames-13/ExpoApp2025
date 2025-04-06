import { Controller } from '#lib';
import { Errors, getBearerToken, tokenExists } from '#utils';
import UserInfoModel from './user-info.model.js';
import UserResource from './user.resource.js';
import UserService from './user.service.js';
import * as rules from './user.validation.js';

class UserController extends Controller {
  service = UserService;
  resource = UserResource;
  rules = {
    create: rules.userCreateRules,
    update: rules.userUpdateRules,
    createInfo: rules.userInfoCreateRules,
    updateInfo: rules.userInfoUpdateRules,
  };

  refresh = async (req, res) => {
    if (!req.user?._id) throw new Errors.Unauthorized('Invalid credentials!');
    const token = await this.service.refreshToken(req.user._id);
    res.cookie(...token);
    this.success({
      res,
      message: 'Token refreshed!',
      user: await this.resource.make(req.user),
      token: token[1],
    });
  };

  register = async (req, res) => {
    if (tokenExists(req, this.service.authToken)) return this.error({ res, message: 'Already authenticated!' });

    const validData = await this.validator(req, res, this.rules.create);
    const { user, token } = await this.service.registerUser(validData);
    if (!user._id) throw new Errors.BadRequest('Invalid user data!');

    if (req.body.fcmToken) {
      user.fcmToken = req.body.fcmToken;
      await user.save();
      console.log('FCM token saved during registration:', req.body.fcmToken.substring(0, 10) + '...');
    }

    res.cookie(...token);
    this.success({
      res,
      message: 'Registered!',
      user: await this.resource.make(user),
      token: token[1],
    });
  };

  authenticate = async (req, res) => {
    if (tokenExists(req, this.service.authToken)) throw new Errors.BadRequest('Already authenticated!');

    const { email, password } = req.body;
    const { user, token } = await this.service.authenticate(email, password);
    if (!user?._id) throw new Errors.BadRequest('Invalid credentials!');
    console.log('USER TOKEN: ', req.body.fcmToken)
    if (req.body.fcmToken) {
      user.fcmToken = req.body.fcmToken;
      await user.save();
      console.log('FCM token updated during login:', req.body.fcmToken.substring(0, 10) + '...');
    }

    res.cookie(...token);
    this.success({
      res,
      message: 'Authenticated!',
      user: await this.resource.make(user),
      token: token[1],
    });
  };

  googleLogin = async (req, res) => {
    if (tokenExists(req, this.service.authToken)) throw new Errors.BadRequest('Already authenticated!');

    const { email, googleIdToken, displayName, photoURL, fcmToken } = req.body;

    if (!email || !googleIdToken) {
      throw new Errors.BadRequest('Missing required Google authentication data!');
    }

    try {
      // Verify the token with Google (handled in service)
      const { user, token, isNewUser } = await this.service.authenticateWithGoogle(
        email,
        googleIdToken,
        displayName,
        photoURL,
        false // not creating new user, just logging in
      );

      if (!user?._id) throw new Errors.BadRequest('Invalid credentials!');

      // Save FCM token if provided
      if (fcmToken) {
        user.fcmToken = fcmToken;
        await user.save();
        console.log('FCM token saved during Google login:', fcmToken.substring(0, 10) + '...');
      }

      res.cookie(...token);
      this.success({
        res,
        message: 'Authenticated with Google!',
        user: await this.resource.make(user),
        token: token[1],
        isNewUser
      });
    } catch (error) {
      if (error.message === 'User not found') {
        throw new Errors.NotFound('No account exists with this Google email. Please register first.');
      }
      throw error;
    }
  };

  googleRegister = async (req, res) => {
    if (tokenExists(req, this.service.authToken)) throw new Errors.BadRequest('Already authenticated!');

    const { email, googleIdToken, displayName, photoURL, fcmToken } = req.body;

    if (!email || !googleIdToken) {
      throw new Errors.BadRequest('Missing required Google authentication data!');
    }

    try {
      // Create or authenticate with Google
      const { user, token, isNewUser } = await this.service.authenticateWithGoogle(
        email,
        googleIdToken,
        displayName,
        photoURL,
        fcmToken,
        true // create new user if doesn't exist
      );

      if (!user?._id) throw new Errors.BadRequest('Invalid user data!');

      // Save FCM token if provided
      if (fcmToken) {
        user.fcmToken = fcmToken;
        await user.save();
        console.log('FCM token saved during Google registration:', fcmToken.substring(0, 10) + '...');
      }

      res.cookie(...token);
      this.success({
        res,
        message: isNewUser ? 'Registered with Google!' : 'Authenticated with existing Google account!',
        user: await this.resource.make(user),
        token: token[1],
        isNewUser
      });
    } catch (error) {
      throw error;
    }
  };

  logout = async (req, res) => {
    const token = await this.service.logout();
    res.cookie(...token);
    this.success({ res, message: 'Logged out!' });
  };

  getProfile = async (req, res) => {
    const user = req.user;

    if (!user?._id) throw new Errors.BadRequest('Invalid user data!');

    this.success({
      res,
      message: 'Profile fetch successfully!',
      user: await this.resource.make(user),
      token: getBearerToken(req),
    });
  };

  update = async (req, res) => {
    let id = req.params.id || req.params.id || req.user._id;
    let validData = await this.validator(req, res, this.rules.update);
    const user = await this.service.updateUser(id, validData);
    if (!user) throw new Errors.BadRequest('Invalid user data!');

    let info = JSON.parse(req?.body?.info) || null;
    req.body.info = info;
    let userInfo;
    if (req.body?.info && !user?.info?._id) {
      validData = await this.validator(req, res, this.rules.createInfo);
      userInfo = await this.service.createUserInfo(user, info);
    } else if (req.body?.info && user?.info?._id) {
      validData = await this.validator(req, res, this.rules.updateInfo);
      userInfo = await this.service.updateUserInfo(user, info);
    }

    // Handle file upload - now supports both multer file and base64
    if ((req.file || req.base64File) && (userInfo && UserInfoModel.schema.paths['avatar'])) {
      const avatar = this.addImage(req);
      userInfo.avatar = avatar[0];
      await userInfo.save();
    }

    let resource = await this.resource.make(user);
    this.success({
      res,
      message: 'User profile updated!',
      user: resource,
      token: getBearerToken(req),
    });
  };

  forgotPassword = async (req, res) => {
    await this.service.forgotPassword(req.body);

    this.success({
      res,
      message: 'Password reset sent!',
    });
  };

  resetPassword = async (req, res) => {
    const { password } = req.body;
    const token = req.params.token;
    const { user, token: newToken } = await this.service.resetPassword(token, password);
    res.cookie(...newToken);
    this.success({
      res,
      message: 'Password reset!',
      user: await this.resource.make(user),
      token: newToken[1],
    });
  };

  sendVerifyEmail = async (req, res) => {
    const { redirectUrl } = req.body;
    const { email } = req.user;
    await this.service.sendVerifyEmail(email, redirectUrl);
    this.success({
      res,
      message: 'Verification email sent!',
      user: await this.resource.make(req.user),
      token: getBearerToken(req),
    });
  };

  verifyEmail = async (req, res) => {
    const { verifyToken } = req.params;
    const { OTP } = req.body;
    const { email } = req.user;
    let result;
    if (verifyToken) result = await this.service.verifyToken(verifyToken);
    else if (email && OTP) result = await this.service.verifyOTP(email, OTP);
    else throw new Errors.BadRequest('Invalid data!');
    if (!result) throw new Errors.BadRequest('Invalid token!');
    const { user } = result;
    this.success({
      res,
      message: 'Verified!',
      user: await this.resource.make(user),
      token: getBearerToken(req),
    });
  };

  testEmail = async (req, res) => {
    await this.service.testEmail(req.body);
    this.success({ res, message: 'Email sent!' });
  };

  // Dedicated endpoint for updating FCM token
  updateFcmToken = async (req, res) => {
    try {
      const userId = req.user?._id;
      if (!userId) {
        throw new Errors.Unauthorized('Invalid credentials!');
      }

      const { fcmToken } = req.body;
      if (!fcmToken) {
        return this.error({ res, message: 'FCM token is required', statusCode: 400 });
      }

      // Update the user's FCM token
      const user = await this.service.updateFcmToken(userId, fcmToken);
      if (!user) {
        throw new Errors.NotFound('User not found');
      }

      return this.success({
        res,
        message: 'FCM token updated successfully',
        success: true
      });
    } catch (error) {
      return this.error({
        res,
        message: error.message,
        statusCode: error.statusCode || 500
      });
    }
  };
}
export default new UserController();
