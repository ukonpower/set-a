import * as GLP from 'glpower';

import { globalUniforms } from '~/ts/Globals';

import traficLinesVert from './shaders/traficLines.vs';
import traficLinesFrag from './shaders/traficLines.fs';
import { hotGet, hotUpdate } from '~/ts/libs/glpower_local/Framework/Utils/Hot';

export class TraficLines extends GLP.Entity {

	constructor() {

		super();

		const count = new GLP.Vector( 30, 1 );

		// geometry

		const range = new GLP.Vector( 1.0, 0.0, 3.0 );

		const positionArray = [];
		const computeUVArray = [];
		const idArray = [];

		for ( let i = 0; i < count.y; i ++ ) {

			for ( let j = 0; j < count.x; j ++ ) {

				positionArray.push( ( Math.random() - 0.5 ) * range.x );
				positionArray.push( ( Math.random() - 0.5 ) * range.y );
				positionArray.push( ( Math.random() - 0.5 ) * range.z );

				computeUVArray.push( j / count.x, i / count.y );

				idArray.push( Math.random(), Math.random(), Math.random() );

			}

		}

		const geo = this.addComponent( "geometry", new GLP.CubeGeometry( 3.0, 0.05, 0.05 ) );
		geo.setAttribute( "offsetPosition", new Float32Array( positionArray ), 3, { instanceDivisor: 1 } );
		geo.setAttribute( "computeUV", new Float32Array( computeUVArray ), 2, { instanceDivisor: 1 } );
		geo.setAttribute( "id", new Float32Array( idArray ), 3, { instanceDivisor: 1 } );

		// material

		const mat = this.addComponent( "material", new GLP.Material( {
			name: "traficLine",
			type: [ "deferred", "shadowMap" ],
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time, globalUniforms.resolution, {
				uRange: {
					value: range,
					type: "3f"
				},
			} ),
			vert: hotGet( 'traficLinesVert', traficLinesVert ),
			frag: hotGet( 'traficLinesFrag', traficLinesFrag ),
		} ) );

		if ( import.meta.hot ) {

			import.meta.hot.accept( [ "./shaders/traficLines.vs", "./shaders/traficLines.fs" ], ( module ) => {

				if ( module[ 0 ] ) {

					mat.vert = hotUpdate( 'traficLinesVert', module[ 0 ].default );

				}

				if ( module[ 1 ] ) {

					mat.frag = hotUpdate( 'traficLinesFrag', module[ 1 ].default );

				}

				mat.requestUpdate();

			} );

		}

	}

}
