import { EventEmitter } from '../../utils/EventEmitter';
import { Entity, EntityResizeEvent, EntityUpdateEvent } from '../Entity';

export type ComponentUpdateEvent = EntityUpdateEvent & {
	entity: Entity,
}

export type ComponentResizeEvent = EntityResizeEvent & {
	entity: Entity,
}

export type BuiltInComponents =
	'camera' |
	'cameraShadowMap' |
	'perspective' |
	"orthographic" |
	'material' |
	'geometry' |
	'light' |
	'blidger' |
	'postprocess' |
	'gpuCompute' |
( string & {} );

export class Component extends EventEmitter {

	protected entity: Entity | null;

	constructor() {

		super();

		this.entity = null;

	}

	public setEntity( entity: Entity | null ) {

		const beforeEntity = this.entity;

		this.entity = entity;

		this.setEntityImpl( this.entity, beforeEntity );

	}

	public update( event: ComponentUpdateEvent ) {

		if ( this.entity ) {

			this.updateImpl( event );

		}

	}

	public resize( event: ComponentResizeEvent ) {

		if ( this.entity ) {

			this.resizeImpl( event );

		}

	}

	protected setEntityImpl( entity: Entity | null, prevEntity: Entity | null ) {}

	protected updateImpl( event: ComponentUpdateEvent ) {}

	protected resizeImpl( event: ComponentResizeEvent ) {}

	public dispose() {

		this.emit( 'dispose' );

	}

}
