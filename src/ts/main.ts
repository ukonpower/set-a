import * as GLP from 'glpower';
import { blidge, canvas, gpuState, power } from './Globals';
import { Scene } from "./Scene";
import { Music } from './Music';

class App {

	private canvas: HTMLCanvasElement;
	private canvasWrap: HTMLElement;

	private scene: Scene;
	private music: Music;

	constructor() {

		const elm = document.createElement( "div" );
		document.body.appendChild( elm );
		elm.innerHTML = `
			<style>body{color:#FFF;margin:0;background:#000;display:flex;justify-content:center;align-items:center;}</style>
			<div class="cw"></div>
		`;

		document.title = `Lost in Imagination`;

		this.canvasWrap = document.querySelector( '.cw' )!;

		this.canvas = canvas;
		this.canvasWrap.appendChild( this.canvas );

		// scene

		this.scene = new Scene();

		// music

		this.music = new Music();

		blidge.on( 'sync/timeline', ( e:GLP.BLidgeFrame ) => {

			const t = e.current / e.fps;

			if ( e.playing ) {

				this.music.play( t );

			} else {

				this.music.stop();

			}

		} );

		// event

		window.addEventListener( 'resize', this.resize.bind( this ) );

		this.resize();

		// animate

		this.animate();

		// gpustate

		if ( process.env.NODE_ENV == 'development' ) {

			if ( gpuState ) {

				const memoryElm = document.createElement( 'div' );
				memoryElm.classList.add( "dev" );
				memoryElm.style.pointerEvents = "none";
				memoryElm.style.position = "absolute";
				memoryElm.style.width = "50%";
				memoryElm.style.maxWidth = "300px";
				memoryElm.style.height = "100%";
				memoryElm.style.top = '0';
				memoryElm.style.left = "0";
				memoryElm.style.overflowY = 'auto';
				memoryElm.style.fontSize = "12px";
				this.canvasWrap.appendChild( memoryElm );

				const timerElm = document.createElement( 'div' );
				timerElm.classList.add( "dev" );
				timerElm.style.pointerEvents = "none";
				timerElm.style.position = "absolute";
				timerElm.style.maxWidth = "300px";
				timerElm.style.width = "50%";
				timerElm.style.height = "100%";
				timerElm.style.top = "0";
				timerElm.style.right = "0";
				timerElm.style.overflowY = 'auto';
				timerElm.style.fontSize = "12px";
				this.canvasWrap.appendChild( timerElm );

				this.canvasWrap.style.fontFamily = "'Share Tech Mono', monospace";

				gpuState.init( memoryElm, timerElm );

			}

		}


	}

	private animate() {

		if ( gpuState ) {

			gpuState.update();

		}

		this.scene.update();

		window.requestAnimationFrame( this.animate.bind( this ) );

	}

	private resize() {

		const aspect = 16 / 9;
		const scale = 0.5;

		this.canvas.width = 1920 * scale;
		this.canvas.height = this.canvas.width / aspect;

		if ( window.innerWidth / window.innerHeight < aspect ) {

			this.canvas.style.width = window.innerWidth + 'px';
			this.canvas.style.height = window.innerWidth / aspect + 'px';

		} else {

			this.canvas.style.height = window.innerHeight + 'px';
			this.canvas.style.width = window.innerHeight * aspect + 'px';

		}



		this.scene.resize( new GLP.Vector( this.canvas.width, this.canvas.height ) );

	}

}

new App();
