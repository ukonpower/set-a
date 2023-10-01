#include <common>
#include <noise>

layout (location = 0) out vec4 outColor0;
layout (location = 1) out vec4 outColor1;

uniform sampler2D gpuSampler0;
uniform sampler2D gpuSampler1;
uniform float uTime;
uniform vec2 uGPUResolution;
uniform vec4 uParaState;

in vec2 vUv;

#include <noise4D>
#include <rotate>

void main( void ) {

	float t = uTime * 0.8;
	float id = vUv.x * uGPUResolution.x + vUv.y;

	vec4 position = texture( gpuSampler0, vUv );
	vec4 velocity = texture( gpuSampler1, vUv );

	// velocity

	vec3 noisePosition = position.xyz * 0.5 + id * (0.0001 + 0.005 * (1.0 - uParaState.x));
	vec3 noise = fbm3( noisePosition + uTime ) - 0.45;

	noise = noise * 0.005;
	velocity.xyz *= 0.99;
	velocity.xyz += noise; 

	vec3 gPos = position.xyz + vec3( 0.0, -2.0, 0.0 );
	
	velocity.xyz += gPos.xyz * smoothstep( 1.0, 3.0, length( gPos.xyz ) ) * -0.01 * ( uParaState.x * 0.9 + 0.01 );

	//  position

	position.xyz += velocity.xyz;

	// lifetime

	// if( position.w > 1.0 ) {

	
		// position = vec4( 0.0, 0.0, 0.0, 0.0 );
		// velocity = vec4( 0.0 );

	// }

	position.w += 0.016 / 10.0;

	// out

	outColor0 = position;
	outColor1 = velocity;

} 