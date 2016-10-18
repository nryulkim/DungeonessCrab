require_relative 'lib/tcontroller_base'
require_relative '../models/user'

class UsersController < TControllerBase
  def create
    @user = User.new({name: "John", hp: 10, attk: 2, exp: 5, lvl: 1})
    @user.save

    render_content(JSON.generate(@user.attributes), "application/json")
  end
  def index
    @users = User.all
    render_content(JSON.generate(@users), "application.json")
  end
end
