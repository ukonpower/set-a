#include <common>
#include <noise>

layout (location = 0) out vec4 outColor0;
layout (location = 1) out vec4 outColor1;

uniform sampler2D gpuSampler0;
uniform sampler2D gpuSampler1;
uniform float uTime;
uniform vec2 uGPUResolution;

in vec2 vUv;

#include <noise4D>
#include <rotate>

void main( void ) {

	float t = uTime * 1.0;
	float id = vUv.y;

	vec4 position = texture( gpuSampler0, vUv );
	vec4 velocity = texture( gpuSampler1, vUv );

	float pixelX = 1.0 / uGPUResolution.x;

	// velocity

	if( vUv.x < pixelX ) {
	
		float posOffset = id;
		float tOffset = t + id * 0.1;

		vec3 pos = position.xyz;
		vec3 np = pos * 0.3;

		vec3 noise = vec3(
			snoise4D( vec4( np, tOffset) ),
			snoise4D( vec4( np + 123.4, tOffset) ),
			snoise4D( vec4( np + 567.8, tOffset) )
		) * 0.002;

		velocity.xyz += noise;

		velocity.xyz += smoothstep( 0.0, 5.0, length( pos ) ) * - pos * 0.002;
		velocity.xyz *= 0.98;

	}
	
	//  position

	if( vUv.x < pixelX ) {

		position.xyz += velocity.xyz;
		
	} else {

		position.xyz = texture( gpuSampler0, vUv - vec2( pixelX * 1.5, 0.0 ) ).xyz;
		
	}

	// lifetime

	if( position.w > 1.0 ) {
	
		// position = vec4( 5.0, 0.0, 0.0, 0.0 );
		// position.xz *= rotate( vUv.x * TPI * 20.0 - uTime * 0.02 );
		// velocity = vec4( 0.0 );

	}

	position.w += 0.016 / 10.0;

	// out

	outColor0 = position;
	outColor1 = velocity;

} 