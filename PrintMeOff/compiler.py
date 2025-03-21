import sys
import re

def parse_segment(segment):
    match = re.match(r'\{(\d+)\[(.*?)\]\}', segment)
    if not match:
        raise SyntaxError(f"Invalid segment format: {segment}")
    repeat_count = int(match.group(1))
    content = match.group(2)
    
    result = []
    previous = None
    
    i = 0
    while i < len(content):
        char = content[i]
        
        if char == '|':
            i += 1  # Skip | and move to next character
            continue
        elif char == ':':
            i += 1  # Skip : as per syntax
            continue
        elif char in (';', ','):
            if previous is not None:
                previous = previous.swapcase()
            else:
                raise SyntaxError("Misplaced case transition character.")
        else:
            previous = char.strip("'\"")
            result.append(previous)  # Store valid character immediately
        
        i += 1
    
    return ''.join(result) * repeat_count

def compile_and_run(code):
    segments = re.split(r'&\+', code)
    output = ""
    
    for segment in segments:
        segment = segment.strip()
        if segment == "nextlineplz":
            output += "\n"
        else:
            output += parse_segment(segment)
    
    print(output)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python text_printer.py <filename.pmo>")
        sys.exit(1)

    filename = sys.argv[1]

    if not filename.endswith(".pmo"):
        print("Error: File must have a .pmo extension")
        sys.exit(1)

    try:
        with open(filename, "r") as file:
            code = file.read().strip()
        compile_and_run(code)
    except FileNotFoundError:
        print(f"Error: File '{filename}' not found.")
