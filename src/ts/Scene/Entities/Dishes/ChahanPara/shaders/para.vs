#include <common>
#include <vert_h>
#include <rotate>

#ifdef NIKU
	layout (location = 3) in float posY;
#endif


layout (location = 4) in vec2 computeUV;
layout (location = 5) in vec4 rnd;

uniform sampler2D gpuSampler0;
uniform sampler2D gpuSampler1;
uniform sampler2D uNoiseTex;

void main( void ) {

	#include <vert_in>

	float uid = rnd.x + rnd.y * 128.0;

	vec4 gpuPos = texture(gpuSampler0, computeUV );
	vec4 gpuVel = texture(gpuSampler1, computeUV );

	#ifdef KOME

		outPos.x += cos( outPos.y * 20.0 ) * 0.01;
		outPos.y *= 3.0;
		outPos *= 0.3;

	#endif

	#ifdef NEGI

		outPos.yz *= rotate( PI / 2.0 * rnd.z * 0.5 );

	#endif

	#ifdef NIKU

		outPos.xz *= rotate( posY * 0.3 );
		outNormal = normalize( outNormal + texture( uNoiseTex, uv.xy * 1.0 ).xyz * 2.0 );
	
	#endif

	mat2 rot2 = rotate( PI / 2.0 + (rnd.w * PI) );
	outPos.yz *= rot2;
	outNormal.yz *= rot2;

	mat3 rot = makeRotationDir( normalize( gpuVel.xyz ), vec3( 0.0, 1.0, 0.0 ) );
	outPos *= rot;
	outNormal *= rot;

	outPos += gpuPos.xyz;
	
	#include <vert_out>

	vec4 vel = ( projectionMatrix * viewMatrix * modelMatrix * vec4( gpuVel.xyz, 0.0 ) );
	vVelocity += vel.xy * 0.05;
	
}