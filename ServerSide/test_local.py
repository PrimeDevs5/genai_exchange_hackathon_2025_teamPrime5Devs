#!/usr/bin/env python3
"""
Local Testing Script for PDF Intelligence System
Run this to test both CLI and API modes
"""

import os
import sys
import time
import subprocess
import requests
import json
from pathlib import Path

def test_imports():
    """Test if all modules can be imported"""
    print("🧪 Testing imports...")
    try:
        from main import CollectionProcessor
        from api import app
        from config import settings
        print("✅ All modules import successfully")
        return True
    except Exception as e:
        print(f"❌ Import error: {e}")
        return False

def test_cli_mode():
    """Test CLI mode"""
    print("\n🖥️  Testing CLI Mode...")
    try:
        # Check if collections exist
        collections_dir = Path("Collections")
        if not collections_dir.exists():
            print("❌ Collections directory not found")
            return False
        
        # Test processor creation
        processor = CollectionProcessor()
        collections = processor.discover_collections(".")
        print(f"✅ Found {len(collections)} collections")
        
        if collections:
            print("✅ CLI mode is ready to process collections")
        else:
            print("⚠️  No collections found, but CLI mode is functional")
        
        return True
    except Exception as e:
        print(f"❌ CLI test error: {e}")
        return False

def test_api_startup():
    """Test if API can start (without actually running server)"""
    print("\n🌐 Testing API Startup...")
    try:
        # Test FastAPI app creation
        from api import app
        print("✅ FastAPI app created successfully")
        
        # Test configuration
        from config import settings
        print(f"✅ Configuration loaded - API Port: {settings.API_PORT}")
        
        return True
    except Exception as e:
        print(f"❌ API startup test error: {e}")
        return False

def check_dependencies():
    """Check if key dependencies are available"""
    print("\n📦 Checking Dependencies...")
    
    dependencies = [
        ("PyMuPDF", "fitz"),
        ("FastAPI", "fastapi"),
        ("Uvicorn", "uvicorn"),
        ("OpenCV", "cv2"),
        ("NumPy", "numpy"),
        ("scikit-learn", "sklearn"),
        ("NLTK", "nltk"),
        ("PyYAML", "yaml"),
    ]
    
    missing = []
    for name, module in dependencies:
        try:
            __import__(module)
            print(f"✅ {name}")
        except ImportError:
            print(f"❌ {name} - Missing")
            missing.append(name)
    
    if missing:
        print(f"\n⚠️  Missing dependencies: {', '.join(missing)}")
        print("Install with: pip install -r requirements.txt")
        return False
    else:
        print("✅ All dependencies available")
        return True

def run_quick_test():
    """Run a quick integration test"""
    print("\n⚡ Running Quick Integration Test...")
    
    try:
        # Test persona analyzer
        from dynamic_persona_analyzer import DynamicPersonaAnalyzer
        analyzer = DynamicPersonaAnalyzer()
        result = analyzer.analyze_persona_task(
            "Student", 
            "Study for exams"
        )
        print("✅ Persona analyzer works")
        
        # Test relevance scorer
        from relevance_scorer import RelevanceScorer
        scorer = RelevanceScorer()
        print("✅ Relevance scorer works")
        
        return True
    except Exception as e:
        print(f"❌ Integration test error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 PDF Intelligence System - Local Test Suite")
    print("=" * 50)
    
    tests = [
        ("Import Test", test_imports),
        ("Dependency Check", check_dependencies),
        ("CLI Mode Test", test_cli_mode),
        ("API Startup Test", test_api_startup),
        ("Integration Test", run_quick_test),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status} - {test_name}")
        if result:
            passed += 1
    
    print(f"\nTotal: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("\n🎉 All tests passed! System is ready to use.")
        print("\n📚 Quick Start:")
        print("  CLI Mode:  python main.py")
        print("  API Mode:  python main.py --api")
        print("  API Docs:  http://localhost:8000/docs (when API is running)")
    else:
        print("\n⚠️  Some tests failed. Check the output above for details.")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
