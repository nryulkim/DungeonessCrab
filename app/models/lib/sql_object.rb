
class SQLObject
  extend Searchable
  extend Associatable
  
  def self.columns
    # ...
    return @columns if @columns

    arr = DBConnection.execute2(<<-SQL)
      SELECT
        *
      FROM
        #{self.table_name}
    SQL

    @columns = arr[0].map { |column| column.to_sym }
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
      raise "unknown attribute '#{att_name}'" unless columns.include?(att_name)
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
    attr_count = columns.count
    column_str = columns.join(", ")
    quest_str = Array.new(attr_count) {"?"}.join(", ")
    DBConnection.execute(<<-SQL, nil, attribute_values)
      INSERT INTO
        #{table_name} (#{column_str})
      VALUES
        (#{quest_str})
    SQL

    self.id = DBConnection.last_insert_row_id
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
