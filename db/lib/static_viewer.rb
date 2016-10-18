require 'rack'
require 'pathname'

class StaticViewer
  FILE_TYPE = {
    'jpg' => 'image/jpeg',
    'zip' => 'application/zip',
    'png' => 'image/png',
    'txt' => 'text/plain'
  }

  def initialize(app)
    @app = app
  end

  def call(env)
    if is_public?(env)
      req = Rack::Request.new(env)
      res = Rack::Response.new

      file_path = "#{req.path}"
      build_response(res, file_path)
    else
      @app.call(env)
    end
  end

  private
  def build_response(res, file_path)
    type = find_content_type(file_path)

    if type && Pathname(file_path).exist?
      res.write(File.open(file_path, 'r') { |f| (f.read) })
      res['Content-Type'] = find_content_type(file_path)
      res.finish
    else
      type ? res.write("Could not find file.") : res.write("Unsupported file type")
      res.status = 404
      res['Content-Type'] = 'text/html'
      res.finish
    end
  end

  def is_public?(env)
    !!(Regexp.new("/public/*") =~ env["PATH_INFO"])
  end

  def find_content_type(path)
    type = path.match(/\.(\w*)/)[1]
    FILE_TYPE[type]
  end
end
