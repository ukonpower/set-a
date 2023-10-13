import { RenderStack } from "~/ts/Scene/Renderer";
import { Component, ComponentUpdateEvent, ComponentResizeEvent, BuiltInComponents } from "../Component";
import { Camera } from "../Component/Camera";
import { GPUCompute } from "../Component/GPUCompute";
import { Geometry } from "../Component/Geometry";
import { Light } from "../Component/Light";
import { Material } from "../Component/Material";
import { Matrix } from "../../Math/Matrix";
import { Quaternion } from "../../Math/Quaternion";
import { Vector } from "../../Math/Vector";
import { EventEmitter } from "../../utils/EventEmitter";
import { BLidgeNode } from "../BLidge";
import { BLidger } from "../Component/BLidger";

export type EntityUpdateEvent = {
	time: number;
	deltaTime: number;
	matrix?: Matrix;
	renderStack?: RenderStack;
	visibility?: boolean;
	forceDraw?: boolean
}

export type EntityResizeEvent = {
	resolution: Vector
}

let entityCount: number = 0;

export class Entity extends EventEmitter {

	public name: string;
	public uuid: number;

	public position: Vector;
	public quaternion: Quaternion;
	public scale: Vector;

	public matrix: Matrix;
	public matrixWorld: Matrix;
	public matrixWorldPrev: Matrix;

	public parent: Entity | null;
	public children: Entity[];
	public components: Map<string, Component>;

	protected blidgeNode?: BLidgeNode;

	public visible: boolean;

	public userData: any;

	constructor() {

		super();

		this.name = "";
		this.uuid = entityCount ++;

		this.position = new Vector( 0.0, 0.0, 0.0, 1.0 );
		this.quaternion = new Quaternion( 0.0, 0.0, 0.0, 1.0 );
		this.scale = new Vector( 1.0, 1.0, 1.0 );

		this.matrix = new Matrix();
		this.matrixWorld = new Matrix();
		this.matrixWorldPrev = new Matrix();

		this.parent = null;
		this.children = [];

		this.components = new Map();

		this.visible = true;

		this.userData = {};

	}

	/*-------------------------------
		Update
	-------------------------------*/

	// before

	protected beforeUpdate( event:EntityUpdateEvent, cEvent: ComponentUpdateEvent ) {

		this.components.forEach( c => {

			c.preUpdate( cEvent );

		} );

	}

	// update

	public update( event: EntityUpdateEvent ) {

		if ( ! event.renderStack ) event.renderStack = {
			camera: [],
			light: [],
			deferred: [],
			forward: [],
			shadowMap: [],
			envMap: [],
			gpuCompute: [],
		};

		const childEvent = { ...event } as ComponentUpdateEvent;
		childEvent.entity = this;
		childEvent.matrix = this.matrixWorld;

		// pre update

		this.preUpdateImpl( event );

		this.components.forEach( c => {

			c.preUpdate( childEvent );

		} );

		// update

		this.updateImpl( event );

		this.components.forEach( c => {

			c.update( childEvent );

		} );

		// matrix

		this.updateMatrix();

		// after

		this.afterUpdateImpl( event );

		this.components.forEach( c => {

			c.afterUpdate( childEvent );

		} );

		// stack

		const visibility = ( event.visibility || event.visibility === undefined ) && this.visible;
		childEvent.visibility = visibility;

		const geometry = this.getComponent<Geometry>( 'geometry' );
		const material = this.getComponent<Material>( 'material' );

		if ( geometry && material && ( visibility || event.forceDraw ) ) {

			if ( material.visibilityFlag.deferred ) event.renderStack.deferred.push( this );
			if ( material.visibilityFlag.shadowMap ) event.renderStack.shadowMap.push( this );
			if ( material.visibilityFlag.forward ) event.renderStack.forward.push( this );
			if ( material.visibilityFlag.envMap ) event.renderStack.envMap.push( this );

		}

		const camera = this.getComponent<Camera>( 'camera' );

		if ( camera ) {

			event.renderStack.camera.push( this );

		}

		const light = this.getComponent<Light>( 'light' );

		if ( light ) {

			event.renderStack.light.push( this );

		}

		const gpuCompute = this.getComponent<GPUCompute>( "gpuCompute" );

		if ( gpuCompute ) {

			event.renderStack.gpuCompute.push( this );

		}

		// children

		for ( let i = 0; i < this.children.length; i ++ ) {

			this.children[ i ].update( childEvent );

		}

		return event.renderStack;

	}

	protected preUpdateImpl( event:EntityUpdateEvent ) {
	}

	protected updateImpl( event:EntityUpdateEvent ) {
	}

	protected afterUpdateImpl( event:EntityUpdateEvent ) {
	}

	/*-------------------------------
		Resize
	-------------------------------*/

	public resize( event: EntityResizeEvent ) {

		this.components.forEach( c => {

			const cEvent = event as ComponentResizeEvent;
			cEvent.entity = this;

			c.resize( cEvent );

		} );

		this.resizeImpl( event );

		this.emit( "resize", [ event ] );

		for ( let i = 0; i < this.children.length; i ++ ) {

			this.children[ i ].resize( event );

		}

	}

	protected resizeImpl( event:EntityResizeEvent ) {
	}

	/*-------------------------------
		SceneGraph
	-------------------------------*/

	public add( entity: Entity ) {

		if ( entity.parent ) {

			entity.parent.remove( entity );

		}

		entity.parent = this;

		this.children.push( entity );

	}

	public remove( entity: Entity ) {

		this.children = this.children.filter( c => c.uuid != entity.uuid );

	}

	/*-------------------------------
		Matrix
	-------------------------------*/

	public updateMatrix( updateParent?: boolean ) {

		if ( this.parent && updateParent ) {

			this.parent.updateMatrix( true );

		}

		const matrix = this.parent ? this.parent.matrixWorld : new Matrix();

		this.matrixWorldPrev.copy( this.matrixWorld );

		this.matrix.setFromTransform( this.position, this.quaternion, this.scale );

		this.matrixWorld.copy( this.matrix ).preMultiply( matrix );

	}

	public applyMatrix( matrix: Matrix ) {

		this.matrix.clone().multiply( matrix ).decompose(
			this.position,
			this.quaternion,
			this.scale
		);

	}

	/*-------------------------------
		Components
	-------------------------------*/

	public addComponent<T extends Component>( name: BuiltInComponents, component: T ) {

		const prevComponent = this.components.get( name );

		if ( prevComponent ) {

			prevComponent.setEntity( null );

		}

		component.setEntity( this );

		this.components.set( name, component );

		if ( name == "blidger" ) {

			this.appendBlidger( component as unknown as BLidger );

		}

		return component;

	}

	public getComponent<T extends Component>( name: BuiltInComponents ): T | undefined {

		return this.components.get( name ) as T;

	}

	public removeComponent( name: string ) {

		const component = this.components.get( name );

		this.components.delete( name );

		return component;

	}

	/*-------------------------------
		BLidger
	-------------------------------*/

	private appendBlidger( blidger: BLidger ) {

		this.blidgeNode = blidger.node;

		this.appendBlidgerImpl( blidger );

	}

	protected appendBlidgerImpl( blidger: BLidger ) {

		this.emit( "appendBlidger", [ blidger ] );

	}

	/*-------------------------------
		API
	-------------------------------*/

	public getEntityByName( name: string ) : Entity | undefined {

		if ( this.name == name ) {

			return this;

		}

		for ( let i = 0; i < this.children.length; i ++ ) {

			const c = this.children[ i ];

			const entity = c.getEntityByName( name );

			if ( entity ) {

				return entity;

			}

		}

		return undefined;

	}

	/*-------------------------------
		Event
	-------------------------------*/

	public notice( eventName: string, opt?: any ) {

		this.emit( "notice/" + eventName, [ opt ] );

	}

	public noticeRecursive( eventName: string, opt?: any ) {

		this.notice( eventName, opt );

		for ( let i = 0; i < this.children.length; i ++ ) {

			const c = this.children[ i ];

			c.noticeRecursive( eventName, opt );

		}

	}

	/*-------------------------------
		Dispose
	-------------------------------*/

	public dispose() {

		this.emit( "dispose" );

		this.parent && this.parent.remove( this );

		this.children.forEach( c => c.parent = null );

		this.components.forEach( c => c.setEntity( null ) );

	}

}
