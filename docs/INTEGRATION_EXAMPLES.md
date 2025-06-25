
# PowerPrint Integration Examples

## Overview

This document provides practical examples for integrating PowerPrint into various workflows and applications.

## Web Application Integration

### React Component Example

```jsx
import React, { useState } from 'react';
import { PowerPrintAPI } from './powerprint-sdk';

const ImageTo3DConverter = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedConfig, setSelectedConfig] = useState('fast_preview');
  
  const api = new PowerPrintAPI(process.env.REACT_APP_POWERPRINT_API_KEY);
  
  const configurations = {
    fast_preview: { model: 'powerprint-v2', instance: 'basic' },
    high_quality: { model: 'powerprint-pro', instance: 'enterprise' },
    standard: { model: 'powerprint-v2', instance: 'pro' }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const config = configurations[selectedConfig];
      const result = await api.processImage(file, config.model, config.instance);
      setResult(result);
    } catch (error) {
      console.error('Processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="converter">
      <div className="config-selector">
        <label>Quality Setting:</label>
        <select 
          value={selectedConfig} 
          onChange={(e) => setSelectedConfig(e.target.value)}
        >
          <option value="fast_preview">Fast Preview</option>
          <option value="standard">Standard Quality</option>
          <option value="high_quality">High Quality</option>
        </select>
      </div>
      
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageUpload}
        disabled={isProcessing}
      />
      
      {isProcessing && <div>Processing image...</div>}
      
      {result && (
        <div className="result">
          <h3>3D Model Generated!</h3>
          <p>Vertices: {result.modelData.vertices.toLocaleString()}</p>
          <p>Faces: {result.modelData.faces.toLocaleString()}</p>
          <p>Processing Time: {(result.processingTime / 1000).toFixed(1)}s</p>
        </div>
      )}
    </div>
  );
};
```

## Backend Service Integration

### Node.js Express API

```javascript
const express = require('express');
const multer = require('multer');
const { PowerPrintAPI } = require('./powerprint-sdk');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const powerprint = new PowerPrintAPI(process.env.POWERPRINT_API_KEY);

// Configuration management
const configurations = new Map();
configurations.set('ecommerce', {
  model: 'powerprint-v2',
  instance: 'pro',
  description: 'Optimized for product visualization'
});

// Image processing endpoint
app.post('/api/generate-3d', upload.single('image'), async (req, res) => {
  try {
    const { configName = 'ecommerce' } = req.body;
    const config = configurations.get(configName);
    
    if (!config) {
      return res.status(400).json({ error: 'Invalid configuration' });
    }

    const result = await powerprint.processImageBuffer(
      req.file.buffer,
      config.model,
      config.instance
    );

    res.json({
      success: true,
      modelData: result.modelData,
      processingTime: result.processingTime,
      configuration: configName
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Configuration management endpoints
app.get('/api/configurations', (req, res) => {
  const configs = Array.from(configurations.entries()).map(([name, config]) => ({
    name,
    ...config
  }));
  res.json(configs);
});

app.post('/api/configurations', (req, res) => {
  const { name, model, instance, description } = req.body;
  configurations.set(name, { model, instance, description });
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('PowerPrint integration server running on port 3000');
});
```

## E-commerce Platform Integration

### Shopify App Example

```javascript
// shopify-powerprint-app.js
class ShopifyPowerPrintApp {
  constructor(apiKey, shopDomain) {
    this.powerprint = new PowerPrintAPI(apiKey);
    this.shopDomain = shopDomain;
    this.configs = {
      product_preview: { model: 'powerprint-v2', instance: 'basic' },
      marketing_material: { model: 'powerprint-pro', instance: 'pro' }
    };
  }

  async generateProductModel(productId, imageUrl, configType = 'product_preview') {
    try {
      // Download product image
      const response = await fetch(imageUrl);
      const imageBlob = await response.blob();
      
      // Convert to base64
      const base64 = await this.blobToBase64(imageBlob);
      
      // Process with PowerPrint
      const config = this.configs[configType];
      const result = await this.powerprint.processBase64Image(
        base64,
        config.model,
        config.instance
      );

      // Save 3D model data to product metafields
      await this.saveModelToProduct(productId, result.modelData);
      
      return result;
    } catch (error) {
      console.error(`Failed to generate 3D model for product ${productId}:`, error);
      throw error;
    }
  }

  async saveModelToProduct(productId, modelData) {
    // Save 3D model metadata to Shopify product
    const metafield = {
      metafield: {
        namespace: 'powerprint',
        key: '3d_model_data',
        value: JSON.stringify(modelData),
        type: 'json'
      }
    };

    // Use Shopify Admin API to save metafield
    await fetch(`https://${this.shopDomain}.myshopify.com/admin/api/2023-10/products/${productId}/metafields.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN
      },
      body: JSON.stringify(metafield)
    });
  }

  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

// Usage
const app = new ShopifyPowerPrintApp(
  process.env.POWERPRINT_API_KEY,
  'myshop'
);

// Webhook handler for new products
app.on('product/create', async (product) => {
  if (product.images.length > 0) {
    await app.generateProductModel(
      product.id,
      product.images[0].src,
      'product_preview'
    );
  }
});
```

## Manufacturing Workflow Integration

### CAD Processing Pipeline

```python
import os
import json
from pathlib import Path
from powerprint_sdk import PowerPrintAPI, ConfigurationManager

class ManufacturingPipeline:
    def __init__(self):
        self.api = PowerPrintAPI(os.getenv('POWERPRINT_API_KEY'))
        self.config_manager = ConfigurationManager()
        
        # Manufacturing-specific configurations
        self.configs = {
            'prototype': {
                'model': 'powerprint-v2',
                'instance': 'pro',
                'tolerance': 'standard'
            },
            'production': {
                'model': 'powerprint-pro',
                'instance': 'enterprise',
                'tolerance': 'tight'
            },
            'quality_check': {
                'model': 'powerprint-pro',
                'instance': 'enterprise',
                'tolerance': 'precise'
            }
        }
    
    def process_design_images(self, project_id, image_paths, stage='prototype'):
        """Process design images for different manufacturing stages"""
        config = self.configs[stage]
        results = []
        
        for image_path in image_paths:
            try:
                # Process image
                result = self.api.process_image(
                    image_path,
                    config['model'],
                    config['instance']
                )
                
                # Add manufacturing metadata
                result['manufacturing'] = {
                    'stage': stage,
                    'tolerance': config['tolerance'],
                    'project_id': project_id,
                    'print_ready': self.assess_print_readiness(result)
                }
                
                results.append(result)
                
                # Save to project directory
                self.save_model_data(project_id, result, stage)
                
            except Exception as e:
                print(f"Failed to process {image_path}: {e}")
                continue
        
        return results
    
    def assess_print_readiness(self, model_data):
        """Assess if model is ready for 3D printing"""
        vertices = model_data['modelData']['vertices']
        complexity = model_data['modelData']['complexity']
        
        # Basic printability checks
        return {
            'vertex_count_ok': vertices >= 1000 and vertices <= 50000,
            'complexity_ok': complexity >= 1000,
            'recommended_layer_height': self.calculate_layer_height(complexity),
            'support_needed': self.check_support_requirements(model_data)
        }
    
    def calculate_layer_height(self, complexity):
        """Calculate recommended layer height based on model complexity"""
        if complexity > 8000:
            return 0.1  # Fine detail
        elif complexity > 4000:
            return 0.2  # Standard
        else:
            return 0.3  # Draft
    
    def check_support_requirements(self, model_data):
        """Analyze if support structures are needed"""
        # Simplified analysis - in reality would analyze geometry
        return model_data['modelData']['complexity'] > 5000
    
    def save_model_data(self, project_id, result, stage):
        """Save model data to project directory"""
        project_dir = Path(f"projects/{project_id}")
        project_dir.mkdir(parents=True, exist_ok=True)
        
        filename = f"{stage}_model_{result['modelData']['complexity']}.json"
        filepath = project_dir / filename
        
        with open(filepath, 'w') as f:
            json.dump(result, f, indent=2)
    
    def generate_manufacturing_report(self, project_id):
        """Generate comprehensive manufacturing report"""
        project_dir = Path(f"projects/{project_id}")
        model_files = list(project_dir.glob("*.json"))
        
        report = {
            'project_id': project_id,
            'models_processed': len(model_files),
            'stages': [],
            'recommendations': []
        }
        
        for model_file in model_files:
            with open(model_file) as f:
                model_data = json.load(f)
                
                stage_info = {
                    'stage': model_data['manufacturing']['stage'],
                    'complexity': model_data['modelData']['complexity'],
                    'print_ready': model_data['manufacturing']['print_ready'],
                    'processing_time': model_data['processingTime']
                }
                report['stages'].append(stage_info)
        
        # Generate recommendations
        if any(not stage['print_ready']['vertex_count_ok'] for stage in report['stages']):
            report['recommendations'].append("Consider mesh optimization for better printability")
        
        if any(stage['print_ready']['support_needed'] for stage in report['stages']):
            report['recommendations'].append("Support structures recommended for complex geometries")
        
        return report

# Usage example
pipeline = ManufacturingPipeline()

# Process prototype images
prototype_results = pipeline.process_design_images(
    project_id="PROJ_001",
    image_paths=["concept1.jpg", "concept2.jpg"],
    stage="prototype"
)

# Process for production
production_results = pipeline.process_design_images(
    project_id="PROJ_001", 
    image_paths=["final_design.jpg"],
    stage="production"
)

# Generate report
report = pipeline.generate_manufacturing_report("PROJ_001")
print(json.dumps(report, indent=2))
```

## Mobile App Integration

### React Native Example

```jsx
import React, { useState } from 'react';
import { View, Button, Image, Text, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { PowerPrintAPI } from './powerprint-sdk-mobile';

const Mobile3DGenerator = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(null);
  
  const api = new PowerPrintAPI(process.env.POWERPRINT_API_KEY);

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: true,
    };

    launchImageLibrary(options, (response) => {
      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0]);
      }
    });
  };

  const generate3DModel = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await api.processBase64Image(
        selectedImage.base64,
        'powerprint-v2',
        'pro'
      );
      
      setResult(result);
      Alert.alert('Success', '3D model generated successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Select Image" onPress={selectImage} />
      
      {selectedImage && (
        <Image 
          source={{ uri: selectedImage.uri }} 
          style={{ width: 200, height: 200, marginVertical: 10 }}
        />
      )}
      
      <Button 
        title={isProcessing ? "Processing..." : "Generate 3D Model"}
        onPress={generate3DModel}
        disabled={isProcessing || !selectedImage}
      />
      
      {result && (
        <View style={{ marginTop: 20 }}>
          <Text>Model Generated!</Text>
          <Text>Vertices: {result.modelData.vertices}</Text>
          <Text>Processing Time: {result.processingTime}ms</Text>
        </View>
      )}
    </View>
  );
};

export default Mobile3DGenerator;
```

## Error Handling and Monitoring

### Comprehensive Error Handling

```javascript
class RobustPowerPrintIntegration {
  constructor(apiKey) {
    this.api = new PowerPrintAPI(apiKey);
    this.retryCount = 3;
    this.retryDelay = 1000; // 1 second
  }

  async processWithRetry(imageData, config, attempt = 1) {
    try {
      return await this.api.processImage(
        imageData,
        config.model,
        config.instance
      );
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      
      // Check if we should retry
      if (attempt < this.retryCount && this.isRetryableError(error)) {
        console.log(`Retrying in ${this.retryDelay}ms...`);
        await this.delay(this.retryDelay);
        return this.processWithRetry(imageData, config, attempt + 1);
      }
      
      // Log error for monitoring
      this.logError(error, { imageData, config, attempt });
      throw error;
    }
  }

  isRetryableError(error) {
    // Define which errors are worth retrying
    const retryableErrors = [
      'RATE_LIMITED',
      'TEMPORARY_UNAVAILABLE',
      'TIMEOUT'
    ];
    
    return retryableErrors.includes(error.code) || 
           error.status >= 500; // Server errors
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  logError(error, context) {
    // Send to monitoring service (e.g., Sentry, LogRocket)
    console.error('PowerPrint processing failed:', {
      error: error.message,
      code: error.code,
      context,
      timestamp: new Date().toISOString()
    });
  }
}
```

This comprehensive documentation covers all aspects of PowerPrint integration, from basic API usage to complex manufacturing workflows, providing developers with practical examples for various use cases.
