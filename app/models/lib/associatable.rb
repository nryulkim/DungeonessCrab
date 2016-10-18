class AssocOptions
  attr_accessor(
    :foreign_key,
    :class_name,
    :primary_key
  )

  def model_class
    class_name.constantize
  end

  def table_name
    model_class.table_name
  end

end

class BelongsToOptions < AssocOptions
  def initialize(name, options = {})
    @foreign_key = options[:foreign_key] || (name.to_s.foreign_key).to_sym
    @primary_key = options[:primary_key] || :id
    @class_name = options[:class_name] || name.to_s.classify
  end
end

class HasManyOptions < AssocOptions
  def initialize(name, self_class_name, options = {})
    @foreign_key = options[:foreign_key] || (self_class_name.foreign_key).to_sym
    @primary_key = options[:primary_key] || :id
    @class_name = options[:class_name] || name.to_s.singularize.classify
  end
end

module Associatable
  # Phase IIIb
  def belongs_to(name, options = {})
    options = BelongsToOptions.new(name, options)

    define_method(name) do
      fkey_val = self.send(options.foreign_key)
      class_obj = options.model_class

      class_obj.where(options.primary_key => fkey_val).first
    end

    assoc_options[name] = options
  end

  def has_many(name, options = {})
    # ...
    unless options.first[0] == :through
      options = HasManyOptions.new(name, self.to_s, options)

      define_method(name) do
        class_obj = options.model_class
        pr_key = self.send(options.primary_key)
        class_obj.where(options.foreign_key => pr_key)
      end

      assoc_options[name] = options
    else
      options[:source] ||= name
      through(name, options[:through], options[:source])
    end
  end

  def through(name, through_name, source_name)
    define_method(name) do
      through_options = self.class.assoc_options[through_name]
      source_options = through_options.model_class.assoc_options[source_name]

      if through_options.is_a?(BelongsToOptions)
        # A to B has a belongs_to relationship
        a_test_key = self.send(through_options.foreign_key)
        b_column = through_options.primary_key
      else
        # A to B has a has_many relationship
        a_test_key = self.send(through_options.primary_key)
        b_column = through_options.foreign_key
      end

      if source_options.is_a?(BelongsToOptions)
        # B to C has a belongs_to relationship
        b_test_key = source_options.foreign_key
        c_column = source_options.primary_key
      else
        # B to C has a has_many relationship
        b_test_key = source_options.primary_key
        c_column = source_options.foreign_key
      end
      source_table = source_options.table_name
      through_table = through_options.table_name

      all_data = DBConnection.execute(<<-SQL)
        SELECT
          #{source_table}.*
        FROM
          #{through_table}
        JOIN
          #{source_table} ON #{source_table}.#{c_column} = #{through_table}.#{b_test_key}
        WHERE
          #{through_table}.#{b_column} = #{a_test_key}
      SQL

      source_options.model_class.parse_all(all_data)
    end
  end

  def has_one (name, options = {})
    options[:source] ||= name
    through(name, options[:through], options[:source])
  end

  def assoc_options
    @assoc_options ||= {}
  end
end
