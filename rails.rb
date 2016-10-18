COMMANDS = {
  "new" => :generate_files
}

def generate_files(name)
  Dir.mkdir name
  main = "#{name}/"
  File.open("README.md", "w") { |f| f.write("") }


  puts "made files"
end

begin
  send(COMMANDS[ARGV[0]], *ARGV)
rescue TypeError
  puts "Command does not exist"
end
