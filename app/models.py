from flask.ext.login import UserMixin


class User(UserMixin):
    def __init__(self, teamname, names, languages, email, password):
        self.teamname = teamname
        self.names = names
        self.languages = languages
        self.email = email
        self.password = password

    def get_id(self):
        return unicode(self.teamname)

    def __repr__(self):
        return '<User %s>' % (self.teamname)