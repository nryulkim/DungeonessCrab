module Searchable
  def where(params)
    relation_obj ||= LazyRelation.new(self, self.table_name, {})
    relation_obj.where(params)
    relation_obj
  end
end

class LazyRelation
  def initialize(klass, table_name, command_hash)
    @klass = klass
    @table_name = table_name
    @command_hash = command_hash
  end

  def where(params)
    @command_hash = params.merge(@command_hash)
    self
  end

  def where_str
    @command_hash.map do |col, val|
      val = "'#{val}'" if val.is_a?(String)
      "#{@table_name}.#{col} = #{val}"
    end.join(" AND ")
  end


  def execute
    all_attrs = DBConnection.execute(<<-SQL)
      SELECT
        #{@table_name}.*
      FROM
        #{@table_name}
      WHERE
        #{where_str}
    SQL

    all_attrs.map { |atts| @klass.new(atts) }
  end

  def method_missing(method_name, *args)
    obj = execute
    obj[0].send(method_name, *args)
  end

end
