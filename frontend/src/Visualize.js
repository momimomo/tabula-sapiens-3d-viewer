import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { palette } from './palette';

function hashStringToColor(str, palette) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    const index = Math.abs(hash) % palette.length; // Ensure index is within palette bounds
    return palette[index];
}

  const Visualize = ({ data, zMetric, filters, zMaxVal, autorotate }) => {
    const mountRef = useRef();
  
    useEffect(() => {
      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    
  
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth / 1.6, window.innerHeight / 1.6);
      mountRef.current.appendChild(renderer.domElement);
  
      // Lighting
      scene.add(new THREE.AmbientLight(0xffffff));
  
      // Color buffer initialization
      const colorArray = new Float32Array(data.length * 3);
  
      // Geometry and material setup
      const geometry = new THREE.DodecahedronGeometry(0.05);
      const material = new THREE.MeshBasicMaterial({ vertexColors: true });
      const mesh = new THREE.InstancedMesh(geometry, material, data.length);
  
      // Create a dummy object to help update matrix and color
      const dummyObject = new THREE.Object3D();
  
      // Positioning Instances and assigning colors
      data.forEach((item, index) => {
        const { x, y, z } = item;
        const colorValue = hashStringToColor(item.data.cell_ontology_class, palette);
        const color = new THREE.Color(colorValue);
  
        // Update the dummy object's position
        dummyObject.position.set(x, y, z);
        dummyObject.updateMatrix();
  
        // Apply the matrix to the instanced item
        mesh.setMatrixAt(index, dummyObject.matrix);
  
        // Set color for the instance
        color.toArray(colorArray, index * 3);
      });
  
      // Apply color buffer as an attribute
      geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colorArray, 3));
      scene.add(mesh);
  
      // OrbitControls
      const controls = new OrbitControls(camera, renderer.domElement);
      camera.position.x = 15;
      camera.position.y = -5;
      camera.position.z = -5;
      const centerAt = new THREE.Vector3(0, 0, 10)
      controls.target = centerAt
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controls.autoRotate = autorotate;
  
      // Render loop
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
  
      animate();
  
      // Cleanup
      return () => {
        controls.dispose();
        mountRef.current.removeChild(renderer.domElement);
        geometry.dispose();
        material.dispose();
      };
    }, [data, zMetric, filters, zMaxVal, autorotate]); // Dependencies for the effect
  
    return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
  };
  
  export default Visualize;