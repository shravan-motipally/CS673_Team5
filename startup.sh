#!/bin/bash

pushd webapp
echo "Installing assets..."
npm install
echo "Starting webpack on 3000"
npm start &
popd

pushd api/java
echo "Installing dependencies..."
mvn clean install
echo "Starting answering service on 8080"
mvn spring-boot:run &
popd

