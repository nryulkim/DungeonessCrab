require 'json'
class Session
  # find the cookie for this app
  # deserialize the cookie into a hash

  def initialize(req)
    cookie_hash = req.cookies["_rails_lite_app"]
    existing_cookie = JSON.parse(cookie_hash) if cookie_hash
    @cookie = existing_cookie ? existing_cookie : {}
  end

  def [](key)
    @cookie[key]
  end

  def []=(key, val)
    @cookie[key] = val
  end

  # serialize the hash into json and save in a cookie
  # add to the responses cookies
  def store_session(res)
    out_cookie = @cookie.to_json
    res.set_cookie('_rails_lite_app', { path: "/", value: out_cookie })
  end
end
