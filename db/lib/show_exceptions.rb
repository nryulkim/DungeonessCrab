require 'erb'

class ShowExceptions
  attr_reader :app, :exception, :res

  def initialize(app)
    @app = app
    @res = Rack::Response.new
    @exception = nil
  end

  def call(env)
    begin
      app.call(env)
    rescue => e
      render_exception(e)
    end
  end

  private

  def render_exception(e)
    @error = e
    template_path = "app/views/lib/error_page.html.erb"
    erb = ERB.new(File.read(template_path)).result(binding)

    res.write(erb)
    res.status = 500
    res['Content-Type'] = 'text/html'
    res.finish
  end

end
