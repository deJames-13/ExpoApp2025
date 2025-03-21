import { ROLES } from '#common';
import EmailTemplate from '#common/lib/email-template';
import { Service } from '#lib';
import { destroyToken, Errors, generateToken, sendEmail } from '#utils';
import UserInfo from './user-info.model.js';
import UserModel from './user.model.js';

class UserService extends Service {
  model = UserModel;
  info = UserInfo;
  authToken = 'jwt';

  async getAuthenticatedUser(userId) {
    const token = generateToken(userId, this.authToken);
    const user = await this.model?.findById(token.id);
    if (!user) throw new Errors.Unauthorized('User not found!');
    return user;
  }

  async refreshToken(userId) {
    const token = generateToken(userId, this.authToken);
    return token;
  }

  async registerUser(body) {
    const userExists = await this.checkIfExists({ email: body.email });
    if (userExists) throw new Errors.BadRequest('User with that email already exists!');

    const user = await this.create(body);
    const token = generateToken(user._id, this.authToken);
    return { user, token };
  }

  async authenticate(email, password) {
    let user = await this.model?.findOne({ email });
    if (!user || !(user && (await user.matchPassword(password)))) user = null;
    const token = user && generateToken(user._id, this.authToken);

    return { user, token };
  }


  async logout() {
    return destroyToken(this.authToken);
  }

  async setRole(user, role) {
    if (user.role === role) return user;
    if (user.role === 'admin' && role !== 'admin') {
      const adminCount = await this.model.countDocuments({ role: 'admin' });
      if (adminCount === 1) throw new Errors.BadRequest('Cannot remove the only admin user!');
    }
    user.role = role;
    await user.save();
    return user;
  }

  async updateUser(id, body) {
    let { role, password, confirm_password, ...rest } = body;
    body = rest;

    const userExists = await this.checkIfExists({
      email: body.email,
      _id: { $ne: id },
    });
    if (userExists) throw new Errors.BadRequest('User with that email already exists!');

    const data = this.model?.filterFillables(body);
    const user = await this.model?.findByIdAndUpdate(id, data, { new: true });
    if (role && req.user.role === ROLES.ADMIN) await this.setRole(user, role);

    return user;
  }

  async contactExists(contact, exceptUser) {
    const user = await this.info?.findOne({
      contact,
      _id: { $ne: exceptUser.info },
    });

    if (user) throw new Errors.BadRequest('Contact already exists!');
  }

  async createUserInfo(user, info) {
    await this.contactExists(info.contact, user);
    try {
      const data = this.info?.filterFillables(info);
      const userInfo = await this.info?.create(data);
      user.info = userInfo._id;
      await user.save();
      return userInfo;
    } catch (err) {
      throw new Errors.BadRequest('Error creating user info!');
    }
  }
  async updateUserInfo(user, info) {
    await this.contactExists(info.contact, user);
    try {
      const data = this.info?.filterFillables(info);
      const userInfo = await this.info?.findByIdAndUpdate(user.info, data, { new: true });
      return userInfo;
    } catch (err) {
      throw new Errors.BadRequest('Error updating user info!');
    }
  }

  async forgotPassword({ email, redirectUrl }) {
    const user = await this.model?.findOne({ email: email });
    if (!user) throw new Errors.NotFound('User not found!');

    const resetToken = await this.model.getResetPasswordToken();
    const resetUrl = `${redirectUrl}?verfiyToken=${token}`;
    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Recovery',
        message,
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      throw new Errors.InternalServerError('Email could not be sent!');
    }

    await user.save({ validateBeforeSave: false });
    return { user, resetToken };
  }

  async resetPassword(token, password) {
    const resetToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await this.model.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!resetPasswordToken) throw new Errors.BadRequest('Invalid reset token!');

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    const generatedToken = generateToken(user._id, this.authToken);
    return { user, token: generatedToken };
  }

  async sendVerifyEmail(email, redirectUrl) {
    const user = await this.model.findOne({ email });
    if (!user) throw new Errors.NotFound('User not found!');

    const { token } = user.getVerifyEmailToken();
    const { code } = user.getOTP();
    user.emailVerifiedAt = null;
    await user.save({ validateBeforeSave: false, new: true });

    let redirect = redirectUrl ? `${redirectUrl}?verifyToken=${token}&otp=${code}` : '';
    const message = `Your OTP is <strong> ${code} </strong> `;
    const altMessage = redirectUrl
      ? `Or click on the following link to verify your email:
    \n\n <a href="${redirect}">${redirect}</a>`
      : '';

    try {
      await sendEmail({
        email: user.email,
        subject: 'Email Verification',
        message: new EmailTemplate({ userName: user.username, message, altMessage }).generate(),
      });
    } catch (err) {
      await user.save({ validateBeforeSave: false });
      throw new Errors.InternalServerError('Email could not be sent!');
    }

    return { user, token, OTP: code };
  }

  async verifyUser(user) {
    user.emailVerifiedAt = Date.now();
    user.verifyEmail = {
      token: null,
      expire: null,
    };
    user.otp = {
      code: null,
      expire: null,
    };
    await user.save();
    return user;
  }

  async verifyToken(token) {
    const dt = Date.now();
    const verifyToken = crypto.createHash('sha256').update(token).digest('hex');
    let user = await this.model.findOne({
      'verifyEmail.token': verifyToken,
      'verifyEmail.expire': { $gt: dt },
    });

    if (!user) throw new Errors.BadRequest('Invalid verify token!');

    user = await this.verifyUser(user);
    return { user };
  }

  async verifyOTP(email, OTP) {
    const dt = Date.now();
    let user = await this.model.findOne({ email });
    if (!user) throw new Errors.BadRequest('Invalid verify token!');

    // console.log(user.otp, user.verifyEmail, OTP, user.otp.code != parseInt(OTP));
    if (user.otp.code != parseInt(OTP)) throw new Errors.BadRequest('Invalid OTP!');
    if (user.otp.expire < dt) throw new Errors.BadRequest('Your OTP expired! Please try again!');

    user = await this.verifyUser(user);
    return { user };
  }

  async testEmail({ email }) {
    const message = new EmailTemplate({
      userName: 'John Doe',
      message: 'This is a test email!',
      altMessage: 'tngnamo',
    }).generate();
    await sendEmail({ email, message });
  }
}

export default new UserService();
