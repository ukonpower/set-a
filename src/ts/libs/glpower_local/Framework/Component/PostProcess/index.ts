import { Component, ComponentResizeEvent } from '..';
import { GLPowerTexture } from '../../../GLPowerTexture';
import { PostProcessPass } from '../PostProcessPass';

export interface PostProcessParam {
	input?: GLPowerTexture[];
	passes: PostProcessPass[];
}

let postProcessId = 0;

export class PostProcess extends Component {

	public uuid: number;
	public passes: PostProcessPass[];
	public input: GLPowerTexture[];

	constructor( param: PostProcessParam ) {

		super();

		this.uuid = postProcessId ++;

		this.passes = param.passes;

		this.input = param.input || [];

	}

	protected resizeImpl( event: ComponentResizeEvent ): void {

		for ( let i = 0; i < this.passes.length; i ++ ) {

			this.passes[ i ].resize( event );

		}

	}

}
