import * as GLP from 'glpower';

import norenVert from './shaders/noren.vs';
import norenFrag from './shaders/noren.fs';
import { hotGet, hotUpdate } from '~/ts/libs/glpower_local/Framework/Utils/Hot';
import { globalUniforms } from '~/ts/Globals';

export class Noren extends GLP.Entity {

	constructor() {

		super();

		const height = 1.25;

		/*-------------------------------
			bou
		-------------------------------*/

		const bou = new GLP.Entity();

		bou.addComponent( 'geometry', new GLP.CylinderGeometry( 0.03, 0.03, 10.0, 10, 8 ) );
		const matBou = bou.addComponent( 'material', new GLP.Material( {
			vert: hotGet( 'norenVert', norenVert ),
			frag: hotGet( 'norenFrag', norenFrag ),
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time ),
			defines: { 'BOU': '' },
		} ) );

		bou.quaternion.multiply( new GLP.Quaternion().setFromEuler( new GLP.Euler( 0, 0, Math.PI / 2 ) ) );
		bou.position.set( 0, height / 2, 0 );

		this.add( bou );

		/*-------------------------------
			Hata
		-------------------------------*/

		const hata = new GLP.Entity();
		const hataGeo = new GLP.PlaneGeometry( 1.0, height, 1.0, 20.0 );
		hataGeo.setAttribute( 'id', new Float32Array( ( ()=>{

			const num = 5;

			const r: number[] = [];
			for ( let i = 0; i < num; i ++ ) {

				r.push( i / ( num - 1.0 ), i / ( num ), Math.random() );

			}

			return r;

		} )() ), 3, { instanceDivisor: 1 } );

		hata.addComponent( 'geometry', hataGeo );

		const mat = hata.addComponent( 'material', new GLP.Material( {
			vert: hotGet( 'norenVert', norenVert ),
			frag: hotGet( 'norenFrag', norenFrag ),
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time ),
			defines: { 'HATA': '' },
			cullFace: false,
		} ) );

		this.add( hata );

		// const canvas = document.createElement( "canvas" );
		// canvas.width = 512;
		// canvas.height = 128;

		// const ctx = canvas.getContext( "2d" )!;
		// ctx.fillStyle = "#F00";

		// ctx.fillRect( 0, 0, canvas.width, canvas.height );

		// ctx.fillStyle = "#FFF";

		// ctx.font = `100px "UD デジタル 教科書体 NP-B"`;

		// ctx.fillText( "ラーメン", 40, 105 );

		// const texture = new GLP.GLPowerTexture( gl ).attach( canvas );
		// mat.uniforms.uTex = {
		// 	value: texture,
		// 	type: '1i'
		// };

		if ( import.meta.hot ) {

			import.meta.hot.accept( './shaders/noren.vs', ( module ) => {

				if ( module ) {

					matBou.vert = hotUpdate( 'norenVert', module.default );
					matBou.requestUpdate();

					mat.vert = hotUpdate( 'norenVert', module.default );
					mat.requestUpdate();

				}

			} );

			import.meta.hot.accept( './shaders/noren.fs', ( module ) => {

				if ( module ) {

					matBou.frag = hotUpdate( 'norenFrag', module.default );
					matBou.requestUpdate();

					mat.frag = hotUpdate( 'norenFrag', module.default );
					mat.requestUpdate();

				}

			} );

		}



	}

}
