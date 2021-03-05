# Helper functions shared between unit-tests

def load_regexp(path)
	path   = File.expand_path("../#{path}", __FILE__)
	source = File.read(path)
	Regexp.new(source, Regexp::EXTENDED)
end

# Abuse VT100 features to print huge wanky letters
def h1(text)
	puts "\e#3#{text}\n\e#4\e[4m#{text}\e[0m"
end

def h2(text)
	puts "\n\e[1;4m#{text}\e[0m\n"
end

$passes   = 0
$failures = 0

def pass(msg)
	++$passes
	puts "\e[32m✓\e[0m \e[38;5;8m#{msg}\e[0m\n"
end

def fail(msg, detail = nil)
	++$failures
	puts "\e[31m✘\e[0m \e[38;5;9m#{msg}\e[0m\n"
	if detail
		detail = detail.to_s.gsub /^/m, "  "
		puts "\e[38;5;9m#{detail}\e[0m\n"
	end
end

def match(regex, input, *captures)
	result = regex.match(input)
	failed = false
	
	if result.nil?
		fail input, "Failed to match"
		return
	else
		pass input
	end

	captures.each_with_index do |expected, i|
		next if expected.nil?
		actual = result[i + 1]
		unless expected == actual
			fail input, "Expected $#{i} to be #{expected.inspect}, found #{actual.inspect}"
		else
			from, to = result.offset(i + 1)
			print "\e[A\e[#{2 + from}C\e[48;5;22;38;5;46m#{input[from..(to - 1)]}\e[0m\n"
		end
	end
end

def miss(regex, input)
	result = regex.match(input)
	unless result.nil?
		fail input, "Unexpected match: #{result.inspect}"
	end
end
