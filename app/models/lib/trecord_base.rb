require 'active_support/inflector'
require_relative 'searchable'
require_relative 'associatable'
require_relative '../../../db/lib/db_connection'
require 'byebug'
class TRecordBase
  extend Associatable
  extend Searchable

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

  def self.columns
    # ...
    return @columns if @columns

    arr = DBConnection.execute(<<-SQL)
      SELECT
        *
      FROM
        #{self.table_name}
    SQL
    @columns = []
    arr.nfields.times do |i|
      @columns << arr.fname(i)
    end

    @columns
  end

  def self.finalize!
    columns.each do |column|
      inst_var = "@" + column.to_s
      define_method(column) do
        attributes[column]
      end
      define_method(column.to_s + "=") do |arg|
        attributes[column] = arg
      end
    end
  end

  def self.table_name=(table_name)
    @table_name = table_name
  end

  def self.table_name
    @table_name = @table_name || self.to_s.tableize
  end

  def self.all
    objs_arr = DBConnection.execute(<<-SQL)
      SELECT
        #{table_name}.*
      FROM
        #{table_name}
    SQL

    parse_all(objs_arr)
  end

  def self.parse_all(results)
    # ...
    results.map { |obj_hash| self.new(obj_hash) }
  end

  def self.find(id)
    obj = DBConnection.execute(<<-SQL, id)
      SELECT
        #{table_name}.*
      FROM
        #{table_name}
      WHERE
        #{table_name}.id = ?
    SQL

    parse_all(obj).first
  end

  def initialize(params = {})
    # ...
    params.each do |att_name, val|
      att_name = att_name.to_sym
      raise "unknown attribute '#{att_name}'" unless columns.include?(att_name.to_s)
      self.send(att_name.to_s + "=", val)
    end
  end

  def attributes
    @attributes ||= {}
  end

  def attribute_values
    attributes.values
  end

  def insert
    cols = columns.reject { |col| col == "id" }
    attr_count = cols.count
    column_str = cols.join(", ")
    quest_str = Array.new(attr_count) {"?"}.join(", ")
    debugger
    DBConnection.execute(<<-SQL, attribute_values)
      INSERT INTO
        #{table_name} (#{column_str})
      VALUES
        (#{quest_str})
    SQL
  end

  def update
    attr_count = columns.count - 1
    column_str = columns[1..-1].map { |col| "#{col} = ?" }.join(", ")

    DBConnection.execute(<<-SQL, attribute_values)
      UPDATE
        #{table_name}
      SET
        #{column_str}
      WHERE
        id = ?
    SQL
  end

  def save
    if attributes[:id]
      update
    else
      insert
    end
  end

  private

  def columns
    self.class.columns
  end

  def table_name
    self.class.table_name
  end

end
