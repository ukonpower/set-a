import * as GLP from 'glpower';

import { gl, globalUniforms } from '~/ts/Globals';
import { hotGet, hotUpdate } from '~/ts/libs/glpower_local/Framework/Utils/Hot';

import fluidParticlesVert from './shaders/fluidParticles.vs';
import fluidParticlesFrag from './shaders/fluidParticles.fs';
import fluidParticlesCompute from './shaders/fluidParticlesCompute.glsl';

export class FluidParticles extends GLP.Entity {

	private gpu: GLP.GPUComputePass;

	constructor() {

		super();

		const count = new GLP.Vector( 64, 64 );

		// gpu

		this.gpu = new GLP.GPUComputePass( gl, {
			name: 'gpu/fluidParticle',
			size: count,
			layerCnt: 2,
			frag: fluidParticlesCompute,
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
		const computeUVArray = [];
		const idArray = [];

		for ( let i = 0; i < count.y; i ++ ) {

			for ( let j = 0; j < count.x; j ++ ) {

				positionArray.push( ( Math.random() - 0.5 ) * range.x * 0.0 );
				positionArray.push( ( Math.random() - 0.5 ) * range.y * 0.0 );
				positionArray.push( ( Math.random() - 0.5 ) * range.z * 0.0 );

				computeUVArray.push( j / count.x, i / count.y );

				idArray.push( Math.random(), Math.random(), Math.random() );

			}

		}

		const geo = this.addComponent( "geometry", new GLP.SphereGeometry( 0.1, ) );
		geo.setAttribute( "offsetPosition", new Float32Array( positionArray ), 3, { instanceDivisor: 1 } );
		geo.setAttribute( "computeUV", new Float32Array( computeUVArray ), 2, { instanceDivisor: 1 } );
		geo.setAttribute( "id", new Float32Array( idArray ), 3, { instanceDivisor: 1 } );

		// material

		const mat = this.addComponent( "material", new GLP.Material( {
			name: "fluid",
			type: [ "deferred", 'shadowMap' ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time, globalUniforms.resolution, {
				uRange: {
					value: range,
					type: "3f"
				},
				...this.gpu.outputUniforms
			} ),
			vert: hotGet( 'fluidParticlesVert', fluidParticlesVert ),
			frag: hotGet( 'fluidParticlesFrag', fluidParticlesFrag ),
			// drawType: gl.POINTS
		} ) );

		if ( import.meta.hot ) {

			import.meta.hot.accept( [ "./shaders/fluidParticles.vs", "./shaders/fluidParticles.fs" ], ( module ) => {

				if ( module[ 0 ] ) {

					mat.vert = hotUpdate( 'fluidParticlesVert', module[ 0 ].default );

				}

				if ( module[ 1 ] ) {

					mat.frag = hotUpdate( 'fluidParticlesFrag', module[ 1 ].default );

				}

				mat.requestUpdate();

			} );

		}

	}

}
