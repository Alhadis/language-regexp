# Helper functions shared between unit-tests

def load_regexp(path)
	path   = File.expand_path("../#{path}", __FILE__)
	source = File.read(path)
	Regexp.new(source, Regexp::EXTENDED)
end

def test_matches(regex, tests)
	results = []
	tests.each_slice(2) do |test|
		filetype, input = test
		result = regex.match(input)
		error =
			if result.nil?
				"Expression failed to match"
			elsif result[1] != filetype.to_s
				"Expected filetype to be #{filetype}, got #{result[1].inspect}"
			else
				nil
			end
		results.push({
			:passed?  => error.nil?,
			:result   => result,
			:input    => input,
			:filetype => filetype,
			:error    => error,
		})
	end
	results
end

def test_failures(regex, tests)
	results = []
	tests.each do |input|
		result = regex.match(input)
		error = if result.nil? then nil else
			"Expected pattern not to match, got #{result.inspect}"
		end
		results.push({
			:passed? => error.nil?,
			:result => result,
			:input => input,
			:error => error,
		})
	end
	results
end

def print_heading(text, huge = false)
	# Giant letters achieved using a wanky effect
	if huge
		puts "\e#3#{text}\n\e#4\e[4m#{text}\e[0m"
	else
		puts "\e[1;4m#{text}\e[0m\n"
	end
end

def print_result(info)
	# Pass
	if info[:passed?]
		puts "\e[32m✓\e[0m \e[38;5;8m#{info[:input]}\e[0m\n"
	
	# Failure
	else
		puts "\e[31m✘\e[0m \e[38;5;9m#{info[:input]}\e[0m\n"
		puts "\e[38;5;9m#{info[:error].gsub(/^/m, "  ")}\e[0m\n"
	end
end
