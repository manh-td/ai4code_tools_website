# Use the official Golang image as the base image
FROM golang:1.23.0-bullseye AS builder

# Set environment variables
ENV CGO_ENABLED=1
ENV GO111MODULE=on

# Install necessary packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /go/src/github.com/gohugoio/hugo

# Clone the Hugo repository
RUN git clone https://github.com/gohugoio/hugo.git .

# Checkout the latest release tag
RUN git checkout $(git describe --tags `git rev-list --tags --max-count=1`)

# Build the extended version of Hugo
RUN go install -tags extended

# Create a minimal image for the Hugo binary
FROM debian:bullseye-slim

# Install necessary packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy the Hugo binary from the builder stage
COPY --from=builder /go/bin/hugo /usr/local/bin/hugo

# Verify the installation
RUN hugo version

# Set the working directory
WORKDIR /site

# Expose the default Hugo port
EXPOSE 1313

# Set the entrypoint to the Hugo binary
ENTRYPOINT ["hugo"]
