import * as GLP from 'glpower';
import { Carpenter } from './Carpenter';
import { blidge, gl, globalUniforms, power } from '../Globals';

import { MainCamera } from './Entities/MainCamera';
import { Renderer } from './Renderer';
import { createTextures } from './Textures';

type SceneUpdateParam = {
	forceDraw: boolean
}

export class Scene extends GLP.EventEmitter {

	public currentTime: number;
	public elapsedTime: number;
	public deltaTime: number;

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
			power.createTexture().setting( { type: gl.FLOAT, internalFormat: gl.RGBA32F, format: gl.RGBA, magFilter: gl.NEAREST, minFilter: gl.NEAREST } ),
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

		// textures

		createTextures();

		// carpenter

		this.carpenter = new Carpenter( this.root, this.camera );

		this.carpenter.on( "loaded", () => {

			this.emit( "loaded" );

		} );

		// renderer

		this.renderer = new Renderer();
		this.root.add( this.renderer );

	}

	public update( param?: SceneUpdateParam ) {

		const currentTime = new Date().getTime();
		this.deltaTime = ( currentTime - this.currentTime ) / 1000;
		this.elapsedTime += this.deltaTime;
		this.currentTime = currentTime;

		globalUniforms.time.uTime.value = this.elapsedTime;
		globalUniforms.time.uFractTime.value = this.elapsedTime;
		globalUniforms.time.uTimeSeqPrev.value = globalUniforms.time.uTimeSeq.value;
		globalUniforms.time.uTimeSeq.value = blidge.frame.current / 30;

		if ( process.env.NODE_ENV != "development" ) {

			blidge.setFrame( this.elapsedTime * 30 );

		}

		const event: GLP.EntityUpdateEvent = {
			time: this.elapsedTime,
			deltaTime: this.deltaTime,
			forceDraw: param && param.forceDraw
		};

		const renderStack = this.root.update( event );

		this.root.noticeRecursive( "finishUp", event );

		this.renderer.render( renderStack );

		return this.deltaTime;

	}

	public resize( size: GLP.Vector ) {

		globalUniforms.resolution.uResolution.value.copy( size );

		this.root.resize( {
			resolution: size
		} );

	}

	public play( startTime: number ) {

		this.update();

		this.elapsedTime = startTime;

		this.emit( 'play' );

	}

	public dispose() {

		this.emit( 'dispose' );

	}

}
