'use client';
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, Shield, Sword } from 'lucide-react';
import { AF } from '@/lib/audio';

export default function Warrior3DCanvas({
  tier,
  days = 0,
  height = 360,
  interactive = true,
  autoRotate = true,
  curLang = 'pt',
}) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const warriorGroupRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- SETUP SCENE, CAMERA, RENDERER ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 340;
    const h = height || 360;

    const camera = new THREE.PerspectiveCamera(38, width / h, 0.1, 100);
    camera.position.set(0, 1.4, 4.4);
    camera.lookAt(0, 1.05, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Append canvas
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // --- ILUMINAÇÃO DE FORJA MEDIEVAL ---
    const ambientLight = new THREE.AmbientLight(0x28180c, 1.2);
    scene.add(ambientLight);

    // Tocha principal superior (quente dourada)
    const keyLight = new THREE.DirectionalLight(0xffbe6b, 2.4);
    keyLight.position.set(2.5, 4, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Luz de contorno fria/prateada atrás (rim light para destacar o 3D)
    const rimLight = new THREE.DirectionalLight(0x7090b8, 1.6);
    rimLight.position.set(-3, 3, -3);
    scene.add(rimLight);

    // Braseiro incandescente na base (PointLight de fogo subindo no guerreiro)
    const forgeFireLight = new THREE.PointLight(0xff6600, 3.5, 6, 1.2);
    forgeFireLight.position.set(0, 0.4, 0);
    scene.add(forgeFireLight);

    // Luz secundária quente dourada da bigorna
    const goldFillLight = new THREE.PointLight(0xf59e0b, 1.8, 5);
    goldFillLight.position.set(1.5, 1.2, 1.5);
    scene.add(goldFillLight);

    // --- GRUPO DO GUERREIRO ---
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- PEDESTAL DE PEDRA E FORJA (COMO NO VÍDEO) ---
    const pedestalGroup = new THREE.Group();
    rootGroup.add(pedestalGroup);

    // Base cilíndrica de pedra escura
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.35, 0.28, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1a1512,
      roughness: 0.85,
      metalness: 0.25,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 0.14;
    baseMesh.receiveShadow = true;
    pedestalGroup.add(baseMesh);

    // Anel de metal forjado superior do pedestal
    const ringGeo = new THREE.TorusGeometry(1.15, 0.05, 16, 40);
    const ringMat = new THREE.MeshStandardMaterial({
      color: tier.min >= 365 ? 0xffd700 : tier.min >= 61 ? 0xd97706 : 0x5a4838,
      roughness: 0.35,
      metalness: 0.85,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.28;
    pedestalGroup.add(ringMesh);

    // Círculo interno de brasas incandescentes
    const emberPlaneGeo = new THREE.CircleGeometry(1.08, 32);
    const emberPlaneMat = new THREE.MeshBasicMaterial({
      color: tier.min >= 180 ? 0x00bfff : 0xff4500,
      transparent: true,
      opacity: 0.55,
    });
    const emberPlane = new THREE.Mesh(emberPlaneGeo, emberPlaneMat);
    emberPlane.rotation.x = -Math.PI / 2;
    emberPlane.position.y = 0.285;
    pedestalGroup.add(emberPlane);

    // Tochas/Cristais em volta do pedestal (como no vídeo)
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const torchHolderGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.22, 8);
      const torchHolderMat = new THREE.MeshStandardMaterial({ color: 0x2d1a0c, metalness: 0.6 });
      const torchHolder = new THREE.Mesh(torchHolderGeo, torchHolderMat);
      torchHolder.position.set(Math.cos(angle) * 1.1, 0.38, Math.sin(angle) * 1.1);
      pedestalGroup.add(torchHolder);

      // Chama incandescente da tocha
      const flameGeo = new THREE.ConeGeometry(0.05, 0.14, 8);
      const flameMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xffa500 : 0xff4500,
      });
      const flameMesh = new THREE.Mesh(flameGeo, flameMat);
      flameMesh.position.set(Math.cos(angle) * 1.1, 0.53, Math.sin(angle) * 1.1);
      pedestalGroup.add(flameMesh);
    }

    // --- GUERREIRO 3D (ESTILO MANEQUIM / MODELO 3D REAL DO VÍDEO) ---
    const warrior = new THREE.Group();
    warrior.position.y = 0.28; // Em cima do pedestal
    rootGroup.add(warrior);
    warriorGroupRef.current = warrior;

    // Paleta de Materiais Dinâmicos baseados no Nível/Patente
    const isGoldTier = tier.min >= 365;
    const isSteelTier = tier.min >= 31;
    const isGothicTier = tier.min >= 61;
    const isMysticTier = tier.min >= 180;

    // Material da Armadura (Evolui do Couro/Linho para Placas de Aço e Ouro Real)
    const armorColor = isGoldTier
      ? 0xf5b700
      : isMysticTier
      ? 0x223344
      : isGothicTier
      ? 0x1f2328
      : isSteelTier
      ? 0x7c8796
      : 0x3d2b1f; // Couro rústico

    const armorMaterial = new THREE.MeshStandardMaterial({
      color: armorColor,
      roughness: isSteelTier || isGoldTier ? 0.25 : 0.75,
      metalness: isSteelTier || isGoldTier ? 0.88 : 0.2,
    });

    const skinMaterial = new THREE.MeshStandardMaterial({
      color: 0x9b6b43, // Tom de pele bronzeado forja
      roughness: 0.65,
      metalness: 0.1,
    });

    const ironTrimMaterial = new THREE.MeshStandardMaterial({
      color: isGoldTier ? 0xffdf70 : 0x222225,
      roughness: 0.35,
      metalness: 0.9,
    });

    // 1. PÉS & BOTAS
    const bootGeo = new THREE.BoxGeometry(0.18, 0.16, 0.32);
    const leftBoot = new THREE.Mesh(bootGeo, ironTrimMaterial);
    leftBoot.position.set(-0.22, 0.08, 0.04);
    warrior.add(leftBoot);

    const rightBoot = new THREE.Mesh(bootGeo, ironTrimMaterial);
    rightBoot.position.set(0.22, 0.08, 0.04);
    warrior.add(rightBoot);

    // 2. PERNAS & CANELEIRAS
    const legGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.58, 12);
    const leftLeg = new THREE.Mesh(legGeo, armorMaterial);
    leftLeg.position.set(-0.22, 0.44, 0);
    warrior.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, armorMaterial);
    rightLeg.position.set(0.22, 0.44, 0);
    warrior.add(rightLeg);

    // 3. CINTURA & CINTO DE GUERRA
    const hipGeo = new THREE.CylinderGeometry(0.26, 0.24, 0.2, 16);
    const hips = new THREE.Mesh(hipGeo, ironTrimMaterial);
    hips.position.set(0, 0.76, 0);
    warrior.add(hips);

    // Fivela Dourada do Cinto
    const buckleGeo = new THREE.BoxGeometry(0.12, 0.1, 0.08);
    const buckleMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.2,
    });
    const buckle = new THREE.Mesh(buckleGeo, buckleMat);
    buckle.position.set(0, 0.76, 0.13);
    warrior.add(buckle);

    // 4. TORSO / PEITORAL DE PLACAS (CURVADO E ROBUSTO)
    const chestGeo = new THREE.CylinderGeometry(0.38, 0.27, 0.58, 16);
    const chest = new THREE.Mesh(chestGeo, armorMaterial);
    chest.position.set(0, 1.12, 0);
    warrior.add(chest);

    // Placa Frontal de Reforço do Peitoral
    const breastplateGeo = new THREE.BoxGeometry(0.42, 0.48, 0.18);
    const breastplate = new THREE.Mesh(breastplateGeo, armorMaterial);
    breastplate.position.set(0, 1.16, 0.08);
    warrior.add(breastplate);

    // 5. OMBREIRAS DE AÇO (PAULDRONS)
    const pauldronGeo = new THREE.SphereGeometry(0.18, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const leftPauldron = new THREE.Mesh(pauldronGeo, ironTrimMaterial);
    leftPauldron.position.set(-0.46, 1.34, 0);
    leftPauldron.rotation.z = 0.35;
    warrior.add(leftPauldron);

    const rightPauldron = new THREE.Mesh(pauldronGeo, ironTrimMaterial);
    rightPauldron.position.set(0.46, 1.34, 0);
    rightPauldron.rotation.z = -0.35;
    warrior.add(rightPauldron);

    // 6. BRAÇOS & ANTEBRAÇOS
    const armGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.44, 12);
    // Braço esquerdo (segura o escudo)
    const leftUpperArm = new THREE.Mesh(armGeo, skinMaterial);
    leftUpperArm.position.set(-0.44, 1.08, 0);
    leftUpperArm.rotation.z = 0.2;
    warrior.add(leftUpperArm);

    const leftForearmGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.4, 12);
    const leftForearm = new THREE.Mesh(leftForearmGeo, ironTrimMaterial); // Braçadeira
    leftForearm.position.set(-0.4, 0.88, 0.16);
    leftForearm.rotation.x = Math.PI / 4;
    warrior.add(leftForearm);

    // Braço direito (segura o machado / espada)
    const rightUpperArm = new THREE.Mesh(armGeo, skinMaterial);
    rightUpperArm.position.set(0.44, 1.08, 0);
    rightUpperArm.rotation.z = -0.2;
    warrior.add(rightUpperArm);

    const rightForearm = new THREE.Mesh(leftForearmGeo, ironTrimMaterial);
    rightForearm.position.set(0.4, 0.88, 0.16);
    rightForearm.rotation.x = Math.PI / 4;
    warrior.add(rightForearm);

    // 7. PESCOÇO & CABEÇA / ELMO MEDIEVAL
    const neckGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.14, 12);
    const neck = new THREE.Mesh(neckGeo, skinMaterial);
    neck.position.set(0, 1.45, 0);
    warrior.add(neck);

    // Cabeça
    const headGeo = new THREE.SphereGeometry(0.2, 20, 20);
    const head = new THREE.Mesh(headGeo, skinMaterial);
    head.position.set(0, 1.62, 0);
    warrior.add(head);

    // Elmo Medieval (Capacete com visor ou crista de cavaleiro)
    const helmetGeo = new THREE.SphereGeometry(0.23, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.58);
    const helmet = new THREE.Mesh(helmetGeo, armorMaterial);
    helmet.position.set(0, 1.64, 0);
    warrior.add(helmet);

    // Visor / Faixa de Ferro do Elmo
    const visorGeo = new THREE.BoxGeometry(0.34, 0.08, 0.28);
    const visor = new THREE.Mesh(visorGeo, ironTrimMaterial);
    visor.position.set(0, 1.62, 0.08);
    warrior.add(visor);

    // Crista Superior do Elmo
    const crestGeo = new THREE.BoxGeometry(0.04, 0.14, 0.38);
    const crest = new THREE.Mesh(crestGeo, ironTrimMaterial);
    crest.position.set(0, 1.82, 0);
    warrior.add(crest);

    // --- 8. ESCUDO REDONDO MEDIEVAL (NO BRAÇO ESQUERDO, EXATAMENTE COMO NO VÍDEO) ---
    const shieldGroup = new THREE.Group();
    shieldGroup.position.set(-0.52, 0.88, 0.24);
    shieldGroup.rotation.y = Math.PI / 6;
    warrior.add(shieldGroup);

    // Disco do Escudo
    const shieldPlateGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.04, 24);
    const shieldWoodMat = new THREE.MeshStandardMaterial({
      color: tier.min >= 180 ? 0x1e3a5f : tier.min >= 31 ? 0x22262c : 0x4a2c16,
      roughness: 0.6,
      metalness: 0.3,
    });
    const shieldPlate = new THREE.Mesh(shieldPlateGeo, shieldWoodMat);
    shieldPlate.rotation.x = Math.PI / 2;
    shieldGroup.add(shieldPlate);

    // Aro de Ferro ao redor do escudo
    const shieldBorderGeo = new THREE.TorusGeometry(0.42, 0.03, 12, 32);
    const shieldBorder = new THREE.Mesh(shieldBorderGeo, ironTrimMaterial);
    shieldGroup.add(shieldBorder);

    // Umbo Central (Ponta de Metal no centro do escudo)
    const umboGeo = new THREE.SphereGeometry(0.12, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const umboMat = new THREE.MeshStandardMaterial({
      color: isGoldTier ? 0xffd700 : 0x777777,
      metalness: 0.9,
      roughness: 0.2,
    });
    const umbo = new THREE.Mesh(umboGeo, umboMat);
    umbo.rotation.x = Math.PI / 2;
    umbo.position.z = 0.02;
    shieldGroup.add(umbo);

    // --- 9. ARMA NA MÃO DIREITA (MACHADO FORJADO OU ESPADA LONGA) ---
    const weaponGroup = new THREE.Group();
    weaponGroup.position.set(0.5, 0.88, 0.2);
    weaponGroup.rotation.x = -Math.PI / 8;
    weaponGroup.rotation.z = -Math.PI / 12;
    warrior.add(weaponGroup);

    if (tier.min >= 31) {
      // ESPADA LONGA DE AÇO
      const hiltGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.26, 8);
      const hiltMat = new THREE.MeshStandardMaterial({ color: 0x3d2712, roughness: 0.8 });
      const hilt = new THREE.Mesh(hiltGeo, hiltMat);
      weaponGroup.add(hilt);

      // Guarda da Espada
      const guardGeo = new THREE.BoxGeometry(0.28, 0.035, 0.06);
      const guard = new THREE.Mesh(guardGeo, ironTrimMaterial);
      guard.position.y = 0.13;
      weaponGroup.add(guard);

      // Lâmina de Aço Afiada
      const bladeGeo = new THREE.BoxGeometry(0.08, 0.88, 0.02);
      const bladeMat = new THREE.MeshStandardMaterial({
        color: isGoldTier ? 0xffdf70 : 0xccd6e0,
        metalness: 0.95,
        roughness: 0.15,
      });
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.y = 0.58;
      weaponGroup.add(blade);
    } else {
      // MACHADO FORJADO MEDIEVAL (BATTLE AXE DO VÍDEO)
      const handleGeo = new THREE.CylinderGeometry(0.03, 0.035, 0.85, 12);
      const handleMat = new THREE.MeshStandardMaterial({ color: 0x54361c, roughness: 0.75 });
      const handle = new THREE.Mesh(handleGeo, handleMat);
      weaponGroup.add(handle);

      // Lâmina do Machado Curvada
      const axeHeadGeo = new THREE.BoxGeometry(0.32, 0.24, 0.04);
      const axeHeadMat = new THREE.MeshStandardMaterial({
        color: 0x88929e,
        metalness: 0.9,
        roughness: 0.25,
      });
      const axeHead = new THREE.Mesh(axeHeadGeo, axeHeadMat);
      axeHead.position.set(0.12, 0.32, 0);
      weaponGroup.add(axeHead);
    }

    // --- 10. PARTÍCULAS DE BRASAS FLUTUANTES EM 3D ---
    const emberCount = 65;
    const emberPositions = new Float32Array(emberCount * 3);
    const emberVelocities = [];

    for (let i = 0; i < emberCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.2 + Math.random() * 0.95;
      emberPositions[i * 3] = Math.cos(angle) * radius;
      emberPositions[i * 3 + 1] = 0.3 + Math.random() * 1.8;
      emberPositions[i * 3 + 2] = Math.sin(angle) * radius;

      emberVelocities.push({
        y: 0.006 + Math.random() * 0.012,
        x: (Math.random() - 0.5) * 0.004,
        z: (Math.random() - 0.5) * 0.004,
      });
    }

    const emberGeo = new THREE.BufferGeometry();
    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));
    const emberMat = new THREE.PointsMaterial({
      color: tier.min >= 180 ? 0x38bdf8 : 0xff7700,
      size: 0.055,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const emberParticles = new THREE.Points(emberGeo, emberMat);
    scene.add(emberParticles);

    // --- INTERAÇÃO DE ROTAÇÃO 360° COM MOUSE E TOQUE NO CELULAR ---
    let targetRotationY = 0;
    let currentRotationY = 0;
    let previousMouseX = 0;
    let angularVelocity = 0;
    let dragging = false;

    const onPointerDown = (e) => {
      dragging = true;
      setIsDragging(true);
      setHasInteracted(true);
      previousMouseX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      angularVelocity = 0;
    };

    const onPointerMove = (e) => {
      if (!dragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const deltaX = clientX - previousMouseX;
      previousMouseX = clientX;

      angularVelocity = deltaX * 0.012;
      targetRotationY += angularVelocity;
    };

    const onPointerUp = () => {
      dragging = false;
      setIsDragging(false);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onPointerDown);
    domElement.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);

    // --- LOOP DE ANIMAÇÃO 60FPS ---
    let clock = new THREE.Clock();
    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotação suave com inércia e amortecimento
      if (!dragging && autoRotate && !hasInteracted) {
        targetRotationY += 0.008; // Rotação contínua sutil quando inativo
      } else if (!dragging) {
        targetRotationY += angularVelocity;
        angularVelocity *= 0.94; // Desaceleração realista
      }

      currentRotationY += (targetRotationY - currentRotationY) * 0.12;
      rootGroup.rotation.y = currentRotationY;

      // Animação viva de respiração do guerreiro
      const breatheOffset = Math.sin(elapsedTime * 2.2) * 0.018;
      warrior.position.y = 0.28 + breatheOffset;
      chest.scale.set(1 + breatheOffset * 0.8, 1, 1 + breatheOffset * 0.8);

      // Pulsação suave da luz da fornalha
      forgeFireLight.intensity = 3.2 + Math.sin(elapsedTime * 8) * 0.4 + Math.cos(elapsedTime * 12) * 0.25;

      // Movimentação das partículas de brasa
      const positions = emberParticles.geometry.attributes.position.array;
      for (let i = 0; i < emberCount; i++) {
        positions[i * 3 + 1] += emberVelocities[i].y;
        positions[i * 3] += emberVelocities[i].x;
        positions[i * 3 + 2] += emberVelocities[i].z;

        if (positions[i * 3 + 1] > 2.6) {
          positions[i * 3 + 1] = 0.3;
          const angle = Math.random() * Math.PI * 2;
          const r = 0.2 + Math.random() * 0.95;
          positions[i * 3] = Math.cos(angle) * r;
          positions[i * 3 + 2] = Math.sin(angle) * r;
        }
      }
      emberParticles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Redimensionamento responsivo
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 340;
      camera.aspect = newW / h;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, h);
    };

    window.addEventListener('resize', handleResize);

    // Limpeza de recursos WebGL no desmonte
    return () => {
      cancelAnimationFrame(animationId);
      domElement.removeEventListener('mousedown', onPointerDown);
      domElement.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', handleResize);

      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [tier, height, autoRotate]);

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      {/* Canvas 3D */}
      <div
        ref={containerRef}
        style={{ height: `${height}px`, width: '100%', cursor: isDragging ? 'grabbing' : 'grab' }}
        className="relative overflow-hidden touch-none"
      />

      {/* Rótulo de Instrução Interativa: ARRASTE PARA GIRAR 360° */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-amber-600/40 text-amber-300 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider shadow">
        <RotateCw size={12} className="text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
        <span>
          {curLang === 'en'
            ? 'DRAG TO ROTATE 360°'
            : curLang === 'es'
            ? 'ARRASTRA PARA GIRAR 360°'
            : 'ARRASTE PARA GIRAR 360°'}
        </span>
      </div>
    </div>
  );
}
