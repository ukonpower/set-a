import * as GLP from 'glpower';

import paraFrag from './shaders/para.fs';
import paraVert from './shaders/para.vs';

import paraCompute from './shaders/paraCompute.glsl';

import { gl, globalUniforms } from '~/ts/Globals';
import { hotGet, hotUpdate } from '~/ts/libs/glpower_local/Framework/Utils/Hot';

export class ChahanPara extends GLP.Entity {

	private gpu: GLP.GPUComputePass;

	constructor() {

		super();

		const count = new GLP.Vector( 256, 64 );

		/*-------------------------------
			GPU
		-------------------------------*/

		this.gpu = new GLP.GPUComputePass( gl, {
			name: 'gpu/para',
			size: count,
			layerCnt: 2,
			frag: hotGet( "paraCompute", paraCompute ),
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time ),
		} );

		this.gpu.initTexture( ( l, x, y ) => {

			if ( l == 0 ) {

				return [ 0, 0, 0, Math.random() ];

			}

			{

				return [ 0, 0, 0, Math.random() ];

			}

		} );

		this.addComponent( "gpuCompute", new GLP.GPUCompute( { passes: [
			this.gpu
		] } ) );

		const mesh = [ "KOME", "NEGI", "NIKU", "TAMAGO" ];

		let guTotal = 0;
		const guNumArray = [ 40, 10, 10, 4 ];
		guNumArray.forEach( item => guTotal += item );
		const guRatioArray = guNumArray.map( item => item / guTotal );

		const geos = [
			new GLP.SphereGeometry( 0.05, 10, 5 ),
			new GLP.CylinderGeometry( 0.03, 0.03, 0.02, 10, 10, false ),
			new GLP.CubeGeometry( 0.035, 0.1, 0.035, 1.0, 10.0, 1.0 ),
			new GLP.CubeGeometry( 0.05, 0.07, 0.02 )
		];

		let toralRatio = 0;

		for ( let g = 0; g < mesh.length; g ++ ) {

			const gu = mesh[ g ];
			const guEntity = new GLP.Entity();
			this.add( guEntity );

			const idArray: number[] = [];
			const computeUVArray: number[] = [];

			for ( let i = 0; i < count.y * guRatioArray[ g ]; i ++ ) {

				for ( let j = 0; j < count.x; j ++ ) {

					computeUVArray.push(
						j / count.x,
						toralRatio + ( i ) / count.y * guRatioArray[ g ]
					);
					idArray.push( Math.random(), Math.random(), Math.random(), Math.random() );


				}

			}

			toralRatio += guRatioArray[ g ];

			const geo = geos[ g ];
			geo.setAttribute( "computeUV", new Float32Array( computeUVArray ), 2, { instanceDivisor: 1 } );
			geo.setAttribute( "rnd", new Float32Array( idArray ), 4, { instanceDivisor: 1 } );
			guEntity.addComponent( "geometry", geo );

			const defines: any = {};
			defines[ gu ] = "";

			const mat = guEntity.addComponent( "material", new GLP.Material( {
				name: "para",
				defines,
				type: [ "deferred", "shadowMap" ],
				uniforms: GLP.UniformsUtils.merge( globalUniforms.time, this.gpu.uniforms, globalUniforms.tex ),
				frag: hotGet( 'paraFrag', paraFrag ),
				vert: hotGet( 'paraVert', paraVert ),
				cullFace: true,
			} ) );

			if ( import.meta.hot ) {

				import.meta.hot.accept( "./shaders/para.fs", ( module ) => {

					if ( module ) {

						mat.frag = hotUpdate( 'paraFrag', module.default );
						mat.requestUpdate();

					}

				} );

				import.meta.hot.accept( "./shaders/para.vs", ( module ) => {

					if ( module ) {

						mat.vert = hotUpdate( 'paraVert', module.default );
						mat.requestUpdate();

					}

				} );

				import.meta.hot.accept( "./shaders/paraCompute.glsl", ( module ) => {

					if ( module ) {

						this.gpu.frag = hotUpdate( "paraCompute", module.default );
						this.gpu.requestUpdate();

					}

				} );

			}


		}


	}

	protected appendBlidgerImpl( blidger: GLP.BLidger ): void {

		this.gpu.uniforms = GLP.UniformsUtils.merge( this.gpu.uniforms, blidger.uniforms );

		this.children.forEach( c => {

			const mat = c.getComponent<GLP.Material>( "material" );

			if ( mat ) {

				mat.uniforms = GLP.UniformsUtils.merge( mat.uniforms, blidger.uniforms );

			}

		} );

	}

}
