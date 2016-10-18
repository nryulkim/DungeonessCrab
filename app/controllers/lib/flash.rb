require 'json'

class Flash
  def initialize(req)
    cookie_hash = req.cookies["_rails_lite_app_flash"]
    @existing = cookie_hash ? JSON.parse(cookie_hash) : {}
    @new = {}
  end

  def [](key)
    merged = @existing.merge(@new)
    merged[key.to_s]
  end

  def []=(key, val)
    if @add_next
      @existing[key.to_s] = val
      @add_next = false
    else
      @new[key.to_s] = val
    end
  end

  def now
    @add_next = true
    self
  end

  def store_flash(res)
    out_cookie = @new.to_json
    res.set_cookie('_rails_lite_app_flash', { path: "/", value: out_cookie })
  end
end


# class Flash
#   attr_reader :flashy_cookie
#
#   def initialize(req)
#     cookie_hash = req.cookies["_rails_lite_app_flash"]
#     existing_cookie = JSON.parse(cookie_hash) if cookie_hash
#     @flashy_cookie = existing_cookie ? existing_cookie : {}
#   end
#
#   def [](key)
#     @flashy_cookie[key.to_s]
#   end
#
#   def []=(key, val)
#     if @add_next
#       old_keys.add(key.to_s)
#       @add_next = false
#     end
#
#     @flashy_cookie[key] = val
#   end
#
#   def now
#     @add_next = true
#     self
#   end
#
#   def delete_old
#     old_keys.each do |key|
#       @flashy_cookie.delete(key)
#     end
#
#     @flashy_cookie.delete(:old)
#   end
#
#   # serialize the hash into json and save in a cookie
#   # add to the responses cookies
#   def store_flash(res)
#     delete_old
#     old_keys = @flashy_cookie.keys
#     out_cookie = @flashy_cookie.to_json
#     res.set_cookie('_rails_lite_app_flash', out_cookie)
#   end
#
#   private
#   def old_keys
#     @flashy_cookie[:old] ||= Set.new
#   end
#
#   def old_keys=(key_arr)
#     old_keys
#     keys.each { |key| @flash_cookie[:old].add(key) }
#     old_keys.delete(:old)
#   end
# end
