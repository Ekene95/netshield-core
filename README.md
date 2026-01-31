# Spring Web App - NetShield Test Project

A simple Spring Boot web application designed to test NetShield secrets detection in a real-world Java project.

## Features

- 🌐 **Web UI** - Thymeleaf templates with styled pages
- 🔌 **REST API** - JSON endpoints for testing
- ⚙️ **Spring Boot** - Modern Java web framework
- 🛡️ **NetShield** - Integrated secrets detection
- ✅ **Tests** - JUnit tests for endpoints

## Project Structure

```
spring-web-app/
├── pom.xml                                    # Maven configuration
├── src/
│   ├── main/
│   │   ├── java/com/example/webapp/
│   │   │   ├── Application.java              # Spring Boot main class
│   │   │   ├── HomeController.java           # Web page controller
│   │   │   ├── ApiController.java            # REST API endpoints
│   │   │   └── AppConfig.java                # Configuration
│   │   └── resources/
│   │       ├── application.properties        # App config (uses env vars)
│   │       └── templates/
│   │           ├── index.html                # Homepage
│   │           └── about.html                # About page
│   └── test/
│       └── java/com/example/webapp/
│           └── ApplicationTests.java         # Tests
├── .github/
│   ├── workflows/
│   │   ├── security.yml                      # NetShield workflow
│   │   └── build.yml                         # Maven build workflow
│   └── actions/
│       └── netshield/                        # NetShield action (local)
└── README.md
```

## Quick Start

### 1. Build NetShield

```bash
cd .github/actions/netshield
npm install
npm run build
cd ../../..
```

### 2. Run the Application Locally

```bash
# Build the project
mvn clean install

# Run the app
mvn spring-boot:run

# Or run the JAR
java -jar target/spring-web-app-1.0.0.jar
```

Visit: http://localhost:8080

### 3. Available Endpoints

**Web Pages:**
- `http://localhost:8080/` - Homepage
- `http://localhost:8080/about` - About page

**REST API:**
- `GET http://localhost:8080/api/status` - Application status
- `GET http://localhost:8080/api/hello?name=YourName` - Greeting
- `POST http://localhost:8080/api/echo` - Echo JSON payload

### 4. Run Tests

```bash
mvn test
```

## Testing NetShield

### Setup Repository

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository, then:
git remote add origin https://github.com/YOUR-USERNAME/spring-web-app.git
git branch -M main
git push -u origin main
```

### Create Test Branch with Secrets

```bash
git checkout -b test-secrets
```

**Add test secrets to `src/main/resources/application.properties`:**

```properties
# DANGER: Test secrets - NetShield should catch these!
aws.access.key=AKIA4EXAMPLE7TESTKEY9
aws.secret.key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
database.password=SuperSecret123!
api.secret.token=sk_live_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
stripe.key=sk_test_4eC39HqLyjWDarjtT1zdp7dc
github.token=ghp_1234567890abcdefGHIJKLMNOPQRSTUVWXYZ123456
```

**Or run this command:**

```bash
cat >> src/main/resources/application.properties << 'EOF'

# DANGER: Test secrets - NetShield should catch these!
aws.access.key=AKIA4EXAMPLE7TESTKEY9
aws.secret.key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
database.password=SuperSecret123!
api.secret.token=sk_live_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
EOF
```

### Push and Create PR

```bash
git add src/main/resources/application.properties
git commit -m "Test: Add secrets for NetShield detection"
git push origin test-secrets
```

**Note:** If GitHub's push protection blocks this:
1. Click the provided URL
2. Select "Allow me to push this secret" (it's for testing)
3. Push again

### Create Pull Request

1. Go to GitHub
2. Click "Compare & pull request"
3. Create the PR
4. Watch NetShield fail ❌

**Expected Result:**
```
❌ NetShield blocked: 4 secret(s) detected

File: src/main/resources/application.properties
Line: 35
Rule: aws-access-token

File: src/main/resources/application.properties
Line: 36
Rule: aws-secret-key
...
```

### Remove Secrets and Verify Pass

```bash
git checkout test-secrets

# Remove the test secrets (last 7 lines)
head -n -7 src/main/resources/application.properties > temp && mv temp src/main/resources/application.properties

git add src/main/resources/application.properties
git commit -m "Remove test secrets"
git push
```

Watch NetShield pass ✅

## Testing Checklist

- [ ] NetShield built (`dist/index.js` exists)
- [ ] Repository pushed to GitHub
- [ ] PR created with secrets
- [ ] NetShield fails CI ❌
- [ ] Annotations show on code lines
- [ ] Secrets removed
- [ ] NetShield passes CI ✅
- [ ] Maven build also passes ✅

## Common Mistakes to Avoid

❌ **DON'T hardcode:**
```properties
database.password=MyPassword123
api.key=sk_live_abc123xyz
```

✅ **DO use environment variables:**
```properties
database.password=${DB_PASSWORD}
api.key=${API_KEY}
```

✅ **DO use Spring's default syntax:**
```properties
# Fallback to empty if env var not set
database.password=${DB_PASSWORD:}
```

## Development

### Hot Reload

Spring Boot DevTools is included for automatic restarts during development:

```bash
mvn spring-boot:run
```

Edit code → app restarts automatically

### Add New Endpoints

Edit `ApiController.java` or `HomeController.java` and add methods with Spring annotations.

### Customize Templates

Edit HTML files in `src/main/resources/templates/`. Thymeleaf provides server-side rendering.

## Troubleshooting

### NetShield doesn't run

```bash
# Check workflow file
cat .github/workflows/security.yml

# Verify NetShield is built
ls -la .github/actions/netshield/dist/index.js

# Rebuild if needed
cd .github/actions/netshield
npm install && npm run build
cd ../../..
git add .github/actions/netshield/dist/
git commit -m "Build NetShield"
git push
```

### Application won't start

```bash
# Clean and rebuild
mvn clean install

# Check Java version (needs 17+)
java -version

# Run with debug
mvn spring-boot:run -X
```

### Tests fail

```bash
# Run specific test
mvn test -Dtest=ApplicationTests

# Skip tests during build
mvn clean install -DskipTests
```

## Next Steps

1. **Enable Branch Protection:**
   - Settings → Branches → Add rule for `main`
   - Require "NetShield Secrets Scan"
   - No PR with secrets can merge

2. **Add More Features:**
   - Database integration (PostgreSQL, MySQL)
   - User authentication
   - File uploads
   - More API endpoints

3. **Deploy:**
   - Heroku
   - AWS Elastic Beanstalk
   - Docker container
   - Cloud Run

## License

MIT
