import * as GLP from 'glpower';
import { blidge, canvas, gpuState } from './Globals';
import { Scene } from "./Scene";
import { Music } from './Music';

class App {


	// elms
	private rootElm: HTMLElement;
	private canvasWrapElm: HTMLElement;
	private canvas: HTMLCanvasElement;

	private scene: Scene;
	private music: Music;

	constructor() {

		document.body.innerHTML = `
		<style>
			body{margin:0;}
			button{display:block;width:200px;margin:0 auto 10px auto;padding:10px;border:1px solid #fff;background:none;color:#fff;cursor:pointer;}
			canvas{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);}
			.r{width:100%;height:100%;position:relative;overflow:hidden;display:flex;background:#000;}
			.cw{position:relative;flex:1 1 100%;display:none;}
			.s{width:100vw;height:100vh;display:flex;flex-direction:column;justify-content:center;}
		</style>
		`;

		document.title = "DEMO2";

		this.rootElm = document.createElement( 'div' );
		this.rootElm.classList.add( 'r' );
		document.body.appendChild( this.rootElm );

		this.canvasWrapElm = document.createElement( 'div' );
		this.canvasWrapElm.classList.add( 'cw' );
		this.rootElm.appendChild( this.canvasWrapElm );

		this.canvas = canvas;
		this.canvasWrapElm.appendChild( this.canvas );

		const startElm = document.createElement( 'div' );
		startElm.classList.add( "s" );
		this.rootElm.appendChild( startElm );

		const fullScreen = document.createElement( 'button' );
		fullScreen.innerText = '1. Full Screen';
		fullScreen.onclick = () => {

			var elem = document.documentElement;

			if ( elem.requestFullscreen ) {

				elem.requestFullscreen();

			}


		};

		startElm.appendChild( fullScreen );

		const play = () => {

			startElm.style.display = "none";
			this.canvasWrapElm.style.display = 'block';
			this.canvasWrapElm.style.cursor = 'none';

			this.resize();

			// world.elapsedTime = 0;
			// world.lastUpdateTime = new Date().getTime();

			this.scene.play();

			this.animate();

		};

		const playButton = document.createElement( 'button' );
		playButton.innerText = 'ready...';
		playButton.disabled = true;
		playButton.onclick = play;

		startElm.appendChild( playButton );

		// scene

		this.scene = new Scene();

		setTimeout( () => {

			this.resize();

			this.scene.update();

			playButton.innerText = '2. Play!';
			playButton.disabled = false;

		}, 100 );

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

				return;

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
				this.canvasWrapElm.appendChild( memoryElm );

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
				this.canvasWrapElm.appendChild( timerElm );

				this.canvasWrapElm.style.fontFamily = "'Share Tech Mono', monospace";

				gpuState.init( memoryElm, timerElm );

			}

		}


	}

	private counter: boolean = true;

	private animate() {

		if ( this.counter ) {


			if ( gpuState ) {

				gpuState.update();

			}

			this.scene.update();

		}

		// this.counter = ! this.counter;

		window.requestAnimationFrame( this.animate.bind( this ) );

	}

	private resize() {

		const aspect = 16 / 7;
		const scale = 1.0;

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
