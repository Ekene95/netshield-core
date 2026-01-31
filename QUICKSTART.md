# Quick Start - 5 Minute NetShield Test

Get NetShield running in 5 minutes with this Spring Boot web app.

## Step 1: Build NetShield (1 minute)

```bash
cd spring-web-app
cd .github/actions/netshield
npm install && npm run build
cd ../../..
```

Verify:
```bash
ls -la .github/actions/netshield/dist/index.js
# Should show a ~1-2MB file
```

## Step 2: Push to GitHub (2 minutes)

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub at: https://github.com/new
# Name it: spring-web-app
# Don't add README or .gitignore

# Push
git remote add origin https://github.com/YOUR-USERNAME/spring-web-app.git
git branch -M main
git push -u origin main
```

## Step 3: Test with Secrets (2 minutes)

```bash
# Create test branch
git checkout -b test-secrets

# Add fake secrets
echo '
# DANGER: Test secrets
aws.access.key=AKIA4EXAMPLE7TESTKEY9
database.password=SuperSecret123!
' >> src/main/resources/application.properties

# Commit
git add src/main/resources/application.properties
git commit -m "Test: Add secrets"

# Push (GitHub might block - follow URL to allow)
git push origin test-secrets
```

## Step 4: Create PR and Watch

1. Go to: `https://github.com/YOUR-USERNAME/spring-web-app/pulls`
2. Click "Compare & pull request"
3. Create the PR
4. Watch "NetShield Secrets Scan" run
5. See it FAIL ❌ with annotations on the secret lines

## Step 5: Fix and Verify

```bash
# Remove secrets
git checkout test-secrets
head -n -4 src/main/resources/application.properties > temp && mv temp src/main/resources/application.properties

# Push fix
git add src/main/resources/application.properties
git commit -m "Remove secrets"
git push
```

Watch NetShield PASS ✅

---

## Bonus: Run the App Locally

```bash
# In spring-web-app directory
mvn spring-boot:run
```

Visit: http://localhost:8080

You'll see a nice web page with:
- Homepage with gradient background
- About page
- REST API endpoints

---

## Automated Setup

Or just run the setup script:

```bash
./setup.sh
```

It does all the steps above automatically!

---

## What You Just Tested

✅ NetShield catches secrets in Java `.properties` files  
✅ NetShield catches secrets in Java source code  
✅ CI fails when secrets detected  
✅ PR shows inline annotations  
✅ CI passes when secrets removed  
✅ Works with Spring Boot projects  

## Next: Make it Mandatory

Settings → Branches → Add rule for `main`:
- ✅ Require status checks to pass
- ✅ Check: "NetShield Secrets Scan"

Now no one can merge PRs with secrets!
