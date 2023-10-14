#include <common>
#include <vert_h>

uniform vec4 uState;

void main( void ) {

	vec3 pos = position * 1.0;

	pos *= 0.3 + uState.x * 0.9;
	
	gl_Position = vec4( pos.xy, 0.0, 1.0 );

	vUv = uv;

}