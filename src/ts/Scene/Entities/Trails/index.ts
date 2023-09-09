import * as GLP from 'glpower';

import { gl, globalUniforms } from '~/ts/Globals';
import { hotGet, hotUpdate } from '~/ts/libs/glpower_local/Framework/Utils/Hot';

import trailsVert from './shaders/trails.vs';
import trailsFrag from './shaders/trails.fs';
import trailsCompute from './shaders/trailsCompute.glsl';

export class Trails extends GLP.Entity {

	private gpu: GLP.GPUComputePass;

	constructor() {

		super();

		const num = new GLP.Vector( 64, 256 );

		// gpu

		this.gpu = new GLP.GPUComputePass( gl, {
			name: 'gpu/trails',
			size: num,
			layerCnt: 2,
			frag: trailsCompute,
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

		const positionArray = [];
		const trailIdArray = [];
		const idArray = [];

		for ( let i = 0; i < num.y; i ++ ) {

			positionArray.push( ( Math.random() - 0.5 ) * range.x * 0.0 );
			positionArray.push( ( Math.random() - 0.5 ) * range.y * 0.0 );
			positionArray.push( ( Math.random() - 0.5 ) * range.z * 0.0 );

			trailIdArray.push( i / num.y );

			idArray.push( Math.random(), Math.random(), Math.random() );

		}

		const geo = this.addComponent( "geometry", new GLP.CubeGeometry( 0.05, 0.05, 0.05, 1.0, num.x ) );
		geo.setAttribute( "offsetPosition", new Float32Array( positionArray ), 3, { instanceDivisor: 1 } );
		geo.setAttribute( "trailId", new Float32Array( trailIdArray ), 1, { instanceDivisor: 1 } );
		geo.setAttribute( "id", new Float32Array( idArray ), 3, { instanceDivisor: 1 } );

		// material

		const mat = this.addComponent( "material", new GLP.Material( {
			name: "trails",
			type: [ "deferred", 'shadowMap' ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time, this.gpu.outputUniforms, {
				uGPUResolution: {
					value: this.gpu.size,
					type: "2f"
				}
			} ),
			vert: hotGet( 'trailsVert', trailsVert ),
			frag: hotGet( 'trailsFrag', trailsFrag ),
			// drawType: gl.POINTS
		} ) );


		if ( import.meta.hot ) {

			import.meta.hot.accept( [ "./shaders/trails.vs", "./shaders/trails.fs" ], ( module ) => {

				if ( module[ 0 ] ) {

					mat.vert = hotUpdate( 'trailsVert', module[ 0 ].default );

				}

				if ( module[ 1 ] ) {

					mat.frag = hotUpdate( 'trailsFrag', module[ 1 ].default );

				}

				mat.requestUpdate();

			} );

		}

	}

}
