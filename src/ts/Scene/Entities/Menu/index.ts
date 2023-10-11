import * as GLP from 'glpower';
import { MenuItem } from './MenuItem';

const list = [
	"0b5vr",
	"amagi",
	"butadiene",
	"conspiracy",
	"ctrl-alt-test",
	"doxas",
	"fairlight",
	"falken",
	"fl1ne",
	"gam0022",
	"hadhad",
	"hatsuka",
	"hirai",
	"iyoyi",
	"jugem-t",
	"kamoshika",
	"kanetaaaaa",
	"kioku",
	"logicoma",
	"moscowmule",
	"mrdoob",
	"nerumae",
	"ninjadev",
	"notargs",
	"phi16",
	"saina",
	"sp4ghet",
	"yosshin",
	"zavie",
];

export class Menu extends GLP.Entity {

	private menuList: GLP.Entity[];

	constructor() {

		super();

		this.menuList = [];

		list.forEach( ( item, i ) => {

			const menu = new MenuItem( item, "99999" );

			menu.position.set( i * 0.4, 0, 0 );

			this.add( menu );

			this.menuList.push( menu );

		} );


	}

	protected updateImpl( event: GLP.EntityUpdateEvent ): void {

		for ( let i = 0; i < this.menuList.length; i ++ ) {

			const menu = this.menuList[ i ];

			const num = i / this.menuList.length;

			const rad = num * Math.PI * 2.0;
			const r = 3.0;

			const x = - ( ( num + event.time * 0.08 ) % 1 - 0.5 ) * 10.0;
			const z = 0;

			menu.position.set( x, 0, z );

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
