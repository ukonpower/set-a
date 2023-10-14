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

		const elm = document.createElement( "svg" );
		elm.innerHTML = `<svg width="977" height="648" viewBox="0 0 977 648" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M458.025 442.904L434.624 466.648C420.401 446.689 396.771 425.583 363.736 403.33L385.759 380.618C409.618 395.53 433.707 416.292 458.025 442.904ZM367.177 618.062C414.436 614.85 462.269 592.597 510.675 551.302C541.187 522.625 567.455 483.166 589.479 432.925C591.773 427.648 593.149 422.716 593.608 418.127L626.3 427.763L619.417 441.183C569.634 555.432 491.634 624.37 385.415 648L367.177 618.062Z" fill="black"/>
		<path d="M201.311 389.565V401.61L205.096 421.913C210.372 456.095 221.958 495.21 239.852 539.258C249.487 562.887 263.367 585.141 281.491 606.017C284.702 609.688 288.717 613.014 293.535 615.997H293.879L268.414 639.397C268.414 638.25 265.661 634.465 260.155 628.041C220.467 582.617 192.363 510.352 175.846 411.245C174.699 405.051 173.322 399.43 171.716 394.383L201.311 389.565ZM81.9007 391.286L112.183 393.695C110.807 395.071 109.66 401.61 108.742 413.31C101.401 494.752 77.5419 564.608 37.165 622.879C31.6591 631.597 28.9061 636.529 28.9061 637.676L0 616.685C24.7767 590.302 41.6386 564.149 50.5857 538.226C65.4976 503.125 75.4771 464.698 80.5242 422.945C81.4419 411.016 81.9007 400.463 81.9007 391.286Z" fill="black"/>
		<path d="M707.168 159.672L692.371 124.572L736.074 135.239H914.329L976.27 133.519L967.667 163.801L914.329 159.672H707.168Z" fill="black"/>
		<path d="M539.237 205.784L511.019 197.869L564.702 125.948L466.283 144.187L503.449 286.997L478.328 294.567L440.474 149.348L371.65 162.769L364.08 136.272L434.28 124.228L420.171 71.5771L445.636 64.3506L460.089 119.066L588.79 96.3538L607.717 114.592L539.237 205.784Z" fill="black"/>
		<path d="M31.315 35.7885C112.298 34.6415 174.584 25.3502 218.172 7.91477L230.905 0L262.22 23.7443L229.873 33.7238C206.014 40.1474 188.808 44.621 178.254 47.1445L177.222 113.216H270.479C276.444 113.216 282.179 112.642 287.685 111.495V141.434C282.638 140.057 276.902 139.369 270.479 139.369H176.534C172.863 217.599 135.125 267.382 63.3182 288.717L37.8533 264.285C108.283 252.814 145.678 211.175 150.037 139.369H23.4002C17.4354 139.369 11.7001 140.057 6.19415 141.434V111.495C8.02946 112.183 12.6177 112.757 19.959 113.216H150.725L151.413 50.9299C122.278 55.5181 89.2419 59.074 52.3063 61.5976L31.315 35.7885Z" fill="black"/>
		</svg>
		`;

		document.body.appendChild( elm );

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
