class User():
  def __init__(self, teamname, names, languages, email, password):
    self.teamname = teamname 
    self.names = names
    self.languages = languages
    self.email = email
    self.password = password

  def is_authenticated(self):
    return True

  def is_active(self):
    return True

  def is_anonymous(self):
    return False

  def get_id(self):
    return unicode(self.teamname)

  def __repr(self):
    return '<User %u>' % (self.teamname)
