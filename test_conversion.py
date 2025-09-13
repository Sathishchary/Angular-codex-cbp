#!/usr/bin/env python3
"""
Test script for PDF to CBP conversion functionality.
This script validates that the conversion works correctly for both DOCX and PDF files.
"""

import json
import os
import sys
import subprocess
import tempfile

def test_conversion(input_file, expected_format="cbp"):
    """Test conversion of a single file."""
    print(f"Testing conversion of: {input_file}")
    
    if not os.path.exists(input_file):
        print(f"  ❌ File not found: {input_file}")
        return False
    
    # Create temporary output file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as temp_file:
        output_file = temp_file.name
    
    try:
        # Run conversion
        result = subprocess.run([
            sys.executable, 'convert_to_cbp.py', 
            input_file, output_file
        ], capture_output=True, text=True)
        
        if result.returncode != 0:
            print(f"  ❌ Conversion failed: {result.stderr}")
            return False
        
        # Validate output
        with open(output_file, 'r') as f:
            data = json.load(f)
        
        # Check basic structure
        if 'section' not in data:
            print(f"  ❌ Missing 'section' key in output")
            return False
        
        sections = data['section']
        if not isinstance(sections, list):
            print(f"  ❌ 'section' should be a list")
            return False
        
        print(f"  ✅ Conversion successful: {len(sections)} sections generated")
        
        # Print some stats
        total_children = sum(len(section.get('children', [])) for section in sections)
        print(f"     Total step actions: {total_children}")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Error during testing: {e}")
        return False
    
    finally:
        # Clean up
        if os.path.exists(output_file):
            os.unlink(output_file)

def main():
    """Run conversion tests."""
    print("PDF to CBP Conversion Test Suite")
    print("=" * 40)
    
    # Find test files
    test_files = []
    
    # Add sample PDF if it exists
    if os.path.exists('sample_nuclear_procedure.pdf'):
        test_files.append('sample_nuclear_procedure.pdf')
    
    # Add DOCX files from DocxCBP directory
    docx_dir = 'DocxCBP'
    if os.path.exists(docx_dir):
        for file in os.listdir(docx_dir):
            if file.endswith('.docx'):
                test_files.append(os.path.join(docx_dir, file))
    
    if not test_files:
        print("❌ No test files found")
        return False
    
    # Run tests
    results = []
    for test_file in test_files:
        results.append(test_conversion(test_file))
    
    # Summary
    print("\n" + "=" * 40)
    passed = sum(results)
    total = len(results)
    print(f"Test Summary: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
        return True
    else:
        print("❌ Some tests failed")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)