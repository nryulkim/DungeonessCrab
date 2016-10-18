dir_name = File.expand_path(File.dirname(__FILE__))
Dir["#{dir_name}/../app/controllers/*_controller.rb"].each {|file| require file }
require_relative 'lib/router'

ROUTER = Router.new


ROUTER.draw do
  # Example
  # get Regexp.new("^/dogs$"), DogsController, :index
  get Regexp.new("^/$"), StaticPagesController, :root
  get Regexp.new("^/users$"), UsersController, :index
  post Regexp.new("^/users$"), UsersController, :create
end
