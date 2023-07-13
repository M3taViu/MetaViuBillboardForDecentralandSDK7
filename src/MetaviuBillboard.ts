import { engine, GltfContainer, Material, MeshRenderer, Transform, VideoPlayer, pointerEventsSystem, InputAction  } from '@dcl/sdk/ecs'
import { getSceneInfo } from '~system/Scene'
import {  Quaternion, Vector3 } from '@dcl/sdk/math'
import { Entity } from '@dcl/sdk/ecs'
import { _openExternalURL } from './MetaviuAddIn'
import { getUserData } from '~system/UserIdentity'
import { onEnterSceneObservable, onLeaveSceneObservable} from '@dcl/sdk/observables'


class MetaviuBillboard {
  private billboard_id: number;
  private billboard_type: string;
  private redirect_url: Array<{ key: number, value: string }> = [];
  private readonly baseApiUrl = 'https://billboards-api.metaviu.io';


  constructor(billboardId: number, billboardType: string, X: number, Y: number, Z: number) {
    this.billboard_id = billboardId;
    this.billboard_type = billboardType.toLowerCase();

    const billboardEntity = this.createEntity(X, Y, Z);
    this.initialize(billboardEntity);
  }

  private createEntity(  X: number, Y: number, Z: number): Entity {
    const billboardEntity = engine.addEntity();
    let model = '';
    switch (this.billboard_type) {
      case "double":
          model = 'models/MetaViu/MetaViuDouble.glb';
          break;
      case "triple":
          model = 'models/MetaViu/MetaViuTriple.glb';
          break;
      case "quadruple":
        model = 'models/MetaViu/MetaViuQuadruple.glb';
          break;
      case "panel":
        model = 'models/MetaViu/MetaViuPanel.glb';
          break;
      default:
        console.error('MetaViuBillboards error: unknown type', this.billboard_type);
    }

   
     GltfContainer.create(billboardEntity, {
        src: model,
      })
    
    Transform.create(billboardEntity, {
      position: Vector3.create(X, Y, Z),
      scale: Vector3.create(1, 1, 1),
    });

    return billboardEntity;
  }

  private addRedirect(key: number, value: string) {
    this.redirect_url.push({ key, value });
  }
  
  private getRedirectUrl(key: number) {
    const redirectUrl = this.redirect_url.find(redirect => redirect.key === key);
    return redirectUrl ? redirectUrl.value : 'https://metaviu.io';
  }



  private async findAd(host: Entity) {
    const userData = await getUserData({});
    const sceneInfo = await getSceneInfo({});

    if (!userData || !userData.data) {
      console.error('MetaViuBillboards error: missing userData');
      return;
    }
   
    let request = {
      billboard_type: this.billboard_type,
      billboard_id: this.billboard_id,
      type: ['image', 'video'],
      mime_type: ['image/jpeg', 'image/png', 'video/mp4'],
      context: {
        scene_data: sceneInfo,
        user: userData,
      },
      vendor: 'Decentraland',
      version: 'SDK7-Alpha',
    };

    try {
          const response = await this.fetchFromApi('show_ad', request);
          this.addRedirect(this.billboard_id, response.redirect_url);
          switch (this.billboard_type) {
            case "double":
              this.createMonitor(host, Vector3.create(-0.05, 4.8, 0.3), Vector3.create(5.1, 2.9, 4), Quaternion.fromEulerDegrees(0, 90, 0), response.content.side_1.type, response.content.side_1.url);
              this.createMonitor(host, Vector3.create(0.05, 4.8, 0.3), Vector3.create(5.1, 2.9, 4), Quaternion.fromEulerDegrees(0, 270, 0), response.content.side_2.type, response.content.side_2.url);
                break;
            case "triple":
              this.createMonitor(host, Vector3.create(2.837, 4.04, 0.34), Vector3.create(3.54, 2.5, 2), Quaternion.fromEulerDegrees(0, -101.4, 0), response.content.side_1.type, response.content.side_1.url);
              this.createMonitor(host, Vector3.create(1.152, 4.04, 0.89), Vector3.create(3.54, 2.5, 2), Quaternion.fromEulerDegrees(0, 138.65, 0), response.content.side_2.type, response.content.side_2.url);
              this.createMonitor(host, Vector3.create(1.5, 4.04, -0.846), Vector3.create(3.54, 2.5, 2), Quaternion.fromEulerDegrees(0, 18.7, 0), response.content.side_3.type, response.content.side_3.url);
                break;
            case "quadruple":
              this.createMonitor(host, Vector3.create(1.85, 4.15, 1.78), Vector3.create(3.2, 2.5, 2), Quaternion.fromEulerDegrees(0, 180, 0), response.content.side_1.type, response.content.side_1.url);
              this.createMonitor(host, Vector3.create(1.85, 4.15, -1.55), Vector3.create(3.2, 2.5, 2), Quaternion.Zero(), response.content.side_2.type, response.content.side_2.url);
              this.createMonitor(host, Vector3.create(3.5, 4.15, 0.14), Vector3.create(3.2, 2.5, 2), Quaternion.fromEulerDegrees(0, -90, 0), response.content.side_3.type, response.content.side_3.url);
              this.createMonitor(host, Vector3.create(0.18, 4.15, 0.14), Vector3.create(3.2, 2.5, 2), Quaternion.fromEulerDegrees(0, 90, 0), response.content.side_4.type, response.content.side_4.url);
                break;
            case "panel":
              this.createMonitor(host, Vector3.create(-0.05, 2.8, 0.3), Vector3.create(5.1, 2.9, 4), Quaternion.fromEulerDegrees(0, 90, 0), response.content.side_1.type, response.content.side_1.url);
              this.createMonitor(host, Vector3.create(0.05, 2.8, 0.3), Vector3.create(5.1, 2.9, 4), Quaternion.fromEulerDegrees(0, 270, 0), response.content.side_2.type, response.content.side_2.url);
                break;
            default:
              console.error('MetaViuBillboards error: unknown type', this.billboard_type);
          }

          // set rotation systems
          onEnterSceneObservable.add((player) => {
            try {
              const requestBody = {'billboard_id': player.userId, 'client_id': response.client_id, type: "in"};
             this.fetchFromApi('set_scene_observable', requestBody);
            } catch (e) {
              console.error('MetaViuBillboards error: Failed To enter scene save', e);
            }
          })
          
          onLeaveSceneObservable.add((player) => {
            try {
              const requestBody = {'billboard_id': player.userId, 'client_id': response.client_id, type: "out"};
              this.fetchFromApi('set_scene_observable', requestBody);
            } catch (e) {
              console.error('MetaViuBillboards error: Failed to leave scene', e);
            }
          })
    } catch (err) {
      console.error('MetaViuBillboards error: Error in findAd:', err);
    }
  }



  private initialize(billboardEntity: Entity): void {
    this.findAd(billboardEntity).then();

    pointerEventsSystem.onPointerDown(
      {
        entity: billboardEntity,
        opts: { button: InputAction.IA_POINTER, hoverText: 'Interact' }
      },
      (e) => {
        this.setLinkClick(this.billboard_id, 'str');
        return _openExternalURL(this.getRedirectUrl(this.billboard_id));
      }
    );
  }

  private async fetchFromApi(apiPath: string, requestBody: object) {
    try {
      const url = `${this.baseApiUrl}/${apiPath}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(requestBody),
      });
      
      return await response.json();
    } catch (error) {
      console.error('MetaViuBillboards error: Failed to fetch from API', error);
      return null;
    }
  }

 // helper method to create Material
 private createMaterial(monitor: Entity, contentUrl: string, isVideo: boolean) {
    const contentTexture = isVideo 
      ? Material.Texture.Video({ videoPlayerEntity: monitor }) 
      : Material.Texture.Common({ src: contentUrl });

    const materialParams = {
      texture: contentTexture,
      roughness: 1.0,
      specularIntensity: 0,
      metallic: 0,
    };

    Material.setPbrMaterial(monitor, materialParams);
  }

  private async setLinkClick(billboard_id: number, client_id: string){
    try {
      const requestBody = {'billboard_id': billboard_id, 'client_id': client_id};
      await this.fetchFromApi('set_client_link_click', requestBody);
    } catch (e) {
      console.error('MetaViuBillboards error: Failed to Click save', e);
    }
  }


  private createMonitor(parent: Entity, position: Vector3, scale: Vector3, rotation: Quaternion, contentType: string, contentUrl: string): Entity {
    let monitor = engine.addEntity();
    MeshRenderer.setPlane(monitor);
    Transform.create(monitor, {
      position: position,
      scale: scale,
      rotation: rotation,
      parent: parent,
    });

    if (contentType === 'video') {
      VideoPlayer.create(monitor, {
        src: contentUrl,
        playing: true,
      });
    }

    this.createMaterial(monitor, contentUrl, contentType === 'video');

    return monitor;
  }

}

export default MetaviuBillboard;
