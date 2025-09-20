"""
Simple API Test - Run this while API server is running
"""
import requests
import json

def test_api():
    try:
        # Test health
        response = requests.get("http://localhost:8000/health")
        print("✅ Health Check Response:")
        print(json.dumps(response.json(), indent=2))
        
        # Test uploading PDFs from existing collection
        pdf_file = "./Collections/Collection 1/PDFs/South of France - Cities.pdf"
        
        with open(pdf_file, 'rb') as f:
            files = {'files': ('cities.pdf', f, 'application/pdf')}
            data = {
                'persona': 'College student planning a trip with friends',
                'job_to_be_done': 'Plan a 5-day trip to South of France'
            }
            
            print("\n🚀 Testing synchronous processing...")
            response = requests.post(
                "http://localhost:8000/process-pdfs-sync",
                files=files,
                data=data,
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                print("✅ SUCCESS! Here's the JSON output:")
                print("\n📊 METADATA:")
                print(json.dumps(result['metadata'], indent=2))
                
                print(f"\n📋 EXTRACTED SECTIONS ({len(result['extracted_sections'])}):")
                for section in result['extracted_sections'][:5]:
                    print(f"  {section['importance_rank']}. {section['section_title']}")
                
                print(f"\n📄 SUBSECTION ANALYSIS ({len(result['subsection_analysis'])}):")
                for analysis in result['subsection_analysis'][:3]:
                    print(f"  - {analysis['document']}: {analysis['refined_text'][:100]}...")
                
                # Save full result
                with open('api_test_result.json', 'w') as outfile:
                    json.dump(result, outfile, indent=2)
                print(f"\n💾 Full JSON result saved to: api_test_result.json")
                
            else:
                print(f"❌ Error: {response.status_code}")
                print(response.text)
                
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_api()
