package com.example.webapp;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Value("${app.name:Spring Web App}")
    private String appName;

    @Value("${app.version:1.0.0}")
    private String appVersion;

    // External service configurations
    @Value("${external.api.url:https://api.example.com}")
    private String externalApiUrl;

    @Value("${external.api.key:${API_KEY:}}")
    private String externalApiKey;

    // Database configurations (should use environment variables)
    @Value("${spring.datasource.url:jdbc:h2:mem:testdb}")
    private String databaseUrl;

    @Value("${spring.datasource.username:${DB_USERNAME:sa}}")
    private String databaseUsername;

    @Value("${spring.datasource.password:${DB_PASSWORD:}}")
    private String databasePassword;

    public String getAppName() {
        return appName;
    }

    public String getAppVersion() {
        return appVersion;
    }

    public String getExternalApiUrl() {
        return externalApiUrl;
    }

    public String getDatabaseUrl() {
        return databaseUrl;
    }

    // NOTE: Never log or expose sensitive configuration values
}
