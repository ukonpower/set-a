#include <common>
#include <noise>

layout (location = 0) out vec4 outColor0;
layout (location = 1) out vec4 outColor1;

uniform sampler2D gpuSampler0;
uniform sampler2D gpuSampler1;
uniform float uTime;
uniform vec2 uResolution;

in vec2 vUv;

#include <noise4D>
#include <rotate>

void main( void ) {

	float t = uTime * 0.8;
	float id = vUv.x + vUv.y * uResolution.x;

	vec4 position = texture( gpuSampler0, vUv );
	vec4 velocity = texture( gpuSampler1, vUv );

	// velocity

	float tOffset = id * 0.01;
	vec3 noisePosition = position.xyz * 0.15;

	vec3 noise = vec3(
		snoise4D( vec4( noisePosition, tOffset + t ) ),
		snoise4D( vec4( noisePosition + 1234.5, tOffset + t ) ),
		snoise4D( vec4( noisePosition + 2345.6, tOffset + t ) )
	);

	noise = noise * 0.0005;
	velocity.xyz += noise;
	// velocity.y += 0.0001;

	float dir = atan2( position.z, position.x );
	velocity.x += sin( dir ) * 0.0001;
	velocity.z += -cos( dir ) * 0.0001;

	//  position

	position.xyz += velocity.xyz;

	// lifetime

	if( position.w > 1.0 ) {

	
		position = vec4( 5.0, 0.0, 0.0, 0.0 );
		position.xz *= rotate( vUv.x * TPI * 20.0 - uTime * 0.02 );

		velocity = vec4( 0.0 );

	}

	position.w += 0.016 / 10.0;

	// out

	outColor0 = position;
	outColor1 = velocity;

} 