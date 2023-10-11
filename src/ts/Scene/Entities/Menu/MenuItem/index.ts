import * as GLP from 'glpower';

import menuVert from './shaders/menu.vs';
import menuFrag from './shaders/menu.fs';
import { gl, globalUniforms } from '~/ts/Globals';

export class MenuItem extends GLP.Entity {

	constructor( name: string, price: string ) {

		super();

		price += "円";

		const size = new GLP.Vector( 0.3, 1.0 );

		this.addComponent( "geometry", new GLP.PlaneGeometry( size.x, size.y ) );
		const mat = this.addComponent( "material", new GLP.Material( {
			vert: menuVert,
			frag: menuFrag,
			cullFace: false,
			uniforms: GLP.UniformsUtils.merge( globalUniforms.time )
		} ) );
		this.add( this );

		const canvas = document.createElement( "canvas" );
		canvas.width = 128;
		canvas.height = Math.floor( canvas.width * ( size.y / size.x ) );

		const ctx = canvas.getContext( "2d" )!;
		ctx.fillStyle = "#F00";

		ctx.fillRect( 0, 0, canvas.width, canvas.height );

		const padding = canvas.width * 0.08;
		ctx.fillStyle = "#FFF";
		ctx.fillRect( padding, padding, canvas.width - padding * 2, canvas.height - padding * 2 );

		const fontSize = canvas.height * 0.9 / name.length;
		ctx.fillStyle = "#000";
		ctx.font = `${fontSize}px 'ＭＳ ゴシック'`;

		let hSum = 0.0;

		const cList = [];

		for ( let i = 0; i < name.length; i ++ ) {

			const c = name.charAt( i );

			const data = ctx.measureText( c );
			const h = data.fontBoundingBoxAscent + data.fontBoundingBoxDescent;
			hSum += h;

			cList.push( {
				c,
				data,
				h
			} );

		}

		let x = canvas.width / 2 - fontSize / 3;
		let y = fontSize + 10;

		for ( let i = 0; i < cList.length; i ++ ) {

			const c = cList[ i ];
			ctx.fillText( c.c, x, y );

			x += 0;
			y += c.h * 0.80;

		}

		// price

		ctx.font = `${35}px 'ＭＳ ゴシック'`;

		const priceData = ctx.measureText( price );
		ctx.translate( canvas.width / 2 - priceData.width / 2, canvas.height - 40 );
		ctx.rotate( ( Math.random() - 0.5 ) * 0.3 );

		ctx.fillText( price, 0, 0 );

		const texture = new GLP.GLPowerTexture( gl ).attach( canvas );
		mat.uniforms.uTex = {
			value: texture,
			type: '1i'
		};

	}

}
