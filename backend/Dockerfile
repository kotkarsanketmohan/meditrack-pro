# Stage 1: Build the application with dependency caching
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app/backend

# Copy the pom.xml and download dependencies (layer caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/backend/target/*.jar app.jar

# Expose port 8080 for Railway
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
