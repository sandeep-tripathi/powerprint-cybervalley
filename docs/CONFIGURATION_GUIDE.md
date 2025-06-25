
# PowerPrint Configuration Management Guide

## Overview

PowerPrint's Configuration Manager allows you to save, load, and manage different AI model and compute instance combinations for various use cases.

## Features

### Save Configurations
Store your current model and instance selection with a descriptive name and optional description.

### Load Configurations  
Quickly apply saved settings to switch between different processing modes.

### Export/Import
Export configurations as JSON files for backup or sharing with team members.

### Configuration History
Track when configurations were created and last used.

## Getting Started

### 1. Access Configuration Manager

The Configuration Manager is available in the main generation interface, located below the Model Selector and Compute Instance dropdowns.

### 2. Save Your First Configuration

1. Select your desired AI model (e.g., "PowerPrint Pro")
2. Choose a compute instance (e.g., "Enterprise")
3. Click "Save Current" button
4. Enter a descriptive name (e.g., "High-Quality Production")
5. Add an optional description
6. Click "Save Configuration"

### 3. Load a Configuration

1. Browse your saved configurations in the Configuration Manager
2. Click "Load Configuration" on the desired setting
3. Your model and instance selections will be updated automatically

## Configuration Examples

### High-Quality Production
- **Model:** PowerPrint Pro
- **Instance:** Enterprise
- **Use Case:** Final production models for 3D printing
- **Processing Time:** 2-5 minutes
- **Output Quality:** Ultra-high detail

### Fast Preview
- **Model:** PowerPrint V2
- **Instance:** Pro
- **Use Case:** Quick model previews and iterations
- **Processing Time:** 1-2 minutes
- **Output Quality:** High detail

### Budget Processing
- **Model:** PowerPrint V2
- **Instance:** Basic
- **Use Case:** Cost-effective processing for simple models
- **Processing Time:** 30-60 seconds
- **Output Quality:** Standard detail

## Configuration Management

### Naming Conventions

Use descriptive names that indicate the purpose:
- `Production_HighDetail`
- `Preview_Fast`
- `Architecture_UltraHigh`
- `Prototype_Standard`

### Descriptions

Include relevant details:
- Intended use case
- Expected quality level
- Processing time expectations
- Any special considerations

### Organization Tips

- Create configurations for different project types
- Use consistent naming across your team
- Regular cleanup of unused configurations
- Export important configurations for backup

## API Integration

### Programmatic Configuration Management

You can manage configurations programmatically using the PowerPrint API:

```python
import requests

class ConfigurationManager:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://api.powerprint.dev"
    
    def apply_configuration(self, config_name):
        """Apply a saved configuration by name"""
        # Load configuration from your storage
        config = self.load_configuration(config_name)
        
        # Apply to PowerPrint API
        response = requests.put(
            f"{self.base_url}/api/settings",
            json={
                "selectedModel": config["selectedModel"],
                "selectedInstance": config["selectedInstance"],
                "apiKey": self.api_key
            }
        )
        return response.json()
    
    def process_with_config(self, images, config_name):
        """Process images using a specific configuration"""
        config = self.load_configuration(config_name)
        
        payload = {
            "images": images,
            "settings": {
                "selectedModel": config["selectedModel"],
                "selectedInstance": config["selectedInstance"],
                "apiKey": self.api_key
            }
        }
        
        response = requests.post(
            f"{self.base_url}/api/pipeline/process",
            json=payload
        )
        return response.json()

# Usage
manager = ConfigurationManager("pp_your_api_key")
result = manager.process_with_config(["base64_image_data"], "high_quality_production")
```

### Configuration JSON Format

```json
{
  "id": "uuid-string",
  "name": "High-Quality Production",
  "description": "Best quality for final production models",
  "selectedModel": "powerprint-pro",
  "selectedInstance": "enterprise",
  "createdAt": "2024-01-15T10:30:00Z",
  "lastUsed": "2024-01-20T14:45:00Z",
  "version": "1.0"
}
```

## Team Collaboration

### Sharing Configurations

1. Export configuration from one team member
2. Share the JSON file securely
3. Import on other team members' accounts
4. Ensure consistent processing across the team

### Configuration Standards

Establish team standards for:
- Naming conventions
- Quality levels for different project phases
- Default configurations for new projects
- Review and approval process for new configurations

## Best Practices

### Performance Optimization
- Use appropriate configurations for each stage of your workflow
- Cache frequently used configurations locally
- Monitor processing times and adjust as needed

### Quality Management
- Test configurations with sample images first
- Document expected output quality for each configuration
- Regular review and optimization of configurations

### Cost Management
- Use lower-cost configurations for initial iterations
- Reserve high-cost configurations for final production
- Monitor API usage across different configurations

## Troubleshooting

### Configuration Not Loading
- Check that both model and instance are still available
- Verify API key is valid and has sufficient credits
- Ensure configuration file format is correct

### Performance Issues
- Consider switching to a lower instance tier
- Check current API status and load
- Verify image quality and format

### Quality Issues
- Upgrade to higher model/instance combination
- Review image input guidelines
- Check processing parameters

## Support

For configuration-related issues:
- Check the API status page
- Review error logs in the browser console
- Contact support with configuration details
- Join the community Discord for tips and best practices
