const controller = require('app/http/controllers/controller');
const passport = require('passport');

class registerController extends controller {

    showRegsitrationForm(req, res) {
        res.render('home/auth/register', { recaptcha: this.recaptcha.render() });
    }

    registerProccess(req, res, next) {
        this.recaptchaValidation(req, res)
            .then(result => this.validationData(req))
            .then(result => {
                if (result) this.register(req, res, next)
                else {
                    return this.back(req, res)
                }
            })
            .catch(err => console.log(err));
    }


    validationData(req) {
        req.checkBody('name', 'فیلد نام نمیتواند خالی بماند').notEmpty();
        req.checkBody('name', 'فیلد نام نمیتواند کمتر از 2 کاراکتر باشد').isLength({ min: 2 });
        req.checkBody('email', 'فیلد نام نمیتواند خالی بماند').notEmpty();
        req.checkBody('email', 'فیلد ایمیل معتبر نیست').isEmail();
        req.checkBody('password', 'فیلد رمز نمیتواند خالی بماند').notEmpty();
        req.checkBody('password', 'فیلد پسورد نمیتواند کمتر از 8 کاراکتر باشد').isLength({ min: 7 });

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

    register(req, res, next) {
        passport.authenticate('local.register', {
            successRedirect: '/',
            failureRedirect: '/auth/register',
            failureFlash: true
        })(req, res, next);
    }

}

module.exports = new registerController();