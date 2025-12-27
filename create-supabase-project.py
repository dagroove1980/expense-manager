#!/usr/bin/env python3
"""
Supabase Project Creation Helper
This script helps you create a Supabase project via their Management API
"""

import os
import sys
import json
import requests
import getpass

def print_header():
    print("=" * 60)
    print("🚀 Supabase Project Creation Helper")
    print("=" * 60)
    print()

def get_access_token():
    """Get Supabase access token from user"""
    print("To create a project via API, you need a Supabase access token.")
    print()
    print("How to get your access token:")
    print("1. Go to https://supabase.com/dashboard/account/tokens")
    print("2. Click 'Generate New Token'")
    print("3. Copy the token")
    print()
    
    token = getpass.getpass("Enter your Supabase access token: ").strip()
    if not token:
        print("❌ Token is required!")
        sys.exit(1)
    return token

def create_project_via_api(access_token, project_name, db_password, region="us-east-1", org_id=None):
    """Create a Supabase project via Management API"""
    url = "https://api.supabase.com/v1/projects"
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    # Get organization ID if not provided
    if not org_id:
        orgs_url = "https://api.supabase.com/v1/organizations"
        try:
            response = requests.get(orgs_url, headers=headers)
            if response.status_code == 200:
                orgs = response.json()
                if orgs:
                    org_id = orgs[0]["id"]
                    print(f"✓ Found organization: {orgs[0]['name']}")
                else:
                    print("❌ No organizations found. Please create one in Supabase dashboard first.")
                    sys.exit(1)
            else:
                print(f"❌ Error fetching organizations: {response.status_code}")
                print(response.text)
                sys.exit(1)
        except Exception as e:
            print(f"❌ Error: {e}")
            sys.exit(1)
    
    payload = {
        "name": project_name,
        "organization_id": org_id,
        "region": region,
        "database_password": db_password,
        "plan": "free"  # or "pro" for paid plans
    }
    
    print(f"\n📦 Creating project '{project_name}'...")
    print("   This may take 2-3 minutes...")
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code == 201:
            project = response.json()
            print("✅ Project created successfully!")
            return project
        else:
            print(f"❌ Error creating project: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def get_project_credentials(access_token, project_id):
    """Get project URL and anon key"""
    url = f"https://api.supabase.com/v1/projects/{project_id}/api-keys"
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            keys = response.json()
            # Find the anon key
            anon_key = next((k for k in keys if k.get("name") == "anon" or k.get("name") == "public"), None)
            return anon_key["api_key"] if anon_key else None
        else:
            print(f"⚠️  Could not fetch API keys: {response.status_code}")
            return None
    except Exception as e:
        print(f"⚠️  Error fetching API keys: {e}")
        return None

def save_env_file(supabase_url, anon_key):
    """Save credentials to .env.local"""
    env_content = f"""VITE_SUPABASE_URL={supabase_url}
VITE_SUPABASE_ANON_KEY={anon_key}
"""
    
    env_file = ".env.local"
    if os.path.exists(env_file):
        response = input(f"\n⚠️  {env_file} already exists. Overwrite? (y/n): ")
        if response.lower() != 'y':
            print("Keeping existing file.")
            return
    
    with open(env_file, 'w') as f:
        f.write(env_content)
    
    print(f"\n✅ Saved credentials to {env_file}")
    print("\n⚠️  Remember to:")
    print("   1. Add .env.local to .gitignore (already done)")
    print("   2. Set these as environment variables in Vercel for production")

def main():
    print_header()
    
    print("Choose an option:")
    print("1. Create project via API (requires access token)")
    print("2. Manual setup guide (create via web dashboard)")
    print()
    
    choice = input("Enter choice (1 or 2): ").strip()
    
    if choice == "1":
        # API-based creation
        access_token = get_access_token()
        
        project_name = input("\nProject name (default: expense-manager): ").strip() or "expense-manager"
        db_password = getpass.getpass("Database password: ").strip()
        
        if not db_password:
            print("❌ Database password is required!")
            sys.exit(1)
        
        print("\nAvailable regions:")
        regions = [
            ("us-east-1", "US East (N. Virginia)"),
            ("us-west-1", "US West (N. California)"),
            ("eu-west-1", "EU West (Ireland)"),
            ("eu-west-2", "EU West (London)"),
            ("eu-west-3", "EU West (Paris)"),
            ("eu-central-1", "EU Central (Frankfurt)"),
            ("ap-northeast-1", "Asia Pacific (Tokyo)"),
            ("ap-southeast-1", "Asia Pacific (Singapore)"),
        ]
        
        for i, (code, name) in enumerate(regions, 1):
            print(f"  {i}. {name} ({code})")
        
        region_choice = input("\nSelect region (1-8, default: 1): ").strip() or "1"
        try:
            region = regions[int(region_choice) - 1][0]
        except (ValueError, IndexError):
            region = "us-east-1"
        
        project = create_project_via_api(access_token, project_name, db_password, region)
        
        if project:
            project_id = project.get("id")
            project_ref = project.get("ref")
            supabase_url = f"https://{project_ref}.supabase.co"
            
            print(f"\n📋 Project Details:")
            print(f"   ID: {project_id}")
            print(f"   URL: {supabase_url}")
            print(f"   Status: {project.get('status', 'unknown')}")
            
            print("\n⏳ Waiting for project to be ready...")
            print("   (This may take 2-3 minutes)")
            
            # Wait a bit and try to get API key
            import time
            time.sleep(5)
            
            anon_key = get_project_credentials(access_token, project_id)
            
            if anon_key:
                save_env_file(supabase_url, anon_key)
                print(f"\n✅ Setup complete!")
                print(f"\n📝 Next steps:")
                print(f"   1. Wait 2-3 minutes for project to fully initialize")
                print(f"   2. Go to https://supabase.com/dashboard/project/{project_ref}")
                print(f"   3. Run the SQL schema from supabase-schema.sql in SQL Editor")
                print(f"   4. Test locally: npm run dev")
            else:
                print(f"\n⚠️  Could not fetch API key automatically.")
                print(f"   Please get it manually from:")
                print(f"   https://supabase.com/dashboard/project/{project_ref}/settings/api")
                print(f"\n   Then create .env.local with:")
                print(f"   VITE_SUPABASE_URL={supabase_url}")
                print(f"   VITE_SUPABASE_ANON_KEY=<your-anon-key>")
    
    elif choice == "2":
        # Manual guide
        print("\n" + "=" * 60)
        print("📖 Manual Setup Guide")
        print("=" * 60)
        print()
        print("1. Go to https://supabase.com/dashboard")
        print("2. Click 'New Project'")
        print("3. Fill in project details")
        print("4. Get your credentials from Settings → API")
        print("5. Run: ./setup-supabase.sh")
        print()
        print("Or see QUICK_START.md for detailed instructions")
    
    else:
        print("Invalid choice. Exiting.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nCancelled by user.")
        sys.exit(0)
