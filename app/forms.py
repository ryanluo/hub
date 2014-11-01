from flask.ext.wtf import Form
from wtforms import TextField, PasswordField, SelectMultipleField
from wtforms.validators import Required, Email, EqualTo


class RegisterForm(Form):
    teamname = TextField('teamname', validators=[Required()])
    names = TextField('Names', validators=[Required()])
    languages = SelectMultipleField('Languages', validators=[], choices=[('python','Python'), ('html','HTML'), ('css','CSS'), ('php','"PHP"')])
    email = TextField('Email', validators=[Email()])
    password = PasswordField('Password', validators=[Required()])
    confirm = PasswordField(
        'Confirm Password',
        validators=[Required(),
                    EqualTo('password', message='Passwords do not match.')])

    def validate(self):
        if not Form.validate(self):
            return False

        # TODO: Make sure that the user does not exist
        return True


class LoginForm(Form):
    teamname = TextField('teamname', validators=[Required()])
    password = PasswordField('Password', validators=[Required()])
