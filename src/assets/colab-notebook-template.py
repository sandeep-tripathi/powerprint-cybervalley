
"""
PowerPrint 2D to 3D Conversion - Google Colab Integration Template

This notebook provides a template for running 2D to 3D mesh conversion
in Google Colab and exposing it via ngrok for the PowerPrint web app.

Usage:
1. Run this notebook in Google Colab
2. Install required dependencies
3. Start the Flask server with ngrok tunnel
4. Copy the ngrok URL to your PowerPrint web app
"""

# Install required packages
import subprocess
import sys

def install_packages():
    packages = [
        'flask',
        'flask-cors',
        'numpy',
        'opencv-python',
        'pillow',
        'scipy',
        'scikit-image'
    ]
    
    for package in packages:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])

# Advanced 2D to 3D conversion functions
import numpy as np
import cv2
from PIL import Image
import base64
import io
from flask import Flask, request, jsonify
from flask_cors import CORS

def advanced_2d_to_3d_conversion(image_data, options):
    """
    Advanced 2D to 3D mesh conversion using computer vision techniques
    """
    # Decode base64 image
    image_bytes = base64.b64decode(image_data)
    image = Image.open(io.BytesIO(image_bytes))
    image_array = np.array(image)
    
    # Convert to grayscale for depth estimation
    if len(image_array.shape) == 3:
        gray = cv2.cvtColor(image_array, cv2.COLOR_RGB2GRAY)
    else:
        gray = image_array
    
    # Enhanced depth estimation using gradients and edge detection
    height, width = gray.shape
    resolution = options.get('resolution', 64)
    extrusion_height = options.get('extrusionHeight', 0.2)
    
    # Resize for processing
    resized = cv2.resize(gray, (resolution, resolution))
    
    # Create depth map using advanced techniques
    depth_map = create_advanced_depth_map(resized)
    
    # Generate mesh from depth map
    vertices, faces, normals, uvs = generate_mesh_from_depth(
        depth_map, extrusion_height, options
    )
    
    return {
        'vertices': vertices.tolist(),
        'faces': faces.tolist(),
        'normals': normals.tolist(),
        'uvCoordinates': uvs.tolist(),
        'boundingBox': calculate_bounding_box(vertices)
    }

def create_advanced_depth_map(image):
    """
    Create a depth map using advanced computer vision techniques
    """
    # Gaussian blur for smoothing
    blurred = cv2.GaussianBlur(image, (5, 5), 0)
    
    # Edge detection
    edges = cv2.Canny(blurred, 50, 150)
    
    # Distance transform for depth estimation
    dist_transform = cv2.distanceTransform(255 - edges, cv2.DIST_L2, 5)
    
    # Normalize depth values
    depth_map = dist_transform / np.max(dist_transform)
    
    # Apply brightness-based depth enhancement
    brightness_depth = blurred.astype(float) / 255.0
    
    # Combine distance and brightness information
    combined_depth = 0.7 * depth_map + 0.3 * brightness_depth
    
    return combined_depth

def generate_mesh_from_depth(depth_map, extrusion_height, options):
    """
    Generate 3D mesh from depth map
    """
    height, width = depth_map.shape
    vertices = []
    faces = []
    uvs = []
    
    # Generate vertices
    for y in range(height):
        for x in range(width):
            # Normalize coordinates
            norm_x = (x / (width - 1)) - 0.5
            norm_y = (y / (height - 1)) - 0.5
            depth = depth_map[y, x] * extrusion_height
            
            vertices.append([norm_x, norm_y, depth])
            uvs.append([x / (width - 1), 1.0 - (y / (height - 1))])
    
    # Generate faces (triangles)
    for y in range(height - 1):
        for x in range(width - 1):
            # Create quad as two triangles
            v1 = y * width + x
            v2 = y * width + (x + 1)
            v3 = (y + 1) * width + x
            v4 = (y + 1) * width + (x + 1)
            
            # Triangle 1
            faces.append([v1, v2, v3])
            # Triangle 2
            faces.append([v2, v4, v3])
    
    vertices = np.array(vertices, dtype=np.float32)
    faces = np.array(faces, dtype=np.uint32)
    uvs = np.array(uvs, dtype=np.float32)
    
    # Calculate normals
    normals = calculate_normals(vertices, faces)
    
    return vertices, faces, normals, uvs

def calculate_normals(vertices, faces):
    """
    Calculate vertex normals for the mesh
    """
    normals = np.zeros_like(vertices)
    
    for face in faces:
        v1, v2, v3 = vertices[face]
        
        # Calculate face normal
        edge1 = v2 - v1
        edge2 = v3 - v1
        normal = np.cross(edge1, edge2)
        
        # Normalize
        length = np.linalg.norm(normal)
        if length > 0:
            normal = normal / length
        
        # Add to vertex normals
        normals[face[0]] += normal
        normals[face[1]] += normal
        normals[face[2]] += normal
    
    # Normalize vertex normals
    for i in range(len(normals)):
        length = np.linalg.norm(normals[i])
        if length > 0:
            normals[i] = normals[i] / length
    
    return normals

def calculate_bounding_box(vertices):
    """
    Calculate the bounding box of the mesh
    """
    min_coords = np.min(vertices, axis=0)
    max_coords = np.max(vertices, axis=0)
    
    return {
        'min': {'x': float(min_coords[0]), 'y': float(min_coords[1]), 'z': float(min_coords[2])},
        'max': {'x': float(max_coords[0]), 'y': float(max_coords[1]), 'z': float(max_coords[2])}
    }

# Flask server setup
app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'online', 'service': 'PowerPrint 2D to 3D Colab'})

@app.route('/process', methods=['POST'])
def process_images():
    try:
        data = request.json
        images = data.get('images', [])
        options = data.get('processingOptions', {})
        
        if not images:
            return jsonify({'success': False, 'error': 'No images provided'}), 400
        
        # Process the first image (can be extended for multiple images)
        start_time = time.time()
        mesh_data = advanced_2d_to_3d_conversion(images[0], options)
        processing_time = (time.time() - start_time) * 1000  # Convert to milliseconds
        
        return jsonify({
            'success': True,
            'meshData': mesh_data,
            'processingTime': processing_time
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Setup ngrok tunnel
def setup_ngrok():
    try:
        from pyngrok import ngrok
        import time
        
        # Kill any existing tunnels
        ngrok.kill()
        
        # Create new tunnel
        tunnel = ngrok.connect(5000, "http")
        print(f"🚀 PowerPrint Colab Server running!")
        print(f"📡 Ngrok tunnel: {tunnel.public_url}")
        print(f"💻 Copy this URL to your PowerPrint web app:")
        print(f"   {tunnel.public_url}")
        
        return tunnel.public_url
        
    except ImportError:
        print("Installing pyngrok...")
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'pyngrok'])
        from pyngrok import ngrok
        return setup_ngrok()

# Main execution
if __name__ == "__main__":
    import time
    
    print("🔧 Installing packages...")
    install_packages()
    
    print("🌐 Setting up ngrok tunnel...")
    ngrok_url = setup_ngrok()
    
    print("🚀 Starting Flask server...")
    app.run(host='0.0.0.0', port=5000, debug=False)
