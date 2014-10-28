class User():
  def __init__(self, username, name, email, password):
    self.username = username
    self.name = name
    self.email = email
    self.password = password

  def is_authenticated(self):
    return True

  def is_active(self):
    return True

  def is_anonymous(self):
    return False

  def get_id(self):
    return unicode(self.username)

  def __repr(self):
    return '<User %u>' % (self.username)
