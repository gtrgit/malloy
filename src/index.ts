import {
  Animator,
  AudioSource,
  AvatarAttach,
  engine,
  GltfContainer,
  InputAction,
  Material,
  MeshCollider,
  MeshRenderer,
  pointerEventsSystem,
  Transform,
  VisibilityComponent
} from '@dcl/sdk/ecs'
import { triggerSceneEmote, triggerEmote , movePlayerTo  } from '~system/RestrictedActions';
import { Color4 , Vector3} from '@dcl/sdk/math'
import { initAssetPacks } from '@dcl/asset-packs/dist/scene-entrypoint'

// You can remove this if you don't use any asset packs
initAssetPacks(engine, pointerEventsSystem, {
  Animator,
  AudioSource,
  AvatarAttach,
  Transform,
  VisibilityComponent,
  GltfContainer
})

import { bounceScalingSystem, circularSystem } from './systems'

import { setupUi } from './ui'
import { BounceScaling, Spinner } from './components'
import { createCube } from './factory'

// Defining behavior. See `src/systems.ts` file.
engine.addSystem(circularSystem)
engine.addSystem(bounceScalingSystem)

export function main() {
  // draw UI
  setupUi()
  console.log('--------------------------')
  // fetch cube from Inspector
  const cube = engine.getEntityOrNullByName('Magic Cube')
  if (cube) {
    // Give the cube a color
    Material.setPbrMaterial(cube, { albedoColor: Color4.Blue() })

    // Make the cube spin, with the circularSystem
    Spinner.create(cube, { speed: 10 })

    // Give the cube a collider, to make it clickable
    MeshCollider.setBox(cube)

    // Add a click behavior to the cube, spawning new cubes in random places, and adding a bouncy effect for feedback
    pointerEventsSystem.onPointerDown(
      { entity: cube, opts: { button: InputAction.IA_POINTER, hoverText: 'spawn' } },
      () => {
        console.log('pressed')
        // createCube(1 + Math.random() * 8, Math.random() * 8, 1 + Math.random() * 8, false)
        // createBlockPlayer()
        BounceScaling.createOrReplace(cube)
      }
    )
  }
}


export function emotez(){

        const emoter = engine.addEntity()
        Transform.create(emoter, { position: Vector3.create(8, 0, 8) })
        MeshRenderer.setBox(emoter)
        MeshCollider.setBox(emoter)
        triggerEmote({ predefinedEmote: 'robot'})
      // pointerEventsSystem.onPointerDown(
      //   {
      //     entity: emoter,
      //     opts: { button: InputAction.IA_POINTER, hoverText: 'Dance' },
      //   },
      //   () => {
      //     triggerEmote({ predefinedEmote: 'robot' })
      //   }
      // )
}
export function createBlockPlayer(x: number, y: number, z: number, spawner = true){
  const PlayerTransform = Transform.get(engine.PlayerEntity);

  console.log('pos'+PlayerTransform.position)
const space = .7
createCube(PlayerTransform.position.x-space, PlayerTransform.position.y, PlayerTransform.position.z, false)
createCube(PlayerTransform.position.x, PlayerTransform.position.y, PlayerTransform.position.z+space, false)
createCube(PlayerTransform.position.x, PlayerTransform.position.y, PlayerTransform.position.z-space, false)
createCube(PlayerTransform.position.x+space, PlayerTransform.position.y, PlayerTransform.position.z, false)

}

export function movePlayerz(){
  movePlayerTo({
    newRelativePosition: Vector3.create(1, 0, 1),
    cameraTarget: Vector3.create(8, 1, 8),
  })
}