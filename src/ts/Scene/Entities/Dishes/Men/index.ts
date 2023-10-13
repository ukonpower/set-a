import * as GLP from 'glpower';

import { gl, globalUniforms } from '~/ts/Globals';
import { hotGet, hotUpdate } from '~/ts/libs/glpower_local/Framework/Utils/Hot';

import menVert from './shaders/men.vs';
import menFrag from './shaders/men.fs';
import menCompute from './shaders/menCompute.glsl';

export class Men extends GLP.Entity {

	private gpu: GLP.GPUComputePass;

	constructor() {

		super();

		const count = new GLP.Vector( 64, 256 );

		// gpu

		this.gpu = new GLP.GPUComputePass( gl, {
			name: 'gpu/fluidParticle',
			size: count,
			layerCnt: 2,
			frag: menCompute,
			uniforms: globalUniforms.time,
		} );

		this.gpu.initTexture( ( l, x, y ) => {

			return [ 0, 0, 0, Math.random() ];

		} );

		this.addComponent( "gpuCompute", new GLP.GPUCompute( { passes: [
			this.gpu
		] } ) );

		// geometry

		const range = new GLP.Vector( 10.0, 5.0, 10.0 );

		const idArray = [];

		for ( let i = 0; i < count.y; i ++ ) {

			idArray.push( i / count.y, Math.random(), Math.random() );

		}

		const geo = this.addComponent( "geometry", new GLP.CubeGeometry( 0.1, 0.1, 0.1, 1.0, count.x ) );
		geo.setAttribute( "id", new Float32Array( idArray ), 3, { instanceDivisor: 1 } );

		// material

		const mat = this.addComponent( "material", new GLP.Material( {
			name: "fluid",
			type: [ "deferred", 'shadowMap' ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time, {
				uRange: {
					value: range,
					type: "3f"
				},
			}, this.gpu.uniforms ),
			vert: hotGet( 'menVert', menVert ),
			frag: hotGet( 'menFrag', menFrag ),
		} ) );

		if ( import.meta.hot ) {

			import.meta.hot.accept( [ "./shaders/men.vs", "./shaders/men.fs" ], ( module ) => {

				if ( module[ 0 ] ) {

					mat.vert = hotUpdate( 'menVert', module[ 0 ].default );

				}

				if ( module[ 1 ] ) {

					mat.frag = hotUpdate( 'menFrag', module[ 1 ].default );

				}

				mat.requestUpdate();

			} );

			import.meta.hot.accept( "./shaders/menCompute.glsl", ( module ) => {

				if ( module ) {

					this.gpu.frag = hotUpdate( "menCompute", module.default );
					this.gpu.requestUpdate();

				}

			} );

		}

	}

	protected appendBlidgerImpl( blidger: GLP.BLidger ): void {

		this.gpu.uniforms = GLP.UniformsUtils.merge( this.gpu.uniforms, blidger.uniforms );

	}

}
