#!/usr/bin/env python3
"""
Test script for the PDF Intelligence API
Tests both asynchronous and synchronous endpoints
"""

import requests
import json
import time
import os

API_BASE = "http://localhost:8000"

def test_health():
    """Test if API is running"""
    try:
        response = requests.get(f"{API_BASE}/health")
        if response.status_code == 200:
            print("✅ API Health Check: PASSED")
            print(f"Response: {response.json()}")
            return True
        else:
            print(f"❌ API Health Check: FAILED (Status: {response.status_code})")
            return False
    except Exception as e:
        print(f"❌ API Health Check: FAILED (Error: {e})")
        return False

def test_sync_processing():
    """Test synchronous PDF processing"""
    print("\n🧪 Testing Synchronous PDF Processing...")
    
    # Find some PDFs to test with
    test_pdfs = []
    collections_dir = "./Collections"
    
    if os.path.exists(collections_dir):
        for collection in os.listdir(collections_dir):
            collection_path = os.path.join(collections_dir, collection)
            if os.path.isdir(collection_path):
                pdfs_dir = os.path.join(collection_path, "PDFs")
                if os.path.exists(pdfs_dir):
                    for pdf_file in os.listdir(pdfs_dir):
                        if pdf_file.endswith('.pdf'):
                            test_pdfs.append(os.path.join(pdfs_dir, pdf_file))
                            if len(test_pdfs) >= 2:  # Test with 2 PDFs
                                break
                if len(test_pdfs) >= 2:
                    break
    
    if not test_pdfs:
        print("❌ No PDF files found for testing")
        return False
    
    print(f"📄 Found {len(test_pdfs)} PDFs for testing:")
    for pdf in test_pdfs:
        print(f"   - {os.path.basename(pdf)}")
    
    # Prepare the request
    files = []
    try:
        for pdf_path in test_pdfs[:2]:  # Use first 2 PDFs
            files.append(('files', (os.path.basename(pdf_path), open(pdf_path, 'rb'), 'application/pdf')))
        
        data = {
            'persona': 'College student planning a trip with friends',
            'job_to_be_done': 'Plan a 5-day trip to South of France with accommodation and activity recommendations'
        }
        
        print("🚀 Sending request to /process-pdfs-sync...")
        start_time = time.time()
        
        response = requests.post(
            f"{API_BASE}/process-pdfs-sync",
            files=files,
            data=data,
            timeout=120  # 2 minutes timeout
        )
        
        processing_time = time.time() - start_time
        print(f"⏱️ Processing completed in {processing_time:.2f} seconds")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Synchronous Processing: SUCCESS")
            
            # Display key results
            metadata = result.get('metadata', {})
            extracted_sections = result.get('extracted_sections', [])
            subsection_analysis = result.get('subsection_analysis', [])
            
            print(f"\n📊 Results Summary:")
            print(f"   - Documents processed: {len(metadata.get('input_documents', []))}")
            print(f"   - Sections extracted: {len(extracted_sections)}")
            print(f"   - Subsections analyzed: {len(subsection_analysis)}")
            print(f"   - Persona: {metadata.get('persona', 'N/A')}")
            print(f"   - Task: {metadata.get('job_to_be_done', 'N/A')}")
            
            # Show first few sections
            print(f"\n📋 Top Extracted Sections:")
            for i, section in enumerate(extracted_sections[:5]):
                print(f"   {section['importance_rank']}. {section['section_title']} (Page {section['page_number']})")
            
            # Save result to file for inspection
            with open('test_api_result.json', 'w') as f:
                json.dump(result, f, indent=2)
            print(f"\n💾 Full result saved to: test_api_result.json")
            
            return True
        else:
            print(f"❌ Synchronous Processing: FAILED (Status: {response.status_code})")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Synchronous Processing: ERROR - {e}")
        return False
    finally:
        # Close file handles
        for file_tuple in files:
            if len(file_tuple) > 1 and hasattr(file_tuple[1][1], 'close'):
                file_tuple[1][1].close()

def test_async_processing():
    """Test asynchronous PDF processing"""
    print("\n🧪 Testing Asynchronous PDF Processing...")
    
    # Find some PDFs to test with
    test_pdfs = []
    collections_dir = "./Collections"
    
    if os.path.exists(collections_dir):
        for collection in os.listdir(collections_dir):
            collection_path = os.path.join(collections_dir, collection)
            if os.path.isdir(collection_path):
                pdfs_dir = os.path.join(collection_path, "PDFs")
                if os.path.exists(pdfs_dir):
                    for pdf_file in os.listdir(pdfs_dir):
                        if pdf_file.endswith('.pdf'):
                            test_pdfs.append(os.path.join(pdfs_dir, pdf_file))
                            if len(test_pdfs) >= 1:  # Test with 1 PDF for async
                                break
                if len(test_pdfs) >= 1:
                    break
    
    if not test_pdfs:
        print("❌ No PDF files found for testing")
        return False
    
    # Prepare the request
    files = []
    try:
        pdf_path = test_pdfs[0]
        files.append(('files', (os.path.basename(pdf_path), open(pdf_path, 'rb'), 'application/pdf')))
        
        data = {
            'persona': 'Business analyst',
            'job_to_be_done': 'Create quarterly report with key insights'
        }
        
        print("🚀 Sending request to /upload-pdfs...")
        response = requests.post(
            f"{API_BASE}/upload-pdfs",
            files=files,
            data=data
        )
        
        if response.status_code == 200:
            result = response.json()
            job_id = result['job_id']
            print(f"✅ Job submitted successfully: {job_id}")
            
            # Poll for completion
            print("⏳ Waiting for processing to complete...")
            max_wait = 60  # 1 minute
            wait_time = 0
            
            while wait_time < max_wait:
                status_response = requests.get(f"{API_BASE}/job/{job_id}")
                if status_response.status_code == 200:
                    status_data = status_response.json()
                    status = status_data['status']
                    print(f"   Status: {status}")
                    
                    if status == 'completed':
                        print("✅ Async Processing: SUCCESS")
                        if 'result' in status_data:
                            print("📊 Results received in job status")
                            return True
                        break
                    elif status == 'failed':
                        print(f"❌ Async Processing: FAILED - {status_data.get('error', 'Unknown error')}")
                        return False
                
                time.sleep(5)
                wait_time += 5
            
            print("⏰ Timeout waiting for async processing")
            return False
            
        else:
            print(f"❌ Async Processing: FAILED (Status: {response.status_code})")
            return False
            
    except Exception as e:
        print(f"❌ Async Processing: ERROR - {e}")
        return False
    finally:
        # Close file handles
        for file_tuple in files:
            if len(file_tuple) > 1 and hasattr(file_tuple[1][1], 'close'):
                file_tuple[1][1].close()

def main():
    """Run all tests"""
    print("🧪 PDF Intelligence API Test Suite")
    print("=" * 50)
    
    # Test 1: Health check
    if not test_health():
        print("\n❌ API is not running. Start it with: python main.py --api")
        return
    
    # Test 2: Synchronous processing (recommended)
    sync_success = test_sync_processing()
    
    # Test 3: Asynchronous processing
    async_success = test_async_processing()
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    print(f"   ✅ Health Check: PASSED")
    print(f"   {'✅' if sync_success else '❌'} Synchronous Processing: {'PASSED' if sync_success else 'FAILED'}")
    print(f"   {'✅' if async_success else '❌'} Asynchronous Processing: {'PASSED' if async_success else 'FAILED'}")
    
    if sync_success:
        print("\n🎉 SUCCESS! The API is working correctly.")
        print("💡 Use the synchronous endpoint /process-pdfs-sync for immediate results.")
        print("🌐 Visit http://localhost:8000/docs for interactive API documentation.")
    else:
        print("\n❌ Some tests failed. Check the API server logs for details.")

if __name__ == "__main__":
    main()
