require 'active_support/inflector'
require_relative 'searchable'
require_relative 'associatable'
require_relative 'sql_object'
require_relative 'db_connection'

class TRecordBase
  def self.my_attr_accessor(*names)
    names.each do |name|
      define_method(name) do
        instance_variable_get("@" + name.to_s)
      end

      define_method(name.to_s + "=") do |arg|
        instance_variable_set("@" + name.to_s, arg)
      end
    end
  end

  def self.my_attr_reader(*names)
    names.each do |name|
      define_method(name) do
        instance_variable_get("@" + name.to_s)
      end
    end
  end
end
