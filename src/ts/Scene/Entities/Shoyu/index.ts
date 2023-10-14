import * as GLP from 'glpower';

import { Dish } from '../Dishes/Dish';

export class Shoyu extends GLP.Entity {

	constructor( ) {

		super();

		/*-------------------------------
			Sara
		-------------------------------*/

		const sara = new Dish( "SHOYU" );
		sara.position.set( 0.0, - 0.02, 0.0 );
		this.add( sara );

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
