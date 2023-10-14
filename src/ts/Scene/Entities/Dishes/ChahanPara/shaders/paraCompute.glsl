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
	float id = ( vUv.x * uGPUResolution.x + vUv.y ) / uGPUResolution.x;

	vec4 position = texture( gpuSampler0, vUv );
	vec4 velocity = texture( gpuSampler1, vUv );

	// velocity

	vec3 noisePosition = position.xyz * 0.6 + id * (0.5 + 0.1 * (1.0 - uParaState.x));
	vec3 noise = fbm3( noisePosition + uTime ) - 0.45;

	noise = noise * (0.004 + uParaState.x * 0.002);
	velocity.xyz *= 0.99;
	velocity.xyz += noise; 

	float r = (1.0 - uParaState.x) * 0.0004 ;

	float dir = atan2( position.z, position.x );
	velocity.x += sin( dir ) * r;
	velocity.z += -cos( dir ) * r;

	vec3 gravity = vec3( 0.00001 );

	float mori = smoothstep( 0.7, 1.0, -id + linearstep( 0.0, 1.0, uParaState.z) * 2.0 );

	vec3 gPos = position.xyz + vec3( 0.0, -2.0 - 4.0 * ( 1.0 - uParaState.w ) , 0.0 );
	gravity += gPos.xyz * smoothstep( 1.0, 3.0, length( gPos.xyz ) ) * -vec3(0.001, 0.005, 0.001) * ( 1.0 - smoothstep( 0.0, 1.0, -id + uParaState.x * 2.0 ) );

	gPos = position.xyz + vec3( 0.0, -3.0, 0.0 );
	gravity += gPos.xyz * smoothstep( 1.0, 3.0, length( gPos.xyz ) ) * -vec3(0.01) * uParaState.x * (1.0 - uParaState.z);

	gPos = position.xyz + vec3( 0.0, 0.0, 0.0 );
	gravity += gPos.xyz * smoothstep( 0.0, 0.01, length( gPos.xyz ) ) * -vec3(0.1) * mori;

	velocity *= 1.0 - mori * 0.5;

	velocity.xyz += gravity;

	if( length( velocity.xyz ) > 0.15 ) {

		velocity.xyz = normalize( velocity.xyz ) * 0.15;

	}
	

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