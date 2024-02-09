const controller = require('app/http/controllers/controller');
const passport = require('passport');
const passwordReset = require('app/models/password-reset');
const User = require('app/models/user')
const uniqueString = require('unique-string')
class forgotpasswordcontroller extends controller {

    showforgotpassword(req, res) {
        const title = 'فراموشی رمز عبور';
        res.render('home/auth/passwords/email', { recaptcha: this.recaptcha.render(), title });
    }

    sendpasswordlink(req, res, next) {
        this.recaptchaValidation(req, res)
            .then(result => this.validationData(req))
            .then(result => {
                if (result) this.sendresetlink(req, res, next)
                else {
                    return this.back(req, res)
                }
            })
            .catch(err => console.log(err));
    }

    validationData(req) {
        req.checkBody('email', 'فیلد ایمیل معتبر نیست').isEmail();

        return req.getValidationResult()
            .then(result => {
                const errors = result.array();
                const messages = [];
                errors.forEach(err => messages.push(err.msg));

                if (errors.length == 0)
                    return true;

                req.flash('errors', messages)
                return false;
            })
            .catch(err => console.log(err));
    }

    async sendresetlink(req, res, next) {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            req.flash('errors', 'کاربر وجود ندارد')
            return this.back(req, res);
        }
        const NewPasswordReset = new passwordReset({
            email: req.body.email,
            token: uniqueString()
        });
        await NewPasswordReset.save();
        // sendmail
        req.flash('success', 'ایمیل ارسال شد');
        res.redirect('/');
    }

}

module.exports = new forgotpasswordcontroller();