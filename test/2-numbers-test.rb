#!/usr/bin/env ruby
require_relative "./0-helpers"

h1 "Numbers"
N  = load_regexp("../number.regexp")
N_ = load_regexp("../number-with-separators.regexp")

[N, N_].each do |x|
	# Integers
	match x,   "15";   match x,   "+15";   match x,   "-15"
	match x,    "0";   match x,    "+0";   match x,    "-0"
	match x,  "1e5";   match x,  "1e-5";   match x,  "1e+5"
	match x, "+1e5";   match x, "+1e-5";   match x, "+1e+5"
	match x, "-1e5";   match x, "-1e-5";   match x, "-1e+5"
	match x,  "1e5";   match x,  "1e-5";   match x,  "1e+5"
	match x, "+1e5";   match x, "+1e-5";   match x, "+1e+5"
	match x, "-1e5";   match x, "-1e-5";   match x, "-1e+5"
	match x,  "1e56";  match x,  "1e-56";  match x,  "1e+56"
	match x, "+1e56";  match x, "+1e-56";  match x, "+1e+56"
	match x, "-1e56";  match x, "-1e-56";  match x, "-1e+56"
	match x,  "1E56";  match x,  "1E-56";  match x,  "1E+56"
	match x, "+1E56";  match x, "+1E-56";  match x, "+1E+56"
	match x, "-1E56";  match x, "-1E-56";  match x, "-1E+56"

	# Floats
	match x,   "1.5";  match x,   "+1.5";  match x,   "-1.5"
	match x,   "0.0";  match x,   "+0.0";  match x,   "-0.0"
	match x,    ".5";  match x,    "+.5";  match x,    "-.5"
	match x,    ".0";  match x,    "+.0";  match x,    "-.0"
	match x, "1.5e1";  match x, "+1.5e1";  match x, "-1.5e1"
	match x, "1.5e+1"; match x, "+1.5e-1"; match x, "-1.5e+1"
	match x,  ".5e6";  match x,   ".5e-6"; match x,   ".5e+6"
	match x, "+.5e-6"; match x,  "+.5e-6"; match x,  "-.5e+6"
	match x, "+.5e+6"; match x,  "+.5e-6"; match x,  "-.5e+6"
end

# Separators
tests = %W[
	1_500   +1_500   -1_500
	0_000   +0_000   -0_000
	01e5_6   1e-5_6   1e+5_6
	+1e5_6  +1e-5_6  +1e+5_6
	-1e5_6  -1e-5_6  -1e+5_6
	01e5_6   1e-5_6   1e+5_6
	+1e5_6  +1e-5_6  +1e+5_6
	-1e5_6  -1e-5_6  -1e+5_6
	01e5_6   1e-5_6   1e+5_6
	+1e5_6  +1e-5_6  +1e+5_6
	-1e5_6  -1e-5_6  -1e+5_6
	12E5_6  12E-5_6  12E+5_6
	+1E5_6  +1E-5_6  +1E+5_6
	-1E5_6  -1E-5_6  -1E+5_6
].each { |num| match N_, num }
