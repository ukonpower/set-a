#include <common>
#include <vert_h>
#include <rotate>

layout (location = 3) in vec2 computeUV;
layout (location = 4) in vec3 id;
layout (location = 5) in vec3 offsetPosition;

uniform sampler2D gpuSampler0;
uniform sampler2D gpuSampler1;

uniform float uTime;

void main( void ) {

	#include <vert_in>

	outPos.x *= id.x;
	outPos.x += ( fract(uTime * ( 0.1 + id.y * 0.2 ) + id.x ) - 0.5 ) * 50.0;

	// outPos.xz *= rotate( floor( id.z * 2.0 ) * PI / 2.0 );

	outPos += offsetPosition;
	
	#include <vert_out>
	
}