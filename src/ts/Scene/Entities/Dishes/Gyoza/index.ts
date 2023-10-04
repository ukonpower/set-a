import * as GLP from 'glpower';

import gyozaVert from './shaders/gyoza.vs';
import gyozaFrag from './shaders/gyoza.fs';

import { hotGet, hotUpdate } from '~/ts/libs/glpower_local/Framework/Utils/Hot';
import { globalUniforms } from '~/ts/Globals';

export class Gyoza extends GLP.Entity {

	constructor( ) {

		super();

		/*-------------------------------
			gyoza
		-------------------------------*/

		const gyoza = new GLP.Entity();
		const geo = gyoza.addComponent( "geometry", new GLP.SphereGeometry( 0.5 ) );

		const num = 4;

		geo.setAttribute( 'num', new Float32Array( ( ()=>{

			const r: number[] = [];

			for ( let i = 0; i < num; i ++ ) {

				r.push( i / num );


			}

			return r;

		} )() ), 1, { instanceDivisor: 1 } );

		const gyozaMat = gyoza.addComponent( "material", new GLP.Material( {
			vert: hotGet( "ghozaVert", gyozaVert ),
			frag: hotGet( "ghozaFrag", gyozaFrag ),
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time )
		} ) );

		this.add( gyoza );

		if ( import.meta.hot ) {

			import.meta.hot.accept( "./shaders/gyoza.fs", ( module ) => {

				if ( module ) {

					gyozaMat.frag = hotUpdate( 'gyozaFrag', module.default );
					gyozaMat.requestUpdate();

				}

			} );

			import.meta.hot.accept( "./shaders/gyoza.vs", ( module ) => {

				if ( module ) {

					gyozaMat.vert = hotUpdate( 'gyozaVert', module.default );
					gyozaMat.requestUpdate();

				}

			} );

		}

	}

	protected appendBlidgerImpl( blidger: GLP.BLidger ): void {

		this.children.forEach( c => {

			const mat = c.getComponent<GLP.Material>( "material" );

			if ( mat ) {

				mat.uniforms = GLP.UniformsUtils.merge( mat.uniforms, blidger.uniforms );

			}

		} );

	}

}
