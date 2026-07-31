import os
import re

directory = "src"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace single quote versions
    new_content = re.sub(r"'http://localhost:9321/([^']*)'", r"`${import.meta.env.VITE_API_URL || 'http://localhost:9321'}/\1`", content)
    # Replace double quote versions just in case
    new_content = re.sub(r'"http://localhost:9321/([^"]*)"', r"`${import.meta.env.VITE_API_URL || 'http://localhost:9321'}/\1`", new_content)
    
    # Also handle axiosInstance.ts baseURL specifically
    new_content = new_content.replace("'http://localhost:9321'", "import.meta.env.VITE_API_URL || 'http://localhost:9321'")
    new_content = new_content.replace('"http://localhost:9321"', "import.meta.env.VITE_API_URL || 'http://localhost:9321'")
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {filepath}")

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith(('.ts', '.vue', '.js')):
            process_file(os.path.join(root, file))
