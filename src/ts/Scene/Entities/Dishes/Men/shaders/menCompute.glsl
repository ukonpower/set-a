#include <common>
#include <noise>

layout (location = 0) out vec4 outColor0;
layout (location = 1) out vec4 outColor1;

uniform sampler2D gpuSampler0;
uniform sampler2D gpuSampler1;
uniform float uTime;
uniform vec2 uGPUResolution;

uniform vec4 uState;

in vec2 vUv;

#include <noise4D>
#include <rotate>

void main( void ) {

	float t = uTime * 0.8;
	float id = ( vUv.x * uGPUResolution.x + vUv.y ) / uGPUResolution.x;
	vec2 pixel = 1.0 / uGPUResolution;

	vec4 position = texture( gpuSampler0, vUv );
	vec4 velocity = texture( gpuSampler1, vUv );

	float head = vUv.x < pixel.x ? 1.0 : 0.0;

	vec3 noisePosition = position.xyz * ( 0.20 + ( 1.0 - head ) * 0.1 + 0.2 * (1.0 - uState.x) ) + vUv.y * 0.35;
	vec3 noise = fbm3( noisePosition + uTime * ( 0.5 + head * 0.5 ) ) - 0.45;

	if( vUv.x < pixel.x ) {

		// velocity

		noise = noise * 0.03;
		velocity.xyz *= 0.99;
		velocity.xyz += noise; 

		float r = (1.0) * 0.0004 ;

		float dir = atan2( position.z, position.x );
		velocity.x += sin( dir ) * r;
		velocity.z += -cos( dir ) * r;

		vec3 gravity = vec3( 0.00001 );

		vec3 gPos = position.xyz + vec3( 0.0, -4.5, 0.0 );
		gravity += gPos.xyz * smoothstep( 1.0, 4.0, length( gPos.xyz ) ) * -vec3(0.003, 0.01, 0.003);

		gPos = position.xyz + vec3( 0.0, 0.0, 0.0 );
		gravity += gPos.xyz * smoothstep( 0.0, 0.001, length( gPos.xyz ) ) * -vec3(0.2) * (smoothstep( 0.0, 1.0, -vUv.y + linearstep( 0.0, 1.0, uState.y ) * 2.0 ) + ( 1.0 - uState.x) ) * mix( vec3( 0.2, 1.0, 0.2 ), vec3( 1.0, 1.0, 1.0 ), uState.x );

		velocity.xyz += gravity;

		if( length( velocity.xyz ) > 0.15 ) {

			velocity.xyz = normalize( velocity.xyz ) * 0.15;

		}

		//  position

		position.xyz += velocity.xyz;

	} else {

		vec4 prevPos = texture( gpuSampler1, vUv - vec2( pixel.x, 0.0 ) );
		vec3 diff = position.xyz - prevPos.xyz;

		position.xyz = mix( position.xyz, texture( gpuSampler0, vUv - vec2( pixel.x, 0.0 ) ).xyz, 0.9 );
		position.xyz += noise * 0.035;
		
	}

	// out

	outColor0 = position;
	outColor1 = velocity;

} 