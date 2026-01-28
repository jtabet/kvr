# KVR - Key-Value REST API

A lightweight, container-ready key-value store with a simple REST interface. Perfect for microservice architectures where you need zero-configuration data storage with minimal overhead.

## 🚀 Features

- **Zero Configuration** - Run it out of the box, no database setup required
- **RESTful API** - Simple, intuitive HTTP endpoints for data operations
- **Lightweight** - Minimal footprint ideal for containerized deployments
- **Docker Ready** - Pre-built Docker image available on GitHub Container Registry
- **Fast** - In-memory storage for near-instant access times

## 📦 Quick Start

### Using Docker

```bash
# Pull and run the image
docker run -d -p 3000:3000 ghcr.io/jtabet/kvr:latest

# Or build locally
git clone https://github.com/jtabet/kvr.git
cd kvr
docker build -t kvr .
docker run -d -p 3000:3000 kvr
```

### Using Node.js

```bash
# Clone the repository
git clone https://github.com/jtabet/kvr.git
cd kvr

# Install dependencies
npm install

# Start the server
npm start
```

The server will start on port 3000 (configurable via `PORT` environment variable).

## 📖 API Reference

### Store a Value

**PUT** `/:key`

Stores or updates a value for the specified key.

**Request:**
```bash
curl -X PUT http://localhost:3000/session-123 \
  -H "Content-Type: text/plain" \
  -d "active"
```

**Response:**
```
active
```

### Retrieve a Value

**GET** `/:key`

Retrieves the value associated with the specified key.

**Request:**
```bash
curl http://localhost:3000/session-123
```

**Response:**
```
active
```

If the key doesn't exist:
```json
{
  "error": "Key not found"
}
```

HTTP Status: `404 Not Found`

### Delete a Key

**DELETE** `/:key`

Deletes the specified key and its value.

**Request:**
```bash
curl -X DELETE http://localhost:3000/session-123
```

**Response:**
```json
{
  "deleted": "session-123"
}
```

### Clear All Keys

**DELETE** `/`

Removes all keys from the store.

**Request:**
```bash
curl -X DELETE http://localhost:3000/
```

**Response:**
```json
{
  "deleted": "all"
}
```

## 💡 Common Use Cases

### Session Storage

Store temporary session data between service calls:

```bash
# Store session state
curl -X PUT http://localhost:3000/session-abc123 \
  -d '{"userId": 456, "authToken": "xyz789"}'

# Retrieve session state
curl http://localhost:3000/session-abc123
```

### Feature Flags

Quickly toggle features without redeploying services:

```bash
# Enable a feature
curl -X PUT http://localhost:3000/feature/new-ui -d "enabled"

# Check feature status in your service
curl http://localhost:3000/feature/new-ui
```

### Temporary Cache

Cache computed results or API responses:

```bash
# Cache expensive computation result
curl -X PUT http://localhost:3000/cache/report-daily \
  -d '{"data": [...], "timestamp": 1234567890}'

# Retrieve cached result
curl http://localhost:3000/cache/report-daily
```

### Service Coordination

Coordinate between microservices with shared state:

```bash
# Service A sets a lock
curl -X PUT http://localhost:3000/locks/process-456 -d "locked"

# Service B checks lock status
curl http://localhost:3000/locks/process-456

# Service A releases lock
curl -X DELETE http://localhost:3000/locks/process-456
```

## 🐳 Deployment

### Environment Variables

- `PORT` - Server port (default: `3000`)

### Docker Compose Example

```yaml
version: '3.8'
services:
  kvr:
    image: ghcr.io/jtabet/kvr:latest
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
    restart: unless-stopped
```

### Kubernetes Example

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kvr
spec:
  replicas: 1
  selector:
    matchLabels:
      app: kvr
  template:
    metadata:
      labels:
        app: kvr
    spec:
      containers:
      - name: kvr
        image: ghcr.io/jtabet/kvr:latest
        ports:
        - containerPort: 3000
        env:
        - name: PORT
          value: "3000"
---
apiVersion: v1
kind: Service
metadata:
  name: kvr
spec:
  selector:
    app: kvr
  ports:
  - protocol: TCP
    port: 3000
    targetPort: 3000
```

### Health Checks

Since KVR is a simple key-value store, ensure the service is running by making a test request:

```bash
# Store a health check key
curl -X PUT http://localhost:3000/health -d "ok"

# Verify it's accessible
curl http://localhost:3000/health
```

## 🔧 Development

### Local Setup

```bash
# Clone the repository
git clone https://github.com/jtabet/kvr.git
cd kvr

# Install dependencies
npm install

# Start in development mode
npm start
```

### Building the Docker Image

```bash
docker build -t kvr:latest .
```

### Running Tests

```bash
# Currently, manual testing is recommended using curl:
curl -X PUT http://localhost:3000/test-key -d "test-value"
curl http://localhost:3000/test-key
curl -X DELETE http://localhost:3000/test-key
```

## 📝 API Usage Examples

### Node.js

```javascript
const axios = require('axios');

const baseURL = 'http://localhost:3000';

// Store a value
await axios.put(`${baseURL}/config/api-key`, 'secret-key-123');

// Get a value
const response = await axios.get(`${baseURL}/config/api-key`);
console.log(response.data); // 'secret-key-123'

// Delete a key
await axios.delete(`${baseURL}/config/api-key`);
```

### Python

```python
import requests

base_url = 'http://localhost:3000'

# Store a value
requests.put(f'{base_url}/config/api-key', data='secret-key-123')

# Get a value
response = requests.get(f'{base_url}/config/api-key')
print(response.text)  # 'secret-key-123'

# Delete a key
requests.delete(f'{base_url}/config/api-key')
```

### Go

```go
package main

import (
    "fmt"
    "io/ioutil"
    "net/http"
)

func main() {
    baseURL := "http://localhost:3000"

    // Store a value
    req, _ := http.NewRequest("PUT", baseURL+"/config/api-key", strings.NewReader("secret-key-123"))
    client := &http.Client{}
    client.Do(req)

    // Get a value
    resp, _ := http.Get(baseURL + "/config/api-key")
    body, _ := ioutil.ReadAll(resp.Body)
    fmt.Println(string(body)) // 'secret-key-123'

    // Delete a key
    req, _ = http.NewRequest("DELETE", baseURL+"/config/api-key", nil)
    client.Do(req)
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/jtabet/kvr)
- [Docker Image](https://github.com/jtabet/kvr/pkgs/container/kvr)
- [Report Issues](https://github.com/jtabet/kvr/issues)

---

**KVR** - Keep it Simple, Keep it Fast, Keep it Running.