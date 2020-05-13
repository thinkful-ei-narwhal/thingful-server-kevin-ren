function requireAuth(req, res, next) {
  const authValue = req.get('Authorization' || '');
  if (!authValue.toLowerCase().startsWith('basic ')) {
    return res.status(401).json({ error: 'Missing basic auth' });
  }
  const token = authValue.slice(' ')[1];
  const [tokenUsername, tokenPassword] = Buffer.from(token, 'base64')
    .toString()
    .split(':');
  if (!tokenUsername || !tokenPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  req.app
    .get('db')('thingful_users')
    .where({ user_name: tokenUserName })
    .first()
    .then((user) => {
      if (!user || user.password !== tokenPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      req.user = user;
      next();
    })
    .catch(next);
}

module.exports = { requireAuth };
