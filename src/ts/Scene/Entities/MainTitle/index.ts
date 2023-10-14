import * as GLP from 'glpower';
import { canvas, gl, globalUniforms } from '~/ts/Globals';

import titleVert from './shaders/mainTitle.vs';
import titleFrag from './shaders/mainTitle.fs';
import { hotGet, hotUpdate } from '~/ts/libs/glpower_local/Framework/Utils/Hot';

export class MainTitle extends GLP.Entity {

	constructor( ) {

		super();

		const elm = `
		<svg width="865" height="273" viewBox="0 0 865 273" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M713.149 267.095L760.393 5.34822C760.647 4.33222 761.282 3.82422 762.298 3.82422H817.543C818.559 3.82422 819.194 4.33222 819.448 5.34822L864.787 267.095C865.041 268.365 864.533 269 863.263 269H820.972C819.956 269 819.321 268.365 819.067 267.095L814.876 239.282H763.06L758.869 267.095C758.615 268.365 757.98 269 756.964 269H714.673C713.657 269 713.149 268.365 713.149 267.095ZM770.68 198.515H807.256L791.635 91.4542L789.349 77.3572L787.825 91.4542L770.68 198.515Z" fill="white"/>
		<path d="M548.325 158.891C547.055 158.891 546.42 158.383 546.42 157.367V115.838C546.42 114.822 547.055 114.314 548.325 114.314H621.858C623.128 114.314 623.763 114.822 623.763 115.838V157.367C623.763 158.383 623.128 158.891 621.858 158.891H548.325Z" fill="white"/>
		<path d="M374.273 269C373.257 269 372.749 268.365 372.749 267.095V49.9252H323.219C321.949 49.9252 321.314 49.2902 321.314 48.0202L321.695 5.34822C321.695 4.33222 322.203 3.82422 323.219 3.82422H467.999C469.269 3.82422 469.904 4.33222 469.904 5.34822V48.0202C469.904 49.2902 469.396 49.9252 468.38 49.9252H418.469L418.85 267.095C418.85 268.365 418.342 269 417.326 269H374.273Z" fill="white"/>
		<path d="M177.708 269C176.692 269 176.184 268.365 176.184 267.095L176.565 5.34822C176.565 4.33222 177.073 3.82422 178.089 3.82422H300.39C301.406 3.82422 301.914 4.45922 301.914 5.72922V48.4012C301.914 49.4172 301.406 49.9252 300.39 49.9252H222.285V109.361H300.39C301.406 109.361 301.914 109.869 301.914 110.885L302.295 153.938C302.295 154.954 301.787 155.462 300.771 155.462H222.285V222.137H300.771C301.787 222.137 302.295 222.772 302.295 224.042V267.476C302.295 268.492 301.787 269 300.771 269H177.708Z" fill="white"/>
		<path d="M75.01 272.81C61.294 272.81 48.721 269.381 37.291 262.523C26.115 255.411 17.098 246.14 10.24 234.71C3.63598 223.026 0.333984 210.199 0.333984 196.229V178.703C0.333984 177.433 0.968984 176.798 2.23898 176.798H44.911C45.927 176.798 46.435 177.433 46.435 178.703V196.229C46.435 204.611 49.229 211.85 54.817 217.946C60.405 223.788 67.136 226.709 75.01 226.709C82.884 226.709 89.615 223.661 95.203 217.565C100.791 211.469 103.585 204.357 103.585 196.229C103.585 186.831 97.489 178.703 85.297 171.845C81.233 169.559 74.883 166.003 66.247 161.177C57.611 156.351 49.483 151.779 41.863 147.461C27.893 139.333 17.479 129.173 10.621 116.981C4.01698 104.535 0.714984 90.5652 0.714984 75.0712C0.714984 60.8472 4.14398 48.1472 11.002 36.9712C17.86 25.5412 26.877 16.5242 38.053 9.92017C49.483 3.31616 61.802 0.0141602 75.01 0.0141602C88.472 0.0141602 100.791 3.44316 111.967 10.3012C123.397 16.9052 132.414 25.9222 139.018 37.3522C145.876 48.5282 149.305 61.1012 149.305 75.0712V106.313C149.305 107.329 148.797 107.837 147.781 107.837H105.109C104.093 107.837 103.585 107.329 103.585 106.313L103.204 75.0712C103.204 66.1812 100.41 58.9422 94.822 53.3542C89.234 47.7662 82.63 44.9722 75.01 44.9722C67.136 44.9722 60.405 48.0202 54.817 54.1162C49.229 59.9582 46.435 66.9432 46.435 75.0712C46.435 83.4532 48.213 90.4382 51.769 96.0262C55.325 101.614 61.802 106.948 71.2 112.028C72.47 112.79 74.883 114.187 78.439 116.219C82.249 117.997 86.313 120.156 90.631 122.696C94.949 124.982 98.759 127.014 102.061 128.792C105.617 130.57 107.776 131.713 108.538 132.221C121.238 139.333 131.271 148.096 138.637 158.51C146.003 168.67 149.686 181.243 149.686 196.229C149.686 210.707 146.257 223.788 139.399 235.472C132.795 246.902 123.778 256.046 112.348 262.904C101.172 269.508 88.726 272.81 75.01 272.81Z" fill="white"/>
		</svg>
		
		`;

		const texture = new GLP.GLPowerTexture( gl );

		const img = document.createElement( "img" );
		img.src = "data:image/svg+xml," + encodeURIComponent( elm );

		img.onload = () => {

			const canvas = document.createElement( "canvas" );
			canvas.width = 1024;
			canvas.height = 512;

			const ctx = canvas.getContext( "2d" )!;

			ctx.fillStyle = "#fff3";
			ctx.fillRect( 0, 0, canvas.width, canvas.height );

			ctx.drawImage( img, 0, 50 );

			ctx.fillStyle = "#FFF";
			ctx.font = `bold ${50}px 'Yu Gothic'`;
			ctx.fillText( "CODE / GRAPHICS / MUSIC: UKONPOWER", 0, 400, 600 );

			texture.attach( canvas );

		};

		this.addComponent( "geometry", new GLP.PlaneGeometry( 2.0, 1.0 ) );
		const mat = this.addComponent( "material", new GLP.Material( {
			frag: hotGet( 'mttlFrag', titleFrag ),
			vert: hotGet( 'mttlVert', titleVert ),
			uniforms: GLP.UniformsUtils.merge( {
				uTex: {
					value: texture,
					type: "1i"
				}
			}, globalUniforms.tex ),
		} ) );

		if ( import.meta.hot ) {

			import.meta.hot.accept( "./shaders/mainTitle.vs", ( module ) => {

				if ( module ) {

					mat.vert = hotUpdate( 'mttlVert', module.default );
					mat.requestUpdate();

				}

			} );

			import.meta.hot.accept( "./shaders/mainTitle.fs", ( module ) => {

				if ( module ) {

					mat.frag = hotUpdate( 'mttlFrag', module.default );
					mat.requestUpdate();

				}

			} );

		}

	}

}
