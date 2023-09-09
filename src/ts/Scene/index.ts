import * as GLP from 'glpower';
import { Carpenter } from './Carpenter';
import { blidge, gl, globalUniforms, power } from '../Globals';

import { MainCamera } from './Entities/MainCamera';
import { Renderer } from './Renderer';


export class Scene extends GLP.EventEmitter {

	private currentTime: number;
	private elapsedTime: number;
	private deltaTime: number;

	private root: GLP.Entity;
	private camera: GLP.Entity;
	private renderer: Renderer;

	private carpenter: Carpenter;

	constructor() {

		super();

		// state

		this.currentTime = new Date().getTime();
		this.elapsedTime = 0;
		this.deltaTime = 0;

		// root

		this.root = new GLP.Entity();

		// camera

		const gBuffer = new GLP.GLPowerFrameBuffer( gl );
		gBuffer.setTexture( [
			power.createTexture().setting( { type: gl.FLOAT, internalFormat: gl.RGBA32F, format: gl.RGBA } ),
			power.createTexture().setting( { type: gl.FLOAT, internalFormat: gl.RGBA32F, format: gl.RGBA } ),
			power.createTexture(),
			power.createTexture(),
			power.createTexture().setting( { type: gl.FLOAT, internalFormat: gl.RGBA32F, format: gl.RGBA } ),
		] );

		const deferredBuffer = new GLP.GLPowerFrameBuffer( gl, { disableDepthBuffer: true } );
		deferredBuffer.setTexture( [ power.createTexture(), power.createTexture() ] );

		const forwardBuffer = new GLP.GLPowerFrameBuffer( gl, { disableDepthBuffer: true } );
		forwardBuffer.setDepthTexture( gBuffer.depthTexture );
		forwardBuffer.setTexture( [ deferredBuffer.textures[ 0 ] ] );

		this.root.on( 'resize', ( event: GLP.EntityResizeEvent ) => {

			gBuffer.setSize( event.resolution );
			deferredBuffer.setSize( event.resolution );
			forwardBuffer.setSize( event.resolution );

		} );

		this.camera = new MainCamera( { renderTarget: { gBuffer, deferredBuffer, forwardBuffer } } );
		this.camera.position.set( 0, 0, 4 );
		this.root.add( this.camera );

		// carpenter

		this.carpenter = new Carpenter( this.root, this.camera );

		// renderer

		this.renderer = new Renderer();
		this.root.add( this.renderer );

	}

	public update() {

		const currentTime = new Date().getTime();
		this.deltaTime = ( currentTime - this.currentTime ) / 1000;
		this.elapsedTime += this.deltaTime;
		this.currentTime = currentTime;

		// blidge.frame.current = this.elapsedTime * 30 % blidge.frame.end;

		globalUniforms.time.uTime.value = this.elapsedTime;
		globalUniforms.time.uFractTime.value = this.elapsedTime % 1;

		const event: GLP.EntityUpdateEvent = {
			time: this.elapsedTime,
			deltaTime: this.deltaTime,
		};

		const renderStack = this.root.update( event );

		this.root.noticeRecursive( "sceneTick", event, );

		this.emit( "update" );

		this.renderer.render( renderStack );

	}

	public resize( size: GLP.Vector ) {

		globalUniforms.resolution.uResolution.value.copy( size );

		this.root.resize( {
			resolution: size
		} );

	}

	public dispose() {

		this.emit( 'dispose' );

	}

}
