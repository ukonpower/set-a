#include <common>
#include <vert_h>

layout (location = 3) in vec2 computeUV;
layout (location = 4) in vec3 id;

uniform sampler2D gpuSampler0;
uniform sampler2D gpuSampler1;

void main( void ) {

	#include <vert_in>

	float uid = id.x + id.y * 128.0;

	vec4 gpuPos = texture(gpuSampler0, computeUV );

	outPos *= ( 0.05 + id.z * id.z ) * 1.5 ;
	outPos *= smoothstep( 1.0, 0.9, gpuPos.w);
	outPos *= smoothstep( 0.1, 0.15, gpuPos.w);
	outPos += gpuPos.xyz;
	
	#include <vert_out>
	
	// gl_PointSize = 10.0;
	
}