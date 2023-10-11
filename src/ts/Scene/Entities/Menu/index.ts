import * as GLP from 'glpower';
import { MenuItem } from './MenuItem';
import { blidge } from '~/ts/Globals';

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
	private curve: GLP.FCurveGroup | null;

	constructor() {

		super();

		this.menuList = [];

		list.forEach( ( item, i ) => {

			const menu = new MenuItem( item, "9999" );

			menu.position.set( i * 0.4, 0, 0 );

			menu.userData.rnd = Math.random();

			this.add( menu );

			this.menuList.push( menu );

		} );

		this.curve = null;

	}

	protected updateImpl( event: GLP.EntityUpdateEvent ): void {

		let visible = 0;

		if ( this.curve ) {

			const value = this.curve.setFrame( blidge.frame.current ).value;
			visible = value.x;

		}

		for ( let i = 0; i < this.menuList.length; i ++ ) {

			const menu = this.menuList[ i ];

			const num = i / this.menuList.length;

			const xx = ( num + event.time * 0.08 ) % 1;

			const x = - ( xx - 0.5 ) * 10.0;
			const z = Math.sin( xx * Math.PI ) * 0;

			menu.position.set( x, 0, z );

			menu.position.y += ( 1.0 - visible ) * ( 1.2 + menu.userData.rnd * 1.5 );

		}

	}

	protected appendBlidgerImpl( blidger: GLP.BLidger ): void {

		const node = blidger.node;

		this.curve = blidge.getCurveGroup( node.animation.state )!;

		this.children.forEach( c => {

			const mat = c.getComponent<GLP.Material>( "material" );

			if ( mat ) {

				mat.uniforms = GLP.UniformsUtils.merge( mat.uniforms, blidger.uniforms );

			}

		} );

	}

}
