'use client';
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { RotateCw } from 'lucide-react';

/* DEFINIÇÃO EXATA DAS 11 FASES COM VISUAIS 3D TOTALMENTE ÚNICOS */
function getTier3DConfig(minDays = 0) {
  if (minDays >= 730) {
    // 10. SOBERANO ANCESTRAL (2 Anos)
    return {
      tierIndex: 10,
      name: 'SOBERANO ANCESTRAL',
      armorColor: 0xffe680,
      trimColor: 0xffffff,
      metalness: 0.98,
      roughness: 0.1,
      hasCape: true,
      capeColor: 0xffd700,
      hasWings: true, // Asas Cósmicas em 3D nas costas
      hasHalo: true, // Auréola Solar Cósmica
      helmetType: 'celestial_crown',
      pauldronType: 'celestial_wings',
      weaponType: 'celestial_godblade',
      shieldType: 'aegis_eternity',
      torchColor: 0xffea00,
      emberColor: 0xffffff,
      pedestalRings: 3,
      pedestalMatColor: 0x3d3015,
      fireIntensity: 5.0,
      runicRing: true,
    };
  }
  if (minDays >= 365) {
    // 9. PATRIARCA IMORTAL (1 Ano)
    return {
      tierIndex: 9,
      name: 'PATRIARCA IMORTAL',
      armorColor: 0xffc400,
      trimColor: 0xffea75,
      metalness: 0.95,
      roughness: 0.14,
      hasCape: true,
      capeColor: 0x800020, // Púrpura Imperial
      hasWings: false,
      hasHalo: true,
      helmetType: 'imperial_crown',
      pauldronType: 'solar_eagle',
      weaponType: 'divine_sunblade',
      shieldType: 'sun_shield',
      torchColor: 0xffb700,
      emberColor: 0xffdf70,
      pedestalRings: 2,
      pedestalMatColor: 0x3a2d0d,
      fireIntensity: 4.5,
      runicRing: true,
    };
  }
  if (minDays >= 270) {
    // 8. SOBERANO DO TEMPLO (9 Meses)
    return {
      tierIndex: 8,
      name: 'SOBERANO DO TEMPLO',
      armorColor: 0x141210, // Ébano com Ouro
      trimColor: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.22,
      hasCape: true,
      capeColor: 0x181510,
      hasWings: false,
      hasHalo: false,
      helmetType: 'temple_crowned',
      pauldronType: 'ebony_gold',
      weaponType: 'temple_runic_sword',
      shieldType: 'gilded_relic',
      torchColor: 0xf59e0b,
      emberColor: 0xfbbf24,
      pedestalRings: 2,
      pedestalMatColor: 0x1c1712,
      fireIntensity: 4.0,
      runicRing: true,
    };
  }
  if (minDays >= 180) {
    // 7. GRÃO-MESTRE DA ORDEM (6 Meses)
    return {
      tierIndex: 7,
      name: 'GRÃO-MESTRE DA ORDEM',
      armorColor: 0x182433, // Aço Damasco Azul-Místico
      trimColor: 0x38bdf8, // Runas Azuis Celestiais
      metalness: 0.88,
      roughness: 0.25,
      hasCape: true,
      capeColor: 0x0f172a,
      hasWings: false,
      hasHalo: false,
      helmetType: 'mystic_greathelm',
      pauldronType: 'mystic_runic',
      weaponType: 'mystic_claymore',
      shieldType: 'templar_cross',
      torchColor: 0x0ea5e9, // Tochas Azuis Místicas
      emberColor: 0x38bdf8,
      pedestalRings: 2,
      pedestalMatColor: 0x131f2d,
      fireIntensity: 4.0,
      runicRing: true,
    };
  }
  if (minDays >= 120) {
    // 6. LORDE COMANDANTE (4 Meses)
    return {
      tierIndex: 6,
      name: 'LORDE COMANDANTE',
      armorColor: 0x22262d,
      trimColor: 0xb45309, // Bronze Imperial
      metalness: 0.86,
      roughness: 0.28,
      hasCape: true,
      capeColor: 0x991b1b, // Carmesim de Comandante
      hasWings: false,
      hasHalo: false,
      helmetType: 'crowned_bascinet',
      pauldronType: 'bronze_lion',
      weaponType: 'commander_sword',
      shieldType: 'lion_shield',
      torchColor: 0xff6600,
      emberColor: 0xf97316,
      pedestalRings: 1,
      pedestalMatColor: 0x221a14,
      fireIntensity: 3.5,
      runicRing: false,
    };
  }
  if (minDays >= 61) {
    // 5. CAMPEÃO DA FORJA (60-90 Dias)
    return {
      tierIndex: 5,
      name: 'CAMPEÃO DA FORJA',
      armorColor: 0x17191d, // Aço Negro Gótico
      trimColor: 0xd97706,
      metalness: 0.9,
      roughness: 0.22,
      hasCape: true,
      capeColor: 0x450a0a,
      hasWings: false,
      hasHalo: false,
      helmetType: 'gothic_winged',
      pauldronType: 'gothic_spiked',
      weaponType: 'zweihander',
      shieldType: 'gothic_tower',
      torchColor: 0xff4500,
      emberColor: 0xfb923c,
      pedestalRings: 1,
      pedestalMatColor: 0x1c1815,
      fireIntensity: 3.5,
      runicRing: false,
    };
  }
  if (minDays >= 31) {
    // 4. CAVALEIRO DA ORDEM (30-60 Dias)
    return {
      tierIndex: 4,
      name: 'CAVALEIRO DA ORDEM',
      armorColor: 0x8c99a8, // Aço Polido Espelhado
      trimColor: 0xd97706,
      metalness: 0.94,
      roughness: 0.16,
      hasCape: true,
      capeColor: 0x1e3a5f, // Manto Azul Cavaleiro
      hasWings: false,
      hasHalo: false,
      helmetType: 'knight_greathelm',
      pauldronType: 'knight_plates',
      weaponType: 'longsword',
      shieldType: 'heater_shield',
      torchColor: 0xff7700,
      emberColor: 0xf59e0b,
      pedestalRings: 1,
      pedestalMatColor: 0x201c18,
      fireIntensity: 3.2,
      runicRing: false,
    };
  }
  if (minDays >= 15) {
    // 3. HOMEM-DE-ARMAS (15-30 Dias)
    return {
      tierIndex: 3,
      name: 'HOMEM-DE-ARMAS',
      armorColor: 0x4d535b, // Cota de Malha
      trimColor: 0x272b30,
      metalness: 0.75,
      roughness: 0.45,
      hasCape: false,
      hasWings: false,
      hasHalo: false,
      helmetType: 'norman_nasal',
      pauldronType: 'steel_bands',
      weaponType: 'arming_sword',
      shieldType: 'kite_shield',
      torchColor: 0xff6600,
      emberColor: 0xf97316,
      pedestalRings: 1,
      pedestalMatColor: 0x221d19,
      fireIntensity: 2.8,
      runicRing: false,
    };
  }
  if (minDays >= 8) {
    // 2. ESCUDEIRO FORJADO (8-14 Dias)
    return {
      tierIndex: 2,
      name: 'ESCUDEIRO FORJADO',
      armorColor: 0x3d3228, // Couro Batido + Placas
      trimColor: 0x1f1b17,
      metalness: 0.45,
      roughness: 0.65,
      hasCape: false,
      hasWings: false,
      hasHalo: false,
      helmetType: 'spangenhelm',
      pauldronType: 'iron_studs',
      weaponType: 'battle_axe',
      shieldType: 'round_oak',
      torchColor: 0xff5500,
      emberColor: 0xf59e0b,
      pedestalRings: 1,
      pedestalMatColor: 0x1d1815,
      fireIntensity: 2.5,
      runicRing: false,
    };
  }
  if (minDays >= 4) {
    // 1. PAJEM DE ARMAS (4-7 Dias)
    return {
      tierIndex: 1,
      name: 'PAJEM DE ARMAS',
      armorColor: 0x4a3727, // Couro Cru Reforçado
      trimColor: 0x2e2016,
      metalness: 0.25,
      roughness: 0.75,
      hasCape: false,
      hasWings: false,
      hasHalo: false,
      helmetType: 'iron_coif',
      pauldronType: 'leather_guards',
      weaponType: 'handaxe',
      shieldType: 'wooden_buckler',
      torchColor: 0xff4400,
      emberColor: 0xf97316,
      pedestalRings: 0,
      pedestalMatColor: 0x181512,
      fireIntensity: 2.0,
      runicRing: false,
    };
  }
  // 0. NEÓFITO DA FORJA (0-3 Dias)
  return {
    tierIndex: 0,
    name: 'NEÓFITO DA FORJA',
    armorColor: 0x332822, // Túnica de Linho e Cinzas
    trimColor: 0x221a16,
    metalness: 0.1,
    roughness: 0.9,
    hasCape: false,
    hasWings: false,
    hasHalo: false,
    helmetType: 'headband',
    pauldronType: 'none',
    weaponType: 'rustic_dagger',
    shieldType: 'none',
    torchColor: 0xcc4400,
    emberColor: 0xe65100,
    pedestalRings: 0,
    pedestalMatColor: 0x141210,
    fireIntensity: 1.5,
    runicRing: false,
  };
}

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
  const rotationRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [webGLError, setWebGLError] = useState(false);

  const tierMin = tier && typeof tier.min === 'number' ? tier.min : 0;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cfg = getTier3DConfig(tierMin);

    // --- SETUP SCENE, CAMERA, RENDERER COM TRY/CATCH SEGURO ---
    let scene;
    let camera;
    let renderer;

    try {
      scene = new THREE.Scene();
      sceneRef.current = scene;

      const width = container.clientWidth || 340;
      const h = height || 360;

      camera = new THREE.PerspectiveCamera(38, width / h, 0.1, 100);
      camera.position.set(0, 1.45, 4.4);
      camera.lookAt(0, 1.1, 0);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;

      // Limpeza segura de nós filhos existentes
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.warn('WebGL não suportado ou falhou na inicialização:', err);
      setWebGLError(true);
      return;
    }

    // --- ILUMINAÇÃO DINÂMICA DA FORJA ---
    const ambientLight = new THREE.AmbientLight(0x24180f, 1.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffbe70, 2.5);
    keyLight.position.set(2.8, 4.2, 3.2);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimColor = cfg.tierIndex >= 9 ? 0xffdf70 : cfg.tierIndex >= 7 ? 0x38bdf8 : 0x7593b8;
    const rimLight = new THREE.DirectionalLight(rimColor, 1.8);
    rimLight.position.set(-3, 3, -3);
    scene.add(rimLight);

    const forgeFireLight = new THREE.PointLight(cfg.torchColor, cfg.fireIntensity, 6, 1.2);
    forgeFireLight.position.set(0, 0.4, 0);
    scene.add(forgeFireLight);

    // --- GRUPO PRINCIPAL ---
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- PEDESTAL DE FORJA ---
    const pedestalGroup = new THREE.Group();
    rootGroup.add(pedestalGroup);

    const baseGeo = new THREE.CylinderGeometry(1.22, 1.38, 0.28, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: cfg.pedestalMatColor,
      roughness: 0.8,
      metalness: cfg.tierIndex >= 9 ? 0.9 : 0.3,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 0.14;
    baseMesh.receiveShadow = true;
    pedestalGroup.add(baseMesh);

    // Anel de metal forjado superior do pedestal
    const ringGeo = new THREE.TorusGeometry(1.18, 0.05, 16, 40);
    const ringMat = new THREE.MeshStandardMaterial({
      color: cfg.tierIndex >= 9 ? 0xffd700 : cfg.tierIndex >= 5 ? 0xcc7a00 : 0x4a3b2f,
      roughness: 0.3,
      metalness: 0.9,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.28;
    pedestalGroup.add(ringMesh);

    // Brasas incandescentes da base
    const emberPlaneGeo = new THREE.CircleGeometry(1.1, 32);
    const emberPlaneMat = new THREE.MeshBasicMaterial({
      color: cfg.torchColor,
      transparent: true,
      opacity: 0.55,
    });
    const emberPlane = new THREE.Mesh(emberPlaneGeo, emberPlaneMat);
    emberPlane.rotation.x = -Math.PI / 2;
    emberPlane.position.y = 0.285;
    pedestalGroup.add(emberPlane);

    // Tochas em volta do pedestal (Quantidade varia por nível: 2 a 6 tochas)
    const torchCount = cfg.tierIndex === 0 ? 2 : cfg.tierIndex === 1 ? 4 : 6;
    for (let i = 0; i < torchCount; i++) {
      const angle = (i / torchCount) * Math.PI * 2;
      const torchHolderGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.22, 8);
      const torchHolderMat = new THREE.MeshStandardMaterial({ color: 0x29180c, metalness: 0.7 });
      const torchHolder = new THREE.Mesh(torchHolderGeo, torchHolderMat);
      torchHolder.position.set(Math.cos(angle) * 1.12, 0.38, Math.sin(angle) * 1.12);
      pedestalGroup.add(torchHolder);

      const flameGeo = new THREE.ConeGeometry(0.055, 0.15, 8);
      const flameMat = new THREE.MeshBasicMaterial({ color: cfg.torchColor });
      const flameMesh = new THREE.Mesh(flameGeo, flameMat);
      flameMesh.position.set(Math.cos(angle) * 1.12, 0.54, Math.sin(angle) * 1.12);
      pedestalGroup.add(flameMesh);
    }

    // --- ANEL RÚNICO GIRATÓRIO NO CHÃO (Níveis 8, 9, 10) ---
    let runicCircle = null;
    if (cfg.runicRing) {
      const runeRingGeo = new THREE.RingGeometry(1.24, 1.34, 32);
      const runeRingMat = new THREE.MeshBasicMaterial({
        color: cfg.trimColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      runicCircle = new THREE.Mesh(runeRingGeo, runeRingMat);
      runicCircle.rotation.x = -Math.PI / 2;
      runicCircle.position.y = 0.29;
      pedestalGroup.add(runicCircle);
    }

    // --- GUERREIRO 3D REAL (ESTILO MANEQUIM MEDIEVAL) ---
    const warrior = new THREE.Group();
    warrior.position.y = 0.28;
    rootGroup.add(warrior);
    warriorGroupRef.current = warrior;

    // Materiais
    const armorMaterial = new THREE.MeshStandardMaterial({
      color: cfg.armorColor,
      roughness: cfg.roughness,
      metalness: cfg.metalness,
    });

    const trimMaterial = new THREE.MeshStandardMaterial({
      color: cfg.trimColor,
      roughness: 0.3,
      metalness: 0.9,
    });

    const skinMaterial = new THREE.MeshStandardMaterial({
      color: 0x9e6d45,
      roughness: 0.65,
      metalness: 0.1,
    });

    // 1. PÉS & BOTAS (EVOLUÇÃO)
    const bootGeo = new THREE.BoxGeometry(0.19, 0.16, 0.33);
    const leftBoot = new THREE.Mesh(bootGeo, cfg.tierIndex >= 3 ? trimMaterial : armorMaterial);
    leftBoot.position.set(-0.22, 0.08, 0.04);
    warrior.add(leftBoot);

    const rightBoot = new THREE.Mesh(bootGeo, cfg.tierIndex >= 3 ? trimMaterial : armorMaterial);
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

    // 3. CINTURA & CINTO
    const hipGeo = new THREE.CylinderGeometry(0.26, 0.24, 0.2, 16);
    const hips = new THREE.Mesh(hipGeo, trimMaterial);
    hips.position.set(0, 0.76, 0);
    warrior.add(hips);

    const buckleGeo = new THREE.BoxGeometry(0.12, 0.1, 0.08);
    const buckle = new THREE.Mesh(buckleGeo, trimMaterial);
    buckle.position.set(0, 0.76, 0.13);
    warrior.add(buckle);

    // 4. TORSO / PEITORAL
    const chestGeo = new THREE.CylinderGeometry(0.38, 0.27, 0.58, 16);
    const chest = new THREE.Mesh(chestGeo, armorMaterial);
    chest.position.set(0, 1.12, 0);
    warrior.add(chest);

    // Placa Frontal de Reforço com Emblema
    const breastplateGeo = new THREE.BoxGeometry(0.42, 0.48, 0.18);
    const breastplate = new THREE.Mesh(breastplateGeo, armorMaterial);
    breastplate.position.set(0, 1.16, 0.08);
    warrior.add(breastplate);

    // Brasão no Peito (Para Níveis 4 a 10)
    if (cfg.tierIndex >= 4) {
      const emblemGeo = new THREE.BoxGeometry(0.14, 0.14, 0.03);
      const emblem = new THREE.Mesh(emblemGeo, trimMaterial);
      emblem.position.set(0, 1.22, 0.18);
      emblem.rotation.z = Math.PI / 4;
      warrior.add(emblem);
    }

    // 5. OMBREIRAS ESPECÍFICAS DE CADA FASE
    if (cfg.pauldronType !== 'none') {
      const pSize = cfg.pauldronType === 'solar_eagle' || cfg.pauldronType === 'celestial_wings' ? 0.26 : 0.19;
      const pauldronGeo = new THREE.SphereGeometry(pSize, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.65);

      const leftPauldron = new THREE.Mesh(pauldronGeo, trimMaterial);
      leftPauldron.position.set(-0.46, 1.34, 0);
      leftPauldron.rotation.z = 0.35;
      warrior.add(leftPauldron);

      const rightPauldron = new THREE.Mesh(pauldronGeo, trimMaterial);
      rightPauldron.position.set(0.46, 1.34, 0);
      rightPauldron.rotation.z = -0.35;
      warrior.add(rightPauldron);

      // Espigões góticos nas ombreiras (Nível 5 - Campeão)
      if (cfg.pauldronType === 'gothic_spiked') {
        const spikeGeo = new THREE.ConeGeometry(0.04, 0.16, 8);
        const lSpike = new THREE.Mesh(spikeGeo, trimMaterial);
        lSpike.position.set(-0.52, 1.48, 0);
        lSpike.rotation.z = 0.4;
        warrior.add(lSpike);

        const rSpike = new THREE.Mesh(spikeGeo, trimMaterial);
        rSpike.position.set(0.52, 1.48, 0);
        rSpike.rotation.z = -0.4;
        warrior.add(rSpike);
      }
    }

    // 6. CAPA NAS COSTAS (Níveis 4 a 10)
    if (cfg.hasCape) {
      const capeGeo = new THREE.PlaneGeometry(0.68, 1.15, 8, 8);
      const capeMat = new THREE.MeshStandardMaterial({
        color: cfg.capeColor,
        side: THREE.DoubleSide,
        roughness: 0.8,
      });
      const cape = new THREE.Mesh(capeGeo, capeMat);
      cape.position.set(0, 0.95, -0.22);
      cape.rotation.x = -0.15; // Flutuando levemente para trás
      warrior.add(cape);
    }

    // 7. AURÉOLA SOLAR / ASAS CÓSMICAS (Nível 9 e 10)
    if (cfg.hasHalo) {
      const haloGeo = new THREE.TorusGeometry(0.42, 0.035, 16, 32);
      const haloMat = new THREE.MeshBasicMaterial({ color: cfg.trimColor });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.set(0, 1.72, -0.12);
      warrior.add(halo);
    }
    if (cfg.hasWings) {
      // Asas Celestiais Douradas em 3D
      const wingGeo = new THREE.BoxGeometry(0.7, 0.35, 0.04);
      const wingMat = new THREE.MeshStandardMaterial({
        color: 0xffe066,
        metalness: 0.95,
        roughness: 0.15,
      });
      const leftWing = new THREE.Mesh(wingGeo, wingMat);
      leftWing.position.set(-0.55, 1.45, -0.25);
      leftWing.rotation.set(0.2, -0.3, 0.5);
      warrior.add(leftWing);

      const rightWing = new THREE.Mesh(wingGeo, wingMat);
      rightWing.position.set(0.55, 1.45, -0.25);
      rightWing.rotation.set(0.2, 0.3, -0.5);
      warrior.add(rightWing);
    }

    // 8. BRAÇOS & ANTEBRAÇOS
    const armGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.44, 12);
    const leftUpperArm = new THREE.Mesh(armGeo, skinMaterial);
    leftUpperArm.position.set(-0.44, 1.08, 0);
    leftUpperArm.rotation.z = 0.2;
    warrior.add(leftUpperArm);

    const leftForearmGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.4, 12);
    const leftForearm = new THREE.Mesh(leftForearmGeo, trimMaterial);
    leftForearm.position.set(-0.4, 0.88, 0.16);
    leftForearm.rotation.x = Math.PI / 4;
    warrior.add(leftForearm);

    const rightUpperArm = new THREE.Mesh(armGeo, skinMaterial);
    rightUpperArm.position.set(0.44, 1.08, 0);
    rightUpperArm.rotation.z = -0.2;
    warrior.add(rightUpperArm);

    const rightForearm = new THREE.Mesh(leftForearmGeo, trimMaterial);
    rightForearm.position.set(0.4, 0.88, 0.16);
    rightForearm.rotation.x = Math.PI / 4;
    warrior.add(rightForearm);

    // 9. CABEÇA & ELMO ESPECÍFICO DE CADA UMA DAS 11 FASES
    const neckGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.14, 12);
    const neck = new THREE.Mesh(neckGeo, skinMaterial);
    neck.position.set(0, 1.45, 0);
    warrior.add(neck);

    const headGeo = new THREE.SphereGeometry(0.2, 20, 20);
    const head = new THREE.Mesh(headGeo, skinMaterial);
    head.position.set(0, 1.62, 0);
    warrior.add(head);

    if (cfg.helmetType === 'headband') {
      // 0. Neófito: Faixa de couro na testa (sem elmo)
      const bandGeo = new THREE.TorusGeometry(0.205, 0.03, 8, 24);
      const band = new THREE.Mesh(bandGeo, trimMaterial);
      band.position.set(0, 1.64, 0);
      band.rotation.x = Math.PI / 2;
      warrior.add(band);
    } else {
      // Elmo Base de Aço / Metal
      const helmetGeo = new THREE.SphereGeometry(0.23, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.58);
      const helmet = new THREE.Mesh(helmetGeo, armorMaterial);
      helmet.position.set(0, 1.64, 0);
      warrior.add(helmet);

      // Detalhes únicos do capacete
      if (cfg.helmetType === 'imperial_crown' || cfg.helmetType === 'celestial_crown') {
        // Coroa Imperial Dourada em 3D
        const crownGeo = new THREE.CylinderGeometry(0.24, 0.22, 0.12, 8);
        const crown = new THREE.Mesh(crownGeo, trimMaterial);
        crown.position.set(0, 1.82, 0);
        warrior.add(crown);
      } else if (cfg.helmetType === 'crowned_bascinet' || cfg.helmetType === 'temple_crowned') {
        // Coroa de Comandante / Soberano
        const crownGeo = new THREE.TorusGeometry(0.235, 0.035, 8, 16);
        const crown = new THREE.Mesh(crownGeo, trimMaterial);
        crown.position.set(0, 1.76, 0);
        crown.rotation.x = Math.PI / 2;
        warrior.add(crown);
      } else if (cfg.helmetType === 'norman_nasal') {
        // Barra Nasal Normanda
        const nasalGeo = new THREE.BoxGeometry(0.04, 0.18, 0.06);
        const nasal = new THREE.Mesh(nasalGeo, trimMaterial);
        nasal.position.set(0, 1.58, 0.22);
        warrior.add(nasal);
      } else {
        // Visor com Fenda de Cruz de Cavaleiro
        const visorGeo = new THREE.BoxGeometry(0.34, 0.08, 0.28);
        const visor = new THREE.Mesh(visorGeo, trimMaterial);
        visor.position.set(0, 1.62, 0.08);
        warrior.add(visor);

        const crestGeo = new THREE.BoxGeometry(0.04, 0.14, 0.38);
        const crest = new THREE.Mesh(crestGeo, trimMaterial);
        crest.position.set(0, 1.82, 0);
        warrior.add(crest);
      }
    }

    // 10. ESCUDO NO BRAÇO ESQUERDO (DIFERENTE EM CADA UMA DAS 11 FASES)
    if (cfg.shieldType !== 'none') {
      const shieldGroup = new THREE.Group();
      shieldGroup.position.set(-0.52, 0.88, 0.24);
      shieldGroup.rotation.y = Math.PI / 6;
      warrior.add(shieldGroup);

      if (cfg.shieldType === 'wooden_buckler') {
        // Broquel de madeira pequeno
        const bucklerGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.04, 16);
        const bucklerMat = new THREE.MeshStandardMaterial({ color: 0x4a3319, roughness: 0.8 });
        const buckler = new THREE.Mesh(bucklerGeo, bucklerMat);
        buckler.rotation.x = Math.PI / 2;
        shieldGroup.add(buckler);
      } else if (cfg.shieldType === 'kite_shield') {
        // Escudo Pipa (Kite Shield) Normando
        const kiteGeo = new THREE.BoxGeometry(0.48, 0.85, 0.04);
        const kite = new THREE.Mesh(kiteGeo, armorMaterial);
        shieldGroup.add(kite);

        const crossGeo = new THREE.BoxGeometry(0.1, 0.7, 0.05);
        const cross = new THREE.Mesh(crossGeo, trimMaterial);
        shieldGroup.add(cross);
      } else if (cfg.shieldType === 'heater_shield' || cfg.shieldType === 'templar_cross') {
        // Escudo Triangular de Cavaleiro / Templário com Cruz
        const plateGeo = new THREE.BoxGeometry(0.56, 0.75, 0.04);
        const plateMat = new THREE.MeshStandardMaterial({
          color: cfg.shieldType === 'templar_cross' ? 0x0f172a : cfg.armorColor,
          metalness: 0.9,
          roughness: 0.2,
        });
        const plate = new THREE.Mesh(plateGeo, plateMat);
        shieldGroup.add(plate);

        // Cruz Heráldica em Relevo Luminosa
        const vCrossGeo = new THREE.BoxGeometry(0.12, 0.65, 0.06);
        const crossMat = new THREE.MeshStandardMaterial({
          color: cfg.shieldType === 'templar_cross' ? 0x38bdf8 : cfg.trimColor,
          emissive: cfg.shieldType === 'templar_cross' ? 0x0284c7 : 0x000000,
          metalness: 0.9,
        });
        const vCross = new THREE.Mesh(vCrossGeo, crossMat);
        shieldGroup.add(vCross);

        const hCrossGeo = new THREE.BoxGeometry(0.45, 0.12, 0.06);
        const hCross = new THREE.Mesh(hCrossGeo, crossMat);
        hCross.position.y = 0.1;
        shieldGroup.add(hCross);
      } else if (cfg.shieldType === 'gothic_tower') {
        // Escudo Torre Gótico Pesado com Espinhos
        const towerGeo = new THREE.BoxGeometry(0.55, 0.95, 0.05);
        const tower = new THREE.Mesh(towerGeo, armorMaterial);
        shieldGroup.add(tower);

        const rimGeo = new THREE.TorusGeometry(0.35, 0.03, 8, 4);
        const rim = new THREE.Mesh(rimGeo, trimMaterial);
        shieldGroup.add(rim);
      } else if (cfg.shieldType === 'sun_shield' || cfg.shieldType === 'aegis_eternity') {
        // Escudo Solar de Ouro Puro com Raios Celestiais
        const sunGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.05, 32);
        const sunMat = new THREE.MeshStandardMaterial({
          color: 0xffd700,
          metalness: 0.98,
          roughness: 0.1,
        });
        const sun = new THREE.Mesh(sunGeo, sunMat);
        sun.rotation.x = Math.PI / 2;
        shieldGroup.add(sun);

        // Raios Solares em 3D
        for (let r = 0; r < 8; r++) {
          const rayAngle = (r / 8) * Math.PI * 2;
          const rayGeo = new THREE.ConeGeometry(0.06, 0.22, 6);
          const ray = new THREE.Mesh(rayGeo, trimMaterial);
          ray.position.set(Math.cos(rayAngle) * 0.44, Math.sin(rayAngle) * 0.44, 0.03);
          ray.rotation.z = rayAngle - Math.PI / 2;
          shieldGroup.add(ray);
        }
      } else {
        // Escudo Redondo Tradicional (Round Shield)
        const roundGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.04, 24);
        const round = new THREE.Mesh(roundGeo, armorMaterial);
        round.rotation.x = Math.PI / 2;
        shieldGroup.add(round);

        const borderGeo = new THREE.TorusGeometry(0.44, 0.03, 12, 32);
        const border = new THREE.Mesh(borderGeo, trimMaterial);
        shieldGroup.add(border);

        const umboGeo = new THREE.SphereGeometry(0.12, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5);
        const umbo = new THREE.Mesh(umboGeo, trimMaterial);
        umbo.rotation.x = Math.PI / 2;
        umbo.position.z = 0.02;
        shieldGroup.add(umbo);
      }
    }

    // 11. ARMA NA MÃO DIREITA (DIFERENTE EM CADA UMA DAS 11 FASES)
    const weaponGroup = new THREE.Group();
    weaponGroup.position.set(0.5, 0.88, 0.2);
    weaponGroup.rotation.x = -Math.PI / 8;
    weaponGroup.rotation.z = -Math.PI / 12;
    warrior.add(weaponGroup);

    if (cfg.weaponType === 'rustic_dagger') {
      // 0. Adaga Rústica Curta
      const bladeGeo = new THREE.BoxGeometry(0.05, 0.38, 0.02);
      const blade = new THREE.Mesh(bladeGeo, trimMaterial);
      blade.position.y = 0.25;
      weaponGroup.add(blade);
    } else if (cfg.weaponType === 'handaxe' || cfg.weaponType === 'battle_axe') {
      // 1 e 2. Machado Forjado Medieval
      const handleGeo = new THREE.CylinderGeometry(0.03, 0.035, 0.85, 12);
      const handleMat = new THREE.MeshStandardMaterial({ color: 0x4a2e16, roughness: 0.8 });
      const handle = new THREE.Mesh(handleGeo, handleMat);
      weaponGroup.add(handle);

      const axeHeadGeo = new THREE.BoxGeometry(0.34, 0.26, 0.04);
      const axeHead = new THREE.Mesh(axeHeadGeo, trimMaterial);
      axeHead.position.set(0.13, 0.32, 0);
      weaponGroup.add(axeHead);
    } else if (cfg.weaponType === 'zweihander') {
      // 5. Montante Zweihänder Gótico Gigante
      const hiltGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.38, 8);
      const hilt = new THREE.Mesh(hiltGeo, trimMaterial);
      weaponGroup.add(hilt);

      const guardGeo = new THREE.BoxGeometry(0.42, 0.04, 0.06);
      const guard = new THREE.Mesh(guardGeo, trimMaterial);
      guard.position.y = 0.2;
      weaponGroup.add(guard);

      const bladeGeo = new THREE.BoxGeometry(0.12, 1.15, 0.025);
      const blade = new THREE.Mesh(bladeGeo, trimMaterial);
      blade.position.y = 0.8;
      weaponGroup.add(blade);
    } else if (cfg.weaponType === 'celestial_godblade' || cfg.weaponType === 'divine_sunblade') {
      // 9 e 10. Espada Solar Divina / Cósmica
      const hiltGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.3, 8);
      const hilt = new THREE.Mesh(hiltGeo, trimMaterial);
      weaponGroup.add(hilt);

      const guardGeo = new THREE.BoxGeometry(0.38, 0.05, 0.08);
      const guard = new THREE.Mesh(guardGeo, trimMaterial);
      guard.position.y = 0.16;
      weaponGroup.add(guard);

      const bladeGeo = new THREE.BoxGeometry(0.09, 1.05, 0.025);
      const bladeMat = new THREE.MeshStandardMaterial({
        color: 0xfff0aa,
        emissive: 0xffb700,
        emissiveIntensity: 0.4,
        metalness: 0.98,
        roughness: 0.1,
      });
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.y = 0.72;
      weaponGroup.add(blade);
    } else if (cfg.weaponType === 'mystic_claymore') {
      // 7. Claymore Rúnica Mística Azul
      const hiltGeo = new THREE.CylinderGeometry(0.026, 0.026, 0.32, 8);
      const hilt = new THREE.Mesh(hiltGeo, trimMaterial);
      weaponGroup.add(hilt);

      const guardGeo = new THREE.BoxGeometry(0.34, 0.04, 0.06);
      const guard = new THREE.Mesh(guardGeo, trimMaterial);
      guard.position.y = 0.16;
      weaponGroup.add(guard);

      const bladeGeo = new THREE.BoxGeometry(0.085, 0.98, 0.02);
      const bladeMat = new THREE.MeshStandardMaterial({
        color: 0x93c5fd,
        emissive: 0x0284c7,
        emissiveIntensity: 0.5,
        metalness: 0.95,
      });
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.y = 0.68;
      weaponGroup.add(blade);
    } else {
      // Espada de Aço Polido / Arming Sword / Longsword
      const hiltGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.28, 8);
      const hilt = new THREE.Mesh(hiltGeo, trimMaterial);
      weaponGroup.add(hilt);

      const guardGeo = new THREE.BoxGeometry(0.3, 0.035, 0.06);
      const guard = new THREE.Mesh(guardGeo, trimMaterial);
      guard.position.y = 0.14;
      weaponGroup.add(guard);

      const bladeGeo = new THREE.BoxGeometry(0.08, 0.9, 0.02);
      const blade = new THREE.Mesh(bladeGeo, trimMaterial);
      blade.position.y = 0.62;
      weaponGroup.add(blade);
    }

    // 12. PARTÍCULAS EM 3D (BRASAS / CENTELHAS)
    const emberCount = 60;
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
      color: cfg.emberColor,
      size: 0.06,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const emberParticles = new THREE.Points(emberGeo, emberMat);
    scene.add(emberParticles);

    // --- CONTROLES DE ROTAÇÃO 360° COM POINTER EVENTS ---
    let targetRotationY = rotationRef.current || 0;
    let currentRotationY = rotationRef.current || 0;
    let previousMouseX = 0;
    let angularVelocity = 0;
    let dragging = false;

    const onPointerDown = (e) => {
      dragging = true;
      setIsDragging(true);
      previousMouseX = e.clientX;
      angularVelocity = 0;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (err) {}
    };

    const onPointerMove = (e) => {
      if (!dragging) return;
      const deltaX = e.clientX - previousMouseX;
      previousMouseX = e.clientX;

      angularVelocity = deltaX * 0.012;
      targetRotationY += angularVelocity;
    };

    const onPointerUp = (e) => {
      if (!dragging) return;
      dragging = false;
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {}
    };

    const domElement = renderer.domElement;
    domElement.style.touchAction = 'none';
    domElement.style.cursor = 'grab';
    domElement.addEventListener('pointerdown', onPointerDown);
    domElement.addEventListener('pointermove', onPointerMove);
    domElement.addEventListener('pointerup', onPointerUp);
    domElement.addEventListener('pointercancel', onPointerUp);

    // --- LOOP DE ANIMAÇÃO A 60FPS ---
    let clock = new THREE.Clock();
    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (dragging) {
        // Usuário arrastando ativamente com o dedo/mouse
      } else {
        // Desaceleração suave por inércia após soltar o arraste
        if (Math.abs(angularVelocity) > 0.0001) {
          targetRotationY += angularVelocity;
          angularVelocity *= 0.92;
        } else {
          angularVelocity = 0;
        }

        // Rotação contínua automática suave e majestosa (nunca trava)
        if (autoRotate) {
          targetRotationY += 0.006;
        }
      }

      currentRotationY += (targetRotationY - currentRotationY) * 0.12;
      rotationRef.current = currentRotationY;
      rootGroup.rotation.y = currentRotationY;

      // Respiração viva
      const breatheOffset = Math.sin(elapsedTime * 2.2) * 0.018;
      warrior.position.y = 0.28 + breatheOffset;

      // Anel rúnico no chão gira lentamente
      if (runicCircle) {
        runicCircle.rotation.z += 0.005;
      }

      // Fogo da fornalha pulsa realisticamente
      forgeFireLight.intensity = cfg.fireIntensity + Math.sin(elapsedTime * 8) * 0.35;

      // Movimentação das partículas
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

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 340;
      camera.aspect = newW / h;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      domElement.removeEventListener('pointerdown', onPointerDown);
      domElement.removeEventListener('pointermove', onPointerMove);
      domElement.removeEventListener('pointerup', onPointerUp);
      domElement.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('resize', handleResize);

      if (rendererRef.current) {
        try {
          rendererRef.current.dispose();
        } catch (e) {}
      }
      if (container && renderer && renderer.domElement && container.contains(renderer.domElement)) {
        try {
          container.removeChild(renderer.domElement);
        } catch (e) {}
      }
    };
  }, [tierMin, height, autoRotate]);

  if (webGLError) {
    const cfg = getTier3DConfig(tierMin);
    return (
      <div
        className="relative w-full flex flex-col items-center justify-center p-6 text-center select-none rounded-xl bg-gradient-to-b from-[#1c130c] to-[#0c0805] border border-amber-600/30"
        style={{ height: `${height}px` }}
      >
        <div className="text-6xl mb-3 animate-pulse">🛡️</div>
        <div className="font-display text-lg font-black text-amber-300 tracking-wider">
          {cfg.name}
        </div>
        <div className="text-xs font-mono text-amber-200/70 mt-1 max-w-xs">
          {curLang === 'en' ? 'Live WebGL canvas fallback' : curLang === 'es' ? 'Modo compatible activado' : 'Modo compatibilidade gráfica ativado'}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      <div
        ref={containerRef}
        style={{ height: `${height}px`, width: '100%', cursor: isDragging ? 'grabbing' : 'grab' }}
        className="relative overflow-hidden touch-none"
      />

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
