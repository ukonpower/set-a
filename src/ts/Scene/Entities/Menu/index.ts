import * as GLP from 'glpower';
import { MenuItem } from './MenuItem';

const list = [
	"AAA",
	"BBB",
	"CCC",
];

export class Menu extends GLP.Entity {

	constructor() {

		super();

		this.add( new MenuItem( "ukonpower", "999" ) );

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
