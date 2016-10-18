require 'active_support'
require 'active_support/inflector'
require 'active_support/core_ext'
require 'erb'
require_relative './session'
require_relative './flash'

class TControllerBase
  @@defender = false
  def self.protect_from_forgery
    @@defender = true
  end

  attr_reader :req, :res, :params
  # Setup the controller
  def initialize(req, res, route_params = {})
    @req = req
    @res = res
    @params = @req.params.merge(route_params)
  end

  # Helper method to alias @already_built_response
  def already_built_response?
    @rendered
  end

  # Set the response status code and header
  def redirect_to(url)
    @rendered ? raise {'Cannote render twice'} : @rendered = true
    @res['Location'] = url
    @res.status = 302
    @session.store_session(res) if @session
  end

  # Populate the response with content.
  # Set the response's content type to the given type.
  # Raise an error if the developer tries to double render.
  def render_content(content, content_type)
    @rendered ? raise {'Cannote render twice'} : @rendered = true
    @res.write(content)
    @session.store_session(res) if @session
    @flash.store_flash(res) if @flash
    @res['Content-Type'] = content_type
  end

  # use ERB and binding to evaluate templates
  # pass the rendered html to render_content
  def render(template_name)
    class_name = self.class.to_s.underscore
    class_name.slice! "_controller"
    view_path = "app/views/#{class_name}/#{template_name}.html.erb"
    erb = ERB.new(File.read(view_path)).result(binding)
    render_content(erb, 'text/html')
  end

  # method exposing a `Session` object
  def session
    @session ||= Session.new(@req)
  end

  def flash
    @flash ||= Flash.new(@req)
  end

  # use this with the router to call action_name (:index, :show, :create...)
  def invoke_action(name)
    if @@defender && check_authenticity_token
      @res.write("ATTACK ATTACK!! RUN AND HIDE!")
      @res.status = 403
      @res['Content-Type'] = "text/html"
    else
      self.send(name)
      render(name) unless already_built_response?
    end
  end

  def form_authenticity_token
    flash[:_csurf_master_code] = SecureRandom.urlsafe_base64
  end

  private
  def check_authenticity_token
    !@req.get? && (master_code.nil? || master_code != @req.params["authenticity_token"])
  end

  def master_code
    flash[:_csurf_master_code]
  end
end
