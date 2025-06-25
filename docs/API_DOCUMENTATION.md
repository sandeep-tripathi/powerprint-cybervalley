
# PowerPrint API Documentation

## Overview

PowerPrint provides a comprehensive REST API for AI-powered 3D model generation from images. This documentation covers all available endpoints, authentication, and integration examples.

## Base URL

```
https://api.powerprint.dev
```

## Authentication

All API requests require an API key. Include your API key in the request headers:

```
Authorization: Bearer pp_your_api_key_here
```

### Getting Your API Key

1. Visit [PowerPrint Dashboard](https://powerprint.dev/dashboard)
2. Navigate to API Keys section
3. Generate a new API key
4. Copy and securely store your key

## API Endpoints

### 1. Check API Status

Get current API status and available models/instances.

**Endpoint:** `GET /api/status`

**Response:**
```json
{
  "version": "1.0.0",
  "status": "online",
  "supportedModels": [
    "powerprint-v2",
    "powerprint-pro"
  ],
  "supportedInstances": [
    "basic",
    "pro", 
    "enterprise"
  ]
}
```

### 2. Get Pipeline Settings

Retrieve current pipeline configuration.

**Endpoint:** `GET /api/settings`

**Response:**
```json
{
  "selectedModel": "powerprint-v2",
  "selectedInstance": "pro",
  "apiKey": "pp_***masked***"
}
```

### 3. Update Pipeline Settings

Configure AI model and compute instance for processing.

**Endpoint:** `PUT /api/settings`

**Request Body:**
```json
{
  "selectedModel": "powerprint-pro",
  "selectedInstance": "enterprise",
  "apiKey": "pp_your_api_key_here"
}
```

**Response:**
```json
{
  "success": true
}
```

### 4. Process Images

Convert images to 3D models using PowerPrint pipeline.

**Endpoint:** `POST /api/pipeline/process`

**Request Body:**
```json
{
  "images": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD..."
  ],
  "settings": {
    "selectedModel": "powerprint-v2",
    "selectedInstance": "pro",
    "apiKey": "pp_your_api_key_here"
  }
}
```

**Response:**
```json
{
  "success": true,
  "modelData": {
    "meshData": {
      "type": "powerprint_generated",
      "algorithm": "gaussian_splatting_to_mesh",
      "processingTime": 15000
    },
    "textureUrl": "https://storage.powerprint.dev/textures/abc123.jpg",
    "complexity": 5000,
    "vertices": 4000,
    "faces": 3000
  },
  "processingTime": 15000
}
```

## Error Handling

All errors return HTTP status codes with descriptive messages:

```json
{
  "error": "Invalid API key",
  "code": "UNAUTHORIZED",
  "message": "The provided API key is invalid or expired"
}
```

Common error codes:
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid API key)
- `429` - Rate Limited (too many requests)
- `500` - Server Error (processing failed)

## Rate Limits

- **Free Plan:** 50 requests/month
- **Pro Plan:** 1,000 requests/month
- **Enterprise:** Unlimited

## Model Types

### PowerPrint V2 (`powerprint-v2`)
- **Use Case:** General purpose 3D generation
- **Quality:** High
- **Speed:** Fast
- **Best For:** Product prototypes, visualization

### PowerPrint Pro (`powerprint-pro`)
- **Use Case:** Professional 3D printing
- **Quality:** Ultra-high
- **Speed:** Moderate
- **Best For:** Manufacturing, detailed models

## Compute Instances

### Basic
- **Processing Time:** 30-60 seconds
- **Model Complexity:** Up to 2,000 vertices
- **Best For:** Quick previews

### Pro
- **Processing Time:** 60-120 seconds
- **Model Complexity:** Up to 8,000 vertices
- **Best For:** Production models

### Enterprise
- **Processing Time:** 120-300 seconds
- **Model Complexity:** Up to 20,000 vertices
- **Best For:** High-detail manufacturing

## SDK Examples

### Python SDK

```python
import requests
import base64

class PowerPrintAPI:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://api.powerprint.dev"
        
    def process_image(self, image_path, model="powerprint-v2", instance="pro"):
        # Encode image
        with open(image_path, "rb") as f:
            image_data = base64.b64encode(f.read()).decode()
        
        # Prepare request
        payload = {
            "images": [f"data:image/jpeg;base64,{image_data}"],
            "settings": {
                "selectedModel": model,
                "selectedInstance": instance,
                "apiKey": self.api_key
            }
        }
        
        # Send request
        response = requests.post(
            f"{self.base_url}/api/pipeline/process",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        return response.json()

# Usage
api = PowerPrintAPI("pp_your_api_key")
result = api.process_image("my_image.jpg", "powerprint-pro", "enterprise")
print(f"Generated model with {result['modelData']['vertices']} vertices")
```

### JavaScript SDK

```javascript
class PowerPrintAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.powerprint.dev';
    }

    async processImage(imageFile, model = 'powerprint-v2', instance = 'pro') {
        // Convert image to base64
        const base64 = await this.fileToBase64(imageFile);
        
        const payload = {
            images: [`data:${imageFile.type};base64,${base64}`],
            settings: {
                selectedModel: model,
                selectedInstance: instance,
                apiKey: this.apiKey
            }
        };

        const response = await fetch(`${this.baseUrl}/api/pipeline/process`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        return response.json();
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });
    }
}

// Usage
const api = new PowerPrintAPI('pp_your_api_key');
const result = await api.processImage(imageFile, 'powerprint-pro', 'enterprise');
console.log(`Generated model with ${result.modelData.vertices} vertices`);
```

## Best Practices

### Image Guidelines
- **Format:** JPEG, PNG, WebP
- **Resolution:** 512x512 to 2048x2048
- **Quality:** High contrast, good lighting
- **Subject:** Clear object separation from background

### Performance Optimization
- Use appropriate model/instance for your use case
- Batch multiple images when possible
- Cache results to avoid re-processing
- Implement proper error handling and retries

### Security
- Store API keys securely (environment variables)
- Never expose API keys in client-side code
- Rotate API keys regularly
- Monitor usage and set up alerts

## Pricing

- **Platform Access:** €50 one-time
- **API Usage:** Included in platform access
- **Free Tier:** 50 requests/month
- **Additional Credits:** Available for purchase

## Support

- **Documentation:** [docs.powerprint.dev](https://docs.powerprint.dev)
- **Support Email:** support@powerprint.dev
- **Discord Community:** [discord.gg/powerprint](https://discord.gg/powerprint)
- **Status Page:** [status.powerprint.dev](https://status.powerprint.dev)
