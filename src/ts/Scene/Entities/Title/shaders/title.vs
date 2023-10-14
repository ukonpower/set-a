#include <common>
#include <vert_h>

uniform vec4 uState;

void main( void ) {

	vec3 pos = position * 1.0;
	
	gl_Position = vec4( pos.xy, 0.0, 1.0 );

	vUv = uv;

}