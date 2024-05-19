/* import * as THREE from "three"; */

// シーンの追加
const scene = new THREE.Scene();

// カメラの追加
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 0, 500);

// レンダラーの追加
const renderer = new THREE.WebGLRenderer({
  alpha: true,
});
// サイズ調整
renderer.setSize(window.innerWidth, window.innerHeight);
// レンダリングしたいDOM要素と紐付け
document.body.appendChild(renderer.domElement);

// ジオメトリ作成
const ballGeometry = new THREE.SphereGeometry(100, 64, 32);

// マテリアル作成
const ballMaterial = new THREE.MeshPhysicalMaterial();

// メッシュ化
const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
scene.add(ballMesh);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
// 光の当たる位置調整
directionalLight.position.set(1, 1, 1); 
// シーンに追加
scene.add(directionalLight);
const axes = new THREE.AxisHelper(100);
scene.add(axes);

// レンダリング関数
renderer.render(scene, camera);
    