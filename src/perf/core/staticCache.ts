/**
 * Museum Virtual Undip — Static Computations & Geometry Cache
 * Mengoptimalkan kalkulasi statis Three.js: pembekuan matriks (matrixAutoUpdate = false),
 * shadow map statis ter-cache, GPU instancing otomatis, dan PMREM environment mapping.
 */

import * as THREE from 'three'

class StaticOptimizationManager {
  private cachedEnvMap: THREE.Texture | null = null
  private pmremGenerator: THREE.PMREMGenerator | null = null

  /**
   * Bekukan matriks transformasi untuk objek yang tidak bergerak.
   * Menghemat kalkulasi perkalian matriks per frame pada ratusan mesh.
   */
  public markStatic(root: THREE.Object3D): void {
    root.traverse((child) => {
      if ((child as THREE.Mesh).isMesh || (child as THREE.Group).isGroup) {
        child.matrixAutoUpdate = false
        child.updateMatrix()
      }
    })
  }

  /**
   * Konfigurasi Shadow Map Statis:
   * Matikan autoUpdate agar shadow map tidak di-render ulang setiap frame,
   * hanya di-bake sekali saat adegan selesai ditata.
   */
  public setupStaticShadows(renderer: THREE.WebGLRenderer): void {
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.shadowMap.autoUpdate = false
    renderer.shadowMap.needsUpdate = true
  }

  /**
   * Trigger pembaruan bayangan saat ada lampu atau objek bergerak
   */
  public refreshShadows(renderer: THREE.WebGLRenderer): void {
    renderer.shadowMap.needsUpdate = true
  }

  /**
   * Helper Pembuatan InstancedMesh Otomatis
   * Menggabungkan N objek identik (mis. 50 pilar atau 100 kursi) menjadi 1 draw call.
   */
  public createInstancedMesh(
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    transforms: Array<{
      position: [number, number, number]
      rotation?: [number, number, number]
      scale?: [number, number, number]
    }>,
    castShadow = false,
    receiveShadow = false,
  ): THREE.InstancedMesh {
    const count = transforms.length
    const instanced = new THREE.InstancedMesh(geometry, material, count)
    instanced.castShadow = castShadow
    instanced.receiveShadow = receiveShadow

    const dummy = new THREE.Object3D()

    transforms.forEach((t, i) => {
      dummy.position.set(...t.position)
      if (t.rotation) dummy.rotation.set(...t.rotation)
      if (t.scale) dummy.scale.set(...t.scale)
      dummy.updateMatrix()
      instanced.setMatrixAt(i, dummy.matrix)
    })

    instanced.instanceMatrix.needsUpdate = true
    instanced.matrixAutoUpdate = false
    instanced.updateMatrix()

    return instanced
  }

  /**
   * Cache PMREM Environment Map
   * Menghindari kalkulasi ulang PMREMGenerator yang sangat berat untuk pantulan PBR.
   */
  public getOrGenerateEnvMap(renderer: THREE.WebGLRenderer, sourceTexture: THREE.Texture): THREE.Texture {
    if (this.cachedEnvMap) {
      return this.cachedEnvMap
    }

    if (!this.pmremGenerator) {
      this.pmremGenerator = new THREE.PMREMGenerator(renderer)
      this.pmremGenerator.compileEquirectangularShader()
    }

    const env = this.pmremGenerator.fromEquirectangular(sourceTexture).texture
    this.cachedEnvMap = env
    return env
  }

  public dispose(): void {
    if (this.cachedEnvMap) {
      this.cachedEnvMap.dispose()
      this.cachedEnvMap = null
    }
    if (this.pmremGenerator) {
      this.pmremGenerator.dispose()
      this.pmremGenerator = null
    }
  }
}

export const staticCache = new StaticOptimizationManager()
