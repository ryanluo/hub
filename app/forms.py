from flask.ext.wtf import Form
from wtforms import TextField, PasswordField, SelectMultipleField
from wtforms.validators import Required, Email, EqualTo


class RegisterForm(Form):
    teamname = TextField('Team Name', validators=[Required()])
    names = TextField('Names', validators=[Required()])
    location = TextField('Location Description (Ex: 2nd floor)', validators=[])
    languages = SelectMultipleField('Languages', validators=[], choices=[
        ('python', 'Python'),
        ('java', 'Java'),
        ('html', 'HTML'),
        ('css', 'CSS'),
        ('javascript', 'JavaScript'),
        ('ruby', 'Ruby'),
        ('c++', 'C++'),
        ('c', 'C (why?)'),
        ('other', 'Other'),
        ('php', 'PHP')])
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
    teamname = TextField('Team Name', validators=[Required()])
    password = PasswordField('Password', validators=[Required()])
